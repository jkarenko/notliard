import Phaser from 'phaser';
import Player from '../entities/Player';
import MovementSystem from '../systems/MovementSystem';
import { GRID_SIZE, GAME_SPEED_HZ } from '../config/Constants';
import HUDScene, { HUD_HEIGHT } from './HUDScene';
import EntitySpawner from '../services/EntitySpawner';
import Door from '../entities/Door';
import Item from '../entities/Item';

export default class TownScene extends Phaser.Scene {
    private player!: Player;
    private movementSystem!: MovementSystem;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private map!: Phaser.Tilemaps.Tilemap;
    private terrainLayer!: Phaser.Tilemaps.TilemapLayer;
    private doors: Door[] = [];
    private items: Item[] = [];

    private accumulator: number = 0;
    private fixedTimeStep: number = 1000 / GAME_SPEED_HZ;

    constructor() {
        super({ key: 'TownScene' });
    }

    create(data: { startX?: number, startY?: number }) {
        // Launch HUD
        this.scene.launch('HUDScene');

        this.movementSystem = new MovementSystem();

        // Create Map
        this.map = this.make.tilemap({ key: 'town_test' });
        const tileset = this.map.addTilesetImage('placeholder_tiles', 'placeholder_tiles');
        
        if (tileset) {
            this.terrainLayer = this.map.createLayer('Terrain', tileset, 0, 0)!;
            this.terrainLayer.setCollision([1]); // Tile ID 1 is Wall
        }

        // Spawn Entities
        const spawner = new EntitySpawner(this);
        const { doors, items } = spawner.spawnFromMap(this.map, 'town_test');
        this.doors = doors;
        this.items = items || []; // Default to empty if spawner doesn't return items for town yet (safe guard)

        // Spawn player
        const startX = data.startX ?? 2 * GRID_SIZE;
        const startY = data.startY ?? 2 * GRID_SIZE;
        this.player = new Player(this, startX, startY, 'player_spritesheet');

        // Camera Setup
        const viewportHeight = this.cameras.main.height - HUD_HEIGHT;
        this.cameras.main.setViewport(0, 0, this.cameras.main.width, viewportHeight);
        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        
        // Calculate Zoom to show ~26 tiles horizontally (208 logical pixels)
        // Zoom = CanvasWidth / 208
        const zoom = this.scale.width / (26 * GRID_SIZE);
        this.cameras.main.setZoom(zoom);

        this.add.text(10, 10, 'Town Scene', {
            fontSize: '8px',
            color: '#ffffff'
        }).setScrollFactor(0);

        this.cursors = this.input.keyboard!.createCursorKeys();
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

        // Jump disabled in Town
        /*
        if (this.cursors.up!.isDown) {
            this.movementSystem.jump(this.player);
        }
        */

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

        // Check Door Collision
        const pGridX = this.player.gridX;
        const pGridY = Math.floor((this.player.logicalY + 4) / GRID_SIZE);

        const door = this.doors.find(d => 
            (d.triggerType === 'touch' && d.gridX === pGridX && d.gridY === pGridY) ||
            (d.triggerType === 'press_up' && d.gridX === pGridX && d.gridY === pGridY && this.cursors.up!.isDown)
        );

        if (door) {
            this.scene.stop('HUDScene');
            
            if (door.destination === 'TransitionScene' && door.nextScene) {
                this.scene.start('TransitionScene', {
                    nextScene: door.nextScene,
                    startX: door.targetX,
                    startY: door.targetY,
                    direction: 'right' // Exiting town usually to the right
                });
            } else {
                this.scene.start(door.destination, { startX: door.targetX, startY: door.targetY });
            }
        }

        // Item Collection
        this.items = this.items.filter(item => {
            if (Math.abs(item.gridX - pGridX) <= 1 && Math.abs(item.logicalY - this.player.logicalY) < GRID_SIZE) {
                const dx = (item.gridX * GRID_SIZE) - (this.player.gridX * GRID_SIZE);
                const dy = item.logicalY - this.player.logicalY;
                if (dx * dx + dy * dy < (GRID_SIZE * GRID_SIZE)) {
                     return !item.collect();
                }
            }
            return true;
        });

        // Update HUD
        const hudScene = this.scene.get('HUDScene') as HUDScene;
        if (hudScene) {
            hudScene.refresh();
        }
    }
}
