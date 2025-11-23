import { describe, it, expect, beforeEach } from 'vitest';
import MovementSystem, { type TilemapLayer, type Tile } from '../systems/MovementSystem';
import { GRID_SIZE, GRAVITY, JUMP_HEIGHT } from '../config/Constants';
import type { PhysicsEntity } from '../types/Entities';

// Mock factory for PhysicsEntity
function createMockEntity(overrides: Partial<PhysicsEntity> = {}): PhysicsEntity {
  return {
    gridX: 2,
    logicalY: 16,
    velocityY: 0,
    isGrounded: false,
    x: 0,
    y: 0,
    ...overrides,
  };
}

// Mock factory for TilemapLayer
function createMockLayer(tiles: Map<string, Tile> = new Map()): TilemapLayer {
  return {
    getTileAt: (x: number, y: number) => {
      const key = `${x},${y}`;
      return tiles.get(key) || null;
    },
  };
}

// Helper to create a tile grid key
function tileKey(x: number, y: number): string {
  return `${x},${y}`;
}

// Helper to create a tile
function createTile(collides: boolean): Tile {
  return { collides };
}

describe('MovementSystem', () => {
  let movementSystem: MovementSystem;

  beforeEach(() => {
    movementSystem = new MovementSystem();
  });

  describe('update() - gravity', () => {
    it('should apply gravity to falling entity', () => {
      const entity = createMockEntity({ velocityY: 0, logicalY: 16 });
      const layer = createMockLayer();
      const deltaMs = 100; // 0.1 seconds

      movementSystem.update(entity, deltaMs, layer);

      // velocityY should increase: 0 + (800 * 0.1) = 80
      expect(entity.velocityY).toBe(GRAVITY * (deltaMs / 1000));
    });

    it('should accumulate velocity over multiple updates', () => {
      const entity = createMockEntity({ velocityY: 50, logicalY: 16 });
      const layer = createMockLayer();
      const deltaMs = 100;

      movementSystem.update(entity, deltaMs, layer);

      // velocityY should be: 50 + (800 * 0.1) = 130
      expect(entity.velocityY).toBe(50 + GRAVITY * (deltaMs / 1000));
    });

    it('should apply gravity correctly with different delta times', () => {
      const entity = createMockEntity({ velocityY: 0, logicalY: 16 });
      const layer = createMockLayer();

      movementSystem.update(entity, 50, layer);
      expect(entity.velocityY).toBeCloseTo(40, 1);

      movementSystem.update(entity, 50, layer);
      expect(entity.velocityY).toBeCloseTo(80, 1);
    });
  });

  describe('update() - floor collision', () => {
    it('should stop entity on collision with floor', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 100,
        isGrounded: false
      });

      const tiles = new Map();
      tiles.set(tileKey(2, 3), createTile(true)); // Floor at row 3
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      expect(entity.isGrounded).toBe(true);
      expect(entity.velocityY).toBe(0);
      expect(entity.logicalY).toBe(GRID_SIZE * 2); // Snapped to row 2
    });

    it('should not stop entity when no floor collision', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 50
      });
      const layer = createMockLayer(); // No tiles

      const initialVelocity = entity.velocityY;
      movementSystem.update(entity, 100, layer);

      expect(entity.isGrounded).toBe(false);
      expect(entity.velocityY).toBeGreaterThan(initialVelocity); // Gravity applied
    });

    it('should handle entity falling multiple rows', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 200 // Fast fall
      });

      const tiles = new Map();
      tiles.set(tileKey(2, 5), createTile(true)); // Floor at row 5
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      expect(entity.isGrounded).toBe(true);
      expect(entity.logicalY).toBe(GRID_SIZE * 4); // Snapped to row 4 (top of tile at row 5)
    });

    it('should not collide with non-colliding tiles', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 100
      });

      const tiles = new Map();
      tiles.set(tileKey(2, 3), createTile(false)); // Non-colliding tile
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      expect(entity.isGrounded).toBe(false);
    });

    it('should stop at first colliding tile when falling through multiple tiles', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 8,
        velocityY: 300 // Very fast fall
      });

      const tiles = new Map();
      tiles.set(tileKey(2, 3), createTile(true)); // First floor
      tiles.set(tileKey(2, 5), createTile(true)); // Second floor
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      expect(entity.logicalY).toBe(GRID_SIZE * 2); // Stopped at first floor
    });
  });

  describe('update() - ceiling collision', () => {
    it('should stop upward movement on ceiling collision', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 24,
        velocityY: -100 // Moving up
      });

      const tiles = new Map();
      tiles.set(tileKey(2, 2), createTile(true)); // Ceiling at row 2
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      expect(entity.velocityY).toBe(0);
      expect(entity.logicalY).toBe(GRID_SIZE * 3); // Snapped below tile
    });

    it('should allow upward movement when no ceiling', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 24,
        velocityY: -200 // Strong upward velocity to overcome gravity
      });
      const layer = createMockLayer();

      const originalY = entity.logicalY;
      movementSystem.update(entity, 100, layer);

      expect(entity.logicalY).toBeLessThan(originalY);
    });

    it('should not collide with non-colliding ceiling tiles', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 24,
        velocityY: -100
      });

      const tiles = new Map();
      tiles.set(tileKey(2, 2), createTile(false)); // Non-colliding
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      expect(entity.velocityY).toBeLessThan(0); // Still moving up
    });
  });

  describe('update() - walking off ledge', () => {
    it('should set isGrounded to false when walking off ledge', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 0,
        isGrounded: true
      });

      const tiles = new Map();
      // No tile below at row 3
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      expect(entity.isGrounded).toBe(false);
    });

    it('should remain grounded when floor exists', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 0,
        isGrounded: true
      });

      const tiles = new Map();
      tiles.set(tileKey(2, 3), createTile(true)); // Floor exists
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      expect(entity.isGrounded).toBe(true);
    });

    it('should not check ledge when entity is falling', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 50, // Falling
        isGrounded: true
      });

      const tiles = new Map();
      const layer = createMockLayer(tiles);

      movementSystem.update(entity, 100, layer);

      // isGrounded set to false by collision check, not ledge check
      expect(entity.isGrounded).toBe(false);
    });
  });

  describe('moveHorizontal()', () => {
    it('should move entity when no collision', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 16 });
      const layer = createMockLayer();

      const moved = movementSystem.moveHorizontal(entity, 1, layer);

      expect(moved).toBe(true);
      expect(entity.gridX).toBe(3);
    });

    it('should not move entity when blocked by wall', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 16 });

      const tiles = new Map();
      tiles.set(tileKey(3, 2), createTile(true)); // Wall to the right
      const layer = createMockLayer(tiles);

      const moved = movementSystem.moveHorizontal(entity, 1, layer);

      expect(moved).toBe(false);
      expect(entity.gridX).toBe(2); // Unchanged
    });

    it('should move left when direction is negative', () => {
      const entity = createMockEntity({ gridX: 5, logicalY: 16 });
      const layer = createMockLayer();

      const moved = movementSystem.moveHorizontal(entity, -1, layer);

      expect(moved).toBe(true);
      expect(entity.gridX).toBe(4);
    });

    it('should check collision at both top and bottom of entity', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 16 });

      const tiles = new Map();
      // Wall blocking only the bottom half
      tiles.set(tileKey(3, 2), createTile(true));
      const layer = createMockLayer(tiles);

      const moved = movementSystem.moveHorizontal(entity, 1, layer);

      expect(moved).toBe(false); // Should be blocked
    });

    it('should handle entity spanning two vertical tiles', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 12 }); // Between rows

      const tiles = new Map();
      tiles.set(tileKey(3, 1), createTile(false));
      tiles.set(tileKey(3, 2), createTile(false));
      const layer = createMockLayer(tiles);

      const moved = movementSystem.moveHorizontal(entity, 1, layer);

      expect(moved).toBe(true);
    });

    it('should not move when top tile blocks', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 16 });

      const tiles = new Map();
      tiles.set(tileKey(3, 2), createTile(true)); // Top blocked
      tiles.set(tileKey(3, 3), createTile(false)); // Bottom clear
      const layer = createMockLayer(tiles);

      const moved = movementSystem.moveHorizontal(entity, 1, layer);

      expect(moved).toBe(false);
    });

    it('should not move when bottom tile blocks', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 17 }); // Position so bottom is in row 3

      const tiles = new Map();
      tiles.set(tileKey(3, 2), createTile(false)); // Top clear
      tiles.set(tileKey(3, 3), createTile(true)); // Bottom blocked
      const layer = createMockLayer(tiles);

      const moved = movementSystem.moveHorizontal(entity, 1, layer);

      expect(moved).toBe(false);
    });

    it('should allow movement through non-colliding tiles', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 16 });

      const tiles = new Map();
      tiles.set(tileKey(3, 2), createTile(false));
      const layer = createMockLayer(tiles);

      const moved = movementSystem.moveHorizontal(entity, 1, layer);

      expect(moved).toBe(true);
    });
  });

  describe('jump()', () => {
    it('should apply jump velocity when grounded', () => {
      const entity = createMockEntity({ isGrounded: true, velocityY: 0 });

      movementSystem.jump(entity);

      const expectedVelocity = -Math.sqrt(2 * GRAVITY * JUMP_HEIGHT);
      expect(entity.velocityY).toBeCloseTo(expectedVelocity, 2);
      expect(entity.isGrounded).toBe(false);
    });

    it('should not jump when airborne', () => {
      const entity = createMockEntity({ isGrounded: false, velocityY: 50 });

      movementSystem.jump(entity);

      expect(entity.velocityY).toBe(50); // Unchanged
    });

    it('should calculate correct jump velocity for JUMP_HEIGHT', () => {
      const entity = createMockEntity({ isGrounded: true, velocityY: 0 });

      movementSystem.jump(entity);

      // v^2 = 2*g*h -> v = sqrt(2*g*h)
      // For 24px jump height with 800 gravity: sqrt(2*800*24) = sqrt(38400) ≈ 196
      const expectedVelocity = -Math.sqrt(2 * GRAVITY * JUMP_HEIGHT);
      expect(entity.velocityY).toBeCloseTo(expectedVelocity, 1);
    });

    it('should only jump once until grounded again', () => {
      const entity = createMockEntity({ isGrounded: true, velocityY: 0 });

      movementSystem.jump(entity);
      const firstJumpVelocity = entity.velocityY;

      movementSystem.jump(entity); // Try to jump again

      expect(entity.velocityY).toBe(firstJumpVelocity); // No change
    });

    it('should set isGrounded to false immediately', () => {
      const entity = createMockEntity({ isGrounded: true });

      movementSystem.jump(entity);

      expect(entity.isGrounded).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle zero deltaMs', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 16, velocityY: 0 });
      const layer = createMockLayer();

      expect(() => {
        movementSystem.update(entity, 0, layer);
      }).not.toThrow();

      expect(entity.velocityY).toBe(0); // No gravity applied
    });

    it('should handle very small deltaMs', () => {
      const entity = createMockEntity({ gridX: 2, logicalY: 16, velocityY: 0 });
      const layer = createMockLayer();

      movementSystem.update(entity, 1, layer); // 1ms

      expect(entity.velocityY).toBeCloseTo(GRAVITY * 0.001, 3);
    });

    it('should handle entity exactly on grid line', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: GRID_SIZE * 2, // Exactly on grid
        velocityY: 0,
        isGrounded: true
      });

      const tiles = new Map();
      tiles.set(tileKey(2, 3), createTile(true));
      const layer = createMockLayer(tiles);

      expect(() => {
        movementSystem.update(entity, 100, layer);
      }).not.toThrow();
    });

    it('should handle negative grid positions', () => {
      const entity = createMockEntity({ gridX: -1, logicalY: 16 });
      const layer = createMockLayer();

      const moved = movementSystem.moveHorizontal(entity, -1, layer);

      expect(moved).toBe(true);
      expect(entity.gridX).toBe(-2);
    });

    it('should handle very large grid positions', () => {
      const entity = createMockEntity({ gridX: 1000, logicalY: 8000 });
      const layer = createMockLayer();

      const moved = movementSystem.moveHorizontal(entity, 1, layer);

      expect(moved).toBe(true);
      expect(entity.gridX).toBe(1001);
    });

    it('should handle zero velocity (no movement)', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 0
      });
      const layer = createMockLayer();

      const initialY = entity.logicalY;
      movementSystem.update(entity, 100, layer);

      // Gravity applied, so position changes
      expect(entity.logicalY).not.toBe(initialY);
    });
  });

  describe('physics accuracy', () => {
    it('should apply gravity correctly over multiple frames', () => {
      const entity = createMockEntity({ velocityY: 0, logicalY: 0 });
      const layer = createMockLayer();

      // Simulate 5 frames at 20ms each
      for (let i = 0; i < 5; i++) {
        movementSystem.update(entity, 20, layer);
      }

      // After 100ms total: v = 0 + 800 * 0.1 = 80
      expect(entity.velocityY).toBeCloseTo(80, 1);
    });

    it('should maintain consistent jump height', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 100,
        velocityY: 0,
        isGrounded: true
      });
      const layer = createMockLayer();

      // Jump
      movementSystem.jump(entity);

      // Simulate until apex (velocity becomes positive)
      const startY = entity.logicalY;
      let maxHeight = startY;

      for (let i = 0; i < 100; i++) {
        movementSystem.update(entity, 16, layer); // ~60fps
        if (entity.logicalY < maxHeight) {
          maxHeight = entity.logicalY;
        }
        if (entity.velocityY > 0) break; // Reached apex
      }

      const jumpHeight = startY - maxHeight;
      // Should be close to JUMP_HEIGHT (24px), allowing for discrete timestep error
      expect(jumpHeight).toBeGreaterThan(JUMP_HEIGHT - 5);
      expect(jumpHeight).toBeLessThan(JUMP_HEIGHT + 5);
    });

    it('should handle continuous horizontal movement', () => {
      const entity = createMockEntity({ gridX: 0, logicalY: 16 });
      const layer = createMockLayer();

      // Move right 10 times
      for (let i = 0; i < 10; i++) {
        movementSystem.moveHorizontal(entity, 1, layer);
      }

      expect(entity.gridX).toBe(10);
    });

    it('should handle alternating horizontal movement', () => {
      const entity = createMockEntity({ gridX: 5, logicalY: 16 });
      const layer = createMockLayer();

      movementSystem.moveHorizontal(entity, 1, layer);
      expect(entity.gridX).toBe(6);

      movementSystem.moveHorizontal(entity, -1, layer);
      expect(entity.gridX).toBe(5);

      movementSystem.moveHorizontal(entity, -1, layer);
      expect(entity.gridX).toBe(4);
    });
  });

  describe('gameplay scenarios', () => {
    it('should handle falling from height and landing', () => {
      const entity = createMockEntity({
        gridX: 5,
        logicalY: 8,
        velocityY: 0,
        isGrounded: false
      });

      const tiles = new Map();
      tiles.set(tileKey(5, 10), createTile(true)); // Floor far below
      const layer = createMockLayer(tiles);

      // Simulate falling
      for (let i = 0; i < 50; i++) {
        movementSystem.update(entity, 16, layer);
        if (entity.isGrounded) break;
      }

      expect(entity.isGrounded).toBe(true);
      expect(entity.velocityY).toBe(0);
      expect(entity.logicalY).toBe(GRID_SIZE * 9); // Landed one row above the floor tile
    });

    it('should handle jumping and hitting ceiling', () => {
      const entity = createMockEntity({
        gridX: 3,
        logicalY: 40,
        velocityY: 0,
        isGrounded: true
      });

      const tiles = new Map();
      tiles.set(tileKey(3, 3), createTile(true)); // Ceiling above
      const layer = createMockLayer(tiles);

      movementSystem.jump(entity);

      // Simulate upward movement
      for (let i = 0; i < 10; i++) {
        movementSystem.update(entity, 16, layer);
        if (entity.velocityY === 0) break; // Hit ceiling or reached apex
      }

      // Should have hit the ceiling and stopped
      expect(entity.velocityY).toBe(0);
      expect(entity.logicalY).toBe(GRID_SIZE * 4); // Below ceiling
    });

    it('should handle trying to move into wall multiple times', () => {
      const entity = createMockEntity({ gridX: 5, logicalY: 16 });

      const tiles = new Map();
      tiles.set(tileKey(6, 2), createTile(true)); // Wall to right
      const layer = createMockLayer(tiles);

      // Try to move right 5 times
      for (let i = 0; i < 5; i++) {
        movementSystem.moveHorizontal(entity, 1, layer);
      }

      // Should still be at original position
      expect(entity.gridX).toBe(5);
    });

    it('should handle movement along floor', () => {
      const entity = createMockEntity({
        gridX: 2,
        logicalY: 16,
        velocityY: 0,
        isGrounded: true
      });

      const tiles = new Map();
      // Floor along the path
      for (let x = 1; x <= 5; x++) {
        tiles.set(tileKey(x, 3), createTile(true));
      }
      const layer = createMockLayer(tiles);

      // Move right twice
      movementSystem.moveHorizontal(entity, 1, layer);
      movementSystem.update(entity, 16, layer);

      movementSystem.moveHorizontal(entity, 1, layer);
      movementSystem.update(entity, 16, layer);

      expect(entity.gridX).toBe(4);
      expect(entity.isGrounded).toBe(true);
    });
  });
});
