# Notliard (Zeliard Remake) - Project Context

## Project Overview

This project is a browser-based remake of the 1990 DOS game **Zeliard**, developed by Game Arts/Sierra On-Line. It is an Action RPG / Metroidvania Platformer. The remake replicates the original game's mechanics (grid-based movement, combat, economy) using modern web technologies.

**Status:** In Development. Core gameplay (movement, combat, maps, transitions) is implemented.

**Live Demo:** [GitHub Pages](https://jkarenko.github.io/notliard/)

## Technical Architecture

* **Framework:** Phaser 3.90.0
* **Language:** TypeScript 5.x
* **Build Tool:** Vite 5.x
* **Level Editor:** Tiled Map Editor (exporting to Phaser-compatible JSON)
* **Persistence:** `localStorage` for save states (via `GameState` singleton)
* **CI/CD:** GitHub Actions (deploys to GitHub Pages)

## Implemented Features

* **Movement System:** 8px grid-based movement with fixed timestep (15Hz logic / 60Hz visual interpolation). Gravity and jumping physics implemented.
* **Combat System:** Melee attack (Spacebar), hit detection, enemy damage/death, visual feedback (flash/blink), invulnerability frames.
* **Maps:** Tiled map integration (`town_test`, `cavern_test`, `transition_test`) with collision and scrolling.
* **Transitions:** Automated "walking" cutscenes between Town and Cavern.
* **Entities:**
  * **Player:** Grid-aligned, animated, HP/Stats synced with GameState.
  * **Enemies:** Basic Slime AI (patrol), takes damage, drops Almas.
  * **Doors:** Trigger transitions (Press UP or Touch).
* **UI/HUD:** Authentic layout (Gray background, Blue strips) displaying persistent HP, Gold, Almas, and Location.

## Source Structure

```plaintext
src/
├── config/         # GameConfig.ts, Constants.ts
├── data/           # GameState.ts (Persistent data)
├── entities/       # Player.ts, Enemy.ts, Door.ts
│   └── enemies/    # Specific enemy types (Slime.ts)
├── scenes/         # BootScene, MainMenuScene, TownScene, CavernScene, HUDScene, TransitionScene
├── services/       # EntitySpawner.ts (Tiled object spawning)
├── systems/        # MovementSystem.ts (Physics), CombatSystem.ts
├── types/          # Shared interfaces
└── ui/             # (Merged into HUDScene for now)
```

## Getting Started

1. **Install:** `npm install`
2. **Run Dev Server:** `npm run dev` (Open `http://localhost:5173`)
3. **Build:** `npm run build` (Output to `dist/`)

## Key Design Constraints

* **Resolution:** 320x240 logical canvas (scaled 2x zoom in scenes to fill screen).
* **Grid:** 8x8 pixels.
* **Input:** Keyboard (Arrows, Space to Attack, UP to enter doors).
* **Physics:** Custom `MovementSystem` (not Arcade Physics for movement), swept AABB collision.

## Deployment

* **GitHub Actions:** Automatically builds and deploys `dist/` to GitHub Pages on push to `main`.
* **Config:** `vite.config.ts` sets `base: './'` for relative path support.
