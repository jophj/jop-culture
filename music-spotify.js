var express       = require('express');
var SpotifyWebApi = require('spotify-web-api-node');
var EventEmitter  = require('events').EventEmitter;
var goodreads     = require('goodreads'); 

var eventEmitter = new EventEmitter();
var router = express.Router();

var authData = {};
var clientData = {};
if (process.env.SPOTIFY_CLIENTID){
  clientData.clientId = process.env.SPOTIFY_CLIENTID;
  clientData.clientSecret = process.env.SPOTIFY_CLIENTSECRET;
  clientData.redirectUri = process.env.SPOTIFY_REDIRECTURI;
  
  authData.access_token = process.env.SPOTIFY_ACCESSTOKEN;
  authData.refresh_token = process.env.SPOTIFY_REFRESHTOKEN;
  authData.expires = process.env.SPOTIFY_EXPIRES;
}
else{
  clientData = require('./spotifyClientData');
  authData = require('./spotifyTokensData');
}

var spotifyApi = new SpotifyWebApi(clientData);

/**
 * tokens: spotify tokens with property access_token and expires_in
 * Saves the auth data in the AUTH_DATA file.
 */
var storeAuthData = function(tokens){
  var d = new Date();
  var time = d.getTime();

  authData['expires'] = time + (tokens['expires_in'] * 1000);
  authData['access_token'] = tokens['access_token'];
}

/**
 * Checks if authentication data is valid.
 * If it isn't, refresh authentication.
 */
var initAuthenticationData = function(){
  spotifyApi.setAccessToken(authData['access_token']);
  spotifyApi.setRefreshToken(authData['refresh_token']);

  setTimeout(refreshAccessToken, 0);
  
  return authData;
}
/**
 * Refresh auth tokens and stores them in the AUTH_DATA file.
 * Called when token timeout expires.
 * Sets new timeout.
 */
var refreshAccessToken = function(goodCallback, badCallback){
  spotifyApi.refreshAccessToken()
    .then(function(tokens){

      console.log('Authentication refreshed');
      storeAuthData(tokens);
      spotifyApi.setAccessToken(tokens['access_token']);

      var time = new Date().getTime();
      var delay = authData['expires'] - time;
      delay = delay < 0 ? 0 : delay;

      setTimeout(refreshAccessToken, delay);
      console.log('Authentication scheduled in ', delay/1000, ' seconds')

      goodCallback(data);
    }, function(err){
      console.log(err);
      badCallback(err);
    });
};

initAuthenticationData();

/* EXPRESS APP STARTS HERE */
var app = express();

router.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.get('/', function(req, res){
  res.send('up and running');
});

router.get('/isAuthenticated', function(req, res){
  spotifyApi.getMe()
  .then(function(data) {
    var string = "[auth] " + data.display_name + " is currently authenticated";
    console.log(string);
    res.send(string);
  }, function(err) {
    console.log('ERROR: authentication', err);
    res.status(500).send(err);
  });
});

var albumListBuilder = function(spotifyApiParam){

  var spotifyApi = spotifyApiParam;
  var builder = {};
  var buildCallback;

  //albums list to return
  var albums = [];

  //false only if offset is 0 from the beginning
  var skipFirstAlbum = false;
  var albumIdToSkip = null;

  var alreadyInList = function(album, albums){
    for (var i = albums.length - 1; i >= 0; i--) {
      if (album.title === albums[i].title)
        return true;
    };
    return false;
  };
  
  var getAlbum = function(item){
    var album = {};
    var track = item.track;
    album.title = track.album.name;
    album.imageUrl = track.album.images[1].url;
    album.artist = track.artists[0].name;
    return album;
  };

  var fetchData = function(limitCounter, offsetCounter){
    return spotifyApi.getMySavedTracks({limit: limitCounter, offset:offsetCounter});
  }

  var endBuild = function(data){
    eventEmitter.removeListener('spotify.moreAlbums', buildLoop);
    buildCallback(data);
  }

  /**
   * A track is not acceptable if has to be skipped.
   * When offset is not0 all the track from the first track's album must be skipped.
   */
  var accept = function(track){

    if (skipFirstAlbum && albums.length === 0 ){
      if (albumIdToSkip === null){
        albumIdToSkip = track.track.album.id;
      }

      if (track.track.album.id === albumIdToSkip){
        return false;
      }
    }

    return true;
  }

  /**
   * Returns false if album is already in list
   */
  var addAlbum = function(album){
    if (alreadyInList(album, albums)){
      return false;
    }
    else{
      albums.push(album);
      return true;
    }
  }

  var buildLoop = function(requestLimit, offsetCounter){
    // this is hardcoded here for some reason
    var limitCounter = 50;

    var promise = fetchData(limitCounter, offsetCounter);

    promise.then(function(data) {

      if (data.items.length === 0){
        endBuild({
          "items": albums,
          offset: offsetCounter + 1 //was decreased in init procedure
        });
        return;
      }

      var count = data.items.length;
      for (var i = 0; i < count; i++) {
        offsetCounter += 1;

        var track = data.items[i];
        
        if (accept(track)){
          var album = getAlbum(track);
          if (addAlbum(album)){
            requestLimit -= 1;

            if (requestLimit === 0){
              endBuild({
                "items": albums,
                offset: offsetCounter
              });
              return;
            }
          }
        }
      };

      eventEmitter.emit('spotify.moreAlbums', requestLimit, offsetCounter);

    }, function(err) {
      console.log('ERROR: saved tracks API', err);

      endBuild({
          "items": albums,
          offset: offsetCounter,
          error: err
        });        
      res.status(500).send(err);
    });
  };


  /**
   * Asynchronously build saved albums list.
   * Calls callback with albums object as argument.
   */ 
  builder.build = function(callback, requestLimitParam, offsetCounterParam){
    
    buildCallback = callback;
    var offsetCounter = offsetCounterParam;
    var requestLimit = requestLimitParam;

    if (offsetCounter > 0){
      offsetCounter -= 1;
      skipFirstAlbum = true;
    }

    eventEmitter.on('spotify.moreAlbums', buildLoop);
    eventEmitter.emit('spotify.moreAlbums', requestLimit, offsetCounter);
  };

  return builder;
};

/**
 * Query params
 * offset: track offset number (spotify API offset)
 * limit:  maximum number of albums in the response
 *
 * Response properties
 * offset: track offset number of the last track queried (spotify API offset)
 * items: {
 *  title
 *  imageUrl
 *  artist   
 * }
 */
router.get('/saved', function(req, res){

  var offset = 0;
  if (req.query.offset > 0)
    offset = parseInt(req.query.offset);

  var limit = Number.MAX_VALUE;
  if (req.query.limit > 0)
    limit = parseInt(req.query.limit);

  var buildCallback = function(albumsObj){
    res.send(albumsObj);
  };

  var albumBuilder = albumListBuilder(spotifyApi);
  var albums = albumBuilder.build(buildCallback, limit, offset);
});

module.exports = router;