import Phaser from 'phaser';

export const HUD_HEIGHT = 48;

export default class HUDScene extends Phaser.Scene {
    private graphics!: Phaser.GameObjects.Graphics;
    private lifeBar!: Phaser.GameObjects.Graphics;
    
    // UI Elements
    private placeText!: Phaser.GameObjects.Text;
    private goldText!: Phaser.GameObjects.Text;
    private almasText!: Phaser.GameObjects.Text;
    private hpText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'HUDScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const hudY = height - HUD_HEIGHT;

        this.graphics = this.add.graphics();
        this.lifeBar = this.add.graphics(); // Separate graphics for life bar

        // 1. Main Background (Gray)
        this.graphics.fillStyle(0x666666);
        this.graphics.fillRect(0, hudY, width, HUD_HEIGHT);

        // 2. Info Section (Left) - Blue Background Panel?
        // The original has distinct blue strips. Let's draw one big blue box or strips.
        // Let's do strips for authentic look.
        
        const startX = 4;
        const stripWidth = 200;
        const stripHeight = 12;
        const spacing = 2;

        // Strip 1: LIFE
        this.drawStrip(startX, hudY + 2, stripWidth, stripHeight);
        // Strip 2: PLACE
        this.drawStrip(startX, hudY + 14 + spacing, stripWidth, stripHeight);
        // Strip 3: GOLD/ALMAS
        this.drawStrip(startX, hudY + 26 + spacing * 2, stripWidth, stripHeight);

        // 3. Equipment Boxes (Right)
        const boxSize = 32;
        const boxY = hudY + 8;
        const boxStartX = 210;
        const boxSpacing = 4;

        for (let i = 0; i < 3; i++) {
            const bx = boxStartX + (boxSize + boxSpacing) * i;
            // Black fill
            this.graphics.fillStyle(0x000000);
            this.graphics.fillRect(bx, boxY, boxSize, boxSize);
            // White border
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.strokeRect(bx, boxY, boxSize, boxSize);
        }

        // 4. Text Labels
        const textConfig = { fontSize: '10px', fontFamily: 'monospace', resolution: 2 };

        // Row 1: LIFE
        this.add.text(startX + 2, hudY + 3, 'LIFE', { ...textConfig, color: '#ffff00' });
        // Life Bar
        // Initial full bar
        this.lifeBar.fillStyle(0x00ff00);
        this.lifeBar.fillRect(startX + 35, hudY + 5, 100, 6);
        this.hpText = this.add.text(startX + 35, hudY + 3, '100/100', { ...textConfig, color: '#ffffff' });

        // Row 2: PLACE
        this.add.text(startX + 2, hudY + 14 + spacing + 1, 'PLACE', { ...textConfig, color: '#00ff00' });
        this.placeText = this.add.text(startX + 45, hudY + 14 + spacing + 1, 'Muralla Town', { ...textConfig, color: '#ffffff' });

        // Row 3: GOLD / ALMAS
        this.add.text(startX + 2, hudY + 26 + spacing * 2 + 1, 'GOLD', { ...textConfig, color: '#ffff00' });
        this.goldText = this.add.text(startX + 35, hudY + 26 + spacing * 2 + 1, '0', { ...textConfig, color: '#ffffff' });

        this.add.text(startX + 90, hudY + 26 + spacing * 2 + 1, 'ALMAS', { ...textConfig, color: '#00ff00' });
        this.almasText = this.add.text(startX + 130, hudY + 26 + spacing * 2 + 1, '0', { ...textConfig, color: '#ffffff' });
    }

    private drawStrip(x: number, y: number, w: number, h: number) {
        this.graphics.fillStyle(0x000088); // Dark Blue
        this.graphics.fillRect(x, y, w, h);
    }

    // Method to update stats (can be called from TownScene)
    public updateStats(hp: number, maxHp: number, gold: number, almas: number, place: string) {
        const startX = 4; // Same as in create
        const hudY = this.cameras.main.height - HUD_HEIGHT; // Same as in create

        const lifeBarWidth = (hp / maxHp) * 100; // Max 100 width
        this.lifeBar.clear();
        this.lifeBar.fillStyle(0x00ff00); // Green color
        this.lifeBar.fillRect(startX + 35, hudY + 5, lifeBarWidth, 6);

        this.hpText.setText(`${hp}/${maxHp}`);
        this.goldText.setText(gold.toString());
        this.almasText.setText(almas.toString());
        this.placeText.setText(place);
    }
}
