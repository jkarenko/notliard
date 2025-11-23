import { describe, it, expect, beforeEach } from 'vitest';
import GameState from '../data/GameState';

describe('GameState', () => {
  beforeEach(() => {
    // Reset to clean state before each test
    GameState.reset();
  });

  describe('initialization', () => {
    it('should initialize with correct default values after reset', () => {
      expect(GameState.character.hp).toBe(100);
      expect(GameState.character.maxHp).toBe(100);
      expect(GameState.character.gold).toBe(0);
      expect(GameState.character.almas).toBe(0);
      expect(GameState.character.currentTown).toBe('Muralla Town');
    });
  });

  describe('reset()', () => {
    it('should reset all character properties to initial state', () => {
      // Modify state
      GameState.character.hp = 50;
      GameState.character.gold = 500;
      GameState.character.almas = 100;
      GameState.character.currentTown = 'Different Town';

      // Reset
      GameState.reset();

      // Verify reset
      expect(GameState.character.hp).toBe(100);
      expect(GameState.character.maxHp).toBe(100);
      expect(GameState.character.gold).toBe(0);
      expect(GameState.character.almas).toBe(0);
      expect(GameState.character.currentTown).toBe('Muralla Town');
    });

    it('should allow resetting multiple times', () => {
      GameState.character.gold = 1000;
      GameState.reset();
      expect(GameState.character.gold).toBe(0);

      GameState.character.gold = 2000;
      GameState.reset();
      expect(GameState.character.gold).toBe(0);
    });
  });

  describe('character state mutations', () => {
    it('should allow HP to be modified', () => {
      GameState.character.hp = 75;
      expect(GameState.character.hp).toBe(75);
    });

    it('should allow gold to be modified', () => {
      GameState.character.gold = 500;
      expect(GameState.character.gold).toBe(500);
    });

    it('should allow almas to be modified', () => {
      GameState.character.almas = 50;
      expect(GameState.character.almas).toBe(50);
    });

    it('should allow currentTown to be modified', () => {
      GameState.character.currentTown = 'New Town';
      expect(GameState.character.currentTown).toBe('New Town');
    });

    it('should persist state across multiple reads (singleton behavior)', () => {
      GameState.character.gold = 999;
      const firstRead = GameState.character.gold;
      const secondRead = GameState.character.gold;
      expect(firstRead).toBe(secondRead);
      expect(firstRead).toBe(999);
    });
  });

  describe('boundary conditions', () => {
    it('should allow HP to be set to 0', () => {
      GameState.character.hp = 0;
      expect(GameState.character.hp).toBe(0);
    });

    it('should allow HP to exceed maxHp (no validation in GameState)', () => {
      // Note: Validation should be in entity classes, not GameState
      GameState.character.hp = 150;
      expect(GameState.character.hp).toBe(150);
    });

    it('should allow negative gold (debt system)', () => {
      GameState.character.gold = -100;
      expect(GameState.character.gold).toBe(-100);
    });

    it('should allow very large gold values', () => {
      GameState.character.gold = 999999;
      expect(GameState.character.gold).toBe(999999);
    });
  });
});
