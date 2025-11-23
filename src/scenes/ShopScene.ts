import Phaser from 'phaser';
import { getTown } from '../data/Towns';
import { HUD_HEIGHT } from './HUDScene';

export default class ShopScene extends Phaser.Scene {
    private shopType: string = '';
    private townId: string = '';
    private background!: Phaser.GameObjects.Graphics;
    private dialogueText!: Phaser.GameObjects.Text;
    private optionsText!: Phaser.GameObjects.Text;
    private keys!: { enter: Phaser.Input.Keyboard.Key, esc: Phaser.Input.Keyboard.Key };

    // State Machine
    private state: 'GREETING' | 'MENU' | 'EXIT' = 'GREETING';
    
    constructor() {
        super({ key: 'ShopScene' });
    }

    init(data: { shopType: string, townId?: string }) {
        this.shopType = data.shopType;
        // Fallback to 'muralla' if not provided (e.g. test map)
        this.townId = data.townId || 'muralla';
        console.log(`ShopScene init: type=${this.shopType}, town=${this.townId}`);
    }

    create() {
        // Overlay on top of TownScene
        const width = this.cameras.main.width;
        const height = this.cameras.main.height - HUD_HEIGHT;

        this.background = this.add.graphics();
        
        // Dim background
        this.background.fillStyle(0x000000, 0.8);
        this.background.fillRect(0, 0, width, height);

        // Main Dialog Box
        const boxWidth = 400;
        const boxHeight = 200;
        const boxX = (width - boxWidth) / 2;
        const boxY = (height - boxHeight) / 2;

        this.background.fillStyle(0x444444);
        this.background.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.background.lineStyle(4, 0xffffff);
        this.background.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Title
        this.add.text(boxX + 20, boxY + 20, this.getShopTitle(), { 
            fontSize: '24px', 
            fontFamily: '"Courier New", monospace',
            color: '#ffff00'
        });

        // Content Text
        this.dialogueText = this.add.text(boxX + 20, boxY + 60, '', {
            fontSize: '18px',
            fontFamily: '"Courier New", monospace',
            color: '#ffffff',
            wordWrap: { width: boxWidth - 40 }
        });

        // Options Text
        this.optionsText = this.add.text(boxX + 20, boxY + 120, '', {
            fontSize: '18px',
            fontFamily: '"Courier New", monospace',
            color: '#00ff00'
        });

        this.keys = {
            enter: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
            esc: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        };

        this.startGreeting();
    }

    private getShopTitle(): string {
        switch (this.shopType) {
            case 'weapon': return 'WEAPON SHOP';
            case 'magic': return 'MAGIC SHOP';
            case 'sage': return 'SAGE';
            case 'inn': return 'INN / CHURCH';
            case 'bank': return 'BANK';
            default: return 'SHOP';
        }
    }

    private startGreeting() {
        this.state = 'GREETING';
        const town = getTown(this.townId);
        let text = "Welcome!";
        
        if (town) {
            if (this.shopType === 'sage') {
                text = `I am ${town.shops.sage?.name}. How can I help you?`;
            } else {
                text = `Welcome to the ${town.name} ${this.getShopTitle()}!`;
            }
        } else {
            text = "Town data not found.";
        }

        this.dialogueText.setText(text);
        this.optionsText.setText("Press ENTER to Exit");
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.enter)) {
            if (this.state === 'GREETING') {
                this.closeShop();
            }
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
            this.closeShop();
        }
    }

    private closeShop() {
        this.scene.stop('ShopScene');
        this.scene.resume('TownScene');
    }
}
