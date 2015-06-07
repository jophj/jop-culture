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

var player = new SteamApi.Player(steamApiKey);


var callback = function(result){
    console.log('steam test');
    console.log(result);
  };
  
console.log('steam test');
console.log(player);
player.GetOwnedGames('76561198017403191', true, true, []).done(
  callback
);

module.export = null;