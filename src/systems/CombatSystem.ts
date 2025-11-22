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

    checkPlayerEnemyCollision(player: Player, enemies: Enemy[]) {
        if (player.isInvulnerable) return; // Player is protected

        // Player bounding box (using logical position, 8x8 size)
        const playerLeft = player.gridX * GRID_SIZE;
        const playerRight = player.gridX * GRID_SIZE + GRID_SIZE;
        const playerTop = player.logicalY;
        const playerBottom = player.logicalY + GRID_SIZE;

        enemies.forEach(enemy => {
            if (!enemy.active) return; // Only check active enemies

            // Enemy bounding box
            const enemyLeft = enemy.gridX * GRID_SIZE;
            const enemyRight = enemy.gridX * GRID_SIZE + GRID_SIZE;
            const enemyTop = enemy.logicalY;
            const enemyBottom = enemy.logicalY + GRID_SIZE;

            // AABB Overlap check
            if (
                playerLeft < enemyRight &&
                playerRight > enemyLeft &&
                playerTop < enemyBottom &&
                playerBottom > enemyTop
            ) {
                // Collision detected
                player.takeDamage(10); // Example: 10 damage
                // Add knockback if desired (e.g., player.velocityY = -200; player.gridX += direction;)
            }
        });
    }
}
