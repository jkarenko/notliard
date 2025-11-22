# Notliard (Zeliard Remake) - Project Context

## Project Overview

This project is a browser-based remake of the 1990 DOS game **Zeliard**, developed by Game Arts/Sierra On-Line. It is an Action RPG / Metroidvania Platformer. The remake aims to replicate the original game's mechanics (grid-based movement, combat, economy) while utilizing modern web technologies.

**Status:** Design Phase / Initial Setup. (Source code not yet initialized).

## Technical Architecture

* **Framework:** Phaser 3.90.0
* **Language:** TypeScript 5.x
* **Build Tool:** Vite 5.x
* **Level Editor:** Tiled Map Editor (exporting to Phaser-compatible JSON)
* **Persistence:** `localStorage` for save states (.USR file simulation)
* **Audio:** Phaser Web Audio API wrapper

## Directory Structure

The project is currently in the design phase. The following documentation is available in `doc/design/`:

* `01-notliard-design-document.md`: High-level game design, mechanics, story, and data structures.
* `02-notliard-phaser-architecture.md`: Detailed technical architecture, file structure, class hierarchy, and implementation plan.
* `03-notliard-asset-loading-strategy.md`: Strategy for managing and loading game assets.

## Planned Source Structure

The source code will likely follow this structure once initialized (based on `02-notliard-phaser-architecture.md`):

```plaintext
src/
├── config/         # Game configuration and constants
├── scenes/         # Phaser scenes (Boot, Menu, Town, Cavern, Boss)
├── entities/       # Game objects (Player, Enemy, NPC, Item)
├── systems/        # Core logic (Movement, Collision, Combat, Economy)
├── services/       # Stateless utilities (Tilemap, Animation)
├── data/           # Game data (Stats, Shops, Progression)
└── ui/             # UI Components (HUD, Inventory, Dialogue)
```

## Development Roadmap

**Phase 1: Foundation**

* Project setup (Vite + TypeScript + Phaser)
* Basic scene architecture
* Grid-based movement system implementation
* Tiled map integration

**Phase 2: Core Mechanics**

* Collision detection (Tile & Entity)
* Combat system
* Enemy AI foundation
* Inventory system

**Phase 3: Systems**

* Spell system
* Save/Load (localStorage)
* Economy (Shops, Banking)
* Progression (Sage upgrades)

## Getting Started (Planned)

Once the project is initialized, the standard workflow will be:

1. `npm install` - Install dependencies
2. `npm run dev` - Start local development server via Vite
3. `npm run build` - Build for production

## Key Design Constraints

* **Movement:** Grid-based (8px tiles), fixed timestep updates (5-30 Hz), optional visual interpolation at 60 Hz.
* **Resolution:** 640x480 logical canvas (scaled).
* **Input:** Keyboard (Arrows, Space, Alt, Enter).
