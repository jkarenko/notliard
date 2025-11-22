import { GRID_SIZE } from '../config/Constants';

interface IMovable {
    gridX: number;
    gridY: number;
    x: number;
    y: number;
    body?: any;
}

export default class MovementSystem {
    constructor() {
    }

    // Updates the logical grid position and the physical pixel position of a movable entity
    updatePosition(entity: IMovable, newGridX: number, newGridY: number) {
        entity.gridX = newGridX;
        entity.gridY = newGridY;
        entity.x = newGridX * GRID_SIZE;
        entity.y = newGridY * GRID_SIZE;
        if (entity.body) {
            entity.body.x = entity.x;
            entity.body.y = entity.y;
        }
    }

    // Moves an entity by a given delta in grid units, checking for collisions
    move(entity: IMovable, deltaX: number, deltaY: number, layer?: Phaser.Tilemaps.TilemapLayer): boolean {
        const newGridX = entity.gridX + deltaX;
        const newGridY = entity.gridY + deltaY;

        // Check collision with tilemap layer
        if (layer) {
            const tile = layer.getTileAt(newGridX, newGridY);
            // If tile exists and is collapsible (setCollision sets index property, but we check specific flag or property)
            // Phaser's setCollision sets 'collides' property on the tile if using Arcade Physics, 
            // but for raw grid check, we can check canCollide or indices.
            // Simpler: check if tile exists and has the collision flag we expect.
            // layer.getTileAt returns null if out of bounds.
            
            if (tile && tile.collides) {
                return false;
            }
        }

        this.updatePosition(entity, newGridX, newGridY);
        return true;
    }
}
