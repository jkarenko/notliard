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

        // Manually add frames for the spritesheet so animations can use them
        const playerTexture = this.textures.get('player_spritesheet');
        playerTexture.add(0, 0, 0, 0, 8, 8);
        playerTexture.add(1, 0, 8, 0, 8, 8);

        // Generate attack effect (8x8 Yellow)
        const attackGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        attackGraphics.fillStyle(0xffff00);
        attackGraphics.fillRect(0, 0, 8, 8);
        attackGraphics.generateTexture('attack_effect', 8, 8);

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
        this.load.tilemapTiledJSON('cavern_test', 'assets/maps/cavern_test.json');
        this.load.tilemapTiledJSON('transition_test', 'assets/maps/transition_test.json');

        console.log('BootScene: Assets loaded/generated.');
    }

    create() {
        console.log('BootScene: Preload complete. Starting MainMenuScene...');
        this.scene.start('MainMenuScene');
    }
}
