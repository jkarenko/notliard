import Phaser from 'phaser';
import Player from '../entities/Player';
import MovementSystem from '../systems/MovementSystem';
import { GRID_SIZE, GAME_SPEED_HZ } from '../config/Constants';

export default class TownScene extends Phaser.Scene {
    private player!: Player;
    private movementSystem!: MovementSystem;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private map!: Phaser.Tilemaps.Tilemap;
    private terrainLayer!: Phaser.Tilemaps.TilemapLayer;

    private accumulator: number = 0;
    private fixedTimeStep: number = 1000 / GAME_SPEED_HZ;

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

        // Camera Setup
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);

        this.add.text(10, 10, 'Town Scene', {
            fontSize: '8px',
            color: '#ffffff'
        }).setScrollFactor(0);

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.input.keyboard!.once('keydown-ENTER', () => {
            this.scene.start('CavernScene');
        });
    }

    update(_time: number, delta: number) {
        this.accumulator += delta;

        while (this.accumulator >= this.fixedTimeStep) {
            this.fixedUpdate(this.fixedTimeStep);
            this.accumulator -= this.fixedTimeStep;
        }

        // Interpolation alpha
        const alpha = this.accumulator / this.fixedTimeStep;
        this.player.updateVisuals(alpha);
    }

    fixedUpdate(delta: number) {
        this.player.captureState();

        // Input Processing (Layer 1 Input)
        // We poll inputs every fixed tick.
        // For smoother "Grid" movement, holding a key moves 1 cell per tick.
        
        let moved = false;
        
        if (this.cursors.left!.isDown) {
            if (this.movementSystem.moveHorizontal(this.player, -1, this.terrainLayer)) {
                this.player.setFlipX(true);
                moved = true;
            }
        } else if (this.cursors.right!.isDown) {
            if (this.movementSystem.moveHorizontal(this.player, 1, this.terrainLayer)) {
                this.player.setFlipX(false);
                moved = true;
            }
        }

        // Jump
        // We use JustDown logic? 
        // If we sample isDown at 15Hz, it might miss a quick tap if the tap is < 66ms.
        // But Phaser's isDown is updated every frame.
        // We should check if Jump was pressed recently (buffer).
        // For now, simple check:
        if (this.cursors.up!.isDown) { // Using isDown for robustness at low tick rate
            this.movementSystem.jump(this.player);
        }

        // Apply Physics (Gravity)
        this.movementSystem.update(this.player, delta, this.terrainLayer);

        // Animations
        if (moved) {
            this.player.playWalkAnimation();
        } else {
             // If on ground and not moving, idle
             if (this.player.isGrounded) {
                 this.player.playIdleAnimation();
             }
        }
    }
}
