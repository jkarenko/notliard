import Phaser from 'phaser';
import Player from '../entities/Player';
import MovementSystem from '../systems/MovementSystem';
import { GRID_SIZE, GAME_SPEED_HZ } from '../config/Constants';
import { HUD_HEIGHT } from './HUDScene';
import EntitySpawner from '../services/EntitySpawner';
import Door from '../entities/Door';
import Enemy from '../entities/Enemy';
import Slime from '../entities/enemies/Slime';
import CombatSystem from '../systems/CombatSystem';

export default class CavernScene extends Phaser.Scene {
    private player!: Player;
    private movementSystem!: MovementSystem;
    private combatSystem!: CombatSystem;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys!: { space: Phaser.Input.Keyboard.Key };
    private map!: Phaser.Tilemaps.Tilemap;
    private terrainLayer!: Phaser.Tilemaps.TilemapLayer;
    private doors: Door[] = [];
    private enemies: Enemy[] = [];

    private accumulator: number = 0;
    private fixedTimeStep: number = 1000 / GAME_SPEED_HZ;

    constructor() {
        super({ key: 'CavernScene' });
    }

    create(data: { startX?: number, startY?: number }) {
        // Launch HUD
        this.scene.launch('HUDScene');

        this.movementSystem = new MovementSystem();
        this.combatSystem = new CombatSystem();

        // Create Map
        this.map = this.make.tilemap({ key: 'cavern_test' });
        const tileset = this.map.addTilesetImage('placeholder_tiles', 'placeholder_tiles');
        
        if (tileset) {
            this.terrainLayer = this.map.createLayer('Terrain', tileset, 0, 0)!;
            this.terrainLayer.setCollision([1]); // Tile ID 1 is Wall
        }

        // Spawn Entities
        const spawner = new EntitySpawner(this);
        const { doors, enemies } = spawner.spawnFromMap(this.map);
        this.doors = doors;
        this.enemies = enemies;

        // Spawn player
        const startX = data.startX ?? 4 * GRID_SIZE;
        const startY = data.startY ?? 13 * GRID_SIZE;
        this.player = new Player(this, startX, startY, 'player_spritesheet');

        // Camera Setup
        const viewportHeight = this.cameras.main.height - HUD_HEIGHT;
        this.cameras.main.setViewport(0, 0, this.cameras.main.width, viewportHeight);
        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);

        this.add.text(10, 10, 'Cavern Scene', {
            fontSize: '8px',
            color: '#ffffff'
        }).setScrollFactor(0);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.keys = {
            space: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };
    }

    update(_time: number, delta: number) {
        this.accumulator += delta;

        while (this.accumulator >= this.fixedTimeStep) {
            this.fixedUpdate(this.fixedTimeStep);
            this.accumulator -= this.fixedTimeStep;
        }

        const alpha = this.accumulator / this.fixedTimeStep;
        this.player.updateVisuals(alpha);
        this.enemies.forEach(enemy => enemy.updateVisuals(alpha));
    }

    fixedUpdate(delta: number) {
        this.player.captureState();
        this.player.updateLogic(delta);

        this.enemies.forEach(enemy => {
            if (!enemy.active) return;
            enemy.captureState();
            this.movementSystem.update(enemy, delta, this.terrainLayer);
            if (enemy instanceof Slime) {
                enemy.updateAI(delta, this.movementSystem, this.terrainLayer);
            }
        });

        // Cleanup dead enemies
        this.enemies = this.enemies.filter(e => e.active);

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

        // Check Door Interaction (UP Key) vs Jump
        const pGridX = this.player.gridX;
        const pGridY = Math.floor((this.player.logicalY + 4) / GRID_SIZE);
        
        // Find door at player location
        const door = this.doors.find(d => d.gridX === pGridX && d.gridY === pGridY);

        if (this.cursors.up!.isDown) {
            if (door && door.triggerType === 'press_up') {
                // Enter door
                this.handleDoorTransition(door, 'left'); // Assuming Cavern->Town is left
                return; // Skip physics/jump
            } else {
                // Jump
                this.movementSystem.jump(this.player);
            }
        }

        if (this.keys.space.isDown) {
            if (this.player.startAttack()) {
                this.combatSystem.attack(this.player, this.enemies);
            }
        }

        this.movementSystem.update(this.player, delta, this.terrainLayer);

        if (moved) {
            this.player.playWalkAnimation();
        } else {
             if (this.player.isGrounded) {
                 this.player.playIdleAnimation();
             }
        }

        // Check Touch Transitions (e.g. Exit to Town)
        if (door && door.triggerType === 'touch') {
            this.handleDoorTransition(door, 'left');
        }
    }

    private handleDoorTransition(door: Door, defaultDirection: 'left'|'right') {
        this.scene.stop('HUDScene');
        
        if (door.destination === 'TransitionScene' && door.nextScene) {
            this.scene.start('TransitionScene', {
                nextScene: door.nextScene,
                startX: door.targetX,
                startY: door.targetY,
                direction: defaultDirection
            });
        } else {
            this.scene.start(door.destination, { startX: door.targetX, startY: door.targetY });
        }
    }
}
