# Notliard Save System Design Document

## Overview

Save system for web-based Notliard using browser localStorage. Implements PC-88 style checkpoint system where players respawn at the last visited Sage, not the first town.

**Key Principles:**

- Save only at Sages (checkpoints)
- Restore to last Sage on death or load
- Persist progression flags (bosses, doors, items)
- Minimal data footprint for localStorage constraints

---

## Save Trigger Points

### Manual Save

- Player talks to Sage
- Selects "Save" option
- Updates last checkpoint location
- Writes full game state to storage

### Auto-Save on Death

- Triggered immediately on player HP reaching 0
- Before gold/Almas loss calculation
- Does NOT update checkpoint location
- Prevents save-scumming death penalty

### Kioku Feather Use

- No save triggered
- Teleports to last checkpoint (Sage location)
- Consumes item from inventory

---

## Data Structure

### Save File Schema (JSON)

```typescript
interface SaveData {
  version: number;                    // Schema version for migration
  timestamp: number;                  // Unix timestamp
  playTime: number;                   // Total seconds played
  
  checkpoint: {
    sageId: number;                   // 0-9 (town index)
    townId: number;                   // Same as sageId for simplicity
  };
  
  character: {
    hp: {
      current: number;
      max: number;
    };
    shield: {
      current: number;
      max: number;
      equipped: number;               // Shield ID (0-6), -1 if broken
    };
    gold: {
      carried: number;
      banked: number;
    };
    almas: number;
    
    equipment: {
      sword: number;                  // Sword ID (0-6)
      shield: number;                 // Shield ID (0-6), -1 if none
      accessory: number;              // Active shoe/cape ID, -1 if none
    };
    
    spells: {
      active: number;                 // Active spell index (0-6)
      charges: number[];              // [7] - charge count per spell
    };
    
    inventory: {
      consumables: {
        kenkoPotion: number;
        juennFruit: number;
        redPotion: number;
        bluePotion: number;
        magiaStone: number;
        sabreOil: number;
        kiokuFeather: number;
        holyWater: number;
        chikaraPowder: number;
      };
      
      special: {
        ruzeriaShoes: boolean;
        pirikaShoes: boolean;
        silkarnShoes: boolean;
        asbestosCape: boolean;
        feruzaShoes: boolean;
        heroCrest: boolean;
        gloryCrest: boolean;
        elfCrest: boolean;
        lionsHeadKey: boolean;
      };
      
      keys: {
        red: number;
        blue: number;
        purple: number;
      };
      
      swords: boolean[];              // [7] - owned swords
      shields: boolean[];             // [7] - owned shields (can rebuy if broken)
    };
  };
  
  progression: {
    tearsCollected: number;           // 0-9
    
    bosses: {
      cangrejo: boolean;              // Boss 1
      pulpo: boolean;                 // Boss 2
      pollo: boolean;                 // Boss 3
      agar: boolean;                  // Boss 4
      vista: boolean;                 // Boss 5
      tarso: boolean;                 // Boss 6
      paguro: boolean;                // Boss 7 (optional)
      dragon: boolean;                // Boss 8
      alguien: boolean;               // Boss 9
      jashiin: boolean;               // Boss 10 (final)
    };
    
    sageUpgrades: {                   // Tracks upgrades per Sage
      muralla: number;                // 0-3
      satono: number;                 // 0-3
      bosque: number;                 // 0-3
      helada: number;                 // 0-3
      tumba: number;                  // 0-2
      dorado: number;                 // 0-3
      llama: number;                  // 0-4
      pureza: number;                 // 0-unlimited (cap at reasonable number)
    };
    
    totalUpgrades: number;            // Sum of all upgrades (for threshold calc)
    
    doors: Map<string, boolean>;      // "cavern_color" -> unlocked
                                      // e.g., "malicia_red", "glacial_blue"
    
    chests: Set<string>;              // Unique chest IDs collected
                                      // e.g., "malicia_chest_001"
    
    walls: Set<string>;               // Hidden wall items collected
                                      // e.g., "malicia_wall_100almas"
  };
  
  meta: {
    playerName?: string;              // Optional
    difficulty?: string;              // Future: easy/normal/hard
  };
}
```

---

## Save/Load Flow

### Save Process

1. **Validation**
   - Verify player is at Sage location
   - Check for active combat (block if in dungeon)

2. **Data Collection**
   - Gather all character state
   - Snapshot progression flags
   - Record current timestamp/playtime

3. **Serialization**
   - Convert to JSON
   - Compress if size > 50KB (unlikely)

4. **Storage**
   - Write to localStorage key: `notliard_save_${slotId}`
   - Update metadata: `notliard_saves_meta` (list of saves)

5. **Confirmation**
   - Show "Game Saved" message
   - Update UI save indicator

### Load Process

1. **Retrieval**
   - Read from localStorage
   - Parse JSON

2. **Validation**
   - Check schema version
   - Migrate if outdated
   - Verify data integrity

3. **State Restoration**
   - Set character stats
   - Restore inventory
   - Apply progression flags
   - Position player at checkpoint Sage

4. **World Setup**
   - Load appropriate town scene
   - Apply unlocked doors
   - Mark collected items as unavailable

---

## Death Handling

### Death Sequence

1. **Pre-Death Save**

   ```plaintext
   - Save current state (before penalties)
   - Mark as "death checkpoint"
   ```

2. **Apply Penalties**

   ```plaintext
   character.gold.carried = 0
   character.almas = Math.floor(character.almas / 2)
   ```

3. **Respawn**

   ```plaintext
   - Teleport to last Sage (checkpoint.sageId)
   - Restore HP/Shield to max
   - Clear any active buffs (Magia Stone, Sabre Oil)
   ```

4. **Post-Death Save**

   ```plaintext
   - Save penalized state
   - Prevents save-scumming
   ```

---

## Storage Implementation

### Browser localStorage

**Capacity:** ~5-10MB per domain (varies by browser)

**Keys:**

- `notliard_save_0` through `notliard_save_4` - Save slots (5 total)
- `notliard_saves_meta` - Save slot metadata
- `notliard_settings` - Game settings (audio, controls)
- `notliard_autosave` - Temporary autosave slot

**Estimated Size per Save:**

- Character data: ~1KB
- Progression flags: ~2KB
- Door/chest/wall state: ~1-3KB (depends on collection count)
- **Total: ~4-6KB per save**

**Meta Structure:**

```typescript
interface SaveMeta {
  slots: Array<{
    id: number;
    exists: boolean;
    timestamp: number;
    playTime: number;
    location: string;          // e.g., "Muralla Town"
    tearsCollected: number;
  }>;
}
```

### Fallback: Download/Upload

If localStorage unavailable or quota exceeded:

- Offer JSON download (manual save)
- File upload to restore
- Server storage (optional, requires backend)

---

## Sage Upgrade Threshold Calculation

Each Sage upgrade requires cumulative Almas based on total upgrades received across all Sages:

```typescript
function getNextUpgradeThreshold(totalUpgrades: number): number {
  // First upgrade: 150 Almas (Cangrejo boss reward)
  // Doubles each time: 150, 300, 600, 1200, 2400...
  return 150 * Math.pow(2, totalUpgrades);
}

function canUpgrade(almas: number, totalUpgrades: number, sageId: number): boolean {
  const maxForSage = SAGE_MAX_UPGRADES[sageId];
  const sageUpgrades = saveData.progression.sageUpgrades[sageName];
  
  if (sageUpgrades >= maxForSage) return false;
  
  const threshold = getNextUpgradeThreshold(totalUpgrades);
  return almas >= threshold;
}
```

---

## Data Migration

### Version Handling

```typescript
const CURRENT_VERSION = 1;

function migrateSave(data: any): SaveData {
  if (data.version === CURRENT_VERSION) return data;
  
  // Example: v0 -> v1
  if (data.version === 0 || !data.version) {
    data.version = 1;
    data.checkpoint = data.checkpoint || { sageId: 0, townId: 0 };
    data.progression.sageUpgrades = data.progression.sageUpgrades || {};
    // ... other migrations
  }
  
  return data;
}
```

### Breaking Changes

If schema changes are incompatible:

- Increment major version
- Show warning to player
- Offer to start new game or attempt migration
- Keep backup of old save in `notliard_save_backup_${slot}`

---

## Edge Cases

### Broken Shield

- `character.equipment.shield = -1`
- `character.shield.equipped = -1`
- Player can still own the shield type (rebuy/repair)

### Unlimited Pureza Upgrades

- Cap at 20 total upgrades to prevent overflow
- Threshold becomes impractical beyond this

### Consumable Stacking

- No hard cap, but UI shows max 99
- Backend allows higher for edge cases

### Boss Re-entry

- If boss defeated, boss door opens immediately
- No boss entity spawns
- Tear already collected (check progression.tearsCollected)

---

## Testing Checklist

- [ ] Save/Load at each Sage location
- [ ] Death penalty calculation (gold = 0, almas = floor(n/2))
- [ ] Respawn at correct Sage after death
- [ ] Kioku Feather teleports to last Sage
- [ ] Progression flags persist (bosses, doors, chests)
- [ ] Equipment/inventory restored correctly
- [ ] Shield breakage state preserved
- [ ] Sage upgrade thresholds calculate correctly
- [ ] Multiple save slots don't conflict
- [ ] localStorage quota handling
- [ ] Schema migration from v0 -> v1
- [ ] Autosave on death before penalties
- [ ] Save blocked during active combat
- [ ] Corrupted save file handling

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Target Implementation:** Phaser 3 + TypeScript + localStorage
