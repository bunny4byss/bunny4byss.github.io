var game = new Phaser.Game(600, 400, Phaser.AUTO, 'GodInvaders');

game.state.add('fase1', jogo.fase1);
game.state.add('fase2', jogo.fase2);
game.state.add('fase3', jogo.fase3);
game.state.start('fase1');