# Notliard Tilemap Workflow Design Document

## Overview

Zeliard's caverns are **100% static and hand-designed**. Each room, item placement, enemy spawn, and secret is manually crafted. This document outlines the tilemap workflow using **Tiled Map Editor** with **Phaser 3's native tilemap system**.

**Core Principle:** WYSIWYG editing in Tiled, zero custom parsing - Phaser handles everything.

---

## Level Design Approach

### Static vs. Procedural

**Zeliard is a metroidvania** - level design is critical to gameplay:

- ~30-40 distinct rooms across 8 worlds
- Precise enemy placement
- Hidden items in specific walls
- Boss arenas with deliberate geometry
- Progression gates (keys, doors, items)

**No procedural generation.** Every cavern is hand-crafted.

---

## Tiled Map Editor + Phaser Integration

### Why Tiled + Phaser

**Phaser's tilemap system is built for Tiled:**

- Native JSON format support (no custom parser needed)
- Automatic rendering and culling
- Built-in collision detection
- Object layer support for entities
- WYSIWYG editing experience
- ~1200 lines of code saved vs custom system

**Setup time:** ~10 minutes to export first map

---

## Tiled Editor Workflow

### Setup

1. **Download Tiled** - <https://www.mapeditor.org/>
2. **Create Tileset:**
   - File → New → New Tileset
   - Name: "malicia"
   - Image: malicia.png (8x8 tile size)
   - Set tile properties: Add custom property "collides" (bool) for solid tiles

3. **Create Map:**
   - File → New → New Map
   - Orientation: Orthogonal
   - Tile layer format: CSV or Base64 (uncompressed)
   - Map size: Variable (e.g., 48x16 tiles for 384x128px room)

### Layer Structure

**Tile Layers:**

- **Background** - Parallax, decorative (optional)
- **Terrain** - Solid tiles, platforms, walls
- **Hazards** - Spikes, water, fire, ice

**Object Layer:**

- **Entities** - Enemies, items, doors, NPCs

**Example in Tiled:**

```plaintext
Layers:
  â””â”€ Background (tile layer)
  â””â”€ Terrain (tile layer) â† collision enabled
  â””â”€ Hazards (tile layer)
  â””â”€ Entities (object layer) â† enemies, items, doors
```

### Entity Placement

**Using Tiled's Object Layer:**

1. Select **Entities** object layer
2. Insert → Rectangle (or Point for single-tile entities)
3. Set **Type** field: "enemy", "item", "door", "npc"
4. Add **Custom Properties**:
   - `enemyType`: "bat", "slug", etc.
   - `itemType`: "chest", "key", "potion"
   - `destination`: "malicia-room02"
   - `doorColor`: "red", "blue", etc.

**Example object setup:**

```plaintext
Type: enemy
Properties:
  - enemyType: "bat"
  - almas: 1
  - hp: 5

Type: door
Properties:
  - doorColor: "red"
  - destination: "malicia-vertical-shaft"
  - id: "malicia_door_01"

Type: item
Properties:
  - itemType: "chest"
  - gold: 100
  - id: "malicia_chest_01"
```

### Export

File → Export As → JSON

- Save to `/public/assets/maps/world1/malicia-entrance.json`
- Phaser loads this directly

---

## Phaser Implementation

### Loading Tilemap

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
    
    // Create layers (auto-renders)
    const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
    const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
    const hazardsLayer = map.createLayer('Hazards', tileset, 0, 0);
    
    // Set layer depth for proper z-ordering
    if (backgroundLayer) backgroundLayer.setDepth(0);
    terrainLayer.setDepth(1);
    if (hazardsLayer) hazardsLayer.setDepth(2);
    
    // Setup collision (tiles with 'collides' property set in Tiled)
    terrainLayer.setCollisionByProperty({ collides: true });
    
    // Spawn entities from object layer
    this.spawnEntities(map);
  }
}
```

### Entity Spawning

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

### Collision Detection

```typescript
// Phaser handles this automatically
class CavernScene extends Phaser.Scene {
  create() {
    const map = this.make.tilemap({ key: 'malicia_entrance' });
    const tileset = map.addTilesetImage('malicia', 'malicia_tiles');
    const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
    
    // Set collision on terrain layer
    terrainLayer.setCollisionByProperty({ collides: true });
    
    // Phaser Arcade Physics integration (if using physics bodies)
    this.physics.add.collider(this.player, terrainLayer);
    
    // Custom grid-based collision
    this.checkTileCollision = (gridX: number, gridY: number): boolean => {
      const tile = terrainLayer.getTileAt(gridX, gridY);
      return tile && tile.properties.collides;
    };
  }
}
```

### Rendering

**Phaser handles rendering automatically:**

- Layers render in order of creation
- Camera culling built-in (only visible tiles rendered)
- No custom renderer needed
- Tile animations supported
- Parallax scrolling on background layers

---

## Advantages Over Custom System

**Development Speed:**

- No custom parser (saves ~300 LOC)
- No custom renderer (saves ~500 LOC)
- No autotiling logic needed (saves ~400 LOC)
- **Total savings: ~1200 lines of code**

**Visual Editing:**

- WYSIWYG in Tiled
- Instant preview of final appearance
- Easy copy-paste of room sections
- Minimap view for large levels

**Battle-Tested:**

- Phaser's tilemap system used in thousands of games
- Tiled is industry standard
- Bugs fixed by community
- Documentation extensive

**Performance:**

- Phaser optimized for tile rendering
- Automatic culling and batching
- WebGL acceleration

---

## Towns vs. Caverns

### Same Workflow, Different Layers

**Caverns use:**

- Terrain, Hazards layers (tile layers)
- Entities object layer with: enemies, items, doors

**Towns use:**

- Terrain layer (tile layer) - buildings, roads
- Entities object layer with: npcs, doors (building entrances)

**Tiled handles both seamlessly** - just different object types in the same structure.

---

## File Organization

```plaintext
/public/assets/
  /tilesets/
    malicia.png
    peligro.png
    ...
  /maps/
    /world1/
      malicia-entrance.json          # Tiled export
      malicia-vertical-shaft.json
      malicia-boss-arena.json
    /world2/
      peligro-entrance.json
      ...
    /towns/
      muralla-town.json
      satono-town.json
      ...
```

---

## Tiled Best Practices

### Tile Properties

Set in Tiled tileset editor:

- **collides** (bool) - Solid tile, blocks movement
- **damage** (int) - Hazard damage (spikes, fire)
- **slippery** (bool) - Ice tiles
- **climbable** (bool) - Ropes, ladders

### Object Types

Use consistent **Type** values:

- "enemy" - All enemy objects
- "item" - Chests, pickups, secrets
- "door" - All transitions
- "npc" - Town NPCs (Sage, shopkeeper, etc.)

### Custom Properties Naming

Use camelCase for consistency:

- `enemyType` not `enemy_type`
- `doorColor` not `door_color`
- `itemType` not `item_type`

### Layer Naming

Keep consistent across all maps:

- "Background" (optional)
- "Terrain" (required)
- "Hazards" (caverns only)
- "Entities" (required)

---

## Git Workflow

**Commit both files:**

- `malicia-entrance.tmx` - Tiled native format (editable)
- `malicia-entrance.json` - Export for Phaser (runtime)

**Why both:**

- .tmx for editing in Tiled
- .json for Phaser runtime
- JSON is human-readable for diffs

**Tiled auto-formats JSON** for readability, so git diffs are clean.

---

## Comparison: Custom vs. Tiled

| Aspect | Custom Multi-File | Tiled + Phaser |
|--------|-------------------|----------------|
| Development time | High (parsers, renderers) | Low (use existing) |
| Code to maintain | ~1200 LOC | ~100 LOC |
| Visual editing | Need custom tool | Built-in (Tiled) |
| Preview | Need separate viewer | Instant in Tiled |
| Learning curve | Custom format | Industry standard |
| Debugging | Custom tools | Tiled inspector |
| Performance | Custom optimizations | Phaser optimized |
| Community support | None | Extensive |

---

## Implementation Priorities

### Phase 1: Setup

1. Install Tiled Map Editor
2. Create first tileset (malicia.png)
3. Create first map (malicia-entrance.tmx)
4. Export to JSON
5. Load in Phaser (verify rendering)

### Phase 2: Entity System

1. Add Entities object layer
2. Place test enemy/item objects
3. Write entity spawner
4. Verify spawning in-game

### Phase 3: Collision

1. Set "collides" property on solid tiles
2. Enable collision on terrain layer
3. Test player collision
4. Add custom grid collision helper

### Phase 4: Content

1. Design remaining cavern rooms
2. Place all enemies, items, doors
3. Test progression gates
4. Balance difficulty

---

## Testing Checklist

- [ ] Tiled exports valid JSON
- [ ] Phaser loads tilemap correctly
- [ ] All layers render in correct order
- [ ] Collision detection works
- [ ] Entities spawn at correct positions
- [ ] Object properties parsed correctly
- [ ] Door transitions work
- [ ] Camera follows player with bounds
- [ ] Performance: 60 FPS stable
- [ ] Multiple maps load/unload correctly

---

## Example: Complete Room in Tiled

**File:** `malicia-entrance.tmx`

**Layers:**

1. **Terrain** (tile layer)
   - Paint solid ground tiles
   - Paint platform tiles
   - Set "collides" property on solid tiles

2. **Hazards** (tile layer)
   - Paint spike tiles at bottom
   - Set "damage" property

3. **Entities** (object layer)
   - Place rectangle: Type="enemy", enemyType="bat", x=256, y=0
   - Place rectangle: Type="enemy", enemyType="slug", x=40, y=112
   - Place rectangle: Type="door", doorColor="red", destination="malicia-room02", x=376, y=96
   - Place rectangle: Type="item", itemType="chest", gold=100, id="malicia_chest_01", x=40, y=48

**Export to JSON:**

- File → Export As → malicia-entrance.json

**Result:** Phaser loads and renders automatically with ~10 lines of code.

---

**Document Version:** 3.0  
**Last Updated:** 2025-01-XX  
**Approach:** Tiled Map Editor + Phaser 3 native tilemap system
