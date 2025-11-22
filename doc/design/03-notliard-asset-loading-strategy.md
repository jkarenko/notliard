# Notliard Asset Loading Strategy

## TL;DR

For a faithful DOS remake with pixel art and chiptunes: **load everything upfront except music**. Total asset size (~10-15MB) doesn't justify complex lazy loading infrastructure.

---

## Asset Size Analysis

### Core Game Assets (Eager Load)

| Asset Type | Estimated Size | Notes |
|------------|---------------|-------|
| Tilesets (8 worlds) | ~4MB | 16x16 tiles, limited palette |
| Sprites/Enemies | ~3MB | Small sprites, few frames |
| Boss sprites | ~1MB | 10 bosses, larger but static |
| UI/HUD elements | ~500KB | Inventory, menus, icons |
| Sound effects | ~500KB | Short, compressed |
| **Subtotal** | **~9MB** | Loads in 10-20 seconds |

### Music (Selective Lazy Load)

| Music Type | Size | Strategy |
|------------|------|----------|
| Chiptune/8-bit | ~2MB total | Preload all |
| High-quality tracker (MOD/XM) | ~5MB total | Preload all |
| Orchestral/MIDI rendered | ~20-40MB | **Lazy load per area** |

**Decision point:** If total music < 5MB, preload. If > 10MB, lazy load.

---

## Recommended Loading Strategy

### Phase 1: Initial Preload (Required)

```typescript
const PRELOAD_ASSETS = {
  core: [
    'player_spritesheet',
    'ui_atlas',
    'hud_elements',
    'common_enemies', // Bats, rats appear in multiple worlds
    'sfx_atlas'
  ],
  
  world1: [
    'muralla_tileset',
    'muralla_npcs',
    'malicia_tileset',
    'malicia_enemies',
    'boss_cangrejo'
  ],
  
  audio: [
    'sfx_sword',
    'sfx_damage',
    'sfx_pickup',
    // Music loaded separately (see Phase 2)
  ]
};
```

**Load time:** 10-20 seconds on average connection

### Phase 2: Music (Conditional Lazy Load)

**If music files < 5MB total:**

```typescript
// Preload all music with core assets
PRELOAD_ASSETS.audio.push(
  'music_muralla',
  'music_malicia',
  // ... all tracks
);
```

**If music files > 10MB total:**

```typescript
// Lazy load per area, cache last 2 tracks
class AudioManager {
  private cache: Map<string, AudioBuffer> = new Map();
  private maxCached = 2;
  
  async loadTrack(trackId: string): Promise<void> {
    if (this.cache.has(trackId)) return;
    
    // Load track
    const audio = await this.scene.load.audio(trackId);
    
    // Evict oldest if cache full
    if (this.cache.size >= this.maxCached) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
    
    this.cache.set(trackId, audio);
  }
}
```

### Phase 3: Progressive World Loading (Optional)

**Only if expanding beyond DOS scope:**

If adding high-res backgrounds (5MB+ per world):

```typescript
// Load next world in background while player progresses
class WorldPreloader {
  preloadNextWorld(currentWorld: number): void {
    const nextWorld = currentWorld + 1;
    if (nextWorld > 8) return;
    
    // Load in background, low priority
    this.scene.load.image(`world${nextWorld}_bg_hires`, url);
    this.scene.load.start();
  }
}
```

---

## Implementation Guidelines

### Phaser Scene Structure

**Single preload scene:**

```typescript
class BootScene extends Phaser.Scene {
  preload() {
    // Load ALL core assets here
    this.load.atlas('sprites', 'sprites.png', 'sprites.json');
    this.load.image('tilesets', 'tilesets.png');
    
    // Music: conditional
    if (MUSIC_SIZE_MB < 5) {
      this.loadAllMusic();
    }
    
    this.load.on('progress', (value) => {
      this.updateProgressBar(value);
    });
  }
  
  create() {
    this.scene.start('MainMenu');
  }
}
```

**Per-scene loading only for music:**

```typescript
class MurallaScene extends Phaser.Scene {
  async create() {
    // Load music if not cached
    if (MUSIC_SIZE_MB >= 10) {
      await AudioManager.loadTrack('muralla_theme');
    }
    
    // Everything else already loaded
    this.setupTown();
  }
}
```

---

## When to Expand Lazy Loading

**Add lazy loading for these scenarios:**

1. **High-res artwork** - If background images exceed 5MB per world
2. **Voice acting** - Multiple MB per dialogue line
3. **Cutscenes** - Video files (10MB+ each)
4. **Orchestral audio** - Full recordings (3-5MB per track)
5. **Mobile targeting** - 2G/3G connection considerations

**Don't add lazy loading for:**

- Tilesets (already tiny)
- Sprite sheets (compressed well)
- Sound effects (KB-sized)
- UI elements (needed everywhere)

---

## Loading Screen UX

**Single preload (recommended):**

```plaintext
Loading Notliard...
[████████████████████████] 100%

Estimated time: 15–20 seconds
```

**With lazy music:**

```plaintext
Loading Notliard...
[████████████████████████] 100%
(Music loads per area)

Initial load: 10-15 seconds
Per-area: 2-3 seconds fade-in
```

**Fake progress optimization:**

```typescript
// Make progress feel faster
updateProgressBar(value: number) {
  // Ease curve: fast to 80%, slow to 100%
  const eased = value < 0.8 
    ? value * 1.2 
    : 0.96 + (value - 0.8) * 0.2;
  
  this.progressBar.setProgress(eased);
}
```

---

## Memory Management

**Browser limits:** ~100-200MB for web games before performance degrades

**Notliard footprint:**

- Assets: 10-15MB
- Phaser runtime: ~5MB
- Scene graphs: ~5MB
- Audio buffers: 2-5MB (if preloaded)
- **Total: ~25-30MB**

**Conclusion:** No memory pressure. Lazy loading won't help.

---

## Decision Matrix

| Scenario | Strategy | Reason |
|----------|----------|--------|
| Faithful DOS remake | Preload everything | Total < 15MB |
| Chiptune/tracker music | Preload all | < 5MB total |
| Orchestral soundtrack | Lazy load music | 20-40MB total |
| Pixel art only | Preload everything | Tiny file sizes |
| HD backgrounds added | Lazy load backgrounds | 5MB+ per world |
| Voice acting added | Lazy load dialogue | Large per-line size |
| Mobile web target | Consider lazy music | Connection quality |
| Desktop/itch.io only | Preload everything | Fast connections |

---

## Recommended Implementation

**For initial release:**

1. Single preload scene
2. Load all assets upfront
3. Simple progress bar
4. Cache everything in memory

**If music becomes large (> 10MB):**

1. Keep single preload for visuals/SFX
2. Add per-scene music loading
3. Cache last 2 tracks
4. Crossfade during load

**If adding HD content later:**

1. Keep core assets preloaded
2. Add background lazy loading per world
3. Preload next world in background
4. Show brief transition screen

---

## Testing Checklist

- [ ] Measure actual asset sizes (don't guess)
- [ ] Test load time on 3G connection (if targeting mobile)
- [ ] Verify cache eviction doesn't cause re-downloads
- [ ] Test music crossfade during lazy load
- [ ] Confirm no stuttering during gameplay
- [ ] Check memory usage stays < 100MB
- [ ] Test with browser cache disabled
- [ ] Verify progress bar accuracy

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Recommendation:** Preload everything unless music > 10MB
