export interface CharacterState {
    hp: number;
    maxHp: number;
    gold: number;
    almas: number;
    currentTown: string;
}

class GameState {
    character: CharacterState = {
        hp: 100,
        maxHp: 100,
        gold: 1000, // Starting gold for testing
        almas: 0,
        currentTown: 'Muralla Town'
    };

    // Helper to reset state (e.g. new game)
    reset() {
        this.character = {
            hp: 100,
            maxHp: 100,
            gold: 0,
            almas: 0,
            currentTown: 'Muralla Town'
        };
    }
}

export default new GameState();
