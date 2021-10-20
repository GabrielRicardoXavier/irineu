var trex,trexCorrendo,trexDoido;
var chao,imagemDoChao;
var chaoInvisivel;
var nuvemImagem;
var pontinhos = 0;
var cacto1,cacto2,cacto3,cacto4,cacto5,cacto6;
var estadoDoJogo = "jogando";
var cactinhos,nuvinhas;
var restart,gameOver;
var imageDoRestart,imagemDoGameOver;
var pulin,faliceu,checkPoint;

function reset(){
  pontinhos = 0;
  
  gameOver.visible = false;
  restart.visible = false;
  
  estadoDoJogo = "jogando";
  
  cactinhos.destroyEach();
  nuvinhas.destroyEach();
  
  trex.changeAnimation ("correndo", trexCorrendo);
}


function cactinho(){
  
  if(frameCount % 60 === 0){
    var cacto = createSprite(600,170,10,40);
    cacto.velocityX = -(5+pontinhos/100);
    cacto.lifetime = 125;
    cacto.scale = 0.6;
    cacto.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    var numeroObstaculo = Math.round(random(1,6));
    switch(numeroObstaculo){
      case 1: cacto.addImage(cacto1);
      break;
      case 2: cacto.addImage(cacto2);
      break;
      case 3: cacto.addImage(cacto3);
      break;
      case 4: cacto.addImage(cacto4);
      break;
      case 5: cacto.addImage(cacto5);
      break;
      case 6: cacto.addImage(cacto6);
      break;
      default:break;
    }
    
    cactinhos.add(cacto);
  }
}

function nuvinha(){
  
  if(frameCount % 60 === 0){
    var nuvem = createSprite(600,10,40,10);
    nuvem.velocityX = -5;
    nuvem.addImage(nuvemImagem);
    nuvem.y = Math.round(random(70,180));

    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    nuvem.depth = chao.depth - 1;
    nuvem.lifetime = 125;

    nuvinhas.add(nuvem);
  }
}

function preload() {
  
  trexCorrendo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexDoido = loadAnimation("trex_collided.png")

  imagemDoChao = loadImage("ground2.png");

  nuvemImagem = loadImage("cloud.png");

  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");

  imagemDoGameOver = loadImage("gameOver.png");
  
  imagemDoRestart = loadImage("restart.png");
  
  pulin = loadSound("jump.mp3");
  faliceu = loadSound("die.mp3");
  checkPoint = loadSound("checkPoint.mp3");
}

function setup() {

  createCanvas(600,200);
  
  trex = createSprite(50, 155, 20, 40);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("morreu", trexDoido);
  trex.scale = 0.5;
  trex.debug = false; 
  trex.setCollider("circle",0,0,40);

  chao = createSprite(300, 190, 600, 20);
  chao.addImage("chaosin",imagemDoChao);

  chaoInvisivel = createSprite(300,200,600,19);
  chaoInvisivel.visible = false;

  restart = createSprite(300,100,40,40);
  restart.addImage("jogarDenovo",imagemDoRestart);
  restart.scale = 0.4;
  restart.visible = false;

  gameOver = createSprite(300,55,60,30);
  gameOver.addImage("perdeu",imagemDoGameOver);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  nuvinhas = new Group();
  cactinhos = new Group();
}

function draw() {
  
  background("white");
  
  text("pontos = " + pontinhos,520,30);

  if (estadoDoJogo === "jogando"){
    if (chao.x <0){
      chao.x = chao.width/2;
    }  
    
    if (keyDown("space") && trex.y >100) {
      trex.velocityY = -5;
      pulin.play();
    }
    
    chao.velocityX = -(5+pontinhos/100);
    pontinhos = pontinhos + Math.round(frameRate()/60);
    
    if (pontinhos > 0 && pontinhos %100 === 0){
        checkPoint.play();
    }
    
    if (cactinhos.isTouching(trex)){
      estadoDoJogo = "cabo";
      trex.changeAnimation ("morreu", trexDoido);
      faliceu.play();
    }
    
    nuvinha();
    cactinho();
    
  } else if (estadoDoJogo === "cabo"){
    cactinhos.setVelocityXEach(0);
    nuvinhas.setVelocityXEach(0);
    chao.velocityX = 0;
    
    cactinhos.setLifetimeEach(-1);
    nuvinhas.setLifetimeEach(-1);
    
    restart.visible = true;
    gameOver.visible = true;
    
    if (mousePressedOver(restart)){
        reset();
    }
  } 

  trex.velocityY = trex.velocityY + 0.5;

  trex.collide(chaoInvisivel);

  drawSprites();
}