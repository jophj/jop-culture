var express       = require('express');
var request       = require('request');
var cheerio       = require('cheerio');
var async         = require('async');

var router = express.Router();

var rottenTomatoesUrl = 'http://www.rottentomatoes.com';

//the items data that is sent as response
var savedMovies = [{"artist":"Hiromasa Yonebayashi, Atsushi Okui, Gary Rydstrom","title":"The Secret World of Arrietty (2012)","imageUrl":"http://resizing.flixster.com/usMaakfAGQ1z5HLskCBmlVO8y88=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/10/11161029_ori.jpg"},{"artist":"Hayao Miyazaki","title":"Ponyo (2009)","imageUrl":"http://resizing.flixster.com/v6z14IIl3cRtRkLiS5ydkxW_3nQ=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/10/87/77/10877731_ori.jpg"},{"artist":"Nicolas Winding Refn","title":"Drive (2011)","imageUrl":"http://resizing.flixster.com/wsvgfk1gMjoWAljBtrUAWUtm3H0=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/36/11163653_ori.jpg"},{"artist":"Hayao Miyazaki","title":"Howl's Moving Castle (2005)","imageUrl":"http://resizing.flixster.com/dJe-QVx7RAmOp_xgcP2Q4fBKy5Y=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/37/11163753_ori.jpg"},{"artist":"Hayao Miyazaki","title":"The Wind Rises (2014)","imageUrl":"http://resizing.flixster.com/c50TMSht01ucMibT4KAULN3ko-g=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/49/11174921_ori.jpg"},{"artist":"Hayao Miyazaki","title":"Castle in the Sky (1989)","imageUrl":"http://resizing.flixster.com/F6-LyHyXvuv02Vn3_ffuX-yzq10=/110x150/dkpu1ddg7pbsk.cloudfront.net/movie/10/93/73/10937384_ori.jpg"},{"artist":"Christopher Nolan","title":"Interstellar (2014)","imageUrl":"http://resizing.flixster.com/l9yjA-72sZMYECeOjx-r14mgXtU=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/19/08/11190860_ori.jpg"},{"artist":"Richard Schenkman","title":"The Man From Earth (2007)","imageUrl":"http://resizing.flixster.com/xGxZXXX74N0JWHWVefiX1aBUG_s=/180x233/dkpu1ddg7pbsk.cloudfront.net/movie/10/92/40/10924054_ori.jpg"},{"artist":"Hayao Miyazaki","title":"Kiki's Delivery Service (1989)","imageUrl":"http://resizing.flixster.com/4WFzN3LG3GMGmnX3b5KrubGTExs=/110x150/dkpu1ddg7pbsk.cloudfront.net/movie/10/94/88/10948823_ori.jpg"},{"artist":"Andrey Tarkovskiy, Andrei Tarkovsky","title":"Stalker (1979)","imageUrl":"http://resizing.flixster.com/vpwvHXq4dj0Sldh0pPxvUvXDUEs=/180x259/dkpu1ddg7pbsk.cloudfront.net/movie/29/43/294309_ori.jpg"},{"artist":"Morten Tyldum","title":"The Imitation Game (2014)","imageUrl":"http://resizing.flixster.com/G1oUSsU3x1Cbl6g4VoYEDMeOn7M=/180x266/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/08/11180871_ori.jpg"},{"artist":"Wes Anderson","title":"The Grand Budapest Hotel (2014)","imageUrl":"http://resizing.flixster.com/6MSLBrMuf-29hx9-aMatYNlWS6U=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/85/11178563_ori.jpg"},{"artist":"Peter Jackson","title":"The Hobbit: The Battle of the Five Armies (2014)","imageUrl":"http://resizing.flixster.com/KK-V3xB7CY355XaejcerpzryvDs=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/97/11179703_ori.jpg"},{"artist":"Francis Lawrence","title":"The Hunger Games: Catching Fire (2013)","imageUrl":"http://resizing.flixster.com/1a9avHqIjVssHwO097tB_XJMVjs=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/64/11176484_ori.jpg"},{"artist":"Francis Lawrence (II), Francis Lawrence","title":"The Hunger Games: Mockingjay - Part 1 (2014)","imageUrl":"http://resizing.flixster.com/rrb4D1D8S1_ACJFg1qDpd6bY4cQ=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/98/11189899_ori.jpg"},{"artist":"Alejandro Gonz�lez I��rritu","title":"Birdman (2014)","imageUrl":"http://resizing.flixster.com/_-lyLoRpQa_fUOfx0RToUm7-t7c=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/99/11189914_ori.jpg"},{"artist":"James Marsh","title":"The Theory of Everything (2014)","imageUrl":"http://resizing.flixster.com/yIHubMDncxMqI6jktB7r4ZLBV-E=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/99/11189903_ori.jpg"},{"artist":"Makoto Shinkai","title":"By�soku 5 senchim�toru (5 Centimeters per Sec... (2007)","imageUrl":"http://resizing.flixster.com/Fp0IXn40MINCPm9zXaHGzUGYi6c=/180x256/dkpu1ddg7pbsk.cloudfront.net/movie/85/24/71/8524717_ori.jpg"},{"artist":"Alexandre Aja","title":"Horns (2014)","imageUrl":"http://resizing.flixster.com/P-0xbUiM_QT5S6iwQLtRXWG-V_c=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/96/11179634_ori.jpg"},{"artist":"Mamoru Oshii","title":"Ghost in the Shell 2 - Innocence (2004)","imageUrl":"http://resizing.flixster.com/cpX31xZ64TJE2caTg7BEpbuOS0E=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/10/93/14/10931402_ori.jpg"},{"artist":"Frank Miller (II), Robert Rodriguez, Frank Miller, Frank A Miller","title":"Frank Miller's Sin City: A Dame to Kill For (2014)","imageUrl":"http://resizing.flixster.com/WAaALZRnyVDmjolEV_y1-zwKX8k=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/18/11181878_ori.jpg"},{"artist":"Michael Bay","title":"Transformers: Age of Extinction (2014)","imageUrl":"http://resizing.flixster.com/jXWcxIKVUq4G-2vl7aClbKnOXr4=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/05/11180556_ori.jpg"},{"artist":"Christopher Nolan","title":"Memento (2000)","imageUrl":"http://resizing.flixster.com/u9oQglvQ2_ARXsfO94ObqAN-90Q=/180x261/dkpu1ddg7pbsk.cloudfront.net/movie/26/78/267827_ori.jpg"},{"artist":"Katie Graham, Andrew Matthews","title":"Zero Charisma (2013)","imageUrl":"http://resizing.flixster.com/bZ8rNTZDgxVpZabX57pNr70v8v4=/180x257/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/39/11173989_ori.jpg"},{"artist":"Terry Gilliam","title":"The Zero Theorem (2014)","imageUrl":"http://resizing.flixster.com/KjtdLbYjGLWjfyVauv2tiYxR7x4=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/99/11179941_ori.jpg"},{"artist":"Park Chan-wook","title":"Oldboy (2005)","imageUrl":"http://resizing.flixster.com/hopGlB-E5-kw2jIPmoIi8Y2TUAw=/180x254/dkpu1ddg7pbsk.cloudfront.net/movie/46/00/460042_ori.jpg"},{"artist":"Jonathan Dayton, Valerie Faris","title":"Ruby Sparks (2012)","imageUrl":"http://resizing.flixster.com/JriqthITvGu-feVnK-HGr41nAPs=/173x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/52/11165270_ori.jpg"},{"artist":"Mamoru Oshii","title":"Ghost in the Shell (1996)","imageUrl":"http://resizing.flixster.com/Y4DlBYF-j1bLX_1vKn1n3CKLSBw=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/88/11178878_ori.jpg"},{"artist":"Shane Carruth","title":"Primer (2004)","imageUrl":"http://resizing.flixster.com/rsaLhA5x_QL5aQ1HRkU_Eak6BoM=/180x249/dkpu1ddg7pbsk.cloudfront.net/movie/25/58/255802_ori.jpg"},{"artist":"Danny Boyle","title":"28 Days Later (2003)","imageUrl":"http://resizing.flixster.com/IyLczUQXtDX7JQvcTv0CJQLNaH8=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/55/37/32/5537323_ori.jpg"},{"artist":"Luc Besson","title":"L�on: The Professional (1994)","imageUrl":"http://resizing.flixster.com/PtWJVEyvHhliVehaP9B46bbAbi8=/180x263/dkpu1ddg7pbsk.cloudfront.net/movie/28/62/286221_ori.jpg"},{"artist":"Gareth Edwards","title":"Godzilla (2014)","imageUrl":"http://resizing.flixster.com/W225v6wvKcYGzmUYs21_qXUEGzg=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/95/11179578_ori.jpg"},{"artist":"Phil Lord, Christopher Miller, Chris McKay","title":"The LEGO Movie (2014)","imageUrl":"http://resizing.flixster.com/bTus4LUrY329ifoCLYGdpuOM1-4=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/76/11177655_ori.jpg"},{"artist":"Hayao Miyazaki","title":"Princess Mononoke (1999)","imageUrl":"http://resizing.flixster.com/hjUSaKaZ5GVBRVg0ms_blr8JgzE=/180x254/dkpu1ddg7pbsk.cloudfront.net/movie/25/42/254295_ori.jpg"},{"artist":"Spike Jonze","title":"Her (2013)","imageUrl":"http://resizing.flixster.com/JioAjhYbK-go4UZGwDDR7hnF3ks=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/76/11177656_ori.jpg"},{"artist":"Joe Johnston","title":"Captain America: The First Avenger (2011)","imageUrl":"http://resizing.flixster.com/-51Cj74TLHsGMtqnMPZOOXig9vA=/173x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/15/83/11158339_ori.jpg"},{"artist":"Brian Percival","title":"The Book Thief (2013)","imageUrl":"http://resizing.flixster.com/l_OyXOEcS9ig_XmNs2NfNAQkqvw=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/89/11178909_ori.jpg"},{"artist":"Edgar Wright","title":"Scott Pilgrim vs. the World (2010)","imageUrl":"http://resizing.flixster.com/2191fflkDHM2iJuFcYI0Lph4Fig=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/89/11168901_ori.jpg"},{"artist":"Peter Jackson","title":"The Hobbit: The Desolation of Smaug (2013)","imageUrl":"http://resizing.flixster.com/i3zwngMY9umqr8lAJLKAU4aYlAU=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/69/11176940_ori.jpg"},{"artist":"Peter Jackson","title":"The Hobbit: An Unexpected Journey (2012)","imageUrl":"http://resizing.flixster.com/vUOEhpcoaWV4JU5YM2dnlgTRyFo=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/02/11170263_ori.jpg"},{"artist":"Gaspar Noe","title":"Enter the Void (Soudain le vide) (2010)","imageUrl":"http://resizing.flixster.com/umlWRKNYjmqT-ZHsG1tf_zAWgb4=/180x246/dkpu1ddg7pbsk.cloudfront.net/movie/11/15/14/11151440_ori.jpg"},{"artist":"Leos Carax","title":"Holy Motors (2012)","imageUrl":"http://resizing.flixster.com/9SUrTmL0_Gx0fN784zZh2dDZDZY=/180x263/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/70/11167005_ori.jpg"},{"artist":"Baz Luhrmann","title":"The Great Gatsby (2013)","imageUrl":"http://resizing.flixster.com/0R08QM_AsJ4cwTHomxUijk46nPQ=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/25/11172588_ori.jpg"},{"artist":"Lori Petty","title":"The Poker House (2008)","imageUrl":"http://resizing.flixster.com/C3cgAQyJnh-IbpKukz8j8QTn2Wo=/180x266/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/90/11169099_ori.jpg"},{"artist":"Alfonso Cuar�n","title":"Gravity (2013)","imageUrl":"http://resizing.flixster.com/5CbtiBSzqVjH_ckRVfzJvs-Ocns=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/64/11176450_ori.jpg"},{"artist":"Alexander Payne","title":"Nebraska (2013)","imageUrl":"http://resizing.flixster.com/LnvW5EMYeCwgCrMtAlW5etUF9n0=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/64/11176448_ori.jpg"},{"artist":"Ron Howard","title":"Rush (2013)","imageUrl":"http://resizing.flixster.com/2ciS-r72tzM85Fhf7mPmzgwYPg4=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/57/11175774_ori.jpg"},{"artist":"Paul Greengrass","title":"Captain Phillips (2013)","imageUrl":"http://resizing.flixster.com/bl6d3jJ3e9IXJQLIwBlb1EIANy0=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/57/11175791_ori.jpg"},{"artist":"Jean-Marc Vall�e","title":"Dallas Buyers Club (2013)","imageUrl":"http://resizing.flixster.com/t8iiyTyrOoVSxSkyUDjOUu6RGo4=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/60/11176064_ori.jpg"},{"artist":"Martin Scorsese","title":"The Wolf of Wall Street (2013)","imageUrl":"http://resizing.flixster.com/v_31slr4ApiAmn-V2r_UELau6PM=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/69/11176976_ori.jpg"},{"artist":"David O. Russell","title":"American Hustle (2013)","imageUrl":"http://resizing.flixster.com/ubIjK2kENG9vCzMutWzrbkkeq0M=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/68/11176815_ori.jpg"},{"artist":"Jennifer Lee (XXX) , Jennifer Lee, Chris Buck","title":"Frozen (2013)","imageUrl":"http://resizing.flixster.com/M3JgYWjuLaOPruIuhLfHA0GwmtY=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/35/11173584_ori.jpg"},{"artist":"Steve McQueen (III)","title":"12 Years a Slave (2013)","imageUrl":"http://resizing.flixster.com/9jypjzk86nizeDc8Pn4T3jyNmxc=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/64/11176495_ori.jpg"},{"artist":"Guillermo del Toro","title":"Pacific Rim (2013)","imageUrl":"http://resizing.flixster.com/xXxKG8aZ0KPN30l05l-Cz-WjZac=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/39/11173933_ori.jpg"},{"artist":"Gary Ross","title":"The Hunger Games (2012)","imageUrl":"http://resizing.flixster.com/ojHrfHgQ7Z6zwJ9O0GlmvI_Y-6Y=/180x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/17/36/11173667_ori.jpg"}];

var ratingPageRequestOptions = function (auth_token)
{
  return {
    url: rottenTomatoesUrl + '/user/id/963241238/ratings',
    headers: {
      'Host': 'www.rottentomatoes.com',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36',
      'Referer': 'http://www.rottentomatoes.com/',
      'Accept-Encoding': 'deflate, sdch',
      'Accept-Language': 'it-IT,en-US;q=0.8,en;q=0.6',
      'Cookie': 'fbm_326803741017=base_domain=.www.rottentomatoes.com; ServerID=1193; JSESSIONID=9D138A438A97E184440B3C755EEB439E; auth_user=963241238; loginPlatform=FBK; session_id=qkrilawrqz-963241238; auth_token='+auth_token+'; fbsr_326803741017=YMLZX3p-SEDqm3iTQIfvmsGgJbaVNmjdpj1KsC059F8.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUFDNTA3R3l4TW1RUGVNT1U5R2ZWT05mamVQYlZRMzIwb0IzeVpJRGdQSlo0OV83RS0yMHZLVHJTUHpieXRoUVpud1FkYUJrYWFHQm1vSkUweUtsWnVjcUdOVjV2eDFOLTRkOEl2UzFLX09CZW16aWRMTlNicXcxbkFSUW54OER2NHc3cTFPV0k4d3NMVElnWHRld2dxWWR1TlNNYllRY00xRVAyNjNQLTBmbFluNlNtQUpkdXlOd2s0QmU0SVFwR2Rfbm9zRjJKaWVWcVUtam5BSjlVenBuM3hqRUZET0FVdU43ajJaY0RJeUJSMC1VMTlVR3gwV0UzdGtBamxibVJ6Z1h4bmJ0ZDJROURZZE1Bek5HVzNKZUV6M3QtVWwtZTJPR1Y2dWRaTGIxY2NuaGRLa0labkhqVkdWN0JXUVFGVEFDX2tfQUNGZlBuTVh2ZXd3SUNKViIsImlzc3VlZF9hdCI6MTQzMzAwMjA5NiwidXNlcl9pZCI6IjE1NTc5MTMyNjYifQ'
    }
  };
};

router.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.get('/', function(req, res){
  res.send('up and running');
});


//TODO use auto_token as query param or drop this
router.get('/isAuthenticated', function(req, res){   
  res.send(' Jop');
});


var movieListBuilder = function(auth_token){
  var builder = {};
  
  //the final object to return as response to query
  var movies = {};
  movies.offset = 0;
  movies.items = [];
  
  //final callback
  var buildCallback = null;
  
  var offsetCounter = 0;
  var requestLimit = 1;
  
  var ratingPageCallback = function (error, response, body) {
    // after the first callback data is stored here to asynchronously retrieve informations
    var moviesNotResolved = [];
    
    $ = cheerio.load(body);
    
    var elements = $('#main_container > div.col-center-right.col-full-xs > div.panel.panel-rt.panel-box > div > div > div > div.media-heading');
    elements.each(
      function (i, elem) {
        var s = $(this);
        var titleElement = s.children('a');
        var yearString = s.children('span').text();
        moviesNotResolved.push({
          title: titleElement.text(),
          year: parseInt(yearString.substr(1, yearString.length-2)),
          href: titleElement.attr('href')
        });
        if (titleElement.text().indexOf('Centi') > 0 )
          console.log('found');
      }
    );

    buildMoviesArray(moviesNotResolved.splice(offsetCounter, requestLimit));
  };
  
  var buildMoviesArray = function name(moviesToResolve) {
    
    var buildMovieObject = function (movie, callback) {
      request(rottenTomatoesUrl + movie.href, function (err, res, body) {
        
        $ = cheerio.load(body);
        var directorElement = $('#main-content > div.media-body > div.movie_info.clearfix > div > table > tr:nth-child(3) > td:nth-child(2) > a');
        var directors = directorElement.map(function (i, element) {
          return $(this).text();
        }).get().join(', ');
        var imageElement = $('#topSection > div.col-sm-7.col-xs-9 > div img');
        movies.items.push({
          artist: directors,
          title: movie.title + " (" + movie.year + ")",
          imageUrl: imageElement.attr('src')
        });
        movies.offset += 1;
        
        callback();
      });
    };
    
    var q = async.queue(buildMovieObject, 5);
    q.drain = function() {
      buildCallback(movies);
    };
    q.push(moviesToResolve);
  };
      
  builder.build = function (callback, requestLimitParam, offsetCounterParam) {
    request(ratingPageRequestOptions(auth_token), ratingPageCallback);
    buildCallback = callback;
    
    offsetCounter = offsetCounterParam;
    requestLimit = requestLimitParam; //TODO TEST OCCHIO console.log
    //requestLimit = 6;
  };
  
  return builder;
}


router.get('/saved', function(req, res){

  var offset = 0;
  if (req.query.offset > 0)
    offset = parseInt(req.query.offset);

  var limit = Number.MAX_VALUE;
  if (req.query.limit > 0)
    limit = parseInt(req.query.limit);

  var moviesResponse = {};
  moviesResponse.items = savedMovies.slice(offset, offset + limit);
  moviesResponse.offset = offset + moviesResponse.items.length;
  
  res.send(moviesResponse);
});

router.get('/fetchData', function (req, res) {
  var auth_token = req.query.auth_token;
  
  var buildCallback = function(moviesObj){
    res.send(moviesObj);
    savedMovies = moviesObj.items;
  };
  
  var movieBuilder = movieListBuilder(auth_token);
  movieBuilder.build(buildCallback, Number.MAX_VALUE, 0);
});

module.exports = router;