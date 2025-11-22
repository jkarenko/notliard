import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Generate a placeholder texture programmatically
        const graphics = this.make.graphics({ x: 0, y: 0 }, false);
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 8, 8);
        graphics.generateTexture('player_placeholder', 8, 8);

        // Generate player spritesheet (16x8 - 2 frames of 8x8)
        const playerGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        
        // Frame 1: White
        playerGraphics.fillStyle(0xffffff);
        playerGraphics.fillRect(0, 0, 8, 8);
        
        // Frame 2: Light Blue
        playerGraphics.fillStyle(0xaaaaff);
        playerGraphics.fillRect(8, 0, 8, 8);

        playerGraphics.generateTexture('player_spritesheet', 16, 8);

        // Generate placeholder tileset (16x8)
        // Tile 1 (Left): Gray Wall
        // Tile 2 (Right): Green Floor (unused in map for now, map uses 0 for empty)
        const tilesGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        
        // Wall (Gray)
        tilesGraphics.fillStyle(0x888888);
        tilesGraphics.fillRect(0, 0, 8, 8);
        
        // Floor (Dark Green)
        tilesGraphics.fillStyle(0x004400);
        tilesGraphics.fillRect(8, 0, 8, 8);

        tilesGraphics.generateTexture('placeholder_tiles', 16, 8);

        // Load the Tiled map JSON
        this.load.tilemapTiledJSON('town_test', 'assets/maps/town_test.json');

        console.log('BootScene: Assets loaded/generated.');
    }

    create() {
        console.log('BootScene: Preload complete. Starting MainMenuScene...');
        this.scene.start('MainMenuScene');
    }
}
