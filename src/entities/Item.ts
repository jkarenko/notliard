import Phaser from 'phaser';
import { GRID_SIZE } from '../config/Constants';
import GameState from '../data/GameState';
import InventorySystem from '../systems/InventorySystem';
import type { ConsumableKey } from '../data/items/Consumables';

export type ItemType = 'almas' | 'gold' | 'consumable' | 'key' | 'special';

export interface ItemProperties {
    type: ItemType;
    value?: number; // Amount for gold/almas
    itemId?: string; // Key for consumables/special items
    persistentId?: string; // For tracking collected status in GameState
}

export default class Item extends Phaser.GameObjects.Sprite {
    gridX: number;
    logicalY: number;
    private itemType: ItemType;
    private value: number;
    private itemId: string;
    private persistentId?: string;

    constructor(scene: Phaser.Scene, x: number, y: number, props: ItemProperties) {
        super(scene, x, y, 'items', 0); // Placeholder texture 'items'

        this.gridX = Math.floor(x / GRID_SIZE);
        this.logicalY = y;
        this.itemType = props.type;
        this.value = props.value || 0;
        this.itemId = props.itemId || '';
        this.persistentId = props.persistentId;

        this.setOrigin(0, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(GRID_SIZE, GRID_SIZE);
        body.setOffset(0, 0); // No gravity for now, items float or sit?
        // If items obey gravity, we need MovementSystem to handle them.
        // For now, assume static placement.

        this.setVisuals();
    }

    private setVisuals() {
        // Placeholder colors/frames until we have assets
        switch (this.itemType) {
            case 'almas':
                this.setTint(0xff00ff); // Pink
                break;
            case 'gold':
                this.setTint(0xffff00); // Yellow
                break;
            case 'consumable':
                this.setTint(0x00ff00); // Green
                break;
            case 'key':
                this.setTint(0x0000ff); // Blue
                break;
        }
    }

    collect(): boolean {
        console.log(`Collecting item: ${this.itemType}`);
        
        // Check persistence
        if (this.persistentId) {
            if (GameState.progression.chests.includes(this.persistentId)) {
                return false; // Already collected (shouldn't spawn really)
            }
            GameState.progression.chests.push(this.persistentId);
        }

        switch (this.itemType) {
            case 'almas':
                GameState.almas += this.value;
                break;
            case 'gold':
                GameState.gold += this.value;
                break;
            case 'consumable':
                if (this.itemId) {
                    InventorySystem.addConsumable(this.itemId as ConsumableKey, this.value || 1);
                }
                break;
            case 'key':
                // InventorySystem.addKey(this.itemId);
                break;
        }

        this.destroy();
        return true;
    }
}
