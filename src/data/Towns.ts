export interface ShopItemDef {
    id: number | string; // ID from Swords/Shields/Consumables
    priceOverride?: number; // If different from base price
}

export interface TownShopData {
    weapon?: {
        swords: number[]; // IDs of available swords
        shields: number[]; // IDs of available shields
        repairCostFactor: number; // Multiplier for repair cost
    };
    magic?: {
        items: string[]; // Keys of available consumables
    };
    bank?: {
        exchangeRate: number; // Almas per Gold (or Gold per Alma? Design doc says 1 Alma = X Gold usually)
        // Design doc: "1 Almas = 6 Gold" in Muralla.
    };
    inn?: {
        price: number;
        name: string; // "Church" or "Inn"
    };
    sage?: {
        name: string;
        maxLevel: number; // Max upgrades available here
    };
}

export interface TownData {
    id: string;
    name: string;
    shops: TownShopData;
}

export const TOWNS: Record<string, TownData> = {
    'muralla': {
        id: 'muralla',
        name: 'Muralla Town',
        shops: {
            weapon: {
                swords: [0, 1, 2], // Training, Wise Man, Spirit
                shields: [0, 1, 2], // Clay, Wise Man, Stone
                repairCostFactor: 1.0
            },
            magic: {
                items: ['kenkoPotion', 'magiaStone', 'kiokuFeather', 'holyWater']
            },
            bank: {
                exchangeRate: 6 // 1 Alma = 6 Gold
            },
            inn: {
                price: 0,
                name: 'Church'
            },
            sage: {
                name: 'Marid',
                maxLevel: 3
            }
        }
    }
    // Add other towns here as we progress
};

export const getTown = (id: string): TownData | undefined => TOWNS[id];
