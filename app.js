var express = require('express');
var music   = require('./music-spotify');
var movies  = require('./movies-rottentomatoes');
var books   = require('./books-goodreads');
var games   = require('./games-steam');
var app = express();

app.set('port', (process.env.PORT || 3666));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/music', music);
app.use('/movies', movies);
app.use('/books', books);

app.listen(app.get('port'), function() {
  console.log("App is running at localhost:" + app.get('port'));
});
