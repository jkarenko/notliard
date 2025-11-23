export interface CharacterStats {
  hp: {
    current: number;
    max: number;
  };
  shield: {
    current: number;
    max: number;
    equipped: number; // Shield ID (0-6), -1 if broken/none
  };
  gold: {
    carried: number;
    banked: number;
  };
  almas: number;
  
  equipment: {
    sword: number;    // Sword ID (0-6)
    shield: number;   // Shield ID (0-6), -1 if none
    accessory: number; // Active shoe/cape ID, -1 if none
  };
  
  spells: {
    active: number;   // Active spell index (0-6), -1 if none
    charges: number[]; // [7] - charge count per spell
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
    
    swords: boolean[]; // [7] - owned swords
    shields: boolean[]; // [7] - owned shields
  };
}

export interface ProgressionState {
  tearsCollected: number; // 0-9
  
  bosses: {
    cangrejo: boolean;
    pulpo: boolean;
    pollo: boolean;
    agar: boolean;
    vista: boolean;
    tarso: boolean;
    paguro: boolean;
    dragon: boolean;
    alguien: boolean;
    jashiin: boolean;
  };
  
  sageUpgrades: {
    muralla: number;
    satono: number;
    bosque: number;
    helada: number;
    tumba: number;
    dorado: number;
    llama: number;
    pureza: number;
  };
  
  totalUpgrades: number;
  
  // Maps/Sets are not directly serializable to JSON, so we use arrays of strings for the save format
  // We can convert to Map/Set in the runtime GameState if needed, 
  // but for the raw data structure, objects or arrays are safer.
  doors: Record<string, boolean>; // "cavern_color" -> unlocked
  chests: string[];              // Unique chest IDs collected
  walls: string[];               // Hidden wall items collected
}

export interface SaveData {
  version: number;
  timestamp: number;
  playTime: number;
  
  checkpoint: {
    sageId: number;
    townId: number;
  };
  
  character: CharacterStats;
  progression: ProgressionState;
  
  meta: {
    playerName?: string;
    difficulty?: string;
  };
}
