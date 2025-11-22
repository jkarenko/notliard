# NOTLIARD - HIGH-LEVEL DESIGN DOCUMENT

A tribute to the original Zeliard

## Reverse Engineering Reference

**Title:** Zeliard (DOS, 1990)
**Genre:** Action RPG / Metroidvania Platformer  
**Developer:** Game Arts (1987 PC-88/X1), Sierra On-Line (1990 DOS port)  
**Core Loop:** Town → Dungeon exploration → Boss fight → Collect Tear → Next town

---

## STORY & NARRATIVE

### Setup

- Ancient demon Jashiin awakens after 2000 years
- 115 days of sand rain devastates Kingdom of Zeliard
- Princess Felicia turned to stone
- Duke Garland (player) must collect Nine Tears of Esmesanti to break curse and defeat Jashiin

### Progression

Linear through 8 worlds + final area, each ending with boss holding a Tear

---

## WORLD STRUCTURE

### Towns/Villages (10 total)

1. **Muralla Town** - Starting point, has Church (free healing)
2. **Satono Town**
3. **Bosque Village**
4. **Helada Town**
5. **Tumba Town**
6. **Dorado Town**
7. **Llama Town**
8. **Pureza Town** - Final town with Sage
9. **Esco Village** - Secret, no Sage, cheap prices
10. **Felishika's Castle** - Ending location

### Dungeons (Caverns)

Each world has 1-5 interconnected caverns with distinct themes:

| World | Cavern Names | Theme |
|-------|--------------|-------|
| 1 | Malicia | Green/Nature |
| 2 | Peligro | Water/Octopus |
| 3 | Madera, Riza | Forest |
| 4 | Escarcha, Glacial | Ice |
| 5 | Corroer, Cementar | Rot/Tomb |
| 6 | Tesoro, Plata, Arrugia | Gold/Treasure |
| 7 | Caliente, Reaccion, Corroer | Fire |
| 8 | Absor, Millagro, Desleal, Faltar, Final | Multi-area complex |

---

## BOSSES

### 9 Tear Guardians + 1 Optional

| # | Name | Description | Almas Reward | Location |
|---|------|-------------|--------------|----------|
| 1 | Cangrejo | Giant Crab | 150 | Muralla (Cavern of Malicia) |
| 2 | Pulpo | Giant Octopus | 200 | Satono (Cavern of Peligro) |
| 3 | Pollo | Giant Chicken | 500 | Bosque (Cavern of Riza) |
| 4 | Agar | Giant Ice Cube | 600 | Helada (Cavern of Glacial) |
| 5 | Vista | Giant Fish | 800 | Tumba (Cavern of Cementar) |
| 6 | Tarso | Titan | 1500 | Dorado (Cavern of Tesoro) |
| 7 | Paguro | Giant Flaming Cube | 1600 | Llama Town (Hut) - OPTIONAL |
| 8 | Dragon | Dragon | 2500 | Llama (Cavern of Caliente) |
| 9 | Alguien | Giant Bat | 3800 | Pureza (Cavern of Absor) |
| 10 | Jashiin | Giant Demon | 0 | Esco Village (Cavern of Final) |

### Boss Mechanics

- **Audio Cue:** Guard doors have increasing volume warning based on proximity
- **Size:** All bosses oversized to limit player mobility
- **Attacks:** Most have ranged attacks (spit, projectiles, fire)
- **Victory:** Grants Tear + Almas + access to next area
- **Persistence:** Once defeated, stay dead even after player death

---

## CHARACTER SYSTEMS

### Progression System

**Leveling:**

- No traditional XP levels
- Sage upgrades based on Almas collected (threshold doubles each time)
- Each Sage can upgrade 2-4 times (varies by town)
- Upgrades increase: Health bar, Spell capacity, Sword damage

**Sage Upgrade Counts by Town:**

| Town | Max Upgrades |
|------|--------------|
| Muralla | 3 |
| Satono | 3 |
| Bosque | 3 |
| Helada | 3 |
| Tumba | 2 |
| Dorado | 3 |
| Llama | 4 |
| Pureza | Unlimited (?) |

### Stats

- **Health (HP)** - Visual bar, increases with Sage upgrades
- **Shield Durability** - Separate damage points, displayed in ARMOR window
- **Gold** - Primary currency
- **Almas** - Enemy souls, secondary currency for upgrades/exchange

### Death Penalty

- Lose **ALL gold**
- Lose **HALF Almas**
- Teleport to **Muralla Town** (first town)
- Must return through already-cleared areas
- **Persistent Progress:** Doors stay open, bosses stay dead, items remain collected

---

## EQUIPMENT SYSTEMS

### Swords (Progressive Upgrades)

| # | Name | Cost (Muralla) | Notes |
|---|------|----------------|-------|
| 1 | Training Sword | 400g | Starter weapon |
| 2 | Wise Man's Sword | 1500g | Minor upgrade |
| 3 | Spirit Sword | 6800g | Significant improvement |
| 4 | Knight's Sword | Trade only | Requires Glory Crest trade in Tumba |
| 5 | Illumination Sword | 69,800g | Best purchasable |
| 6 | **Fairy Flame Enchantment Sword** | Secret | One-hit kill small enemies |

**Sword Mechanics:**

- Longer swords reach farther
- Can swing in 8 directions (up, down, diagonal while jumping)
- Damage increases with Sage level-ups
- Can be enhanced with Sabre Oil consumable

### Shields (Progressive Upgrades)

| # | Name | Cost (Muralla) | HP | Notes |
|---|------|----------------|-----|-------|
| 1 | Clay Shield | 50g | Low | Small, limited coverage |
| 2 | Wise Man's Shield | 150g | Low | Slightly better |
| 3 | Stone Shield | 2980g | Medium | Durable |
| 4 | Honor Shield | 9800g | High | Full frontal coverage (BIG) |
| 5 | Light Shield | 14,800g | High | Magic metal "Megane" |
| 6 | Titanium Shield | 39,800g | Very High | Double HP of Light Shield |

**Shield Mechanics:**

- Take damage separate from player health
- **Break permanently** if durability depleted
- Can be repaired at Weapon Shop
- Holy Water of Acero restores 100 HP
- Larger shields (4-6) provide full frontal protection

### Special Items (Progression Keys)

**Shoes/Capes:**

| Item | Function | Location |
|------|----------|----------|
| Ruzeria Shoes | Prevent slipping on ice | Helada caverns |
| Pirika Shoes | Protect from thorns, Gelroid, hot liquids | Tumba caverns |
| Silkarn Shoes | Climb slopes | Dorado caverns |
| Asbestos Cape | Survive fire caverns heat | Buy in Llama (2500 Almas) |
| **Feruza Shoes** | Double jump height | Secret: Dorado (Lion's Head door) |

**Crests:**

| Item | Function |
|------|----------|
| Hero's Crest | Required to pass guard to 3rd boss (Pollo) |
| Glory/Family Crest | Trade for Knight's Sword in Tumba |
| Elf Crest | Talk to Llama Town NPCs (from defeating Paguro) |

**Keys:**

- **Normal Keys** - Unlock colored doors (red, blue, purple)
- **Lion's Head Key** - Special key for green doors (found in final dungeon)

---

## MAGIC SYSTEM

### 7 Spells (Learned from Sages)

| # | Name | Meaning | Characteristics | Sage/Town |
|---|------|---------|-----------------|-----------|
| 1 | Espada | Throwing Swords | Short distance, stops on contact | Muralla |
| 2 | Saeta | Arrows | Long range projectile | Satono |
| 3 | Fuego | Fire | Short range, persistent damage area | Bosque |
| 4 | Lanzar | Flame | Long range fire projectile | Helada |
| 5 | Rascar | Falling Rocks | Falls from top to bottom of screen | Tumba |
| 6 | Agua | Water | Long range, high arc | Llama |
| 7 | Guerra | War | Full screen coverage | Pureza |

**Spell Mechanics:**

- Each spell has charge counter (capacity increases with Sage upgrades)
- Uses deplete with casting
- Restored by:
  - **Elixir of Kashi** (60-120g) - Single spell type
  - **Chikara Powder** (320-480g) - All spells
- Active spell displayed in SPELL window
- Cast with **ALT key**

---

## ITEMS & CONSUMABLES

### Health Items

| Item | Cost | Effect | Source |
|------|------|--------|--------|
| Ken'Ko Potion | 50g | Small heal | Magic Shop |
| Ju-enn Fruit | 240-900g | **Full heal** | Magic Shop |
| Red Potion | Dungeon | Small heal | Dungeon drops/chests |
| Blue Potion | Dungeon | **Full heal** | Dungeon drops/walls |

### Combat Enhancers

| Item | Cost | Effect | Duration |
|------|------|--------|----------|
| Magia Stone | 1000-2500g | Rotating shield orbs damage enemies | Until depleted/town |
| Sabre Oil | 1200-2400g | Temporary sword damage boost | Timed |

**Magia Stone Mechanics:**

- 2-4 rotating stones around player
- Damages enemies on contact
- Depletes with hits taken
- Weakens progressively (4→3→2→1 stones)
- **Lost completely** when entering town
- **DON'T USE** against red slime creatures (creates more enemies)

### Utility Items

| Item | Cost | Effect |
|------|------|--------|
| Kioku Feather | 350g | Instant teleport to Muralla Town |
| Holy Water of Acero | 100-200g | Repair shield 100 HP |

### Power-ups in Dungeons

**Gold Chests:**

- 50, 100, 500, or 1000 gold

**Alma Orbs (appearance indicates value):**

- **1 Almas** - Gray with red glow
- **10 Almas** - Gray edge with green glow  
- **100 Almas** - Red with green glow

---

## TOWN SERVICES

### Bank

**Functions:**

- Exchange Almas for Gold (rates vary by town)
- Deposit gold (safe from death)
- Withdraw gold
- Check balance

**Almas Exchange Rates:**

| Town | Rate (Almas:Gold) | Notes |
|------|-------------------|-------|
| Muralla | 1 = 6 | |
| Satono | 1 = 6 | |
| Bosque | 1 = 8 | **BEST RATE** |
| Helada | 1 = 4 | |
| Tumba | 1 = 2 | **WORST RATE** |
| Dorado | 1 = 4 | |
| Llama | 4 = 2 | Need 4 Almas minimum |
| Pureza | 1 = 6 | |
| Esco | 1 = 8 | **BEST RATE** (secret) |

### Weapon Shop

- Buy/sell swords and shields
- Repair shields
- Prices decrease in later towns for earlier items
- Selling gives 50-75% of purchase price

### Magic Shop

- Buy consumable items
- Inventory varies by town
- Prices vary by town

### Inn (or Church)

**Rest to restore health:**

| Location | Cost |
|----------|------|
| Muralla (Church) | **FREE** |
| Satono | 30g |
| Bosque | 50g |
| Helada | 70g |
| Tumba | 100g |
| Dorado | 150g |
| Llama | 200g |
| Pureza | 400g |
| Esco (Church) | **FREE** |

### Sage (Named NPCs per town)

| Town | Sage Name |
|------|-----------|
| Muralla | Marid |
| Satono | Yasmin |
| Bosque | Hajjar |
| Helada | Chiriga |
| Tumba | Hisham |
| Dorado | Maryam |
| Llama | Saied |
| Pureza | Indihar |

**Functions:**

- Level up (requires Almas threshold)
- Learn new spells
- **Save game** (.USR files)
- Sets respawn point for death/feather use

**Sage Messages:**

- **Insufficient Almas (far):** "Your experience is lacking. Persevere in your quest."
- **Insufficient Almas (medium):** "You must accumulate more experience."
- **Insufficient Almas (close):** "I can see the faint light of the Spirits in you. You must endure a little longer."
- **Level up:** "The light of the Spirits is bursting forth within you. Indeed, your power has grown."
- **Max level:** "I can no longer impart the power of the Spirits to you. Continue your quest, you'll soon find others to help you."

---

## ENEMY SYSTEMS

### Common Enemies by World

**Muralla Town (Cavern of Malicia):**

- Toads - Fast, harmful
- Slugs - Slow, persistent
- Bats - Swoop from ceiling, follow player
- Rats - Fastest, drop 10 Almas or nothing

**Satono Town (Cavern of Peligro):**

- Blue slime creatures - Confused movement
- Red toads - Shoot low spittle
- Trolls - Cowardly, shoot axes while retreating
- Bats - More numerous variant

**Bosque Village (Cavern of Madera/Riza):**

- Earthworms - Burrow, shoot spit when surface
- Bugs - Jump attack, powerful
- Crabs - Guard doors, charge when approached
- Clay balls - Walk on walls/ceiling, drop on player

**Helada Town (Cavern of Escarcha/Glacial):**

- Turtles - Jump in shell, collide attack
- Green slime creatures - Reproduce when hit (except by Fuego)
- Arrows - Circle platforms at high speed

**Tumba Town (Cavern of Corroer/Cementar):**

- Red slime creatures - Reproduce on contact (except Fuego/Lanzar), live in Gelroid
- Eyeballs - Can double speed
- Evil women - Hard to kill, shoot spit, must hit head, worth 100 Almas
- Bats - More powerful variant

**Dorado Town (Cavern of Tesoro/Plata):**

- Red ghosts - Vanish when hit with non-Illumination sword
- Condors - Can double speed
- Evil women - Stronger, disappear after shooting heart, must hit head

**Llama Town (Cavern of Caliente/Reaccion):**

- Fire creatures - Shoot projectiles, must hit head
- Trolls - Stronger, shoot multiple darts quickly
- Rats - Fast, valuable, appear in large numbers

**Pureza Town (Cavern of Absor/Millagro/Desleal/Faltar/Final):**

- Lava slime creatures - Shoot green (left) and red (right) projectiles
- Bugs - Harmful variant
- Medusas - Must hit head, massive damage on rear contact
- Blue ghosts - Like red ghosts but stronger, slow, worth many Almas

### Enemy Mechanics

- **Respawn:** When leaving/re-entering screen or door
- **Drops:** Almas (1, 10, or 100) or explode with no drop
- **Special behaviors:** Some reproduce, speed burst, wall-walk, require headshots

---

## PLATFORMING MECHANICS

### Movement

- Walk left/right (arrow keys)
- Jump (up arrow)
- Attack while jumping/walking
- Directional sword swings (up, down, forward, diagonal)
- **Standing still regenerates health** (DOS version only)

### Environmental Hazards

- Spikes - Instant damage
- Falling platforms - Timed collapse
- Ice - Slippery (requires Ruzeria Shoes)
- **Gelroid** - Life-draining blue fluid (Tumba, requires Pirika Shoes)
- Fire/Heat - Damage over time (requires Asbestos Cape in Llama)
- Thorns - Contact damage (Pirika Shoes negate)
- Air currents - Push player (final dungeon)
- Invisible walls - Passable barriers (final dungeon)
- Excessive temperatures - Environmental damage

### Traversal Elements

- **Ropes** - Climbable vertical movement
- **Moving platforms (green)** - Can be positioned by player
- **Locked doors** - Require keys (red, blue, green, purple)
- **Slopes** - Require Silkarn Shoes to climb
- **Breakable walls** - Slash to reveal hidden items/passages
- **Fake walls** - Walk through

---

## GAME ECONOMY

### Strategic Trading

**Optimal Strategy:**

- Save Almas for Bosque/Esco exchange (1=8 best rate)
- Bank gold to protect from death
- Avoid exchanging in Tumba (1=2 worst rate)
- Later towns have cheaper old equipment

### Grinding Locations

**Madera Cavern:**

- Go right, down, enter right door
- Use Magia Stone
- Farm bird and crab
- Repeat by exiting/entering door

**Tesoro Cavern:**

- Two ghosts, eagle, evil woman
- Wait 1-2 minutes for respawn
- High Almas value

---

## TECHNICAL SYSTEMS

### Save System

- **Save location:** Sage only
- **Restore:** Anywhere via F7 key
- **Command line:** `ZELIARD <savename>`
- **File format:** .USR files
- **Hex editable:** Can modify save data

### Controls

| Key | Function |
|-----|----------|
| Arrow keys | Movement |
| Space | Attack/Interact |
| Alt | Cast active spell |
| Enter | Inventory screen |
| F7 | Load game |
| F9 + number | Adjust game speed (0-9) |

### Graphics

- **EGA:** 640x200 resolution
- **MCGA:** 320x200 with 64 colors
- **Optimization:** Partial screen redraw (grid-based)
- **Boss indicators:** Visual feedback for Tears collected

### Audio

- **Multi-device:** Separate devices for music/SFX
- **PC Speaker:** Multi-channel support
- **Boss warning:** Distance-based volume increase near boss doors
- **Supported devices:** Roland MT-32, AdLib, Tandy, PC Speaker

---

## PROGRESSION GATES

### Mandatory Requirements

- **Hero's Crest** → Access to Pollo (3rd boss)
- **Each Tear** → Unlocks next area
- **Pirika Shoes** → Required for Tumba (Gelroid)
- **Silkarn Shoes** → Required for slopes (Dorado onward)
- **Asbestos Cape** → Required for Llama (heat)
- **Feruza Shoes** → Required for final dungeon (high ropes)
- **Keys** → Unlock progression doors

### Optional but Helpful

- **Glory Crest** → Knight's Sword (Vista easier)
- **Elf Crest** → Llama Town dialogue/hints
- **Lion's Head Key** → Secret area (Enchantment Sword + Feruza Shoes)

---

## DIFFICULTY MECHANICS

### DOS Version Changes (Easier than PC-88)

**Advantages:**

- Enemies give more XP/Almas
- Better Almas:Gold exchange rates
- Health regeneration while standing still
- Death loses less Almas (half vs. all)
- Multiple save files
- Adjustable game speed
- Pause button

**Disadvantages:**

- Respawn in first town (not last visited Sage)
- Kioku Feather cost halved (discourages backtracking for rates)

### Grinding Requirements

- Sage level-ups require **doubling Almas** each time
- Equipment costs increase exponentially
- Boss difficulty spikes significantly
- Later dungeons require extensive preparation

---

## SECRETS & HIDDEN CONTENT

### Secret Locations

- **Esco Village** - Hidden town with best prices, no Sage, Church
- **Arrugia Cavern** - Behind green Lion's Head door in Dorado

### Secret Items

- **Fairy Flame Enchantment Sword** - Behind Lion's Head door in Dorado
- **Feruza Shoes** - Same location as Enchantment Sword
- **100 Almas orb** - Hidden wall in Malicia (slash wall after green door)
- **Blue potions** - Hidden in upper walls (final dungeon, slash upward)

### Shortcuts (with Late-Game Shoes)

**Malicia:** Climb slope with Silkarn/Feruza Shoes  
**Glacial:** Multiple slope shortcuts  
**Tesoro/Plata:** Lion's Head door to Absor (major shortcut)  
**Caliente:** Red door area jump shortcut, or Lion's Head door

---

## DATA STRUCTURE HINTS FOR REVERSE ENGINEERING

### Player State (likely struct)

- Current HP
- Max HP  
- Current Shield HP
- Max Shield HP
- Gold count
- Almas count
- Banked gold
- Tears collected (0-9)
- Current location (town/cavern ID)
- Facing direction
- Active spell index
- Active accessory index

### Inventory Arrays

- Swords (0-6, current equipped)
- Shields (0-6, current equipped)
- Spells (7 slots, charge counts)
- Magic items (consumables, counts)
- Special items (shoes, crests, keys)
- Use items (potions, feathers)

### Progression Flags (bitflags)

- Bosses defeated (10 flags)
- Doors unlocked (per cavern)
- Items collected (chests, walls)
- NPCs spoken to
- Tears collected

### Town/Sage Data (per location)

- Sage name
- Upgrade count remaining
- Save point ID
- Exchange rate
- Shop inventory
- Shop prices

### Enemy Data (per type)

- HP
- Damage
- Almas drop value (or drop table)
- Movement pattern ID
- Attack pattern ID
- Spawn conditions
- Respawn flag

### Boss Data

- HP (much higher than regular enemies)
- Attack patterns (multiple)
- Movement patterns
- Almas reward
- Tear ID

---

## NOTES FOR AI-ASSISTED DECOMPILATION

### Expected Code Patterns

- **Main game loop** - Town mode vs. Dungeon mode state machine
- **Collision detection** - Player vs. enemies, environment, pickups
- **Inventory management** - Add/remove/use items
- **Save/Load** - Serialize/deserialize player state to .USR file
- **Economic calculations** - Almas exchange with variable rates
- **Upgrade thresholds** - Doubling calculation for Sage level-ups
- **Boss AI** - Pattern-based state machines per boss
- **Platforming physics** - Jump arcs, gravity, rope climbing
- **Screen scrolling** - Follow player, grid-based optimization

### Critical Systems to Map

1. **Progression flags** - What gates access to areas
2. **Item effect handlers** - How each item/spell works
3. **Enemy AI routines** - Behavior patterns
4. **Boss patterns** - Attack sequences
5. **Save file format** - Complete data layout
6. **Exchange rate lookup** - Town-based table
7. **Damage calculations** - Player attack, enemy damage, shield
8. **Spell implementations** - Each spell's unique behavior

---

**Document Version:** 1.0  
**Created:** 2025 for Zeliard DOS reverse engineering project  
**Sources:** GameFAQs guides, MobyGames, Hardcore Gaming 101, The Cutting Room Floor
