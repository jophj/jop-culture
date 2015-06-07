/// <reference path="../typings/mocha/mocha.d.ts"/>

var request = require('superagent');
var assert = require("assert");

var SERVER = 'http://localhost:3666/movies';
SERVER = 'https://jop-culture.herokuapp.com/movies'

describe('Rotten tomatoes movies apis', function(){
  this.timeout(7000);    
  before(function(done) {
    setTimeout(done, 2000);
  });
  
  it('should get a response from server', function(done){
    request.get(SERVER, function(res){
      assert.equal(res.text, 'up and running');
      done();
    });
  });

  it('should get array of saved movies', function(done){
    request.get(SERVER + '/saved', function(res){
      var albumsObj = JSON.parse(res.text);
      assert.ok(albumsObj.items.length > 0);
      assert.ok(albumsObj.offset > 0);
      done();
    });
  });

  it('should receive some more saved albums', function(done){
    var offset = 2;
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

  it('should receive exactly 2 albums', function(done){
    request
      .get(SERVER + '/saved')
      .query({"limit": 2, "offset": 3})
      .end(function(res){
        var albumsObj = JSON.parse(res.text);
        assert.equal(albumsObj.items.length, 2);
        done();
      });
  });
  
  it('should skip the first album when offset is 1', function(done){

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