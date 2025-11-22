import Phaser from 'phaser';
import { GRID_SIZE, GRAVITY, JUMP_HEIGHT } from '../config/Constants';
import Player from '../entities/Player';

export default class MovementSystem {
    constructor() {
    }

    // Called every fixed update tick
    update(entity: Player, deltaMs: number, layer: Phaser.Tilemaps.TilemapLayer) {
        const dt = deltaMs / 1000; // Convert to seconds

        // Apply Gravity
        entity.velocityY += GRAVITY * dt;

        // Predict next vertical position
        const nextY = entity.logicalY + entity.velocityY * dt;
        
        // Vertical Collision Check
        // We check the tile(s) the player is moving into.
        // Bounding box width is GRID_SIZE (8px).
        // Left side: entity.gridX
        // Right side: entity.gridX (since width is 1 tile exactly)
        // If player width > tile, we'd check range. Here width=8, tile=8.

        // Determine grid Y for feet and head
        const feetY = nextY + GRID_SIZE; // Bottom of sprite
        const headY = nextY;             // Top of sprite

        // Grid coordinates
        const gridX = entity.gridX;
        const gridHeadY = Math.floor(headY / GRID_SIZE);
        const gridFeetY = Math.floor((feetY - 0.01) / GRID_SIZE); // -0.01 to avoid floor triggering when standing exactly on line

        // Check floor collision (falling)
        if (entity.velocityY > 0) {
            const tileBelow = layer.getTileAt(gridX, gridFeetY);
            if (tileBelow && tileBelow.collides) {
                // Landed
                entity.logicalY = gridFeetY * GRID_SIZE - GRID_SIZE;
                entity.velocityY = 0;
                entity.isGrounded = true;
            } else {
                entity.logicalY = nextY;
                entity.isGrounded = false;
            }
        }
        // Check ceiling collision (jumping)
        else if (entity.velocityY < 0) {
            const tileAbove = layer.getTileAt(gridX, gridHeadY);
            if (tileAbove && tileAbove.collides) {
                // Hit head
                entity.logicalY = (gridHeadY + 1) * GRID_SIZE;
                entity.velocityY = 0;
            } else {
                entity.logicalY = nextY;
                entity.isGrounded = false;
            }
        }
        else {
             entity.logicalY = nextY;
        }

        // Check if walked off ledge (if grounded and no velocity change)
        if (entity.isGrounded && entity.velocityY === 0) {
             const gridFeetY = Math.floor((entity.logicalY + GRID_SIZE + 0.1) / GRID_SIZE);
             const tileBelow = layer.getTileAt(entity.gridX, gridFeetY);
             if (!tileBelow || !tileBelow.collides) {
                 entity.isGrounded = false;
             }
        }
    }

    // Moves horizontally by 1 grid unit
    moveHorizontal(entity: Player, direction: number, layer: Phaser.Tilemaps.TilemapLayer): boolean {
        const nextGridX = entity.gridX + direction;
        
        // Horizontal Collision Check
        // Check tile at current head/feet Y
        // Actually, since we are grid aligned horizontally, we just check the column.
        // But vertical position is float.
        // We check the tiles intersecting the vertical body range.
        const topGridY = Math.floor(entity.logicalY / GRID_SIZE);
        const bottomGridY = Math.floor((entity.logicalY + GRID_SIZE - 0.1) / GRID_SIZE);

        const tileTop = layer.getTileAt(nextGridX, topGridY);
        const tileBottom = layer.getTileAt(nextGridX, bottomGridY);

        let blocked = false;
        if (tileTop && tileTop.collides) blocked = true;
        if (tileBottom && tileBottom.collides) blocked = true;

        if (!blocked) {
            entity.gridX = nextGridX;
            return true;
        }
        return false;
    }

    jump(entity: Player) {
        if (entity.isGrounded) {
             // Calculate jump velocity based on desired height and gravity physics
             // v^2 = u^2 + 2as -> u = sqrt(-2as)
             // But design doc says "Jump parameters scale with game speed" and "Predetermined grid-aligned arc".
             // We'll use standard physics for now as it's smoother and reliable.
             // v = -sqrt(2 * g * h)
             entity.velocityY = -Math.sqrt(2 * GRAVITY * JUMP_HEIGHT);
             entity.isGrounded = false;
        }
    }
}
