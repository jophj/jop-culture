var callback = function(result){
    console.log('steam test');
    console.log(result);
  };
  
console.log('steam test');
var SteamApi = require('steam-api');
var player = new SteamApi.Player(
  '12CF2FB52A9BFD9E8493335CCB30B54F');
console.log(player);
player.GetOwnedGames('76561198017403191', true, true, []).done(
  callback
);

module.export = null;