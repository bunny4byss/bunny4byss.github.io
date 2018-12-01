jogo.menu = function (){};

var button;
var background;

function actionOnClick(){
  start_sound = game.add.audio('start_sound');
  start_sound.play();
  menu_song.stop();

  game.state.start('cutscene');
}

jogo.menu.prototype = {
    preload: function (){
        game.load.image('bgmenu', 'assets/bgmenu.jpg');
        game.load.image('button', 'assets/play.png');
        game.load.audio('start_sound', 'assets/audio/StartGame.wav');
        game.load.audio('menu_song', 'assets/audio/Menu.m4a')
    },
    create: function (){
         menu_song = game.add.audio('menu_song');
         menu_song.play();
         background = game.add.tileSprite(0,0, 800, 600,'bgmenu');
             button = game.add.button(220, 250, 'button', actionOnClick, this, 2, 1, 0);
    },
    update: function (){}

};
