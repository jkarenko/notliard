import Phaser from 'phaser';
import { GRID_SIZE } from '../config/Constants';

export default class Player extends Phaser.GameObjects.Sprite {
    gridX: number;
    gridY: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.gridX = Math.floor(x / GRID_SIZE);
        this.gridY = Math.floor(y / GRID_SIZE);

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
                frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 0, end: 1 }),
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

    // Method to update visual position based on grid position
    updatePositionFromGrid() {
        this.x = this.gridX * GRID_SIZE;
        this.y = this.gridY * GRID_SIZE;
        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.x = this.x;
            body.y = this.y;
        }
    }
}
