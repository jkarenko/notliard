import GameState from '../data/GameState';
import type { SaveData } from '../types/SaveData';

const SAVE_KEY_PREFIX = 'notliard_save_';
const META_KEY = 'notliard_saves_meta';

export interface SaveMeta {
    slots: Array<{
        id: number;
        exists: boolean;
        timestamp: number;
        playTime: number;
        location: string;
        tearsCollected: number;
    }>;
}

export default class SaveSystem {
    
    /**
     * Saves the current GameState to the specified slot.
     */
    static save(slotId: number): boolean {
        try {
            // Update timestamp and playtime (placeholder for now)
            GameState.data.timestamp = Date.now();
            
            // Serialize
            const json = JSON.stringify(GameState.data);
            
            // Write to storage
            localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, json);
            
            // Update metadata
            this.updateMeta(slotId);
            
            console.log(`Game saved to slot ${slotId}`);
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    /**
     * Loads the GameState from the specified slot.
     */
    static load(slotId: number): boolean {
        try {
            const json = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
            if (!json) {
                console.warn(`No save found in slot ${slotId}`);
                return false;
            }

            const data = JSON.parse(json) as SaveData;
            
            // Validate version (basic check)
            if (data.version !== GameState.data.version) {
                console.warn('Save version mismatch. Attempting to load anyway...');
                // TODO: Implement migration logic here
            }

            // Restore state
            GameState.data = data;
            
            console.log(`Game loaded from slot ${slotId}`);
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }

    /**
     * Checks if a save exists in the specified slot.
     */
    static hasSave(slotId: number): boolean {
        return !!localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
    }

    /**
     * Updates the global metadata for save slots (for UI display).
     */
    private static updateMeta(slotId: number) {
        let meta: SaveMeta = { slots: [] };
        const metaJson = localStorage.getItem(META_KEY);
        
        if (metaJson) {
            meta = JSON.parse(metaJson);
        }

        // Remove existing entry for this slot
        meta.slots = meta.slots.filter(s => s.id !== slotId);

        // Add new entry
        meta.slots.push({
            id: slotId,
            exists: true,
            timestamp: GameState.data.timestamp,
            playTime: GameState.data.playTime,
            location: GameState.currentTownName,
            tearsCollected: GameState.progression.tearsCollected
        });

        // Sort by ID
        meta.slots.sort((a, b) => a.id - b.id);

        localStorage.setItem(META_KEY, JSON.stringify(meta));
    }

    /**
     * Returns the metadata for all save slots.
     */
    static getMeta(): SaveMeta {
        const metaJson = localStorage.getItem(META_KEY);
        if (metaJson) {
            return JSON.parse(metaJson);
        }
        return { slots: [] };
    }
    
    /**
     * Wipes all save data (Dev utility).
     */
    static clearAllSaves() {
        localStorage.removeItem(META_KEY);
        for (let i = 0; i < 5; i++) {
            localStorage.removeItem(`${SAVE_KEY_PREFIX}${i}`);
        }
        console.log('All saves cleared.');
    }
}
