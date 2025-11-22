import Phaser from 'phaser';

const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    parent: 'game-container',
    backgroundColor: '#333333',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // No gravity for grid-based movement
            debug: false // Set to true for debugging physics bodies
        }
    },
    render: {
        pixelArt: true // Ensures crisp pixel art scaling
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [] // Placeholder for scenes, will be added dynamically
};

export default GameConfig;
