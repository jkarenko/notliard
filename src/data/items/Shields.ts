export interface ShieldDef {
    id: number;
    name: string;
    hp: number; // Durability
    price: number;
    description: string;
}

export const SHIELDS: ShieldDef[] = [
    {
        id: 0,
        name: "Clay Shield",
        hp: 200,
        price: 50,
        description: "A fragile shield made of clay."
    },
    {
        id: 1,
        name: "Wise Man's Shield",
        hp: 400,
        price: 150,
        description: "Slightly better than clay."
    },
    {
        id: 2,
        name: "Stone Shield",
        hp: 800,
        price: 2980,
        description: "A durable shield carved from stone."
    },
    {
        id: 3,
        name: "Honor Shield",
        hp: 1600,
        price: 9800,
        description: "A large shield offering great protection."
    },
    {
        id: 4,
        name: "Light Shield",
        hp: 3200,
        price: 14800,
        description: "Made of the magic metal Megane."
    },
    {
        id: 5,
        name: "Titanium Shield",
        hp: 6400,
        price: 39800,
        description: "The strongest shield known to man."
    }
];

export const getShield = (id: number): ShieldDef | undefined => SHIELDS.find(s => s.id === id);
