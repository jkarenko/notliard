import { describe, it, expect, vi, beforeEach } from 'vitest';
import CombatSystem, { type CombatPlayer, type CombatEntity } from '../systems/CombatSystem';
import { GRID_SIZE } from '../config/Constants';

// Mock factory functions using the exported interfaces
function createMockPlayer(overrides: Partial<CombatPlayer> = {}): CombatPlayer {
  return {
    gridX: 2,
    logicalY: 16,
    flipX: false,
    isInvulnerable: false,
    active: true,
    takeDamage: vi.fn(),
    ...overrides,
  };
}

function createMockEnemy(overrides: Partial<CombatEntity> = {}): CombatEntity {
  return {
    gridX: 3,
    logicalY: 16,
    active: true,
    takeDamage: vi.fn(),
    ...overrides,
  };
}

describe('CombatSystem', () => {
  let combatSystem: CombatSystem;

  beforeEach(() => {
    combatSystem = new CombatSystem();
    vi.clearAllMocks();
  });

  describe('attack() - front attack', () => {
    it('should hit enemy directly in front of player (facing right)', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, flipX: false });
      const enemy = createMockEnemy({ gridX: 3, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(true);
      expect(enemy.takeDamage).toHaveBeenCalledWith(1);
      expect(enemy.takeDamage).toHaveBeenCalledTimes(1);
    });

    it('should hit enemy directly in front of player (facing left)', () => {
      const player = createMockPlayer({ gridX: 5, logicalY: 16, flipX: true });
      const enemy = createMockEnemy({ gridX: 4, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(true);
      expect(enemy.takeDamage).toHaveBeenCalledWith(1);
    });

    it('should miss enemy behind player', () => {
      const player = createMockPlayer({ gridX: 5, logicalY: 16, flipX: false });
      const enemy = createMockEnemy({ gridX: 4, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(false);
      expect(enemy.takeDamage).not.toHaveBeenCalled();
    });

    it('should miss enemy too far away', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, flipX: false });
      const enemy = createMockEnemy({ gridX: 5, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(false);
      expect(enemy.takeDamage).not.toHaveBeenCalled();
    });

    it('should miss enemy on different row', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, flipX: false });
      const enemy = createMockEnemy({ gridX: 3, logicalY: 32 }); // Different row

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(false);
      expect(enemy.takeDamage).not.toHaveBeenCalled();
    });

    it('should hit multiple enemies in the same cell', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, flipX: false });
      const enemy1 = createMockEnemy({ gridX: 3, logicalY: 16 });
      const enemy2 = createMockEnemy({ gridX: 3, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemy1, enemy2], 'front');

      expect(hit).toBe(true);
      expect(enemy1.takeDamage).toHaveBeenCalledWith(1);
      expect(enemy2.takeDamage).toHaveBeenCalledWith(1);
    });

    it('should not hit inactive enemies', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, flipX: false });
      const enemy = createMockEnemy({ gridX: 3, logicalY: 16, active: false });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(false);
      expect(enemy.takeDamage).not.toHaveBeenCalled();
    });

    it('should handle empty enemy array', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, flipX: false });

      const hit = combatSystem.attack(player, [], 'front');

      expect(hit).toBe(false);
    });

    it('should handle player at grid position with vertical offset', () => {
      // Player center Y calculation: (logicalY + GRID_SIZE/2) / GRID_SIZE
      const player = createMockPlayer({ gridX: 2, logicalY: 12, flipX: false });
      const enemy = createMockEnemy({ gridX: 3, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      // Both should be on same row (player: (12+4)/8 = 2, enemy: (16+4)/8 = 2.5 -> floor = 2)
      expect(hit).toBe(true);
    });

    it('should respect flipX direction when attacking', () => {
      const player = createMockPlayer({ gridX: 3, logicalY: 16, flipX: true });
      const enemyLeft = createMockEnemy({ gridX: 2, logicalY: 16 });
      const enemyRight = createMockEnemy({ gridX: 4, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemyLeft, enemyRight], 'front');

      expect(hit).toBe(true);
      expect(enemyLeft.takeDamage).toHaveBeenCalledWith(1);
      expect(enemyRight.takeDamage).not.toHaveBeenCalled();
    });
  });

  describe('attack() - down stab', () => {
    it('should hit enemy directly below player', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 24 }); // One row down

      const hit = combatSystem.attack(player, [enemy], 'down');

      expect(hit).toBe(true);
      expect(enemy.takeDamage).toHaveBeenCalledWith(1);
    });

    it('should miss enemy to the side during down stab', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 3, logicalY: 24 });

      const hit = combatSystem.attack(player, [enemy], 'down');

      expect(hit).toBe(false);
      expect(enemy.takeDamage).not.toHaveBeenCalled();
    });

    it('should miss enemy above player during down stab', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 8 });

      const hit = combatSystem.attack(player, [enemy], 'down');

      expect(hit).toBe(false);
      expect(enemy.takeDamage).not.toHaveBeenCalled();
    });

    it('should hit multiple enemies below player', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy1 = createMockEnemy({ gridX: 2, logicalY: 24 });
      const enemy2 = createMockEnemy({ gridX: 2, logicalY: 24 });

      const hit = combatSystem.attack(player, [enemy1, enemy2], 'down');

      expect(hit).toBe(true);
      expect(enemy1.takeDamage).toHaveBeenCalledWith(1);
      expect(enemy2.takeDamage).toHaveBeenCalledWith(1);
    });

    it('should not hit inactive enemies during down stab', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 24, active: false });

      const hit = combatSystem.attack(player, [enemy], 'down');

      expect(hit).toBe(false);
      expect(enemy.takeDamage).not.toHaveBeenCalled();
    });
  });

  describe('checkPlayerEnemyCollision()', () => {
    it('should damage player when colliding with enemy', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 16 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).toHaveBeenCalledWith(10);
    });

    it('should not damage invulnerable player', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, isInvulnerable: true });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 16 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).not.toHaveBeenCalled();
    });

    it('should not damage player when not colliding', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 5, logicalY: 16 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).not.toHaveBeenCalled();
    });

    it('should not check collision with inactive enemies', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 16, active: false });

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).not.toHaveBeenCalled();
    });

    it('should handle multiple enemies and only damage once per enemy', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy1 = createMockEnemy({ gridX: 2, logicalY: 16 });
      const enemy2 = createMockEnemy({ gridX: 5, logicalY: 16 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy1, enemy2]);

      // Should only be hit once by enemy1
      expect(player.takeDamage).toHaveBeenCalledTimes(1);
    });

    it('should detect collision with partial overlap', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      // Enemy slightly overlapping from the right
      const enemy = createMockEnemy({ gridX: 2, logicalY: 16 + GRID_SIZE / 2 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).toHaveBeenCalledWith(10);
    });

    it('should handle empty enemy array', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });

      expect(() => {
        combatSystem.checkPlayerEnemyCollision(player, []);
      }).not.toThrow();

      expect(player.takeDamage).not.toHaveBeenCalled();
    });

    it('should detect collision with AABB overlap from left', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 14 }); // Overlapping vertically

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).toHaveBeenCalledWith(10);
    });

    it('should detect collision with AABB overlap from above', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 12 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).toHaveBeenCalledWith(10);
    });

    it('should detect collision with AABB overlap from below', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 20 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).toHaveBeenCalledWith(10);
    });

    it('should not detect collision when just touching (no overlap)', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      // Enemy exactly one grid cell to the right (no overlap)
      const enemy = createMockEnemy({ gridX: 3, logicalY: 16 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).not.toHaveBeenCalled();
    });

    it('should handle multiple colliding enemies', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16 });
      const enemy1 = createMockEnemy({ gridX: 2, logicalY: 16 });
      const enemy2 = createMockEnemy({ gridX: 2, logicalY: 18 });

      combatSystem.checkPlayerEnemyCollision(player, [enemy1, enemy2]);

      // Should be damaged by both enemies
      expect(player.takeDamage).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should handle floating point grid positions', () => {
      const player = createMockPlayer({ gridX: 2.1, logicalY: 16.5, flipX: false });
      const enemy = createMockEnemy({ gridX: 3.1, logicalY: 16.5 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(true);
    });

    it('should handle enemy at exact grid boundary', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, flipX: false });
      const enemy = createMockEnemy({ gridX: 3, logicalY: GRID_SIZE * 2 }); // Exact boundary

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(true);
    });

    it('should handle negative grid positions', () => {
      const player = createMockPlayer({ gridX: 0, logicalY: 16, flipX: true });
      const enemy = createMockEnemy({ gridX: -1, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(true);
      expect(enemy.takeDamage).toHaveBeenCalledWith(1);
    });

    it('should handle very large grid positions', () => {
      const player = createMockPlayer({ gridX: 1000, logicalY: 8000, flipX: false });
      const enemy = createMockEnemy({ gridX: 1001, logicalY: 8000 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(true);
    });

    it('should handle zero positions', () => {
      const player = createMockPlayer({ gridX: 0, logicalY: 0, flipX: false });
      const enemy = createMockEnemy({ gridX: 1, logicalY: 0 });

      const hit = combatSystem.attack(player, [enemy], 'front');

      expect(hit).toBe(true);
    });

    it('should handle collision check with invulnerable player returns early', () => {
      const player = createMockPlayer({ gridX: 2, logicalY: 16, isInvulnerable: true });
      const enemy = createMockEnemy({ gridX: 2, logicalY: 16 });

      // Should return early and not iterate enemies
      combatSystem.checkPlayerEnemyCollision(player, [enemy]);

      expect(player.takeDamage).not.toHaveBeenCalled();
    });
  });

  describe('gameplay scenarios', () => {
    it('should handle player attacking while multiple enemies are present', () => {
      const player = createMockPlayer({ gridX: 5, logicalY: 16, flipX: false });
      const enemyInFront = createMockEnemy({ gridX: 6, logicalY: 16 });
      const enemyBehind = createMockEnemy({ gridX: 4, logicalY: 16 });
      const enemyAbove = createMockEnemy({ gridX: 6, logicalY: 8 });

      const hit = combatSystem.attack(player, [enemyInFront, enemyBehind, enemyAbove], 'front');

      expect(hit).toBe(true);
      expect(enemyInFront.takeDamage).toHaveBeenCalledWith(1);
      expect(enemyBehind.takeDamage).not.toHaveBeenCalled();
      expect(enemyAbove.takeDamage).not.toHaveBeenCalled();
    });

    it('should handle down stab killing enemy below while others are nearby', () => {
      const player = createMockPlayer({ gridX: 3, logicalY: 16 });
      const enemyBelow = createMockEnemy({ gridX: 3, logicalY: 24 });
      const enemySide = createMockEnemy({ gridX: 4, logicalY: 24 });
      const enemySameLevel = createMockEnemy({ gridX: 3, logicalY: 16 });

      const hit = combatSystem.attack(player, [enemyBelow, enemySide, enemySameLevel], 'down');

      expect(hit).toBe(true);
      expect(enemyBelow.takeDamage).toHaveBeenCalledWith(1);
      expect(enemySide.takeDamage).not.toHaveBeenCalled();
      expect(enemySameLevel.takeDamage).not.toHaveBeenCalled();
    });

    it('should prevent damage to invulnerable player even when surrounded', () => {
      const player = createMockPlayer({ gridX: 5, logicalY: 16, isInvulnerable: true });
      const enemies = [
        createMockEnemy({ gridX: 5, logicalY: 16 }),
        createMockEnemy({ gridX: 5, logicalY: 18 }),
        createMockEnemy({ gridX: 4, logicalY: 16 }),
      ];

      combatSystem.checkPlayerEnemyCollision(player, enemies);

      expect(player.takeDamage).not.toHaveBeenCalled();
    });
  });
});
