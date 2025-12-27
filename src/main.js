import './style.css'
import Phaser from 'phaser'

const WORLD_WIDTH = 1500;
const WORLD_HEIGHT = 1500;

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = 250;

    this.laserCooldown = 10000; 
    this.lastLaserTime = -Infinity;
  }

  // loads assets
  preload(){
    this.load.image("bg1", "/assets/bg1.png");
    this.load.image("charSprite", "/assets/charSprite.svg");
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Background (must match world size)
    this.add.image(0, 0, "bg1")
      .setOrigin(0, 0)
      .setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);

    // Player
    this.player = this.physics.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, "charSprite");
    this.player.setCollideWorldBounds(true);

    // Camera setup
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Minimap (x, y, width, height)
    this.minimap = this.cameras.add(this.scale.width - 100, 20, 90, 90);

    this.minimap.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Zoom so entire world fits in minimap
    const zoomX = this.minimap.width / WORLD_WIDTH;
    const zoomY = this.minimap.height / WORLD_HEIGHT;
    this.minimap.setZoom(Math.min(zoomX, zoomY));

    // Optional styling
    this.minimap.setBackgroundColor(0x000000);
    this.minimap.setName("minimap");

    // Input
    this.cursor = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Lazers
    this.input.on("pointerdown", () => {
      this.shootLaser();
    });

    this.normalZoom = this.cameras.main.zoom;

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


  shootLaser() {
    const now = this.time.now;

    // Cooldown check
    if (now - this.lastLaserTime < this.laserCooldown) {
      return;
    }

    this.lastLaserTime = now;

    const pointer = this.input.activePointer;
    const cam = this.cameras.main;

    const startX = this.player.x;
    const startY = this.player.y;

    const angle = Phaser.Math.Angle.Between(
      startX,
      startY,
      pointer.worldX,
      pointer.worldY
    );

    const maxDistance = Math.hypot(WORLD_WIDTH, WORLD_HEIGHT);

    let endX = startX + Math.cos(angle) * maxDistance;
    let endY = startY + Math.sin(angle) * maxDistance;

    // Clamp to world bounds
    endX = Phaser.Math.Clamp(endX, 0, WORLD_WIDTH);
    endY = Phaser.Math.Clamp(endY, 0, WORLD_HEIGHT);

    // Drawing the lazer
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xff0000, 1);
    graphics.beginPath();
    graphics.moveTo(startX, startY);
    graphics.lineTo(endX, endY);
    graphics.strokePath();

    const camView = cam.worldView;

    const laserOutOfView =
      !camView.contains(endX, endY);

    if (laserOutOfView) {
      // Zoom to show entire map
      const zoomX = cam.width / WORLD_WIDTH;
      const zoomY = cam.height / WORLD_HEIGHT;
      const fullMapZoom = Math.min(zoomX, zoomY);

      this.tweens.add({
        targets: cam,
        zoom: fullMapZoom,
        duration: 200,
        ease: "Sine.easeOut"
      });

      // Return camera to normal
      this.tweens.add({
        targets: cam,
        zoom: this.normalZoom,
        delay: 1000,
        duration: 300,
        ease: "Sine.easeInOut"
      });
    }

    // Fade out laser
    this.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: 1000,
      onComplete: () => graphics.destroy()
    });
  }


}

const config = {
  type: Phaser.WEBGL,
  parent: "game-container",
  canvas: document.getElementById("gameCanvas"),

  scale: {
    mode: Phaser.Scale.NONE,  
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 500,              
    height: 500              
  },

  physics: {
    default: "arcade",
    arcade: { debug: false }
  },

  scene: [GameScene]
};


const game = new Phaser.Game(config)