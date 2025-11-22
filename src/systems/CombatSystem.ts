import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import { GRID_SIZE } from '../config/Constants';

export default class CombatSystem {
    attack(player: Player, enemies: Enemy[], type: 'front' | 'down'): boolean {
        // 1. Determine Hitbox
        let targetGridX = player.gridX;
        // Player center Y row
        let targetGridY = Math.floor((player.logicalY + GRID_SIZE/2) / GRID_SIZE);

        if (type === 'front') {
            const direction = player.flipX ? -1 : 1;
            targetGridX += direction;
        } else {
            // Down Stab (hit below)
            targetGridY += 1;
        }

        // 2. Check for enemies in that grid cell
        // We check if enemy gridX matches targetGridX
        // And if enemy gridY is close enough (same row)
        
        const hitEnemies = enemies.filter(e => 
            e.active && 
            Math.abs(e.gridX - targetGridX) < 1 && // Exact X match (using float tolerance if needed)
            Math.abs(Math.floor((e.logicalY + GRID_SIZE/2) / GRID_SIZE) - targetGridY) <= 0 // Same row
        );

        // 3. Apply Damage
        hitEnemies.forEach(e => {
            e.takeDamage(1);
            console.log('Enemy hit!');
        });
        
        return hitEnemies.length > 0;
    }
}
