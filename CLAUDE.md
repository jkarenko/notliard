# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Notliard** is a browser-based remake of the 1990 DOS game *Zeliard* (Game Arts/Sierra On-Line), an Action RPG / Metroidvania Platformer. Built with **Phaser 3** and **TypeScript**, it replicates the original's grid-based movement, combat, and economy using modern web tech.

**Live Demo:** https://jkarenko.github.io/notliard/

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Architecture

### Core Systems

**Movement System** (`src/systems/MovementSystem.ts`)
- 8px grid-based movement with fixed timestep logic (15Hz physics, 60Hz visual)
- Custom swept AABB collision (NOT using Phaser Arcade physics for movement)
- Gravity physics (800 px/s²) and jumping (24px height)
- Entities store `gridX` (int grid position) and `logicalY` (precise pixel Y)
- Visual positions are interpolated from previous/current state for smooth 60fps display

**Game State** (`src/data/GameState.ts`)
- Singleton managing all persistent game data (character stats, progression, inventory)
- Syncs with Player entity via getters/setters (e.g., `player.hp` → `GameState.hp`)
- Serialized to `localStorage` (not yet implemented in this codebase but structure ready)

**Combat System** (`src/systems/CombatSystem.ts`)
- Grid-aligned hitboxes for attacks (front slash, down stab)
- Enemy damage, knockback, invulnerability frames (1000ms), shield absorption
- Uses `prevGridX` to calculate knockback direction reliably

**Entity Spawner** (`src/services/EntitySpawner.ts`)
- Spawns entities (doors, enemies, items) from Tiled object layers
- Checks `GameState.progression` to skip already-collected items
- Assigns persistent IDs for chest/wall tracking

### Scene Flow

```
BootScene → MainMenuScene → TownScene ↔ TransitionScene ↔ CavernScene
                                ↕                              ↕
                            ShopScene                      (Combat/Enemies)
```

**HUDScene** (`src/scenes/HUDScene.ts`)
- Overlay UI (100px height) launched alongside game scenes
- Displays HP bar, Gold, Almas, Location, Equipment (Sword/Shield/Spell)
- Call `hudScene.refresh()` to update after GameState changes

**Scene Structure Pattern:**
1. Fixed timestep accumulator (`1000/15 = 66.67ms` per tick)
2. `fixedUpdate()` handles input, physics, collision
3. `update()` interpolates visuals with alpha = `accumulator / fixedTimeStep`
4. Player calls `captureState()` before logic, `updateVisuals(alpha)` after

### Key Constraints

- **Resolution:** 640x480 canvas (320x240 logical w/ 2x zoom)
- **Grid:** 8x8 pixels (all positions snap to grid)
- **Timestep:** 15Hz logic updates, interpolated to 60fps visuals
- **Input:** Keyboard only (Arrows, Space = Attack, Up = Enter Door)

## Map Integration (Tiled)

Maps are loaded from `public/assets/maps/*.json` (Tiled format).

**Required Layers:**
- `Terrain` - Tilemap layer with collision (tile ID 1 = wall)
- `Entities` - Object layer for doors/enemies/items

**Object Properties:**
- **Door:** `type: "door"`, properties: `destination`, `targetX`, `targetY`, `triggerType` ("touch" | "press_up"), `nextScene`
- **Enemy:** `type: "enemy"`, properties: `enemyType` (e.g., "slime")
- **Item:** `type: "item"`, properties: `itemType`, `value`, `itemId`, `persistentId`

## Common Patterns

**Adding a New Scene:**
1. Create scene class extending `Phaser.Scene` in `src/scenes/`
2. Implement fixed timestep pattern (see `TownScene` or `CavernScene`)
3. Add to `src/main.ts` scene array
4. Launch HUDScene in `create()`: `this.scene.launch('HUDScene')`
5. Stop HUDScene on transition: `this.scene.stop('HUDScene')`

**Adding a New Enemy:**
1. Extend `Enemy` class (`src/entities/Enemy.ts`)
2. Implement AI in `updateLogic(delta)` (see `Slime.ts` for patrol example)
3. Add spawn case in `EntitySpawner.spawnFromMap()`

**Adding Equipment/Items:**
1. Define in `src/data/items/*.ts` (SWORDS, SHIELDS, CONSUMABLES)
2. Update `GameState` inventory structure in `src/types/SaveData.ts`
3. Use `InventorySystem` for equipping/using items

**Coordinate Conversion:**
- Grid → Pixel: `x = gridX * GRID_SIZE`
- Pixel → Grid: `gridX = Math.floor(x / GRID_SIZE)`
- Player center Y grid: `Math.floor((logicalY + GRID_SIZE/2) / GRID_SIZE)`

## Deployment

- **GitHub Actions** auto-deploys to GitHub Pages on push to `main`
- Build output: `dist/` directory
- `vite.config.ts` uses `base: './'` for relative paths (required for GitHub Pages subdirectories)

## Important Notes

- **Do NOT use Arcade Physics for player movement** - use MovementSystem methods
- Always use `GRID_SIZE` constant (8) for spatial calculations
- Update HUD after GameState changes: `(this.scene.get('HUDScene') as HUDScene).refresh()`
- Doors to TransitionScene require both `destination: "TransitionScene"` AND `nextScene` property
- Camera viewport height must account for HUD: `this.cameras.main.height - HUD_HEIGHT`
