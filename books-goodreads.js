var express       = require('express');
var SpotifyWebApi = require('spotify-web-api-node');
var EventEmitter  = require('events').EventEmitter;
var goodreads     = require('./libs/goodreads/index.js'); 

var eventEmitter = new EventEmitter();
var router = express.Router();

var apiKeys;
if (process.env.SPOTIFY_CLIENTID){
  apiKeys = {};
  apiKeys.key = process.env.GOODREADS_KEY;
  apiKeys.secret = process.env.GOODREADS_SECRET;
}
else{
  apiKeys = require('./goodreadsApiKey');
}

var goodreadsApi = new goodreads.client(apiKeys);

goodreadsApi.getSingleShelf({userID:18865013, shelf:'read'},
  function (response) {
    if(response)
      console.log(response);
  }
);








module.exports = router;