/// <reference path="../typings/mocha/mocha.d.ts"/>

var request = require('superagent');
var assert = require("assert");

var SERVER = 'http://localhost:3666/books';
//SERVER = 'https://jop-culture.herokuapp.com/books';

describe('Goodreads books api', function(){
  this.timeout(5000);    
  before(function(done) {
    setTimeout(done, 1500);
  });
  
  it('should get a response from server', function(done){
    request.get(SERVER, function(res){
      assert.equal(res.text, 'up and running');
      done();
    });
  });

  it('should always be authenticated', function(done){
    request.get(SERVER + '/isAuthenticated', function(res){
      assert.ok(res.text.indexOf('Jop') > 0);
      done();
    })
  });

  it('should get array of saved books', function(done){
    request.get(SERVER + '/saved', function(res){
      var albumsObj = JSON.parse(res.text);
      assert.ok(albumsObj.items.length > 0);
      assert.ok(albumsObj.offset > 0);
      done();
    });
  });

  it('should receive some more saved books', function(done){
    var offset = 30;
    request
      .get(SERVER + '/saved')
      .query({"offset": offset})
      .end(function(res){
        var albumsObj = JSON.parse(res.text);

        assert.ok(albumsObj.items.length > 0);
        assert.ok(albumsObj.offset > offset);

        done();
      });
  });

  it('should receive exactly 2 books', function(done){
    request
      .get(SERVER + '/saved')
      .query({"limit": 2, "offset": 30})
      .end(function(res){
        var albumsObj = JSON.parse(res.text);
        assert.equal(albumsObj.items.length, 2);
        done();
      });
  });
  
  it('should skip the first book when offset is 1', function(done){

    var requestA = function(callbackB){
      return request
        .get(SERVER + '/saved')
        .query({"limit": 1, "offset": 0})
        .end(function(res){
          var albumsObj = JSON.parse(res.text).items[0];
          callbackB(albumsObj);
        });
    };

    var requestB = function(albumsObjA){
      request
        .get(SERVER + '/saved')
        .query({"limit": 1, "offset": 1})
        .end(function(res){
          var albumsObjB = JSON.parse(res.text).items[0];
          assert.notEqual(albumsObjA.title, albumsObjB.title);            
          done();
        });
      };

    requestA(requestB);
  });

  it('should ask for too much', function(done){
    request
      .get(SERVER + '/saved')
      .query({"limit": 200, "offset": 2500})
      .end(function(res){
        var albumsObj = JSON.parse(res.text);
        assert.equal(albumsObj.offset, 2500);
        done();
      });
  });
});