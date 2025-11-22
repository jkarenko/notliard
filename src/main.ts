import Phaser from 'phaser';
import GameConfig from './config/GameConfig';
import BootScene from './scenes/BootScene';
import MainMenuScene from './scenes/MainMenuScene';
import TownScene from './scenes/TownScene';
import CavernScene from './scenes/CavernScene';
import HUDScene from './scenes/HUDScene';

const config: Phaser.Types.Core.GameConfig = {
    ...GameConfig,
    scene: [BootScene, MainMenuScene, TownScene, CavernScene, HUDScene]
};

new Phaser.Game(config);

// Add a div for the game if it doesn't exist
const gameContainer = document.getElementById('game-container');
if (!gameContainer) {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = '<div id="game-container"></div>';
    } else {
        document.body.innerHTML = '<div id="game-container"></div>';
    }
}
