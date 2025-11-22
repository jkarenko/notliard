import Phaser from 'phaser';

export const HUD_HEIGHT = 48;

export default class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HUDScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const hudY = height - HUD_HEIGHT;

        // Draw HUD Background
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000); // Black background
        graphics.fillRect(0, hudY, width, HUD_HEIGHT);
        
        graphics.lineStyle(2, 0xffffff); // White border
        graphics.strokeRect(0, hudY, width, HUD_HEIGHT);

        // Add some placeholder text
        this.add.text(10, hudY + 10, 'HP: 100/100', { fontSize: '12px', color: '#ffffff' });
        this.add.text(100, hudY + 10, 'GOLD: 0', { fontSize: '12px', color: '#ffff00' });
        this.add.text(200, hudY + 10, 'ALMAS: 0', { fontSize: '12px', color: '#ff0000' });
    }
}
