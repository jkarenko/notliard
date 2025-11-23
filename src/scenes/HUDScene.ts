import Phaser from 'phaser';
import GameState from '../data/GameState';
import { SWORDS } from '../data/items/Swords';
import { SHIELDS } from '../data/items/Shields';

export const HUD_HEIGHT = 100;

export default class HUDScene extends Phaser.Scene {
    private graphics!: Phaser.GameObjects.Graphics;
    private lifeBar!: Phaser.GameObjects.Graphics;
    
    // UI Elements
    private placeText!: Phaser.GameObjects.Text;
    private goldText!: Phaser.GameObjects.Text;
    private almasText!: Phaser.GameObjects.Text;
    private hpText!: Phaser.GameObjects.Text;
    
    // Equipment Text
    private swordText!: Phaser.GameObjects.Text;
    private shieldText!: Phaser.GameObjects.Text;
    private spellText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'HUDScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const hudY = height - HUD_HEIGHT;

        this.graphics = this.add.graphics();
        this.lifeBar = this.add.graphics();

        // 1. Main Background
        this.graphics.fillStyle(0x666666);
        this.graphics.fillRect(0, hudY, width, HUD_HEIGHT);

        // Layout Constants (Scaled for 640 width)
        const startX = 10;
        const stripWidth = 350; 
        const stripHeight = 24;
        
        // 2. Info Section (Left) - Blue Strips
        this.drawStrip(startX, hudY + 8, stripWidth, stripHeight); // LIFE
        this.drawStrip(startX, hudY + 38, stripWidth, stripHeight); // PLACE
        this.drawStrip(startX, hudY + 68, stripWidth, stripHeight); // GOLD/ALMAS

        // 3. Equipment Boxes (Right)
        const boxSize = 64; 
        const boxSpacing = 8;
        // Align right
        const boxStartX = width - (boxSize * 3 + boxSpacing * 2) - 10;
        const boxY = hudY + 20;

        const labels = ['SWORD', 'SHIELD', 'SPELL'];
        
        for (let i = 0; i < 3; i++) {
            const bx = boxStartX + (boxSize + boxSpacing) * i;
            
            // Label
            this.add.text(bx, hudY + 4, labels[i], {
                fontSize: '14px', 
                fontFamily: '"Courier New", monospace',
                color: '#cccccc'
            });

            // Box
            this.graphics.fillStyle(0x000000);
            this.graphics.fillRect(bx, boxY, boxSize, boxSize);
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.strokeRect(bx, boxY, boxSize, boxSize);
        }

        // 4. Text Labels (Left)
        const textConfig = { fontSize: '18px', fontFamily: '"Courier New", monospace', fontStyle: 'bold' };

        // Row 1: LIFE
        this.add.text(startX + 5, hudY + 10, 'LIFE', { ...textConfig, color: '#ffff00' });
        this.hpText = this.add.text(startX + 60, hudY + 10, '', { ...textConfig, color: '#ffffff' });

        // Row 2: PLACE
        this.add.text(startX + 5, hudY + 40, 'PLACE', { ...textConfig, color: '#00ff00' });
        this.placeText = this.add.text(startX + 70, hudY + 40, '', { ...textConfig, color: '#ffffff' });

        // Row 3: GOLD / ALMAS
        this.add.text(startX + 5, hudY + 70, 'GOLD', { ...textConfig, color: '#ffff00' });
        this.goldText = this.add.text(startX + 60, hudY + 70, '0', { ...textConfig, color: '#ffffff' });

        this.add.text(startX + 180, hudY + 70, 'ALMAS', { ...textConfig, color: '#00ff00' });
        this.almasText = this.add.text(startX + 250, hudY + 70, '0', { ...textConfig, color: '#ffffff' });

        // Equipment Text Objects (inside boxes)
        const itemTextConfig = { fontSize: '14px', fontFamily: '"Courier New", monospace', wordWrap: { width: boxSize - 4 }, align: 'center' };
        
        this.swordText = this.add.text(boxStartX + 4, boxY + 4, '', itemTextConfig);
        this.shieldText = this.add.text(boxStartX + (boxSize + boxSpacing) + 4, boxY + 4, '', itemTextConfig);
        this.spellText = this.add.text(boxStartX + (boxSize + boxSpacing) * 2 + 4, boxY + 4, '', itemTextConfig);

        // Initial Refresh
        this.refresh();
    }
    
    private drawStrip(x: number, y: number, w: number, h: number) {
        this.graphics.fillStyle(0x000088); // Dark Blue
        this.graphics.fillRect(x, y, w, h);
    }

    public refresh() {
        const startX = 10;
        const hudY = this.cameras.main.height - HUD_HEIGHT;
        
        const hp = GameState.hp;
        const maxHp = GameState.maxHp;

        // Update Life Bar
        // Max width is 260px (350 strip width - 60 label offset - 30 margin)
        // Let's position it accurately
        // Text ends around x=140 usually (LIFE 100/100)
        // Let's draw bar behind text or next to it? 
        // Original has bar next to 'LIFE'.
        // Let's draw bar at x=160, width 180
        const lifeBarWidth = Math.max(0, (hp / maxHp) * 180);
        this.lifeBar.clear();
        this.lifeBar.fillStyle(0x00ff00);
        this.lifeBar.fillRect(startX + 160, hudY + 12, lifeBarWidth, 16);

        // Update Text
        this.hpText.setText(`${Math.floor(hp)}/${maxHp}`);
        this.goldText.setText(GameState.gold.toString());
        this.almasText.setText(GameState.almas.toString());
        this.placeText.setText(GameState.currentTownName);

        // Update Equipment
        const swordId = GameState.character.equipment.sword;
        const sword = SWORDS[swordId];
        this.swordText.setText(sword ? sword.name.replace(/Sword/g, '').trim() : 'None');

        const shieldId = GameState.character.equipment.shield;
        if (shieldId >= 0) {
            const shield = SHIELDS[shieldId];
            this.shieldText.setText(shield ? shield.name.replace(/Shield/g, '').trim() : 'None');
        } else {
            this.shieldText.setText('None');
        }

        // Spell (Placeholder)
        this.spellText.setText('None');
    }
}
