import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import { GRID_SIZE } from '../config/Constants';

export default class CombatSystem {
    attack(player: Player, enemies: Enemy[]): boolean {
        // 1. Determine Hitbox
        // Player faces Left if flipX is true
        const direction = player.flipX ? -1 : 1;
        const targetGridX = player.gridX + direction;
        
        // Vertical range: Player's current row
        const playerGridY = Math.floor((player.logicalY + GRID_SIZE/2) / GRID_SIZE);

        // 2. Check for enemies in that grid cell
        // We check if enemy gridX matches targetGridX
        // And if enemy gridY is close enough (same row or adjacent?)
        // Zeliard is strict horizontally, forgiving vertically?
        // Let's check exact row first.
        
        const hitEnemies = enemies.filter(e => 
            e.active && 
            Math.abs(e.gridX - targetGridX) < 1 && // Exact X match (using float tolerance if needed)
            Math.abs(Math.floor((e.logicalY + GRID_SIZE/2) / GRID_SIZE) - playerGridY) <= 0 // Same row
        );

        // 3. Apply Damage
        hitEnemies.forEach(e => {
            e.takeDamage(1);
            console.log('Enemy hit!');
        });
        
        return hitEnemies.length > 0;
    }
}
