import Phaser from 'phaser';
import { GRID_SIZE } from '../config/Constants';
import type { PhysicsEntity } from '../types/Entities';

export default class Enemy extends Phaser.GameObjects.Sprite implements PhysicsEntity {
    gridX: number;
    logicalY: number;
    velocityY: number = 0;
    isGrounded: boolean = false;
    
    prevGridX: number;
    prevLogicalY: number;

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
