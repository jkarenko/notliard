export interface SwordDef {
    id: number;
    name: string;
    damage: number;
    price: number; // Base price at Muralla
    description: string;
}

export const SWORDS: SwordDef[] = [
    {
        id: 0,
        name: "Training Sword",
        damage: 1,
        price: 400,
        description: "A basic sword for beginners."
    },
    {
        id: 1,
        name: "Wise Man's Sword",
        damage: 2,
        price: 1500,
        description: "A sword crafted with ancient wisdom."
    },
    {
        id: 2,
        name: "Spirit Sword",
        damage: 4,
        price: 6800,
        description: "Infused with the power of spirits."
    },
    {
        id: 3,
        name: "Knight's Sword",
        damage: 8,
        price: 0, // Trade only
        description: "A sword of great craftsmanship. Obtained by trade."
    },
    {
        id: 4,
        name: "Illumination Sword",
        damage: 16,
        price: 69800,
        description: "Radiates a blinding light."
    },
    {
        id: 5,
        name: "Fairy Flame Sword",
        damage: 32, // One-hit kill small enemies
        price: 0, // Secret
        description: "Enchanted with fairy fire. Deadly to small creatures."
    },
    // ID 6 is typically reserved for "No Weapon" or error states in some arrays, 
    // but here we just map 0-5. 
    // The design doc mentions 6 swords.
];

export const getSword = (id: number): SwordDef | undefined => SWORDS.find(s => s.id === id);
