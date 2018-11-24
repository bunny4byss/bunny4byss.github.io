var jogo = {}, centroX = 600/2,centroY = 400/2,nave, speed = 5, velocidadeDisparo = 200, proximoTiro = 0, inimigo,
    bala, inimigoGrupo, direcaoBala = true, vidaPersonagem = 3, vida1, vida2, vida3, score = 0, msgScore, fimJogo,
    furia, furia2, furia3, furiaPonto = 0, ragebala = 0, inimigoG, inimigoGrupoGarg ,inimigoGarg, boss, bossGrupo,
    bossHP = 100, movB, balaArma, balaBoss, proximoAtaqueB = 0, velocidadeAtaqueB = 3000, inimigoDP, inimigoDPGrupo,
    scoreBoss = 0, level = 0, levelvelocidade = -1, night, evening, day, morning, sun, lifehack;

var audioBoss, tiroNave, rageSom, hitNave, naveMorte, fullRage;

var bolado = 50



jogo.fase1 = function (){};
jogo.fase1.prototype = {
    preload: function (){//Carrega as imagens/assets
        
         game.load.image('evening','assets/evening.jpeg');//Cenario
         game.load.image('sun','assets/sun.jpg');  
         game.load.image('morning','assets/morning.jpeg'); 
         game.load.image('day','assets/day.jpeg');
         game.load.image('night','assets/night.jpeg');
         game.load.image('balaNave','assets/bullet_normal.png');
         game.load.spritesheet('nave','assets/nave.png',64,36);//pixel da imagem é 64x64
         game.load.spritesheet('dragao2','assets/dragon_2.png',64,64);//pixel da imagem é 64x64
         game.load.spritesheet('dragao_preto','assets/dragon_3.png',64,64);//pixel da imagem é 64x64
         game.load.spritesheet('gargo','assets/gargoyle.png',64,64);//pixel da imagem é 64x64
         game.load.spritesheet('boss','assets/boss.png',256,185);//pixel da imagem é 256x256
         game.load.spritesheet('atkBoss','assets/ataque_boss.png',200,49);//pixel da imagem é 256x256
        //Audio
        game.load.audio('audioBoss', 'assets/audio/Rugido.wav');
        game.load.audio('temaGame', 'assets/audio/Temagame.ogg');
        game.load.audio('tiroNave', 'assets/audio/Tironave.ogg');
        game.load.audio('rageKill', 'assets/audio/Rage.wav');
        game.load.audio('hitNave', 'assets/audio/Hitnave.wav');
        game.load.audio('naveMorte', 'assets/audio/Navemorte.wav');
        game.load.audio('fullRage', 'assets/audio/Fullrage.wav');
        
        
        //HUD
        game.load.image('life','assets/hud/life.png');//Vida
        game.load.image('lifehack','assets/hud/lifehack.png');//Vida
        game.load.image('score','assets/hud/score.png');//Pontos
        game.load.image('rage','assets/hud/rage.png');
        game.load.image('rage2','assets/hud/rage_2.png');
        game.load.image('rage3','assets/hud/rage_3.png');
        
        
    },
    create: function (){

       //Fisica para o personagem não passar pela tela
        game.physics.startSystem(Phaser.Physics.ARCADE);
        ///////////////////////////////////CENARIO/////////////////////////
        game.stage.backgroundColor = '#ffeee6';//cor do fundo
        game.world.setBounds(0, 0, 600, 400);//Seta o limite do mundo
        sun = game.add.sprite(0,0,'sun');
        morning = game.add.sprite(0,0,'morning');
        day = game.add.sprite(0,0,'day');
        evening = game.add.sprite(0,0,'evening');//Background
        night = game.add.sprite(0,0,'night');//Background
        ///////////////////////////////////CENARIO/////////////////////////
        
        
        var temagame = game.add.audio('temaGame');
        
        
        
         audioBoss = game.add.audio('audioBoss');
         tiroNave = game.add.audio('tiroNave');
         tiroNave.volume = 0.1;
         rageSom = game.add.audio('rageKill');
         hitNave = game.add.audio('hitNave');
         naveMorte = game.add.audio('naveMorte');
         fullRage = game.add.audio('fullRage');
        ////////////////////////////configurações do jogo/criação de balas/inimigos/////////////////////////////////
                //nave
        
        nave = game.add.sprite(centroX - 200,centroY,'nave');//Nave começa o jogo no meio da tela
        nave.anchor.setTo(0.5, 0.5);
       //Habilita as fisicas para o personagem não sair da tela
        game.physics.enable(nave);
        nave.body.collideWorldBounds = true;
        nave.animations.add('naveVirando',[0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        nave.animations.add('naveParada',[ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
        nave.animations.add('naveDestro',[ 24, 25, 26, 27, 28, 29]);
        nave.animations.add('naveVoandoLado', [18, 19, 20, 21, 22, 23]);
        nave.animations.play('naveVoandoLado', 14, true);
        
        
        //Camera que vai seguir o personagem
        game.camera.follow(nave);
        game.camera.deadzone = new Phaser.Rectangle(centroX - 300, 0, 600, 400 );
    
    //Ataque do boss
        balaBoss = game.add.group();
        balaBoss.enableBody = true;
        balaBoss.physicsBodyType = Phaser.Physics.ARCADE;
        balaBoss.createMultiple(50, 'atkBoss');
        balaBoss.setAll('checkWorldBounds',true);
        balaBoss.setAll('outOfBoundsKill',true);
        balaBoss.setAll('anchor.y', -0.5);
        balaBoss.setAll('anchor.x', 0);
        balaBoss.callAll('animations.add', 'animations', 'atkBoss', [0,1,2], 14, true); //Aplica a animação no projetil do boss
        balaBoss.callAll('play', null, 'atkBoss');

    
     //Bala da arma
        balaArma = game.add.group();
        balaArma.enableBody = true;
        balaArma.physicsBodyType = Phaser.Physics.ARCADE;
        balaArma.createMultiple(50, 'balaNave');
        //Seta o tamanho da bala
     //   balaArma.setAll('scale.x', 2);
      //  balaArma.setAll('scale.y', 2);
        
        //Se a bala sair da tela, ela é some
        balaArma.setAll('checkWorldBounds',true);
        balaArma.setAll('outOfBoundsKill',true);
        
        //Seta a bala para iniciar sua saida proximo da nave
        balaArma.setAll('anchor.y', 0.5);
        balaArma.setAll('scale.x', 2);
        balaArma.setAll('scale.y', 2);

    
        
        //inimigo dragao2
        
        
        
        inimigoGrupo = game.add.group();
        inimigoGrupo.enableBody = true;
        inimigoGrupo.physicsBodyType = Phaser.Physics.ARCADE;
        
        
       
        
        inimigoGrupo.setAll('anchor.x', 0.5);
        inimigoGrupo.setAll('anchor.y' ,0.5);
        inimigoGrupo.setAll('scale.x', 0.8);
        inimigoGrupo.setAll('scale.y', 0.8);
        
       
        
        
        
        //Gargola
        
        inimigoGrupoGarg = game.add.group();
        inimigoGrupoGarg.enableBody = true;
        inimigoGrupoGarg.physicsBodyType = Phaser.Physics.ARCADE;
        
        
        inimigoGrupoGarg.setAll('anchor.x', 0.5);
        inimigoGrupoGarg.setAll('anchor.y' ,0.5);
        inimigoGrupoGarg.setAll('scale.x', 0.8);
        inimigoGrupoGarg.setAll('scale.y', 0.8);
        
        //Boss
        bossGrupo = game.add.group();
        bossGrupo.enableBody = true;
        bossGrupo.physicsBodyType = Phaser.Physics.ARCADE;
        
        
        bossGrupo.setAll('anchor.x', 0.5);
        bossGrupo.setAll('anchor.y' ,0.5);
        
        
        
        
        
         //Dragao preto
        
        
        inimigoDPGrupo = game.add.group();
        inimigoDPGrupo.enableBody = true;
        inimigoDPGrupo.physicsBodyType = Phaser.Physics.ARCADE;
        
        
       
        
        inimigoDPGrupo.setAll('anchor.x', 0.5);
        inimigoDPGrupo.setAll('anchor.y' ,0.5);
        inimigoDPGrupo.setAll('scale.x', 0.8);
        inimigoDPGrupo.setAll('scale.y', 0.8);
        
        
        ////////////////////////////configurações do jogo/criação de balas/inimigos/////////////////////////////////
        
        
        
        
        
        
        
        
        
       

        
        //Vidas
         vida1 = game.add.sprite(450,10,'life');//Vida
         vida2 = game.add.sprite(490,10,'life');//Vida
         vida3 = game.add.sprite(530,10,'life');//Vida
         lifehack = game.add.sprite(450,10,'lifehack');//Vida
         lifehack.visible = false;
        //Score
        var ponto = game.add.sprite(-10,-40,'score');
        
        
        //Furia
        rage3 = game.add.sprite(-40,50,'rage3');
        rage2 = game.add.sprite(-40,50,'rage2'); 
        rage = game.add.sprite(-40,50,'rage');
         
        
        
        
        //Texto do score
        msgScore = game.add.text(110,10,score);
        msgScore.addColor('#ffffff', 0);
        fimJogo = game.add.text(centroX -150, centroY, '');
        fimJogo.addColor('#ff0000', 0);


        
        
         game.time.events.loop(50, criarSprite, this);
    
        
        temagame.play();
        
        
       //Verifica se a pessoa está no celular ou no PC
        
        if(!this.game.device.desktop){
            vidaPersonagem = 6000;
             }
        
    },
    update: function (){
        
        if(!this.game.device.desktop){
           
           
     
 if (movB == 1){
     nave.y -= 1;
 }
            if(movB == 3){
                nave.y += 1;
            }
            
        }
            
        game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, this.bossAndar, game);
       if(bossGrupo.total >= 1){
        game.time.events.repeat(Phaser.Timer.SECOND * 1, 0, this.ataqueB, game);
           
           
       }
        

        //Movimento dos inimigos
        inimigoGrupo.setAll('x', levelvelocidade, true, true, 1);
        inimigoGrupoGarg.setAll('x',levelvelocidade, true, true, 1);
        bossGrupo.setAll('x',levelvelocidade, true, true, 1);
        inimigoDPGrupo.setAll('x',levelvelocidade, true, true, 1);
    
        
        
        
        inimigoGrupo.forEach(this.posSprite, this, true);//Verifica as sprites da variavel inimigoGrupo, e se cada uma dela chegar no limite do mapa, a mesma irá morrer
        
        
        
        inimigoGrupoGarg.forEach(this.posSprite, this, true);
        
        //Boss
        
        bossGrupo.forEach(this.posSprite, this, true);
        
        //Dragao Preto
        
        inimigoDPGrupo.forEach(this.posSprite, this, true);
        
        
     
        
        if(vidaPersonagem >= 1){
        
        
        //Botões de movimento
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            nave.scale.setTo(1, 1);
            nave.x += speed;
            direcaoBala = true;
            nave.animations.play('naveVoandoLado', 14, true);
            
            //Seta posicao X de onde a bala sai da nave
            balaArma.setAll('anchor.x', -0.2);
            
        }
        
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            nave.scale.setTo(-1, 1);
            nave.x -= speed;
            direcaoBala = false;
            nave.animations.play('naveVoandoLado', 14, true);
            
             //Seta posicao X de onde a bala sai da nave
            balaArma.setAll('anchor.x', 1);
            
        }
        
        
         if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            
            nave.y -= speed;
            nave.animations.play('naveVirando', 14, true);
        }else
        
        if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            
            nave.y += speed;
            nave.animations.play('naveVirando', 14, true);
            }
        
        
        
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.activePointer.isDown){
            this.atirar();
            
        }
            
             if(game.input.keyboard.isDown(Phaser.Keyboard.X)){
                 
                  if(furiaPonto >= 5){
                  this.rage();
                  }
            
        }
            
        
        }else{
            fimJogo.setText('GAME OVER !\nAperte ENTER para reiniciar');
            
            if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.game.input.activePointer.isDown){
           
            
        
            this.game.state.restart();
                vidaPersonagem = 3;
                score = 0;
            }
        }
            
        
        
        
        
        //Verifica se a bala pegou no inimigo
        game.physics.arcade.overlap(balaArma, inimigoGrupo, this.hitGrupo);
        game.physics.arcade.overlap(balaArma, inimigoGrupoGarg, this.hitGrupoGarg);
        game.physics.arcade.overlap(balaArma, bossGrupo, this.hitBossGrupo);
        game.physics.arcade.overlap(balaArma, inimigoDPGrupo, this.hitGrupoDragaoP);
     
        
        
        //Verifica se o inimigo bateu na nave
        game.physics.arcade.overlap(nave, inimigoGrupo, this.hitNave);
        game.physics.arcade.overlap(nave, inimigoGrupoGarg, this.hitNave);
        game.physics.arcade.overlap(nave, bossGrupo, this.hitNave);
        game.physics.arcade.overlap(nave, balaBoss, this.hitNave);
        game.physics.arcade.overlap(nave, inimigoDPGrupo, this.hitNave);
    },
    atirar: function(){
        
        //Controle a velocidade de disparo atraves da variavel velocidadeDisparo
        if(game.time.now > proximoTiro){
           proximoTiro = game.time.now + velocidadeDisparo;
            
           tiroNave.restart();
        console.log('atirando');
        var bala = balaArma.getFirstDead();
        bala.reset(nave.x, nave.y);
        
        
        //Muda a direcao da bala de acordo com a tecla apertada
            if(direcaoBala == true){
        game.physics.arcade.moveToXY(bala, -100, nave.y, -1000);
            }else{
                
                if(direcaoBala == false){
                game.physics.arcade.moveToXY(bala, 100, nave.y, 1000);
                }
            }
           
           }
        
        
        
    },
    
     ataqueB: function(){
        
       if(game.time.now > proximoAtaqueB){
           proximoAtaqueB = game.time.now + velocidadeAtaqueB;
        var atk_boss = balaBoss.getFirstDead();
        atk_boss.reset(boss.x, boss.y);
        
        console.log('atirando');
                game.physics.arcade.moveToXY(atk_boss, 100, boss.y, 400);
          audioBoss.play();
          
         }
    },
    
    
    hitInimigo: function(b,e){
        console.log('Hit');
     //   b.kill();
     //   e.kill();
        
      // inimigo.animations.stop();
       inimigo.animations.play('morte_drag2', 20, false, true);
       

        
        
        
        furiaPonto ++;
        controleFuria();
        
        msgScore.setText(score);//Mensagem que mostra o score
    },
    
    hitGrupo: function(b,e){
        console.log('Hit');

      // inimigoG.animations.stop();
       inimigoG.animations.play('morte_drag2', 20, false, true);
        
          b.kill();
       // e.kill();
        furiaPonto ++;
        controleFuria();
        msgScore.setText(score);//Mensagem que mostra o score
        
    },
    hitNave: function(n,e){
    
    console.log('Hit Nave');
        vidaPersonagem --;
        e.kill();
    if(vidaPersonagem < 1){
      vida1.visible = false;
      vida2.visible = false;
      vida3.visible = false;
        
     nave.animations.play('naveDestro', 14, false, true);
    naveMorte.play();
   // n.kill();
    }else{ 
    
    hitNave.restart();
        if(vidaPersonagem == 3){
            vida1.visible = true;
            vida2.visible = true;
            vida3.visible = true;
            lifehack.visible = false;
        } 
        if(vidaPersonagem == 2){
            vida1.visible = true;
            vida2.visible = true;
            vida3.visible = false;
            lifehack.visible = false;
        }
         if(vidaPersonagem == 1){
             vida1.visible = true;
             vida2.visible = false;
             vida3.visible = false;
             lifehack.visible = false;
        } 
        if(vidaPersonagem >= 4){
            vida1.visible = false;
            vida2.visible = false;
            vida3.visible = false;
            lifehack.visible = true;
        }
        
        }
            
            
    
},
    //Funcao que limita a o limita de movimentacao dos inimigos
    bossAndar: function(){
    
        
             
        
        
       movB = game.rnd.integerInRange(1, 3);
  
       if(bossGrupo.total >= 1){ 
           
        if(boss.x < 350){
            boss.x = 350
        }
        
    
        if(boss.y >= 5){
        if(movB == 1){
        
            
            boss.body.velocity.y -= 1.4;
           
            
        }
    
        
            
            
            
            
        }
             if(boss.y <= 120){
                if(movB == 2){
                   
                   boss.body.velocity.y += 1.4;
            
                }
                
    
             }
            
        }
         if(inimigoG.y >= 10 ){
        if(movB == 1){
        
            inimigoG.body.velocity.y -= 1.4;
            
        }
    
        
            
            
            
            
        }
             if(inimigoG.y <= 310 ){
                if(movB == 2){

                    inimigoG.body.velocity.y += 1.4;
            
                }
                
    
             }
        
        
        
        
         if(inimigoGarg.y >= 10){
        if(movB == 1){
        
            
           
            inimigoGarg.body.velocity.y -= 1.4;
           
            
        }
    
            
        }
             if(inimigoGarg.y <= 310){
                if(movB == 2){
                  
                    inimigoGarg.body.velocity.y += 1.4;
                   
            
                }
                
    
             }
            
        
        
         if(inimigoDP.y >= 10){
        if(movB == 1){
        
            
           
            inimigoDP.body.velocity.y -= 1.4;
           
            
        }
    
            
        }
             if(inimigoDP.y <= 310){
                if(movB == 2){
                  
                    inimigoDP.body.velocity.y += 1.4;
                   
            
                }
                
    
             }
            
        
},
    
    
    hitGrupoGarg: function(b,e){
        console.log('Hit');

      // inimigoG.animations.stop();
       inimigoGarg.animations.play('morte_garg', 20, false, true);
        
          b.kill();
       // e.kill();
        furiaPonto ++;
        controleFuria();
        msgScore.setText(score);//Mensagem que mostra o score
        
    },
    hitGrupoDragaoP: function(b,e){
        console.log('Hit');

      
       inimigoDP.animations.play('morte_dragaoP', 20, false, true);
        
          b.kill();
       // e.kill();
        furiaPonto ++;
        controleFuria();
        msgScore.setText(score);//Mensagem que mostra o score
        
    },
    
     hitBossGrupo: function(b,e){
        console.log('Hit');
         
            
             
           b.kill();
       // e.kill();
         
         if(bossHP < 1){
         
      // inimigoG.animations.stop();
        boss.animations.play('bossMorrendo', 7, false, true);
        
        
        furiaPonto ++;
        controleFuria();
             score += 50;
             scoreBoss = 0;
        msgScore.setText(score);//Mensagem que mostra o score
             bossHP = 200;
         }
         bossHP -= 3;
        
    },
    
    
    
    rage: function(){
        
       inimigoG.animations.play('morte_drag2', 20, false, true);
       inimigoDP.animations.play('morte_dragaoP', 20, false, true);
       inimigoGarg.animations.play('morte_garg', 20, false, true);
        
            

            ragebala = 0;
            furiaPonto = 0;
            controleFuria();
            score += 30;
            scoreBoss += 30;
            rageSom.play();
            
        
        
    },
    posSprite: function(){
        
        if(inimigoG.x < centroX - 250){                   
            inimigoG.animations.play('morte_drag2', 20, false, true);
           
                                }
        if(inimigoGarg.x < centroX - 250){                   
            inimigoGarg.animations.play('morte_garg', 20, false, true);
           
                                }
        
      /*  if(boss.x < centroX - 250){                   
            boss.animations.play('bossMorrendo', 7, false, true);
                
            }*/
        
              
        if(inimigoDP.x < centroX - 250){     
           
        inimigoDP.animations.play('morte_dragaoP', 20, false, true);
           
                                }

    }

    
};

 function controleFuria (){
       
        
        if(furiaPonto == 5){
            rage.visible = false;
            rage2.visible = false;
            rage3.visible = true;
            
            score += 10;
            scoreBoss += 10;
            fullRage.play();
            
        }else{
        if(furiaPonto >= 2 && furiaPonto < 5){
            rage.visible = false;
            rage2.visible = true;
            rage3.visible = false;
            
        }
        if(furiaPonto < 2){
            rage.visible = true;
            rage2.visible = false;
            rage3.visible = false;
        }
            score++;
            scoreBoss++;
            
        }
        
        
        
    }



 function criarSprite(){
        
     if(inimigoGrupo.total < 1){
        inimigoG = inimigoGrupo.create(590, game.world.randomY - 30, 'dragao2');
        inimigoG.animations.add('drag2Voando',[0, 1, 2, 3]);
        inimigoG.animations.add('morte_drag2',[5, 6, 7, 8, 9, 10, 11, 12]);
        inimigoG.play('drag2Voando', 7, true);

         
     }
     
        if(inimigoGrupoGarg.total < 1){
        inimigoGarg = inimigoGrupoGarg.create(590, game.world.randomY - 30, 'gargo');
        inimigoGarg.animations.add('gargVoando',[0, 1, 2, 3, 4]);
        inimigoGarg.animations.add('morte_garg',[5, 6, 7, 8, 9, 10, 11, 12]);
        inimigoGarg.play('gargVoando', 7, true);
         }
     
      if(bossGrupo.total < 1){
          if(level == 1){
               night.visible = false;
          }
          if(level == 2){
              
              evening.visible = false;
          } 
          if(level == 3){
              
              day.visible = false;
          } 
          if(level == 4){
              
              morning.visible = false;
          }
          
           if(scoreBoss >= 700){//Ao marcar 1500 pontos o boss spawna
               levelvelocidade -= 1;//Aumenta velocidade dos monstros
              
               
               
        boss = bossGrupo.create(590, 0, 'boss');
        boss.animations.add('bossAndando',[0, 1, 2]);
        boss.animations.add('bossMorrendo',[3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 3, 4, 5, 6, 7]);
        boss.play('bossAndando', 7, true);
              
           scoreBoss = 0;
           level ++;
               
               
               
               
               
           }
         }
     
     if(inimigoDPGrupo.total < 1){
         
        
             
        inimigoDP = inimigoDPGrupo.create(590, game.world.randomY - 30, 'dragao_preto');
        inimigoDP.animations.add('dragaoPVoando',[0, 1, 2, 3]);
        inimigoDP.animations.add('morte_dragaoP',[5, 6, 7, 8, 9, 10, 11, 12]);
        inimigoDP.play('dragaoPVoando', 7, true);
             
         }
     
     
    }

