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
var gameItemsDB = [{"title":"Borderlands: The Pre-Sequel","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/261640/df64c72fd335a03dbcc0a19b1f81acc8db1b94ba.jpg","artist":null},{"title":"Call of Duty: Modern Warfare 3 - Multiplayer","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/42690/52841f445d2a1a1df608c6625c541674a30c5985.jpg","artist":null},{"title":"Awesomenauts","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/204300/a2eba6157703c60bfcc199f06df5f1568c9835bb.jpg","artist":null},{"title":"Dota 2","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/570/d4f836839254be08d8e9dd333ecc9a01782c26d2.jpg","artist":null},{"title":"Half-Life 2","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/220/e4ad9cf1b7dc8475c1118625daf9abd4bdcbcad0.jpg","artist":null},{"title":"Risk of Rain","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/248820/62869ec060e6dfdd3ca53e23c85e30a16de9c291.jpg","artist":null},{"title":"Shadowrun Returns","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/234650/d2ada23f204adf831dc89be7c6edbbbc38c99ef6.jpg","artist":null},{"title":"Torchlight II","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/200710/fd37abb86628ff54ed304f75c2fb7cf75a4f6902.jpg","artist":null},{"title":"Team Fortress 2","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/440/07385eb55b5ba974aebbe74d3c99626bda7920b8.jpg","artist":null},{"title":"Rogue Legacy","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/241600/c591f688add1e008d5d92e82b9d9fa2332e20491.jpg","artist":null},{"title":"Minimum","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/214190/f6b158620fd2d25cf5500cbef744cefc8c00635e.jpg","artist":null},{"title":"Portal","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/400/4184d4c0d915bd3a45210667f7b25361352acd8f.jpg","artist":null},{"title":"Monaco","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/113020/60642017342ab7f3c924ee9d13b99702a50e5d9e.jpg","artist":null},{"title":"BioShock","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/7670/4c2a7f97e6556a95319eb346aed7beff9fe0535c.jpg","artist":null},{"title":"Magicka","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/42910/8c59c674ef40f59c3bafde8ff0d59b7994c66477.jpg","artist":null},{"title":"Call of Duty: Modern Warfare 3","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/42680/52841f445d2a1a1df608c6625c541674a30c5985.jpg","artist":null},{"title":"BioShock 2","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/8850/fde6fa1b15e4eb409c9d592197024571fded77e7.jpg","artist":null},{"title":"Super Meat Boy","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/40800/70f084857297d5fdd96d019db3a990d6d9ec64f1.jpg","artist":null},{"title":"Hotline Miami","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/219150/540a1457099f072ced7153239861e42f14febd56.jpg","artist":null},{"title":"Portal 2","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/620/d2a1119ddc202fab81d9b87048f495cbd6377502.jpg","artist":null},{"title":"Strike Suit Zero","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/209540/c76f1c726cba4ceb14290012c7d2c472284b9180.jpg","artist":null},{"title":"The Binding of Isaac","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/113200/d9a7ee7e07dffed1700cb8b3b9482105b88cc5b5.jpg","artist":null},{"title":"Far Cry® 3 Blood Dragon","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/233270/dfc8d8e94b85a3ce6666069bb5d17c2dbc3fada5.jpg","artist":null},{"title":"Cave Story+","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/200900/a242e0465a65ffafbf75eeb521812fb575990a33.jpg","artist":null},{"title":"Bastion","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/107100/d113d66ef88069d7d35a74cfaf2e2ee917f61133.jpg","artist":null},{"title":"Guacamelee! Gold Edition","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/214770/461f1e9e34cf80edf3581d78c5d24e20501eeaf2.jpg","artist":null},{"title":"BIT.TRIP RUNNER","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/63710/13cdddc55559cd4f47fbe970c9ad0de6bebb2f21.jpg","artist":null},{"title":"Hero Siege","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/269210/e19dd6b144d8f7ddb92a35e79ad9f0d9f091c648.jpg","artist":null},{"title":"Don't Starve","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/219740/46cbbc2fcb14eb0bbbbaebbdf0b1e0eaf6f4c646.jpg","artist":null},{"title":"Half-Life 2: Episode Two","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/420/553e6a2e7a469dcbaada729baa1f5fd7764668df.jpg","artist":null},{"title":"Dead Island: Epidemic","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/222900/e5b801707f7373d69eab3f15b6fdb02f7270374a.jpg","artist":null},{"title":"The Binding of Isaac: Rebirth","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/250900/c7a76988c53e7f3a3aa1cf224aaf4dbd067ebbf9.jpg","artist":null},{"title":"Castle Crashers","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/204360/793216ec14c639bdaf2f0119c8cc408b8e9ad7b1.jpg","artist":null},{"title":"BattleBlock Theater","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/238460/13380473acaa95f843301b8a21a383790ae384de.jpg","artist":null},{"title":"Metro 2033","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/43110/df9a163ac1f28dfc84c93a6fc0dc51719eaef518.jpg","artist":null},{"title":"FEZ","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/224760/d2789dc5fb6bfee4d07cd3ec06985593fffd606c.jpg","artist":null},{"title":"LIMBO","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/48000/9f35c3d64649a5a03b69d6a9218b1f77caf15025.jpg","artist":null},{"title":"Deadlight","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/211400/999ca8e7a742d1eff2cb6708dd12036952b31163.jpg","artist":null},{"title":"Half-Life 2: Episode One","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/380/b5a666a961d8b39896887abbed3b78c2b837c238.jpg","artist":null},{"title":"Orcs Must Die! 2","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/201790/c345d9b205f349f0e7f4e6cdf8af4d0b7d242505.jpg","artist":null},{"title":"Dead Island","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/91310/62632a275a4cc08f0238ed3d589ce1d8627fde91.jpg","artist":null},{"title":"METAL SLUG 3","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/250180/2f38a8238712afa7cacdd41031a114b35cf9b9db.jpg","artist":null},{"title":"Company of Heroes","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/4560/e12e8695c6766b47a089351dd9c4531e669c2a7b.jpg","artist":null},{"title":"Screencheat","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/301970/395f329dfd23d2a895a49386cbce220024c7a8e8.jpg","artist":null},{"title":"Jazzpunk","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/250260/4d0aa51a082934215453d77f10b8a985151c37bc.jpg","artist":null},{"title":"Papers, Please","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/239030/eb4c045f73f9a4b1bac708e70fb12f12cd53010f.jpg","artist":null},{"title":"Sanctum 2","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/210770/333a8c65480bb85148bb3a185843a8520ae5d90f.jpg","artist":null},{"title":"The Stanley Parable","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/221910/80de64fedc906c4d81123e7ddc1d61d39183ab2d.jpg","artist":null},{"title":"Dungeons of Dredmor","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/98800/484e2713b16e9af259b96b0729ccf30e8fc78b2d.jpg","artist":null},{"title":"A Virus Named TOM","imageUrl":"http://media.steampowered.com/steamcommunity/public/images/apps/207650/d6491d7919f9da534d1695e6cde5c69fc5f0ec0c.jpg","artist":null}];

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
  if (gameItems!= null && gameItemsDB.length <= gameItems.length){
    gameItemsDB = gameItems;    
    console.log('[Steam] Games fetched:', gameItemsDB.length);
    //TODO reschedue game fetch
  }
});

router.get('/saved', function(req, res){

  var offset = 0;
  if (req.query.offset > 0)
    offset = parseInt(req.query.offset);

  var limit = 50;
  if (req.query.limit > 0)
    limit = parseInt(req.query.limit);

  var gameItems = gameItemsDB.slice(offset, offset + limit);
  
  console.log(offset, limit, gameItems.length);
  res.send({
    offset: offset+gameItems.length,
    items: gameItems
  });
});




module.exports = router;