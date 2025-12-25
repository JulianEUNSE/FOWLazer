import './style.css'
import Phaser from 'phaser'

const sizes={
  width:500,
  height:500
}

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = 150;
  }

  // loads assets
  preload(){
    this.load.image("bg1", "/assets/bg1.png");
    this.load.image("charSprite", "/assets/charSprite.png");
  }

  create(){
    this.add.image(0,0,"bg1").setOrigin(0,0).setScale(0.45);
    this.player = this.physics.add.sprite(100, sizes.height - 100, "charSprite").setOrigin(0, 0).setScale(0.2);

    this.player.setCollideWorldBounds(true);
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update(){
    // Player movement is set up this way to prevent adjacent movement from bleeding into each other
    const { left, right, up, down } = this.cursor;

    this.player.setVelocityX(0);
    this.player.setVelocityY(0);

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } 
    
    if (up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
    } else if (down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
    }
  }
}

const config = {
  type:Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [GameScene]
}

const game = new Phaser.Game(config)