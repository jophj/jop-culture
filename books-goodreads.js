var express       = require('express');
var SpotifyWebApi = require('spotify-web-api-node');
var EventEmitter  = require('events').EventEmitter;

var eventEmitter = new EventEmitter();
var router = express.Router();

var apiKey = require('./goodReadsApiKey');