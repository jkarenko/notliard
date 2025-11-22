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

    // Moves an entity by a given delta in grid units
    move(entity: IMovable, deltaX: number, deltaY: number): boolean {
        const newGridX = entity.gridX + deltaX;
        const newGridY = entity.gridY + deltaY;

        // TODO: Add actual collision checking here later
        // For now, assume movement is always possible
        this.updatePosition(entity, newGridX, newGridY);
        return true;
    }
}
