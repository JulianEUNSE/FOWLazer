import './style.css'
import Phaser from 'phaser'

const sizes={
  width:1000,
  height:600
}

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = 250;
  }

  // loads assets
  preload(){
    this.load.image("bg1", "/assets/bg1.png");
    this.load.image("charSprite", "/assets/charSprite.svg");
  }

  create(){
    this.add.image(0,0,"bg1").setOrigin(0,0);
    this.player = this.physics.add.sprite(100, sizes.height - 100, "charSprite").setOrigin(0.5, 0.5);

    this.player.setCollideWorldBounds(true);
    this.cursor  = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 
                                                 'down': Phaser.Input.Keyboard.KeyCodes.S,
                                                 'left': Phaser.Input.Keyboard.KeyCodes.A, 
                                                 'right': Phaser.Input.Keyboard.KeyCodes.D,});
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

    // positions player so that player always faces direction of cursor
    const pointer = this.input.activePointer;

    const angle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        pointer.worldX,
        pointer.worldY
    );

    this.player.rotation = angle;


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