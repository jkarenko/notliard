export type ConsumableKey = 
    'kenkoPotion' | 'juennFruit' | 'redPotion' | 'bluePotion' | 
    'magiaStone' | 'sabreOil' | 'kiokuFeather' | 'holyWater' | 'chikaraPowder';

export interface ConsumableDef {
    key: ConsumableKey;
    name: string;
    price: number;
    description: string;
    effect: 'heal_small' | 'heal_full' | 'shield_buff' | 'sword_buff' | 'teleport' | 'repair_shield' | 'restore_spells';
    value?: number; // Magnitude of effect (e.g. heal amount, duration)
}

export const CONSUMABLES: Record<ConsumableKey, ConsumableDef> = {
    kenkoPotion: {
        key: 'kenkoPotion',
        name: "Ken'Ko Potion",
        price: 50,
        description: "Restores a small amount of health.",
        effect: 'heal_small',
        value: 20
    },
    juennFruit: {
        key: 'juennFruit',
        name: "Ju-enn Fruit",
        price: 240,
        description: "Fully restores health.",
        effect: 'heal_full'
    },
    redPotion: {
        key: 'redPotion',
        name: "Red Potion",
        price: 0, // Drop only
        description: "Restores a small amount of health.",
        effect: 'heal_small',
        value: 20
    },
    bluePotion: {
        key: 'bluePotion',
        name: "Blue Potion",
        price: 0, // Drop only
        description: "Fully restores health.",
        effect: 'heal_full'
    },
    magiaStone: {
        key: 'magiaStone',
        name: "Magia Stone",
        price: 1000,
        description: "Creates rotating protective orbs.",
        effect: 'shield_buff'
    },
    sabreOil: {
        key: 'sabreOil',
        name: "Sabre Oil",
        price: 1200,
        description: "Temporarily increases sword damage.",
        effect: 'sword_buff',
        value: 30000 // 30 seconds?
    },
    kiokuFeather: {
        key: 'kiokuFeather',
        name: "Kioku Feather",
        price: 350,
        description: "Teleports you back to the last town.",
        effect: 'teleport'
    },
    holyWater: {
        key: 'holyWater',
        name: "Holy Water of Acero",
        price: 100,
        description: "Repairs shield by 100 HP.",
        effect: 'repair_shield',
        value: 100
    },
    chikaraPowder: {
        key: 'chikaraPowder',
        name: "Chikara Powder",
        price: 320,
        description: "Restores spell charges.",
        effect: 'restore_spells'
    }
};
