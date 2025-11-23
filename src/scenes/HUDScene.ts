import Phaser from 'phaser';
import GameState from '../data/GameState';
import { SWORDS } from '../data/items/Swords';
import { SHIELDS } from '../data/items/Shields';

export const HUD_HEIGHT = 48;

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

        // 2. Info Section (Left) - Blue Strips
        const startX = 4;
        const stripWidth = 190;
        const stripHeight = 12;
        const spacing = 2;

        this.drawStrip(startX, hudY + 2, stripWidth, stripHeight); // LIFE
        this.drawStrip(startX, hudY + 14 + spacing, stripWidth, stripHeight); // PLACE
        this.drawStrip(startX, hudY + 26 + spacing * 2, stripWidth, stripHeight); // GOLD/ALMAS

        // 3. Equipment Boxes (Right)
        const boxSize = 32;
        const boxY = hudY + 8;
        const boxStartX = 200;
        const boxSpacing = 4;

        const labels = ['SWORD', 'SHIELD', 'SPELL'];
        
        for (let i = 0; i < 3; i++) {
            const bx = boxStartX + (boxSize + boxSpacing) * i;
            
            // Label
            this.add.text(bx, hudY + 1, labels[i], { 
                fontSize: '8px', 
                fontFamily: 'monospace',
                color: '#cccccc' 
            });

            // Box
            this.graphics.fillStyle(0x000000);
            this.graphics.fillRect(bx, boxY, boxSize, boxSize);
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.strokeRect(bx, boxY, boxSize, boxSize);
        }

        // 4. Text Labels
        const textConfig = { fontSize: '10px', fontFamily: 'monospace', resolution: 2 };

        // Row 1: LIFE
        this.add.text(startX + 2, hudY + 3, 'LIFE', { ...textConfig, color: '#ffff00' });
        this.hpText = this.add.text(startX + 35, hudY + 3, '', { ...textConfig, color: '#ffffff' });

        // Row 2: PLACE
        this.add.text(startX + 2, hudY + 14 + spacing + 1, 'PLACE', { ...textConfig, color: '#00ff00' });
        this.placeText = this.add.text(startX + 45, hudY + 14 + spacing + 1, '', { ...textConfig, color: '#ffffff' });

        // Row 3: GOLD / ALMAS
        this.add.text(startX + 2, hudY + 26 + spacing * 2 + 1, 'GOLD', { ...textConfig, color: '#ffff00' });
        this.goldText = this.add.text(startX + 35, hudY + 26 + spacing * 2 + 1, '0', { ...textConfig, color: '#ffffff' });

        this.add.text(startX + 90, hudY + 26 + spacing * 2 + 1, 'ALMAS', { ...textConfig, color: '#00ff00' });
        this.almasText = this.add.text(startX + 130, hudY + 26 + spacing * 2 + 1, '0', { ...textConfig, color: '#ffffff' });

        // Equipment Text Objects (inside boxes)
        const itemTextConfig = { fontSize: '8px', fontFamily: 'monospace', wordWrap: { width: 30 } };
        
        this.swordText = this.add.text(boxStartX + 2, boxY + 2, '', itemTextConfig);
        this.shieldText = this.add.text(boxStartX + (boxSize + boxSpacing) + 2, boxY + 2, '', itemTextConfig);
        this.spellText = this.add.text(boxStartX + (boxSize + boxSpacing) * 2 + 2, boxY + 2, '', itemTextConfig);

        // Initial Refresh
        this.refresh();
    }

    private drawStrip(x: number, y: number, w: number, h: number) {
        this.graphics.fillStyle(0x000088); // Dark Blue
        this.graphics.fillRect(x, y, w, h);
    }

    public refresh() {
        const startX = 4;
        const hudY = this.cameras.main.height - HUD_HEIGHT;
        
        const hp = GameState.hp;
        const maxHp = GameState.maxHp;

        // Update Life Bar
        const lifeBarWidth = Math.max(0, (hp / maxHp) * 100);
        this.lifeBar.clear();
        this.lifeBar.fillStyle(0x00ff00);
        this.lifeBar.fillRect(startX + 35, hudY + 5, lifeBarWidth, 6);

        // Update Text
        this.hpText.setText(`${Math.floor(hp)}/${maxHp}`);
        this.goldText.setText(GameState.gold.toString());
        this.almasText.setText(GameState.almas.toString());
        this.placeText.setText(GameState.currentTownName);

        // Update Equipment
        const swordId = GameState.character.equipment.sword;
        const sword = SWORDS[swordId];
        this.swordText.setText(sword ? sword.name.split(' ').join('\n') : 'None');

        const shieldId = GameState.character.equipment.shield;
        if (shieldId >= 0) {
            const shield = SHIELDS[shieldId];
            this.shieldText.setText(shield ? shield.name.split(' ').join('\n') : 'None');
            // TODO: Visualize shield HP/Durability?
        } else {
            this.shieldText.setText('None');
        }

        // Spell (Placeholder)
        this.spellText.setText('None');
    }
}
