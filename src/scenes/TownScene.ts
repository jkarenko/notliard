import Phaser from 'phaser';
import Player from '../entities/Player';
import MovementSystem from '../systems/MovementSystem';
import { GRID_SIZE } from '../config/Constants';

export default class TownScene extends Phaser.Scene {
    private player!: Player;
    private movementSystem!: MovementSystem;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private map!: Phaser.Tilemaps.Tilemap;
    private terrainLayer!: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super({ key: 'TownScene' });
    }

    create() {
        this.movementSystem = new MovementSystem();

        // Create Map
        this.map = this.make.tilemap({ key: 'town_test' });
        const tileset = this.map.addTilesetImage('placeholder_tiles', 'placeholder_tiles');
        
        if (tileset) {
            this.terrainLayer = this.map.createLayer('Terrain', tileset, 0, 0)!;
            this.terrainLayer.setCollision([1]); // Tile ID 1 is Wall
        }

        // Spawn player at (2, 2) - safely inside the walls
        this.player = new Player(this, 2 * GRID_SIZE, 2 * GRID_SIZE, 'player_spritesheet');

        this.add.text(10, 130, 'Town Scene', {
            fontSize: '16px',
            color: '#ffffff'
        });

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.input.keyboard!.once('keydown-ENTER', () => {
            this.scene.start('CavernScene');
        });
    }

    update() {
        let moved = false;
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
            moved = this.movementSystem.move(this.player, -1, 0, this.terrainLayer);
            this.player.setFlipX(true);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
            moved = this.movementSystem.move(this.player, 1, 0, this.terrainLayer);
            this.player.setFlipX(false);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
            moved = this.movementSystem.move(this.player, 0, -1, this.terrainLayer);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
            moved = this.movementSystem.move(this.player, 0, 1, this.terrainLayer);
        }

        if (moved) {
            this.player.playWalkAnimation();
        }
    }
}
