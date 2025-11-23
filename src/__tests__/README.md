# Test Suite for Notliard

## Overview

This directory contains the test suite for the Notliard game project. The testing infrastructure is set up using Vitest with jsdom environment for browser API mocking.

## Current Status

### ✅ Implemented Tests

#### GameState Tests (`GameState.test.ts`)
- **Coverage:** 100% of GameState functionality
- **Test Count:** 12 tests, all passing
- **Areas Covered:**
  - Initialization with default values
  - `reset()` function behavior
  - Character state mutations (HP, gold, almas, currentTown)
  - Boundary conditions
  - Singleton behavior

**Why these tests matter:** GameState is a singleton that persists across the entire game. Bugs here affect every scene and can corrupt save data.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Testing Infrastructure

### Setup Files
- **`setup.ts`**: Configures Phaser mocks and canvas element mocks for jsdom environment
- **`vitest.config.ts`**: Vitest configuration with coverage thresholds and exclusions

### Dependencies
- `vitest`: Test framework
- `@vitest/ui`: Interactive test UI
- `@vitest/coverage-v8`: Coverage reporting
- `jsdom`: Browser API mocking

## Recommended Testing Priorities

Based on the codebase analysis, here are the recommended areas for future test coverage:

### 1. 🔥 High Priority (Core Game Logic)

#### CombatSystem (`systems/CombatSystem.ts`)
**Risk Level:** High
**Recommended Tests:**
- Front attack hitbox calculation
- Down stab mechanics
- Player-enemy collision detection
- Invulnerability handling
- Multiple enemies in same cell
- Edge cases with floating point grid positions

**Test Approach:** Unit tests with mocked Player/Enemy objects. The system logic is pure and doesn't require Phaser rendering.

**Challenge:** Requires mocking Phaser entities. Consider refactoring to use interfaces instead of concrete Phaser classes.

#### MovementSystem (`systems/MovementSystem.ts`)
**Risk Level:** High
**Recommended Tests:**
- Gravity application over time
- Floor/ceiling collision detection
- Horizontal movement with wall collision
- Jump velocity calculations
- Walking off ledge detection
- Physics accuracy over multiple frames

**Test Approach:** Unit tests with mocked PhysicsEntity and TilemapLayer.

**Challenge:** Requires mocking Phaser's TilemapLayer. The logic is testable but imports need to be handled carefully.

### 2. 🟡 Medium Priority (Entity Logic)

#### Player Entity (`entities/Player.ts`)
**Recommended Tests:**
- Attack state machine (ATTACK_DURATION timing)
- Damage and invulnerability mechanics
- Death and respawn logic
- Animation state transitions
- State interpolation

**Challenge:** Heavily integrated with Phaser. Requires either:
- Extensive Phaser mocking
- Integration tests with actual Phaser instances
- Refactoring to separate logic from rendering

#### Enemy Entity (`entities/Enemy.ts`)
**Recommended Tests:**
- Damage application
- Death and almas rewards
- Tint flash timing
- Visual interpolation

**Challenge:** Same as Player entity.

#### EntitySpawner (`services/EntitySpawner.ts`)
**Recommended Tests:**
- Door spawning from Tiled objects
- Enemy spawning from Tiled objects
- Handling missing properties
- Handling malformed map data
- Default values for optional properties

**Challenge:** Requires mocking Tiled map format and Phaser constructors.

### 3. 🟢 Lower Priority (Scenes)

Scenes (`scenes/**`) are integration-heavy and would benefit more from:
- E2E tests with Playwright
- Manual testing checklists
- Screenshot regression tests

## Challenges with Phaser Testing

### The Problem

Phaser is a game framework that heavily relies on:
- Canvas rendering
- WebGL context
- Browser APIs
- Complex initialization sequences

When testing Phaser-dependent code, the following issues arise:
1. **Module Loading:** Importing any class that extends Phaser classes triggers Phaser initialization
2. **Missing Dependencies:** Phaser expects modules like `phaser3spectorjs` that aren't in the test environment
3. **Canvas Context:** Phaser requires valid canvas contexts with ImageData support
4. **Circular Dependencies:** Phaser's module system can create circular dependencies in test environments

### Solutions

#### Option 1: Aggressive Mocking (Not Recommended)
Mock the entire Phaser library before any imports. This is fragile and breaks with Phaser updates.

#### Option 2: Refactor for Testability (Recommended)
Separate game logic from Phaser rendering:

```typescript
// Bad: Tightly coupled
class CombatSystem {
  attack(player: Player, enemies: Enemy[]) { ... }
}

// Good: Logic separated
interface CombatEntity {
  gridX: number;
  logicalY: number;
  takeDamage(amount: number): void;
}

class CombatSystem {
  attack(player: CombatEntity, enemies: CombatEntity[]) { ... }
}
```

#### Option 3: Integration Tests
Use Playwright or Puppeteer to test the actual game in a real browser. This is slower but more reliable for Phaser code.

#### Option 4: Vitest Browser Mode
Vitest supports running tests in an actual browser, which would handle Phaser initialization correctly.

## Test Coverage Goals

Current coverage targets (defined in `vitest.config.ts`):
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

### Current Coverage
- **GameState:** 100%
- **Overall:** ~5-10% (only GameState tested)

### Realistic Goals
- **Core Logic (Systems):** 70-80%
- **Entities:** 50-60%
- **Scenes:** Manual/E2E testing only
- **Overall:** 40-50%

## Next Steps

1. **Immediate:**
   - ✅ Set up testing infrastructure (Done)
   - ✅ Create GameState tests (Done)
   - 🔄 Document testing approach (This file)

2. **Short Term:**
   - Refactor CombatSystem and MovementSystem to use interfaces
   - Add unit tests for refactored systems
   - Create test utilities for common mocking patterns

3. **Medium Term:**
   - Refactor Entity classes to separate logic from rendering
   - Add entity logic tests
   - Set up integration test framework (Playwright)

4. **Long Term:**
   - Add E2E tests for critical user flows
   - Set up visual regression testing
   - Integrate tests into CI/CD pipeline

## Contributing Tests

When adding new tests:

1. **Keep tests focused:** One logical unit per test
2. **Use descriptive names:** `should apply damage when enemy in front`
3. **Test edge cases:** Boundaries, nulls, empty arrays
4. **Mock minimally:** Only mock external dependencies
5. **Document complex tests:** Explain non-obvious test logic

## Example Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup common to all tests
  });

  describe('methodName()', () => {
    it('should do expected thing in normal case', () => {
      // Arrange
      const input = createTestData();

      // Act
      const result = component.methodName(input);

      // Assert
      expect(result).toBe(expectedValue);
    });

    it('should handle edge case', () => {
      // Test edge cases
    });
  });

  describe('edge cases', () => {
    it('should handle null input', () => {
      // Test error conditions
    });
  });
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Phaser Testing Discussion](https://phaser.discourse.group/t/unit-testing-phaser-3-projects/1896)
