# Notliard Movement System Design Document

## Core Decision: Tile-Based Logic with Visual Smoothing

**Approach:** Implement discrete 8-pixel grid-based movement logic (faithful to DOS original) with interpolated rendering for modern visual smoothness.

**Rationale:** Preserve authentic gameplay feel while eliminating the visual choppiness that was a hardware limitation, not a design choice.

---

## Original System Analysis

### DOS Implementation Characteristics

**Grid-Based Movement:**

- Player position snaps to 8-pixel grid cells
- Horizontal movement: discrete 8-pixel steps per input frame
- Vertical movement (jumping): follows predetermined grid-aligned arc
- **Air control:** Full directional control mid-air (unlimited direction changes)
- Mid-air direction changes: full 8-pixel displacement per input (same as ground)

**Why This Existed:**

- Early DOS platformers lacked smooth scrolling (pre-Commander Keen 1990)
- EGA hardware limitations (640x200 resolution)
- Simplified collision detection (tile-aligned)
- Performance optimization on 286/386 CPUs
- Variable hardware speeds required manual adjustment (F9 key: 0-9 speed setting)

**Reported Issues:**

- "Too large a brush" for precise platforming
- Overshooting ledges difficult to correct
- Choppy visual presentation
- Inconsistent speed across different hardware
- F9 speed control was necessary workaround, not feature

---

## Modern Implementation Strategy

### Two-Layer Architecture

**Layer 1:** Game Logic (Discrete)

- Player position stored in grid coordinates (tile units)
- Movement updates in 8-pixel increments
- Collision detection against tile-aligned boundaries
- Input processing on fixed timestep

**Layer 2:** Visual Rendering (Continuous)

- Sprite position interpolated between grid cells
- Animation frames independent of movement grid
- Smooth camera scrolling
- Frame-rate independent visual updates

### Benefits of Hybrid Approach

**Preserves Authentic Feel:**

- Jump distances identical to original (at default 15 Hz)
- Platform distances require same timing
- Collision behavior consistent with DOS version
- Level design 1:1 compatible

**Eliminates Hardware Quirks:**

- Consistent behavior across all devices
- No speed adjustment needed for hardware
- Smooth visual presentation at 60 Hz
- Responsive to modern input devices

**Adds Player Control:**

- Game speed slider provides accessibility
- Slower speeds for difficult platforming
- Faster speeds for traversing cleared areas
- Original F9 speed control concept, but refined and consistent

---

## Movement Parameters

### Horizontal Movement

**Logical System:**

```plaintext
Grid cell size: 8 pixels
Movement speed: 1 cell per update (8px/update)
Game logic frequency: 5-30 Hz (player adjustable in 5 Hz increments)
Screen refresh: 60 Hz (fixed, independent of game speed)
```

**Effective Speed by Game Speed Setting:**

```plaintext
5 Hz  (slowest):  8px Ã— 5  = 40 px/second  (slow-motion, easier platforming)
10 Hz:            8px Ã— 10 = 80 px/second  (slow, comfortable)
15 Hz (default):  8px Ã— 15 = 120 px/second (moderate pace)
20 Hz:            8px Ã— 20 = 160 px/second (fast)
25 Hz:            8px Ã— 25 = 200 px/second (faster)
30 Hz (fastest):  8px Ã— 30 = 240 px/second (maximum speed for cleared areas)
```

**Acceleration Model:**

- Instant velocity change (zero acceleration)
- Input → immediate 8-pixel movement per game update
- No gradual speed ramping on ground or in air

### Vertical Movement (Jumping)

**Jump Arc Construction:**

- Initial upward velocity: predetermined based on desired jump height
- Gravity constant: applied per game update
- Grid-aligned apex and landing points
- No variable jump height (original behavior)

**Estimated from DOS behavior:**

- Jump height: ~2-3 tile cells (16-24 pixels)
- Jump duration at 15 Hz: ~0.5-0.6 seconds (8-10 game updates)
- Arc shape: Parabolic, grid-snapped positions
- Duration scales with game speed setting

**Modern Smoothing:**

- Logical position updates on grid per game update (5-30 Hz)
- Visual position rendered at 60 Hz
- With smoothing enabled: interpolated on sub-pixel coordinates
- No change to collision or gameplay timing

### Air Control

**Original Behavior:**

- **Full air control:** Player can change direction at will, unlimited times
- Each directional input: instant 8-pixel displacement (same as ground movement)
- **No momentum:** Previous velocity not carried over
- **No commitment:** Can reverse direction freely mid-jump
- Character sprite faces current input direction

**Why It Felt Clunky:**

- 8-pixel displacement "too large a brush" for precise corrections
- Overshooting a platform by 2-3 pixels requires full 8-pixel correction
- Often results in overcorrection and falling
- Late-game platforming demands precision the grid can't provide

**Implementation:**

- Identical movement logic to ground (8px steps per input)
- No restrictions on direction changes
- No momentum calculation needed
- Player state: `isGrounded` is only distinction
- Visual smoothing makes discrete air movement less jarring

**Modern Mode Consideration:**

- Optional "smooth physics" mode could add analog air control
- Separate difficulty toggle for accessibility
- Classic mode (grid-based) remains default

---

## Visual Interpolation System

### Rendering Strategy

**Position Smoothing (when enabled):**

```plaintext
logicalPosition = gridCell * 8  // Discrete 8px steps per game update
visualPosition = lerp(previousLogical, currentLogical, interpolationFactor)
interpolationFactor = (currentTime - lastGameUpdate) / gameUpdateInterval

// Example at 15 Hz game speed:
// gameUpdateInterval = 66.67ms (1000ms / 15 Hz)
// Screen renders every 16.67ms
// Factor goes 0.0 → 0.25 → 0.5 → 0.75 → 1.0 → (next game update)
```

**Without Smoothing:**

```plaintext
visualPosition = logicalPosition  // Show current game state directly
// Screen still renders at 60 Hz but shows same position until next game update
```

**Sprite Animation:**

- Run cycle: 4-6 frames, driven by game update timer
- Jump/fall: 2-3 frames, state-based not position-based
- Attack: 3-4 frames, full duration regardless of movement
- Animations scale with game speed setting

**Camera Smoothing:**

- Follow player's visual position (interpolated if enabled)
- Damped spring follow for smooth panning
- Maintain grid-aligned boundaries for screen transitions

### Collision Detection

**Critical:** Always Use Logical Position

- Collision checks against `gridPosition * 8`, never `visualPosition`
- Tile boundaries at exact 8-pixel intervals
- Enemy hitboxes grid-aligned
- Platform edges snapped to grid

**Why:**

- Visual interpolation is rendering-only
- Gameplay must remain deterministic
- Prevents sub-pixel collision bugs
- Maintains level design integrity

---

## Input Handling

### Fixed Timestep Update Loop

```plaintext
Input Phase (60 Hz):
  - Sample controller/keyboard state every frame
  - Store in input buffer

Update Phase (5-30 Hz, player configurable):
  - Process buffered input
  - Update logical player position on grid
  - Apply physics (gravity, collisions)
  - Update game state
  - Frequency set by player's game speed slider

Render Phase (60 Hz fixed):
  - Calculate interpolation factor between last/next game states
  - Compute visual positions (if smoothing enabled)
  - Draw sprites at screen refresh rate
  - Without smoothing: show current game state as-is
```

**Example at 15 Hz game speed:**

- Screen renders 60 times per second
- Game updates 15 times per second (every 4th frame)
- Between game updates: screen shows same state (or interpolated if smoothing on)
- Input sampled every frame but processed every 4th frame

### Input Buffering

**Ground vs. Air Movement:**

- Input handling identical for both states
- Left/right: 8-pixel displacement per update regardless of grounded state
- No momentum differences between ground and air
- Only distinction: jump input only works when grounded

**Input Buffer Benefits:**

- Input buffer with 3-5 frame window
- "Coyote time" (late jump input grace period)
- "Jump buffering" (early jump input before landing)

**Critical:** These are quality-of-life improvements, not mechanical changes. Logical movement still grid-based.

---

## Attack Mechanics

### Sword System

**8-Directional Attacks:**

- Forward, up, down, diagonal (while jumping)
- Hitbox extends from player's grid cell
- Attack frames: 3-4 logical updates
- Cooldown: 6-8 updates (prevents spam)

**Visual Smoothing:**

- Sword slash sprite interpolated
- Trail effects for visual feedback
- Impact frames on hit

**Collision:**

- Hitbox aligned to grid cells
- Check all enemy sprites in adjacent cells
- Binary hit detection (no proximity scaling)

---

## Trade-offs & Considerations

### What We Preserve

âœ“ Exact jump distances and platform gaps (at default speed)
âœ“ Predictable collision boundaries
âœ“ Consistent timing across platforms
âœ“ Original level design compatibility
âœ“ Authentic "feel" of deliberate movement
âœ“ Grid-based 8-pixel movement logic

### What We Improve

âœ“ Visual smoothness (optional interpolation)
âœ“ Consistent 60 Hz rendering
âœ“ Modern input buffering
âœ“ Smooth camera movement
âœ“ Better animation quality
âœ“ Player-adjustable game speed (accessibility)
âœ“ No hardware-dependent timing issues

### What We Sacrifice

âœ— Sub-pixel precision platforming (was never present)
âœ— Analog movement speed control
âœ— Momentum-based physics

---

## Game Speed Settings

### Player-Adjustable Speed Slider

**Setting Range:**

- Minimum: 5 Hz (slow motion)
- Maximum: 30 Hz (fast)
- Increment: 5 Hz steps
- Default: 15 Hz (moderate pace)

**Usage Scenarios:**

**Slow Speed (5-10 Hz):**

- Easier platforming for difficult sections
- More time to react to enemies
- Precise jump timing
- Learning new areas

**Default Speed (15 Hz):**

- Balanced gameplay
- Original DOS-era feel
- Comfortable exploration and combat

**Fast Speed (20-30 Hz):**

- Quick traversal of cleared areas
- Returning to earlier towns after death
- Grinding familiar sections
- Speedrunning

**Implementation:**

- Slider in settings menu
- Real-time adjustment (no restart required)
- Speed persists across sessions
- Can be changed anytime except during boss fights

**Technical Notes:**

- Only affects game simulation rate
- Screen always renders at 60 Hz
- Input sampling unchanged (60 Hz)
- Physics calculations scale with speed
- Animation playback scales accordingly

---

## Optional: Modern Mode

### Alternate Control Scheme

If offering accessibility/modern difficulty option:

**Smooth Physics Mode:**

- Continuous pixel-based movement (no grid snapping)
- Acceleration/deceleration curves
- Variable air control
- Momentum preservation
- "Floaty" jump control

**Separate Difficulty Toggle:**

- "Classic" (grid-based, faithful)
- "Modern" (smooth physics, easier)

**Critical:** Maintain classic as default. Modern mode changes fundamental gameplay balance.

---

## Implementation Checklist

### Phase 1: Core Grid System

- [ ] Variable game speed system (5-30 Hz, 5 Hz increments)
- [ ] 60 Hz screen refresh loop (fixed)
- [ ] 8-pixel grid position tracking
- [ ] Discrete movement updates per game tick
- [ ] Grid-aligned collision detection
- [ ] Jump arc with grid-snapped trajectory
- [ ] Physics scaling with game speed

### Phase 2: Visual Smoothing

- [ ] Optional interpolation toggle in settings
- [ ] Interpolated sprite rendering (when enabled)
- [ ] Sub-pixel position calculation
- [ ] Smooth camera follow with damping
- [ ] Animation system decoupled from grid
- [ ] Particle effects for polish

### Phase 3: Input Polish

- [ ] Input buffering (3-5 frames at 60 Hz)
- [ ] Coyote time (6 frames post-ledge)
- [ ] Jump buffering (3 frames pre-land)
- [ ] Responsive attack input
- [ ] Menu/inventory responsiveness

### Phase 4: Game Speed UI

- [ ] Settings slider (5-30 Hz in 5 Hz steps)
- [ ] Real-time speed adjustment
- [ ] Speed persistence across sessions
- [ ] Visual feedback for current speed
- [ ] Default to 15 Hz on first launch

### Phase 5: Testing & Tuning

- [ ] Verify jump distances match original at default speed
- [ ] Platform gaps traversable at all speed settings
- [ ] No collision bugs from interpolation
- [ ] Performance on target devices (60 Hz stable)
- [ ] Consistent behavior across all game speeds
- [ ] Smoothing toggle works correctly

---

## Technical Specifications

### Constants

```typescript
const GRID_SIZE = 8;                    // pixels per grid cell
const SCREEN_REFRESH_RATE = 60;         // Hz (fixed)
const GAME_SPEED_MIN = 5;               // Hz (slowest setting)
const GAME_SPEED_MAX = 30;              // Hz (fastest setting)
const GAME_SPEED_DEFAULT = 15;          // Hz (default setting)
const GAME_SPEED_INCREMENT = 5;         // Hz (slider steps)

const JUMP_HEIGHT = 24;                 // pixels (3 tiles)
const HORIZONTAL_SPEED = 8;             // pixels per game update
const GRAVITY = 800;                    // pixels/secÂ² (scaled to game speed)
const ATTACK_COOLDOWN = 100;            // milliseconds
```

### Derived Values

```typescript
// Calculate game update interval based on current speed setting
function getGameUpdateInterval(gameSpeedHz: number): number {
  return 1000 / gameSpeedHz;  // milliseconds
}

// At 15 Hz default: 66.67ms between game updates
// At 30 Hz fastest: 33.33ms between game updates
// At 5 Hz slowest: 200ms between game updates

// Jump parameters scale with game speed
function getJumpVelocity(gameSpeedHz: number): number {
  const updatesPerSecond = gameSpeedHz;
  const jumpDurationSeconds = 0.5;
  const updatesForJump = jumpDurationSeconds * updatesPerSecond;
  return (2 * JUMP_HEIGHT) / updatesForJump;
}
```

---

## Performance Considerations

**Update Loop:**

- Screen refresh: 60 Hz (16.67ms per frame)
- Game logic: 5-30 Hz (variable, player configurable)
- At 30 Hz: Game updates every other frame
- At 15 Hz: Game updates every 4th frame
- At 5 Hz: Game updates every 12th frame

**Frame Budget:**

- Screen refresh budget: 16.67ms (60 FPS)
- Game update budget (worst case, 30 Hz): 33.33ms
- Rendering overhead: < 10ms per frame
- Game logic overhead: < 5ms per update

**Rendering:**

- Interpolation calculations (if smoothing enabled): < 1ms
- Sprite batching for efficiency
- Target: Stable 60 FPS rendering regardless of game speed
- V-sync recommended for smooth visuals

**Memory:**

- Grid position: 2 integers (x, y)
- Visual position: 2 floats (interpolated x, y)
- Previous position: 2 integers (for interpolation)
- Total per entity: ~24 bytes
- Minimal overhead for variable game speed

**60 Hz Overhead:**

- Negligible on modern hardware (even mobile)
- Most frames just re-render same game state
- Interpolation math is trivial
- No physics/collision processing between game updates

---

## Comparison: Grid vs. Smooth Physics

| Aspect | Grid-Based (Zeliard) | Smooth Physics (Modern) |
|--------|----------------------|-------------------------|
| Position precision | 8-pixel steps | Sub-pixel continuous |
| Jump arcs | Predetermined, grid-snapped | Physics-calculated, variable |
| Air control | Discrete 8px steps | Analog, momentum-based |
| Collision | Tile-aligned, binary | Continuous, requires SAT/sweep |
| Level design | Grid-constrained | Freeform placement |
| Feel | Deliberate, strategic | Responsive, "floaty" |
| Complexity | Low (simple state machine) | High (physics integration) |
| Determinism | Perfect (given fixed timestep) | Requires careful tuning |

---

## Conclusion

**Selected Approach:** Tile-based movement logic with variable game speed and optional visual interpolation.

**Primary Goals Achieved:**

1. Authentic gameplay faithful to DOS original
2. Player-adjustable game speed (5-30 Hz) for comfort and accessibility
3. Modern visual polish via optional interpolation at 60 Hz
4. Consistent cross-platform behavior
5. Maintainable codebase with clear separation of concerns

**Key Features:**

- Grid-based 8-pixel movement preserves original feel
- Variable game speed without affecting rendering smoothness
- Optional visual smoothing toggle for player preference
- 60 Hz screen refresh provides modern responsiveness
- Deterministic gameplay independent of hardware

**Future Flexibility:**

- Easy to add "modern mode" as optional control scheme
- Level design remains compatible with grid system
- Can adjust visual smoothing intensity without touching gameplay
- Game speed settings provide built-in accessibility options
- Performance headroom for additional features

---

**Document Version:** 1.1  
**Last Updated:** 2025-01-XX  
**Decision:** Grid-based movement (8px steps) with variable game speed (5-30 Hz) and optional visual interpolation (60 Hz rendering)  
**Default Settings:** 15 Hz game speed, visual smoothing enabled  
**Implementation Target:** Phaser 3 (or similar 2D engine with fixed timestep support)
