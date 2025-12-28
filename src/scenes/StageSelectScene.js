import Phaser from "phaser";

export default class StageSelectScene extends Phaser.Scene {
  constructor() {
    super("StageSelectScene");
  }

  preload() {
    this.load.image("forestPreview", "/assets/bg1.png");
    this.load.image("cavePreview", "/assets/bg2.png");
    this.load.image("select", "/assets/Select.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(0, 0, "select")
      .setOrigin(0)
      .setDisplaySize(width, height);

    this.add.text(width / 2, 60, "Select a Stage", {
      fontSize: "32px"
    }).setOrigin(0.5);

    this.createStageCard(
      width / 2 - 120,
      height / 2,
      "Forest",
      "forestPreview",
      "forest"
    );

    this.createStageCard(
      width / 2 + 120,
      height / 2,
      "Cave",
      "cavePreview",
      "cave"
    );
  }

  createStageCard(x, y, label, previewKey, mapKey) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 160, 160, 0x111111)
      .setStrokeStyle(2, 0xffffff);

    const preview = this.add.image(0, -20, previewKey)
      .setDisplaySize(140, 100);

    const text = this.add.text(0, 60, label, {
      fontSize: "18px"
    }).setOrigin(0.5);

    container.add([bg, preview, text]);

    container.setSize(160, 160);
    container.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 160, 160),
      Phaser.Geom.Rectangle.Contains
    );

    container.on("pointerdown", () => {
      this.scene.start("GameScene", { mapKey });
    });
  }
}
