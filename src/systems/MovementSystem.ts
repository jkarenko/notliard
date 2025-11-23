import { GRID_SIZE, GRAVITY, JUMP_HEIGHT } from '../config/Constants';
import type { PhysicsEntity } from '../types/Entities';

// Interface for testability - tilemap layers can implement this
export interface Tile {
    collides: boolean;
}

export interface TilemapLayer {
    getTileAt(x: number, y: number): Tile | null;
}

export default class MovementSystem {
    constructor() {
    }

    // Called every fixed update tick
    update(entity: PhysicsEntity, deltaMs: number, layer: TilemapLayer) {
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

        // Determine grid Y for feet and head
        const feetY = nextY + GRID_SIZE; // Bottom of sprite
        const headY = nextY;             // Top of sprite

        // Grid coordinates
        const gridX = entity.gridX;
        const gridHeadY = Math.floor(headY / GRID_SIZE);
        const gridFeetY = Math.floor((feetY - 0.01) / GRID_SIZE); // -0.01 to avoid floor triggering when standing exactly on line

        // Check floor collision (falling)
        if (entity.velocityY > 0) {
            const startGridY = Math.floor((entity.logicalY + GRID_SIZE - 0.01) / GRID_SIZE);
            const endGridY = gridFeetY;

            let collisionFound = false;
            // Iterate from current position down to next position
            for (let y = startGridY; y <= endGridY; y++) {
                const tileBelow = layer.getTileAt(gridX, y);
                if (tileBelow && tileBelow.collides) {
                     // Landed on tile at row y
                     // Snap to top of this tile
                     entity.logicalY = y * GRID_SIZE - GRID_SIZE;
                     entity.velocityY = 0;
                     entity.isGrounded = true;
                     collisionFound = true;
                     break;
                }
            }
            
            if (!collisionFound) {
                 entity.logicalY = nextY;
                 entity.isGrounded = false;
            }
        }
        // Check ceiling collision (jumping)
        else if (entity.velocityY < 0) {
            const startGridY = Math.floor(entity.logicalY / GRID_SIZE);
            const endGridY = gridHeadY;

            let collisionFound = false;
            // Iterate from current position up to next position (reverse order)
            for (let y = startGridY; y >= endGridY; y--) {
                const tileAbove = layer.getTileAt(gridX, y);
                if (tileAbove && tileAbove.collides) {
                    // Hit head on tile at row y
                    // Snap to bottom of this tile
                    entity.logicalY = (y + 1) * GRID_SIZE;
                    entity.velocityY = 0;
                    collisionFound = true;
                    break;
                }
            }

            if (!collisionFound) {
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
    moveHorizontal(entity: PhysicsEntity, direction: number, layer: TilemapLayer): boolean {
        const nextGridX = entity.gridX + direction;
        
        // Horizontal Collision Check
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

    jump(entity: PhysicsEntity) {
        if (entity.isGrounded) {
             // v = -sqrt(2 * g * h)
             entity.velocityY = -Math.sqrt(2 * GRAVITY * JUMP_HEIGHT);
             entity.isGrounded = false;
        }
    }
}