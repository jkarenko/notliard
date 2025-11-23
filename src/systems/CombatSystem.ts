import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import { GRID_SIZE } from '../config/Constants';
import InventorySystem from './InventorySystem';
import GameState from '../data/GameState';

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
        const hitEnemies = enemies.filter(e => 
            e.active && 
            Math.abs(e.gridX - targetGridX) < 1 && // Exact X match
            Math.abs(Math.floor((e.logicalY + GRID_SIZE/2) / GRID_SIZE) - targetGridY) <= 0 // Same row
        );

        // 3. Apply Damage
        const damage = InventorySystem.getDamage();
        hitEnemies.forEach(e => {
            e.takeDamage(damage);
            console.log(`Enemy hit for ${damage} damage!`);
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
                const enemyCenterX = (enemy.gridX * GRID_SIZE) + (GRID_SIZE / 2);
                this.applyDamageToPlayer(player, enemy.damage, enemyCenterX);
            }
        });
    }

    private applyDamageToPlayer(player: Player, amount: number, sourceX: number) {
        const shield = GameState.character.shield;

        // Apply knockback regardless of shield hit (usually)
        // Check if player is already invulnerable to avoid spamming knockback
        if (!player.isInvulnerable) {
             player.applyKnockback(sourceX);
        }

        if (shield.equipped !== -1 && shield.current > 0) {
            // Shield takes damage
            shield.current -= amount;
            console.log(`Shield absorbed ${amount} damage. Remaining: ${shield.current}`);
            
            // Visual feedback for shield hit?
            // player.flashShield(); 

            if (shield.current <= 0) {
                shield.current = 0;
                // Mark shield as broken in inventory?
                // The SaveData tracks 'equipped' separately from ownership.
                // We keep it equipped but it's now broken (0 HP).
                // Or we unequip it?
                // GameState.character.equipment.shield = -1; 
                // shield.equipped = -1;
                console.log("Shield BROKEN!");
            }
            
            // Player still gets invulnerability frames even on shield hit to prevent instant shredding
            player.triggerInvulnerability();

        } else {
            // Player takes damage
            player.takeDamage(amount);
        }
    }
}
