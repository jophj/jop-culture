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

module.exports = router;