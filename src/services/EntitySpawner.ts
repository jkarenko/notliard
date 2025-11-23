import Phaser from 'phaser';
import Door from '../entities/Door';
import Enemy from '../entities/Enemy';
import Slime from '../entities/enemies/Slime';
import Item, { type ItemType } from '../entities/Item';
import GameState from '../data/GameState';

export default class EntitySpawner {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    spawnFromMap(map: Phaser.Tilemaps.Tilemap, mapKey: string = 'unknown_map'): { doors: Door[], enemies: Enemy[], items: Item[] } {
        const doors: Door[] = [];
        const enemies: Enemy[] = [];
        const items: Item[] = [];
        
        const objectLayer = map.getObjectLayer('Entities');
        if (!objectLayer) {
            console.warn('EntitySpawner: No "Entities" layer found in map.');
            return { doors, enemies, items };
        }

        objectLayer.objects.forEach(obj => {
             // In Tiled, type is a property on the object
             if (obj.type === 'door') {
                 const dest = obj.properties?.find((p: any) => p.name === 'destination')?.value;
                 const targetX = obj.properties?.find((p: any) => p.name === 'targetX')?.value;
                 const targetY = obj.properties?.find((p: any) => p.name === 'targetY')?.value;
                 const triggerType = obj.properties?.find((p: any) => p.name === 'triggerType')?.value || 'press_up';
                 const nextScene = obj.properties?.find((p: any) => p.name === 'nextScene')?.value;
                 const shopType = obj.properties?.find((p: any) => p.name === 'shopType')?.value;

                 if (dest && obj.x !== undefined && obj.y !== undefined) {
                     const door = new Door(this.scene, obj.x, obj.y, dest, targetX, targetY, triggerType, nextScene, shopType);
                     doors.push(door);
                 }
             }
             else if (obj.type === 'enemy') {
                 const enemyType = obj.properties?.find((p: any) => p.name === 'enemyType')?.value;
                 if (enemyType === 'slime' && obj.x !== undefined && obj.y !== undefined) {
                     const slime = new Slime(this.scene, obj.x, obj.y);
                     enemies.push(slime);
                 }
             }
             else if (obj.type === 'item') {
                 if (obj.x !== undefined && obj.y !== undefined) {
                     const itemType = obj.properties?.find((p: any) => p.name === 'itemType')?.value as ItemType;
                     const value = obj.properties?.find((p: any) => p.name === 'value')?.value;
                     const itemId = obj.properties?.find((p: any) => p.name === 'itemId')?.value;
                     // Use object ID or name as persistent ID if provided, or generate one based on map + ID
                     const persistentId = obj.name || `item_${mapKey}_${obj.id}`;

                     // Check if already collected
                     if (GameState.progression.chests.includes(persistentId) || 
                         GameState.progression.walls.includes(persistentId)) {
                         return; // Skip spawning
                     }

                     const item = new Item(this.scene, obj.x, obj.y, {
                         type: itemType,
                         value: value,
                         itemId: itemId,
                         persistentId: persistentId
                     });
                     items.push(item);
                 }
             }
        });

        return { doors, enemies, items };
    }
}
