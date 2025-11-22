import Phaser from 'phaser';
import { GRID_SIZE } from '../config/Constants';

export default class Door extends Phaser.GameObjects.Rectangle {
    gridX: number;
    gridY: number;
    destination: string;

    constructor(scene: Phaser.Scene, x: number, y: number, destination: string) {
        // x, y from Tiled are usually top-left. Phaser Rectangle origin is 0.5.
        // We set origin 0,0.
        super(scene, x, y, GRID_SIZE, GRID_SIZE, 0xff0000, 0.5);
        this.setOrigin(0, 0);
        
        this.gridX = Math.floor(x / GRID_SIZE);
        this.gridY = Math.floor(y / GRID_SIZE);
        this.destination = destination;

        scene.add.existing(this);
    }
}
