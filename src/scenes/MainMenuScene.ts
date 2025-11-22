import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({key: "MainMenuScene"});
  }

  create() {
    this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2, "Notliard - Main Menu", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, "Press any key to start", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.input.keyboard!.once("keydown", () => {
      console.log("Starting game...");
      this.scene.start("TownScene");
    });
  }
}
