import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Generate a placeholder texture programmatically to avoid external dependency/CORS issues
        const graphics = this.make.graphics({ x: 0, y: 0 }, false);
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 8, 8);
        graphics.generateTexture('player_placeholder', 8, 8);

        console.log('BootScene: Texture generated.');
    }

    create() {
        console.log('BootScene: Preload complete. Starting MainMenuScene...');
        this.scene.start('MainMenuScene');
    }
}
