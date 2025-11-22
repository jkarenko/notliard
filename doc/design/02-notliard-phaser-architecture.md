# Notliard - Phaser 3.90.0 Project Architecture

## Executive Summary

Browser-based remake of Zeliard (DOS, 1990) using Phaser 3.90.0, TypeScript, and localStorage for persistence. Grid-based movement (8px tiles) with variable game speed (5-30 Hz), optional visual interpolation at 60 Hz rendering.

**Tech Stack:**

- **Framework:** Phaser 3.90.0
- **Language:** TypeScript 5.x
- **Build:** Vite 5.x
- **Level Editor:** Tiled Map Editor (exports to Phaser-compatible JSON)
- **State:** In-memory + localStorage
- **Audio:** Phaser Web Audio API wrapper

**Documentation:** <https://docs.phaser.io/api-documentation/>

---

## Project Structure

```plaintext
notliard/
├── public/                          # Static assets
│   ├── assets/
│   │   ├── sprites/
│   │   │   ├── player.png           # Player spritesheet
│   │   │   ├── enemies.png          # Enemy atlas
│   │   │   ├── bosses/              # Boss sprites (10 files)
│   │   │   └── npcs.png             # Town NPCs
│   │   ├── tilesets/
│   │   │   ├── muralla.png          # Town tilesets
│   │   │   ├── malicia.png          # Cavern tilesets
│   │   │   └── ...                  # 8 worlds
│   │   ├── ui/
│   │   │   ├── hud.png              # HUD elements
│   │   │   ├── inventory.png        # Inventory UI
│   │   │   └── menus.png            # Menu graphics
│   │   ├── audio/
│   │   │   ├── music/               # Background tracks
│   │   │   └── sfx/                 # Sound effects
│   │   ├── maps/                    # Tiled tilemap JSON files
│   │   │   ├── towns/
│   │   │   │   ├── muralla.json
│   │   │   │   ├── satono.json
│   │   │   │   ├── bosque.json
│   │   │   │   └── ...
│   │   │   └── world1/
│   │   │       ├── malicia-entrance.json
│   │   │       ├── malicia-vertical-shaft.json
│   │   │       ├── malicia-boss-arena.json
│   │   │       └── ...
│   │   └── fonts/                   # Bitmap fonts
│   └── index.html
├── src/
│   ├── main.ts                      # Entry point, Phaser config
│   │
│   ├── config/
│   │   ├── GameConfig.ts            # Phaser game configuration
│   │   ├── Constants.ts             # Game constants (GRID_SIZE, speeds, etc)
│   │   └── KeyBindings.ts           # Input mappings
│   │
│   ├── scenes/                      # Phaser scenes
│   │   ├── BootScene.ts             # Asset preloading
│   │   ├── MainMenuScene.ts         # Title screen, save selection
│   │   ├── TownScene.ts             # Town exploration base
│   │   ├── CavernScene.ts           # Dungeon exploration base
│   │   ├── BossScene.ts             # Boss fight arena
│   │   ├── InventoryScene.ts        # Overlay scene for inventory/menu
│   │   └── GameOverScene.ts         # Death/victory screens
│   │
│   ├── entities/                    # Game objects
│   │   ├── Player.ts                # Player character
│   │   ├── Enemy.ts                 # Base enemy class
│   │   ├── enemies/                 # Specific enemy types
│   │   │   ├── Bat.ts
│   │   │   ├── Slug.ts
│   │   │   └── ...
│   │   ├── Boss.ts                  # Base boss class
│   │   ├── bosses/                  # Specific bosses
│   │   │   ├── Cangrejo.ts
│   │   │   ├── Pulpo.ts
│   │   │   └── ...
│   │   ├── NPC.ts                   # Town NPCs
│   │   ├── Item.ts                  # Pickups, chests
│   │   └── Door.ts                  # Room transitions
│   │
│   ├── systems/                     # Core game systems
│   │   ├── MovementSystem.ts        # Grid-based movement logic
│   │   ├── CollisionSystem.ts       # Tile + entity collisions
│   │   ├── CombatSystem.ts          # Sword attacks, damage
│   │   ├── SpellSystem.ts           # 7 spell implementations
│   │   ├── InventorySystem.ts       # Item management
│   │   ├── ProgressionSystem.ts     # Sage upgrades, flags
│   │   ├── EconomySystem.ts         # Gold, Almas, exchange rates
│   │   ├── SaveSystem.ts            # localStorage persistence
│   │   └── AudioManager.ts          # Music/SFX playback
│   │
│   ├── services/                    # Stateless utilities
│   │   ├── TilemapHelper.ts         # Tilemap utility functions
│   │   ├── AnimationFactory.ts      # Sprite animation setup
│   │   └── InputBuffer.ts           # Input buffering, coyote time
│   │
│   ├── data/                        # Game data definitions
│   │   ├── items/
│   │   │   ├── Swords.ts            # Sword stats
│   │   │   ├── Shields.ts           # Shield stats
│   │   │   ├── Spells.ts            # Spell definitions
│   │   │   ├── Consumables.ts       # Potions, etc
│   │   │   └── SpecialItems.ts      # Shoes, crests, keys
│   │   ├── enemies/
│   │   │   └── EnemyData.ts         # Enemy stats by type
│   │   ├── bosses/
│   │   │   └── BossData.ts          # Boss stats + patterns
│   │   ├── towns/
│   │   │   ├── TownData.ts          # Shop inventories, prices
│   │   │   └── SageData.ts          # Sage upgrade thresholds
│   │   └── progression/
│   │       └── GameFlags.ts         # Progression gate definitions
│   │
│   ├── ui/                          # UI components
│   │   ├── HUD.ts                   # Health, shield, gold, almas
│   │   ├── InventoryUI.ts           # Equipment/item management
│   │   ├── DialogueBox.ts           # NPC conversations
│   │   ├── ShopUI.ts                # Buy/sell interfaces
│   │   ├── SageUI.ts                # Upgrade/save interface
│   │   └── SettingsUI.ts            # Game speed, audio controls
│   │
│   ├── types/                       # TypeScript definitions
│   │   ├── SaveData.ts              # Save file schema
│   │   ├── GameState.ts             # Runtime state types
│   │   ├── Entities.ts              # Entity interfaces
│   │   └── Map.ts                   # Tilemap types
│   │
│   └── utils/                       # Helper functions
│       ├── MathUtils.ts             # Grid calculations
│       ├── ArrayUtils.ts            # Collection helpers
│       └── StorageUtils.ts          # localStorage wrappers
│
├── tests/                           # Unit tests (optional)
│   └── ...
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Dependencies

### package.json

```json
{
  "name": "notliard",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "dependencies": {
    "phaser": "^3.90.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "prettier": "^3.1.0"
  }
}
```

**Total Bundle Size (estimated):**

- Phaser: ~900 KB (minified + gzip)
- Game code: ~120 KB (minified + gzip, less without custom tilemap code)
- Assets: ~10-15 MB
- **Total: ~11-16 MB**

---

## Core Control Flows

### 1. Game Initialization

```plaintext
Browser loads index.html
    ↓
main.ts creates Phaser.Game instance
    ↓
GameConfig sets up:
    - Canvas: 640x480 (scaled to fit browser)
    - Physics: Arcade (disabled, custom grid collision)
    - Scenes: [BootScene, MainMenuScene, ...]
    ↓
BootScene.preload()
    → Load core assets (player, UI, common enemies)
    → Show progress bar
    ↓
BootScene.create()
    → Initialize global managers (AudioManager, SaveSystem)
    → Transition to MainMenuScene
```

### 2. Scene Lifecycle (Phaser Pattern)

```plaintext
Scene.init(data)         # Receive data from previous scene
    ↓
Scene.preload()          # Load scene-specific assets (if needed)
    ↓
Scene.create()           # Setup game objects, systems
    → Load tilemap (Phaser.Tilemaps.Tilemap)
    → Create tile layers
    → Spawn entities from object layers
    → Setup collision handlers (CollisionSystem)
    → Initialize UI (HUD, DialogueBox)
    ↓
Scene.update(time, delta)  # Game loop (5-30 Hz logic, 60 Hz render)
    → Process input (InputBuffer)
    → Update entities (MovementSystem, AI)
    → Check collisions (CollisionSystem)
    → Update camera (follow player)
    → Render interpolation (optional visual smoothing)
    ↓
Scene transitions via:
    - this.scene.start('NextScene', { data })
    - this.scene.pause('CurrentScene')
    - this.scene.resume('PausedScene')
```

### 3. Fixed Timestep Game Loop

Phaser's built-in timestep is **variable** (delta-based). We need **fixed timestep** for grid movement.

```typescript
// In CavernScene/TownScene

class CavernScene extends Phaser.Scene {
  private gameSpeedHz: number = 15; // Player-adjustable (5-30 Hz)
  private accumulator: number = 0;
  private lastTime: number = 0;

  update(time: number, delta: number): void {
    // Accumulate time for fixed updates
    this.accumulator += delta;
    const fixedDelta = 1000 / this.gameSpeedHz;

    // Run fixed updates at game speed
    while (this.accumulator >= fixedDelta) {
      this.fixedUpdate(fixedDelta);
      this.accumulator -= fixedDelta;
    }

    // Calculate interpolation factor for visual smoothing
    const alpha = this.accumulator / fixedDelta;
    this.render(alpha);
  }

  private fixedUpdate(delta: number): void {
    // Grid-based logic updates here
    this.movementSystem.update(delta);
    this.collisionSystem.update();
    this.combatSystem.update(delta);
    this.enemyAI.update(delta);
  }

  private render(alpha: number): void {
    // Visual interpolation (if enabled)
    this.entities.forEach(entity => {
      if (this.settings.visualSmoothing) {
        entity.renderPosition = lerp(
          entity.previousPosition,
          entity.currentPosition,
          alpha
        );
      } else {
        entity.renderPosition = entity.currentPosition;
      }
    });
  }
}
```

### 4. Player Movement (Grid-Based)

```plaintext
User presses arrow key
    ↓
InputBuffer captures input (60 Hz)
    ↓
fixedUpdate() processes input (5-30 Hz)
    ↓
MovementSystem.movePlayer(direction)
    → Check if can move (collision check)
    → If valid: player.gridX += direction.x
    → Update logical position: x = gridX * GRID_SIZE (8px)
    ↓
render(alpha) interpolates visual position (60 Hz)
    → visualX = lerp(prevX, currentX, alpha) [if smoothing enabled]
    → player.sprite.x = visualX
```

**Key Points:**

- Logical position: Integer grid cells (e.g., gridX: 5, gridY: 10)
- Physical position: `gridX * 8` pixels
- Visual position: Interpolated between updates (optional)

### 5. Collision Detection

```plaintext
Player attempts to move to (newGridX, newGridY)
    ↓
CollisionSystem.checkTileCollision(newGridX, newGridY)
    → Read tilemap data at grid position
    → If tile is solid ('#'): return blocked
    → If tile is hazard ('^', '~'): apply damage
    → Otherwise: return clear
    ↓
If clear:
    CollisionSystem.checkEntityCollision(newGridX, newGridY)
        → Check all enemies/items at same grid cell
        → If enemy: CombatSystem.handleCollision()
        → If item: InventorySystem.collectItem()
        → If door: TransitionSystem.changeRoom()
```

### 6. Combat System

```plaintext
Player presses attack key
    ↓
CombatSystem.attack()
    → Check cooldown (no spam)
    → Determine attack direction (8-way)
    → Create hitbox at (gridX + dirX, gridY + dirY)
    ↓
CombatSystem.checkHit()
    → Query all enemies in hitbox grid cell
    → For each enemy:
        → Calculate damage (sword + sage level)
        → enemy.hp -= damage
        → If hp <= 0: enemy.die() → drop Almas
    ↓
Play attack animation + SFX
```

### 7. Spell System

```plaintext
Player presses spell key (ALT)
    ↓
SpellSystem.cast(activeSpell)
    → Check spell charges > 0
    → Spawn spell entity based on type:
        - Espada: Short-range projectile
        - Saeta: Long-range arrow
        - Fuego: Area damage zone
        - Lanzar: Fire projectile
        - Rascar: Falling rocks from top
        - Agua: Arcing water shot
        - Guerra: Full screen damage
    ↓
Spell.update()
    → Move spell entity (if projectile)
    → Check collision with enemies
    → Apply damage on hit
    → Destroy after duration/collision
```

### 8. NPC Interaction (Towns)

```plaintext
Player walks into NPC grid cell
    ↓
CollisionSystem detects overlap
    ↓
DialogueBox.show(npc.dialogue)
    → Pause player movement
    → Display text + choices
    ↓
User selects option:
    → "Talk" → Show flavor text
    → "Shop" → Open ShopUI (buy/sell)
    → "Upgrade" → Open SageUI (level up)
    → "Save" → SaveSystem.save()
    → "Rest" → Restore HP (cost gold)
    ↓
Close dialogue → Resume player control
```

### 9. Sage Upgrade System

```plaintext
Player talks to Sage
    ↓
SageUI.show()
    → Display current Almas
    → Display next threshold
    ↓
ProgressionSystem.canUpgrade()
    → Check: almas >= nextThreshold
    → Check: sage has upgrades remaining
    ↓
If can upgrade:
    User clicks "Level Up"
        ↓
    ProgressionSystem.applyUpgrade()
        → Increase max HP
        → Increase spell capacity
        → Increase sword damage
        → totalUpgrades++
        → nextThreshold = 150 * 2^totalUpgrades
        ↓
    SageUI.playAnimation("power up")
        ↓
    SaveSystem.autoSave() [optional]
```

### 10. Death & Respawn

```plaintext
Player HP reaches 0
    ↓
SaveSystem.save() [pre-death state]
    ↓
EconomySystem.applyDeathPenalty()
    → gold = 0
    → almas = floor(almas / 2)
    ↓
SaveSystem.save() [post-penalty state]
    ↓
this.scene.start('GameOverScene', {
    checkpoint: lastSageLocation,
    gold: 0,
    almas: penalizedAlmas
})
    ↓
GameOverScene.create()
    → Show death message
    → "Press key to continue"
    ↓
User presses key
    ↓
Load checkpoint scene (town with last Sage)
    → Player spawns at Sage location
    → HP/shield restored to max
    → Gold = 0, Almas = penalized value
    → All cleared content persists (bosses dead, doors open)
```

### 11. Room Transitions

```plaintext
Player walks into door grid cell
    ↓
CollisionSystem detects door overlap
    ↓
TransitionSystem.changeRoom(door.destination)
    ↓
this.scene.start('CavernScene', {
    roomId: door.destination,
    entryPoint: door.exitPosition
})
    ↓
New CavernScene.create()
    → Load tilemap from Tiled JSON
    → Create tile layers
    → Spawn player at entry point
    → Spawn entities from object layer (filter killed enemies)
    → Apply progression flags (open doors, collected items)
```

### 12. Save System Flow

```plaintext
User talks to Sage → selects "Save"
    ↓
SaveSystem.save(slotId)
    ↓
Collect game state:
    → Character stats (HP, gold, almas)
    → Inventory (equipment, items, spells)
    → Progression flags (bosses, doors, chests)
    → Current location (sageId)
    ↓
Serialize to JSON:
    const saveData: SaveData = {
        version: 1,
        timestamp: Date.now(),
        checkpoint: { sageId: currentSage },
        character: { ... },
        progression: { ... }
    }
    ↓
Write to localStorage:
    localStorage.setItem(`notliard_save_${slotId}`, JSON.stringify(saveData))
    ↓
Show confirmation: "Game Saved"
```

**Load Flow:**

```plaintext
User selects "Load Game" from main menu
    ↓
SaveSystem.load(slotId)
    ↓
Read from localStorage:
    const json = localStorage.getItem(`notliard_save_${slotId}`)
    const saveData: SaveData = JSON.parse(json)
    ↓
Validate & migrate:
    if (saveData.version < CURRENT_VERSION)
        saveData = migrateSave(saveData)
    ↓
Restore game state:
    GameState.character = saveData.character
    GameState.progression = saveData.progression
    ↓
Load checkpoint scene:
    this.scene.start('TownScene', {
        townId: saveData.checkpoint.sageId,
        loadedFromSave: true
    })
```

---

## Phaser-Specific Patterns

### Scene Communication

```typescript
// Pass data between scenes
this.scene.start('BossScene', {
  bossId: 'cangrejo',
  playerStats: this.player.stats
});

// In BossScene.init()
init(data: { bossId: string; playerStats: PlayerStats }) {
  this.bossId = data.bossId;
  this.playerStats = data.playerStats;
}
```

### Asset Management

```typescript
// BootScene preloads core assets
class BootScene extends Phaser.Scene {
  preload() {
    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    
    this.load.atlas('enemies', 
      'assets/sprites/enemies.png',
      'assets/sprites/enemies.json'
    );
    
    this.load.audio('sword_swing', 'assets/audio/sfx/sword.mp3');
    this.load.audio('muralla_theme', 'assets/audio/music/muralla.mp3');
  }

  create() {
    // Assets ready, transition to menu
    this.scene.start('MainMenuScene');
  }
}
```

### Tilemap Integration (Phaser Built-in)

Phaser's tilemap system handles Tiled JSON format natively:

```typescript
class CavernScene extends Phaser.Scene {
  preload() {
    // Load tileset image
    this.load.image('malicia_tiles', 'assets/tilesets/malicia.png');
    
    // Load Tiled JSON
    this.load.tilemapTiledJSON('malicia_entrance', 'assets/maps/world1/malicia-entrance.json');
  }

  create() {
    // Create tilemap from Tiled data
    const map = this.make.tilemap({ key: 'malicia_entrance' });
    const tileset = map.addTilesetImage('malicia', 'malicia_tiles');
    
    // Create layers
    const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
    const hazardsLayer = map.createLayer('Hazards', tileset, 0, 0);
    
    // Setup collision (tiles with 'collides' property set in Tiled)
    terrainLayer.setCollisionByProperty({ collides: true });
    
    // Spawn entities from object layer
    const objectsLayer = map.getObjectLayer('Entities');
    objectsLayer.objects.forEach(obj => {
      if (obj.type === 'enemy') {
        this.spawnEnemy(obj.x, obj.y, obj.properties);
      } else if (obj.type === 'item') {
        this.spawnItem(obj.x, obj.y, obj.properties);
      }
    });
  }
}
```

### Tilemap Rendering (Phaser Built-in)

Phaser handles rendering automatically when layers are created:

```typescript
class CavernScene extends Phaser.Scene {
  create() {
    const map = this.make.tilemap({ key: 'malicia_entrance' });
    const tileset = map.addTilesetImage('malicia', 'malicia_tiles');
    
    // Layers render automatically in order of creation
    const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
    const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
    const hazardsLayer = map.createLayer('Hazards', tileset, 0, 0);
    
    // Set layer depth for proper z-ordering
    backgroundLayer.setDepth(0);
    terrainLayer.setDepth(1);
    hazardsLayer.setDepth(2);
    
    // Camera culling automatic
    // Only visible tiles are rendered
  }
}
```

**Collision Detection:**

```typescript
// Setup collision on terrain layer
terrainLayer.setCollisionByProperty({ collides: true });

// Phaser Arcade Physics integration (if using physics bodies)
this.physics.add.collider(player, terrainLayer);

// Custom grid-based collision
checkTileCollision(gridX: number, gridY: number): boolean {
  const tile = terrainLayer.getTileAt(gridX, gridY);
  return tile && tile.properties.collides;
}
```

### Entity Spawning from Tiled Object Layers

```typescript
class EntitySpawner {
  spawnFromTilemap(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap): void {
    // Get object layer from Tiled
    const entitiesLayer = map.getObjectLayer('Entities');
    
    if (!entitiesLayer) return;
    
    entitiesLayer.objects.forEach(obj => {
      // Objects have type, name, x, y, and custom properties
      switch (obj.type) {
        case 'enemy':
          const enemyType = obj.properties.find(p => p.name === 'enemyType')?.value;
          const enemy = new Enemy(scene, obj.x, obj.y, enemyType);
          scene.add.existing(enemy);
          break;
          
        case 'item':
          const itemType = obj.properties.find(p => p.name === 'itemType')?.value;
          const item = new Item(scene, obj.x, obj.y, itemType);
          scene.add.existing(item);
          break;
          
        case 'npc':
          const npcName = obj.properties.find(p => p.name === 'npcName')?.value;
          const npc = new NPC(scene, obj.x, obj.y, npcName);
          scene.add.existing(npc);
          break;
          
        case 'door':
          const destination = obj.properties.find(p => p.name === 'destination')?.value;
          const door = new Door(scene, obj.x, obj.y, destination);
          scene.add.existing(door);
          break;
      }
    });
  }
}
```

**Tiled Setup:**

- Create object layer named "Entities"
- Place objects with Insert Object tool
- Set object "Type" field (enemy, item, npc, door)
- Add custom properties (enemyType, itemType, destination, etc.)
- Objects export to JSON with all properties

### Camera Setup

```typescript
class CavernScene extends Phaser.Scene {
  create() {
    // Get map dimensions from tilemap
    const map = this.make.tilemap({ key: 'malicia_entrance' });
    const roomWidth = map.widthInPixels;
    const roomHeight = map.heightInPixels;
    
    this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
    
    // Follow player with grid alignment
    this.cameras.main.startFollow(this.player.sprite, true);
    
    // Smooth camera (optional)
    this.cameras.main.setLerp(0.1, 0.1);
  }
}
```

### Tiled Editor Workflow

**Setup:**

1. Download Tiled (<https://www.mapeditor.org/>)
2. Create tileset: File → New → New Tileset
   - Name: "malicia"
   - Image: malicia.png (8x8 tile size)
   - Set tile properties: Add custom property "collides" (bool) for solid tiles
3. Create map: File → New → New Map
   - Orientation: Orthogonal
   - Tile layer format: CSV or Base64 (uncompressed)
   - Map size: Variable (e.g., 48x16 tiles for 384x128px room)

**Layer Structure:**

- **Tile Layers:**
  - Background (parallax, decorative)
  - Terrain (solid tiles, platforms)
  - Hazards (spikes, water, fire)
- **Object Layer:**
  - Entities (enemies, items, doors, NPCs)

**Entity Setup:**

- Select object layer
- Insert → Rectangle (or Point for single-tile entities)
- Set Type: "enemy", "item", "npc", "door"
- Add custom properties:
  - enemyType: "bat", "slug", etc.
  - itemType: "chest", "key", "potion"
  - destination: "malicia-vertical-shaft"
  - npcName: "marid", "weapon_shop"

**Export:**

- File → Export As → JSON
- Save to `/public/assets/maps/world1/malicia-entrance.json`
- Phaser loads via `this.load.tilemapTiledJSON()`

**Git Workflow:**

- JSON diffs show layer changes clearly
- Commit both .tmx (Tiled native) and .json (export) for editability
- Tiled auto-formats JSON for readability

### Input Handling

```typescript
class InputBuffer {
  private keys: Map<string, Phaser.Input.Keyboard.Key>;
  private buffer: { key: string; time: number }[] = [];
  
  constructor(scene: Phaser.Scene) {
    this.keys = new Map([
      ['left', scene.input.keyboard.addKey('LEFT')],
      ['right', scene.input.keyboard.addKey('RIGHT')],
      ['up', scene.input.keyboard.addKey('UP')],
      ['attack', scene.input.keyboard.addKey('SPACE')],
      ['spell', scene.input.keyboard.addKey('ALT')]
    ]);
  }

  update(time: number): void {
    // Buffer inputs for 100ms window
    this.keys.forEach((key, name) => {
      if (Phaser.Input.Keyboard.JustDown(key)) {
        this.buffer.push({ key: name, time });
      }
    });

    // Clean old inputs
    this.buffer = this.buffer.filter(input => time - input.time < 100);
  }

  consumeInput(key: string): boolean {
    const index = this.buffer.findIndex(input => input.key === key);
    if (index !== -1) {
      this.buffer.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

---

## Key Architectural Decisions

### 1. Custom Grid Physics (No Phaser Arcade Physics)

**Rationale:** Zeliard's movement is discrete 8px steps, not continuous physics.

**Implementation:**

- Player position stored as `(gridX, gridY)` integers
- Movement: `gridX += 1` per game update
- Collision: Check tile at `(newGridX, newGridY)` before moving
- Rendering: Convert to pixels `x = gridX * GRID_SIZE`

### 2. Fixed Timestep with Variable Game Speed

**Rationale:** Consistent gameplay across devices, adjustable speed for accessibility.

**Implementation:**

- Accumulator pattern for fixed updates (5-30 Hz)
- Rendering at fixed 60 Hz
- Interpolation for visual smoothness (optional)

### 3. Phaser Tilemap System with Tiled Editor

**Rationale:** Leverage battle-tested infrastructure, WYSIWYG editing, automatic collision.

**Implementation:**

- Tiled editor for level design (free, open source)
- Export to JSON format (Phaser-compatible)
- Layers: terrain, hazards, entities (object layer)
- Collision properties set in Tiled
- ~1200 LOC saved vs custom parser/renderer

### 4. In-Memory State + localStorage Persistence

**Rationale:** Fast runtime, persistent across sessions.

**Implementation:**

- All game state in `GameState` singleton
- Save/load serializes to/from localStorage
- No backend required

### 5. Scene-Based Architecture

**Rationale:** Phaser's strength, clean separation of concerns.

**Implementation:**

- TownScene for exploration
- CavernScene for dungeons
- BossScene for boss fights
- InventoryScene as overlay
- Clean transitions with data passing

---

## Performance Considerations

### Asset Loading Strategy

**Initial Load (BootScene):**

- Player sprites
- Common enemies (bats, rats, slugs)
- UI elements
- SFX (essential)
- First town/cavern tilesets

**Lazy Load Per Scene:**

- Boss sprites (when entering boss scene)
- World-specific tilesets
- Music tracks (per area)

**Estimated Load Times:**

- Initial: 10-15 seconds (10 MB)
- Per scene: 2-3 seconds (1-2 MB)

### Memory Management

**Phaser Texture Management:**

- Unload unused tilesets when leaving world
- Boss sprites destroyed after defeat
- Reuse common sprite atlases

**Entity Pooling:**

- Reuse enemy/projectile objects
- Phaser's `Group` with `maxSize` for pools

### Rendering Optimization

**Tile Culling:**

- Phaser camera culls off-screen tiles automatically
- Only render visible grid cells

**Sprite Batching:**

- Use sprite atlases (all enemies in one texture)
- Reduces draw calls

**Target Performance:**

- 60 FPS rendering on modern browsers
- 15 Hz game logic (default)
- < 100 MB memory usage

---

## Development Workflow

### Hot Reload (Vite)

```bash
npm run dev
# Vite dev server on http://localhost:5173
# Hot module replacement for TypeScript changes
# Asset changes reload automatically
```

### Build for Production

```bash
npm run build
# Output to dist/
# Minified bundle ~1-2 MB (game code + Phaser)
# Assets copied to dist/assets/
```

### Testing Strategy

1. **Unit Tests** - Core systems (CollisionSystem, EconomySystem)
2. **Integration Tests** - Scene transitions, save/load
3. **Manual Testing** - Gameplay feel, progression gates
4. **Performance Tests** - FPS monitoring, memory profiling

---

## Next Steps

### Phase 1: Foundation (2-3 weeks)

- [ ] Project setup (Vite + TypeScript + Phaser)
- [ ] BootScene with asset loading
- [ ] Basic scene architecture (Town, Cavern)
- [ ] Grid movement system
- [ ] Tiled editor setup + export workflow
- [ ] Tilemap rendering (Phaser built-in)
- [ ] Player sprite + animations

### Phase 2: Core Mechanics (3-4 weeks)

- [ ] Collision detection (tiles + entities)
- [ ] Combat system (sword attacks)
- [ ] Enemy AI (basic patterns)
- [ ] Inventory system
- [ ] HUD display
- [ ] First town + cavern (Muralla/Malicia)

### Phase 3: Systems (2-3 weeks)

- [ ] Spell system (7 spells)
- [ ] Save/load (localStorage)
- [ ] Economy (gold, Almas, shops)
- [ ] Progression (Sage upgrades)
- [ ] Death penalty + respawn

### Phase 4: Content (4-6 weeks)

- [ ] 10 towns + interiors
- [ ] 30+ cavern rooms
- [ ] 10 bosses with unique patterns
- [ ] 50+ enemy placements
- [ ] All items, spells, equipment

### Phase 5: Polish (2-3 weeks)

- [ ] Audio (music + SFX)
- [ ] Visual effects (particles, screen shake)
- [ ] UI refinement
- [ ] Balance tuning
- [ ] Playtesting + bug fixes

---

## Migration Path (If Switching to Bespoke Later)

**Decoupling Points:**

- `MovementSystem` - Pure logic, no Phaser dependency
- `CollisionSystem` - Grid-based logic (can read from any tile data structure)
- `SaveSystem` - Operates on plain objects
- Tiled JSON → Can export/convert to custom format

**Phaser-Dependent:**

- Tilemap rendering (Phaser.Tilemaps.Tilemap)
- Tile layer creation and collision setup
- Scenes (would need custom scene manager)
- Sprite rendering (would need canvas/WebGL wrapper)
- Input handling (would need event listeners)
- Audio (would need Web Audio API wrapper)

**Migration Strategy:**

1. Export Tiled JSON to custom format (~1 day)
2. Build custom tilemap renderer (~3-4 days)
3. Replace Phaser scene system (~1 week)
4. Replace sprite/audio systems (~1-2 weeks)

**Effort to Migrate:** ~3-4 weeks (core engine replacement)

**Note:** Using Phaser tilemaps adds minimal coupling compared to custom system. Tiled data is portable - worst case is writing a JSON→custom format converter.

---

**Document Version:** 1.0  
**Framework:** Phaser 3.90.0  
**Language:** TypeScript 5.x  
**Build Tool:** Vite 5.x  
**Target:** Modern browsers (Chrome, Firefox, Safari, Edge)
