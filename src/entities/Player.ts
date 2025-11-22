import Phaser from 'phaser';
import { GRID_SIZE } from '../config/Constants';

export default class Player extends Phaser.GameObjects.Sprite {
    // Logical State (Fixed Timestep)
    gridX: number;
    logicalY: number;
    velocityY: number = 0;
    isGrounded: boolean = false;
    
    // Interpolation State
    prevGridX: number;
    prevLogicalY: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.gridX = Math.floor(x / GRID_SIZE);
        this.logicalY = y;
        
        this.prevGridX = this.gridX;
        this.prevLogicalY = this.logicalY;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(GRID_SIZE, GRID_SIZE);
        body.setOffset(0, 0);
        body.setCollideWorldBounds(true);

        this.initAnimations();
    }

    private initAnimations() {
        if (!this.scene.anims.exists('player-walk')) {
            this.scene.anims.create({
                key: 'player-walk',
                frames: [
                    { key: this.texture.key, frame: 0 },
                    { key: this.texture.key, frame: 1 }
                ],
                frameRate: 4,
                repeat: -1
            });
        }
        if (!this.scene.anims.exists('player-idle')) {
            this.scene.anims.create({
                key: 'player-idle',
                frames: [{ key: this.texture.key, frame: 0 }],
                frameRate: 1
            });
        }
        
        this.play('player-idle');
    }

    playWalkAnimation() {
        if (this.anims.currentAnim?.key !== 'player-walk') {
            this.play('player-walk');
        }
    }

    playIdleAnimation() {
        if (this.anims.currentAnim?.key !== 'player-idle') {
            this.play('player-idle');
        }
    }

    // Capture current state as previous for interpolation
    captureState() {
        this.prevGridX = this.gridX;
        this.prevLogicalY = this.logicalY;
    }

    // Interpolate visual position
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
