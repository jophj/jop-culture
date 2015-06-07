var express       = require('express');
var SteamApi      = require('steam-api');
var EventEmitter  = require('events').EventEmitter;

var eventEmitter = new EventEmitter();
var router = express.Router();



var steamApiKey;
if (process.env.STEAM_APIKEY){
  steamApiKey = process.env.STEAM_APIKEY;
}
else{
  steamApiKey = require('./steamApiKey');
}

var jopSteamID = '76561198017403191';
var player = new SteamApi.Player(steamApiKey);
// that's the awesome db from wich games are retrieved
var gameItems = [];

router.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.get('/', function(req, res){
  res.send('up and running');
});

router.get('/isAuthenticated', function(req, res){
  if (player) res.send(' Jop');
  else res.err(500);
});


var GamesFetcher = function () {
  
  return {
    fetchGames: function (callback) {
      player.GetOwnedGames(jopSteamID, true, true, []).done(
        callback
      );
    }
  };
};

var GamesParser = function () {
  return{
    parseAndOrder: function (steamGames) {
      if (!steamGames) return null;
      
      // descending order
      steamGames.sort(function (g1, g2) {
        return g2.playtimeForever - g1.playtimeForever;
      });
      
      var gameItems = [];
      for (var i = 0; i < steamGames.length; i++) {
        var steamGame = steamGames[i];
        
        gameItems.push({
          title: steamGame.name,
          imageUrl: steamGame.logo,
          artist: null
        });
      }
      return gameItems;
    }
  };
};

GamesFetcher().fetchGames(function (result) {
  var gameItems = GamesParser().parseAndOrder(result);
  console.log(gameItems);
  
});






module.exports = router;