import Phaser from 'phaser';
import { GRID_SIZE } from '../config/Constants';
import type { PhysicsEntity } from '../types/Entities';
import GameState from '../data/GameState';

export default class Enemy extends Phaser.GameObjects.Sprite implements PhysicsEntity {
    gridX: number;
    logicalY: number;
    velocityY: number = 0;
    isGrounded: boolean = false;
    
    prevGridX: number;
    prevLogicalY: number;

    hp: number = 3;
    almasReward: number = 10;
    protected baseTint: number = 0xffffff;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.setOrigin(0, 0);

        this.gridX = Math.floor(x / GRID_SIZE);
        this.logicalY = y;
        
        this.prevGridX = this.gridX;
        this.prevLogicalY = this.logicalY;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(GRID_SIZE, GRID_SIZE);
        body.setOffset(0, 0);
        body.moves = false; // Custom physics
    }

    captureState() {
        this.prevGridX = this.gridX;
        this.prevLogicalY = this.logicalY;
    }

    takeDamage(amount: number) {
        this.hp -= amount;
        this.setTint(0xffffff); // Flash white (or bright)
        this.scene.time.delayedCall(100, () => {
            if (this.active) this.setTint(this.baseTint);
        });

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
        
        // Award Almas
        GameState.character.almas += this.almasReward;
        console.log(`Enemy defeated! Almas: ${GameState.character.almas}`);
    }

    updateVisuals(alpha: number) {
        const currentX = this.gridX * GRID_SIZE;
        const prevX = this.prevGridX * GRID_SIZE;
        
        this.x = Phaser.Math.Linear(prevX, currentX, alpha);
        this.y = Phaser.Math.Linear(this.prevLogicalY, this.logicalY, alpha);
        
        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.x = this.x;
            body.y = this.y;
        }
    }
}