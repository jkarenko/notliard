import GameState from '../data/GameState';
import { SWORDS } from '../data/items/Swords';
import { SHIELDS } from '../data/items/Shields';
import { CONSUMABLES, type ConsumableKey } from '../data/items/Consumables';
import Player from '../entities/Player';

export default class InventorySystem {
    
    // --- Equipment ---

    static equipSword(id: number): boolean {
        if (GameState.character.inventory.swords[id]) {
            GameState.character.equipment.sword = id;
            console.log(`Equipped sword: ${SWORDS[id].name}`);
            return true;
        }
        return false;
    }

    static equipShield(id: number): boolean {
        if (GameState.character.inventory.shields[id]) {
            // Check if shield is broken? The design says broken shields stay in inventory but might not be equipable or provide 0 defense.
            // For now, allow equip. Logic elsewhere handles broken state.
            GameState.character.equipment.shield = id;
            GameState.character.shield.equipped = id;
            
            // Set stats from shield def if equipping fresh? 
            // In Zeliard, shield HP is persistent per shield type.
            // Our SaveData structure tracks `current` and `max` shield HP globally for the EQUIPPED shield.
            // But wait, if we switch shields, does the old one lose its damage state?
            // The original game tracks damage per shield.
            // Our current SaveData has `shields: boolean[]` which only tracks OWNERSHIP.
            // We might need to refine SaveData if we want per-shield durability persistence.
            // DESIGN DOC SAYS: "Shield Durability - Separate damage points... Break permanently if durability depleted"
            // It implies we should swap the stats when we swap shields.
            
            // For this implementation, let's assume `shield.current` refers to the CURRENTLY EQUIPPED shield.
            // And we reset it to Max when equipping a DIFFERENT shield from a shop (buying).
            // But swapping in inventory?
            // "Shields... Take damage separate from player health... Break permanently... Can be repaired".
            // If I have two shields, use one until 10HP, then switch to another, does the first one stay at 10HP?
            // Most likely YES.
            
            // TODO: Refine SaveData to store durability PER SHIELD if strict adherence is needed.
            // For now, simplified: Switching shields resets to MAX HP of the new shield (Generous interpretation) OR
            // we treat `shield.current` as the definitive state and assume you only really "carry" the active one's damage.
            
            const def = SHIELDS[id];
            GameState.character.shield.max = def.hp;
            if (GameState.character.shield.current > def.hp) {
                GameState.character.shield.current = def.hp;
            }
            // If we assume swapping resets (easier for now, essentially free repair on swap):
            GameState.character.shield.current = def.hp;

            console.log(`Equipped shield: ${def.name}`);
            return true;
        }
        return false;
    }

    // --- Consumables ---

    static addConsumable(key: ConsumableKey, amount: number = 1) {
        GameState.character.inventory.consumables[key] += amount;
        // Cap at 99?
        if (GameState.character.inventory.consumables[key] > 99) {
            GameState.character.inventory.consumables[key] = 99;
        }
        console.log(`Added ${amount} ${CONSUMABLES[key].name}`);
    }

    static useConsumable(key: ConsumableKey, player?: Player): boolean {
        if (GameState.character.inventory.consumables[key] <= 0) return false;

        const item = CONSUMABLES[key];
        let used = false;

        switch (item.effect) {
            case 'heal_small':
                if (player) {
                    player.heal(item.value || 20);
                    used = true;
                }
                break;
            case 'heal_full':
                if (player) {
                    player.heal(player.maxHp);
                    used = true;
                }
                break;
            case 'teleport':
                // Handled by Scene logic typically, but we can trigger a flag or event
                // For now, return false so it's not consumed here if we need scene context
                console.warn('Teleport logic requires Scene context');
                return false; 
            case 'repair_shield':
                if (GameState.character.shield.equipped !== -1) {
                    GameState.character.shield.current += (item.value || 100);
                    if (GameState.character.shield.current > GameState.character.shield.max) {
                        GameState.character.shield.current = GameState.character.shield.max;
                    }
                    used = true;
                }
                break;
            case 'restore_spells':
                // Restore all charges
                // GameState.character.spells.charges = ... 
                // Need max charges definition per spell/sage level
                used = true;
                break;
            case 'shield_buff':
            case 'sword_buff':
                // Set flags/timers
                used = true;
                break;
        }

        if (used) {
            GameState.character.inventory.consumables[key]--;
            console.log(`Used ${item.name}`);
        }
        
        return used;
    }

    // --- Getters ---

    static getDamage(): number {
        const swordId = GameState.character.equipment.sword;
        const sword = SWORDS[swordId];
        // TODO: Add Sage Level multiplier logic here
        return sword ? sword.damage : 1; 
    }
}
