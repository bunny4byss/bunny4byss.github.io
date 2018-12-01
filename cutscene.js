jogo.cutscene = function (){};

var background;

var content = [
    "Enquanto Bruce caia sozinho, podia ver o avião de seu pai (...)",
    "No dia de seu aniversário de 10 anos, Steve leva Bruce e Marta ",
    "para passearem em seu avião...",
    "",
    "Durante o vôo, algo brilhante cai do céu e atinge o avião, ",
    "que começa a cair em direção à uma montanha,",
    "e com apenas 1 paraquedas disponível,",
    "Steve decide proteger seu bem mais precioso,",
    "seu filho, colocando nele o paraquedas e o atirando para fora.",
    "",
    "Enquanto Bruce caia sozinho, podia ver o avião de seu pai",
    "se chocando com uma montanha e explodindo em seguida.",
    "Após esse fatídico dia, Bruce é mandado à um orfanato, ",
    "onde passou os próximos 8 anos.",
];

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 120;
var lineDelay = 400;

function nextWord() {
    text.text = text.text.concat(line[wordIndex] + " ");
    wordIndex++;
    if (wordIndex === line.length)
    {
        text.text = text.text.concat("\n");
        game.time.events.add(lineDelay, nextLine, this);
    }
}

function nextLine() {

    if (lineIndex === content.length)
    {
        return game.state.start('fase1');
    }
    line = content[lineIndex].split(' ');
    wordIndex = 0;
    game.time.events.repeat(wordDelay, line.length, nextWord, this);
    lineIndex++;
}

jogo.cutscene.prototype = {
    preload: function (){
        game.load.image('cutscene3', 'assets/cutscene3.jpg');
        game.load.audio('temaGame', 'assets/audio/Temagame.ogg');
    },
    create: function (){
         background = game.add.tileSprite(0,0, 800, 600,'cutscene3');
         text = game.add.text(32, 32, '',
                                  {
                                    font: "bold 14px Arial",
                                    fill: "#19de65"
                                    //fontWeight = "bold"
                                  }
                              );
         theme = game.add.audio('temaGame');
         theme.play();
         theme.loop = true;
         nextLine();
    },
    update: function (){}
};
