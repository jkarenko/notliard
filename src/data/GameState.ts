import type { SaveData, CharacterStats, ProgressionState } from '../types/SaveData';

const DEFAULT_CHARACTER: CharacterStats = {
  hp: {
    current: 100,
    max: 100
  },
  shield: {
    current: 0,
    max: 0,
    equipped: -1
  },
  gold: {
    carried: 0,
    banked: 0
  },
  almas: 0,
  equipment: {
    sword: 0, // Training Sword
    shield: -1,
    accessory: -1
  },
  spells: {
    active: -1,
    charges: [0, 0, 0, 0, 0, 0, 0]
  },
  inventory: {
    consumables: {
      kenkoPotion: 0,
      juennFruit: 0,
      redPotion: 0,
      bluePotion: 0,
      magiaStone: 0,
      sabreOil: 0,
      kiokuFeather: 0,
      holyWater: 0,
      chikaraPowder: 0
    },
    special: {
      ruzeriaShoes: false,
      pirikaShoes: false,
      silkarnShoes: false,
      asbestosCape: false,
      feruzaShoes: false,
      heroCrest: false,
      gloryCrest: false,
      elfCrest: false,
      lionsHeadKey: false
    },
    keys: {
      red: 0,
      blue: 0,
      purple: 0
    },
    swords: [true, false, false, false, false, false, false],
    shields: [false, false, false, false, false, false, false]
  }
};

const DEFAULT_PROGRESSION: ProgressionState = {
  tearsCollected: 0,
  bosses: {
    cangrejo: false,
    pulpo: false,
    pollo: false,
    agar: false,
    vista: false,
    tarso: false,
    paguro: false,
    dragon: false,
    alguien: false,
    jashiin: false
  },
  sageUpgrades: {
    muralla: 0,
    satono: 0,
    bosque: 0,
    helada: 0,
    tumba: 0,
    dorado: 0,
    llama: 0,
    pureza: 0
  },
  totalUpgrades: 0,
  doors: {},
  chests: [],
  walls: []
};

class GameState {
  public data: SaveData;

  constructor() {
    this.data = this.createDefaultState();
  }

  private createDefaultState(): SaveData {
    // Deep copy defaults to avoid reference issues
    return {
      version: 1,
      timestamp: Date.now(),
      playTime: 0,
      checkpoint: {
        sageId: 0,
        townId: 0
      },
      character: JSON.parse(JSON.stringify(DEFAULT_CHARACTER)),
      progression: JSON.parse(JSON.stringify(DEFAULT_PROGRESSION)),
      meta: {}
    };
  }

  reset() {
    this.data = this.createDefaultState();
  }

  // Accessors for common properties to simplify usage elsewhere
  get character() { return this.data.character; }
  get progression() { return this.data.progression; }
  
  // Helpers for nested properties commonly accessed
  get hp() { return this.data.character.hp.current; }
  set hp(value: number) { this.data.character.hp.current = value; }
  
  get maxHp() { return this.data.character.hp.max; }
  set maxHp(value: number) { this.data.character.hp.max = value; }
  
  get gold() { return this.data.character.gold.carried; }
  set gold(value: number) { this.data.character.gold.carried = value; }
  
  get almas() { return this.data.character.almas; }
  set almas(value: number) { this.data.character.almas = value; }

  // Mapping helper for legacy support or UI
  get currentTownName(): string {
    const TOWNS = [
      'Muralla Town', 'Satono Town', 'Bosque Village', 'Helada Town', 
      'Tumba Town', 'Dorado Town', 'Llama Town', 'Pureza Town', 
      'Esco Village', "Felishika's Castle"
    ];
    return TOWNS[this.data.checkpoint.townId] || 'Unknown';
  }
}

export default new GameState();
