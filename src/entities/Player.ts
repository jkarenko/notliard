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
