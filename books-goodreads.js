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

var parseShelfResponse = function(json){
    
    var parseBook = function(book) {
      var title = book.title[0];
      
      var imageUrl = book.large_image_url[0];
      if (imageUrl === '')
        imageUrl = book.image_url[0];
      
      var artists = [];
      for (var j = 0; j < book.authors.length; j++) {
        var author = book.authors[j].author[0];
        artists.push(author.name[0]);
      }
      
      return {
        title: title,
        artist: artists.join(', '),
        imageUrl: imageUrl
      };
    };
    
    var parsedItems = [];
    // check if request offset is higher than books saved
    if (json.GoodreadsResponse.books[0].book){
      var books = json.GoodreadsResponse.books[0].book;
      for (var i = 0; i < books.length; i++) {
        var bookToParse = books[i];
        var book = parseBook(bookToParse);
        parsedItems.push(book);
      }
    }
    return parsedItems;
  };
  
router.get('/', function(req, res){
  res.send('up and running');
});

router.get('/isAuthenticated', function(req, res){
  res.send(' Jop ');
});

router.get('/saved', function(req, res){
  var offset = 0;
  if (req.query.offset > 0)
    offset = parseInt(req.query.offset);

  var limit = Number.MAX_VALUE;
  if (req.query.limit > 0)
    limit = parseInt(req.query.limit);

  goodreadsApi.getSingleShelf({
    userID: 18865013,
    shelf: 'read',
    page: Math.floor(offset/limit) + 1,
    per_page: limit + offset % limit,
    },
    function (response) {
      if(response){
        var reallyParsedJson = parseShelfResponse(response);
        var items = reallyParsedJson.slice(reallyParsedJson.length - limit, reallyParsedJson.length);        
        
        var booksObj = {
          offset: offset + items.length,
          items: items
        };
        
        res.send(booksObj);
      }
       else{
        res.status(500).send(err);
       }
    }
  );
});






module.exports = router;