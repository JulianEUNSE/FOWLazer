import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image("start", "/assets/StartMenu.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(0, 0, "start")
      .setOrigin(0)
      .setDisplaySize(width, height);

    const startBtn = this.add.text(
      width / 4,
      height / 2 + 120,
      "Start Game",
      {
        fontSize: "24px",
        backgroundColor: "#222",
        padding: { x: 20, y: 10 }
      }
    )
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    startBtn.on("pointerdown", () => {
      this.scene.start("StageSelectScene");
    });
  }
}
