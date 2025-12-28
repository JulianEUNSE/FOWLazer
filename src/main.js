import './style.css'
import Phaser from 'phaser'

import StartScene from "./scenes/StartScene";
import StageSelectScene from "./scenes/StageSelectScene";
import GameScene from "./scenes/GameScene";

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

  scene: [
    StartScene,
    StageSelectScene,
    GameScene
  ]
};


const game = new Phaser.Game(config)