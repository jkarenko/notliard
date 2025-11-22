import Enemy from '../Enemy';
import MovementSystem from '../../systems/MovementSystem';

export default class Slime extends Enemy {
    private direction: number = -1; // -1 Left, 1 Right
    private moveTimer: number = 0;
    private moveInterval: number = 200; // Move every 200ms (slower than player)

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Use player spritesheet for now (maybe tint it green?)
        super(scene, x, y, 'player_spritesheet', 0);
        this.setTint(0x00ff00); // Green slime
    }

    updateAI(delta: number, movementSystem: MovementSystem, layer: Phaser.Tilemaps.TilemapLayer) {
        this.moveTimer += delta;
        if (this.moveTimer >= this.moveInterval) {
            this.moveTimer = 0;
            
            // Try move
            if (!movementSystem.moveHorizontal(this, this.direction, layer)) {
                // Blocked, reverse
                this.direction *= -1;
            }
            
            // Check for ledge? 
            // If !tileBelow(nextGridX), reverse?
            // Slimes usually patrol platforms.
            // We can add ledge detection later.
        }
    }
}
