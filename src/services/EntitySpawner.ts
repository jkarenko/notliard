import Phaser from 'phaser';
import Door from '../entities/Door';
import Enemy from '../entities/Enemy';
import Slime from '../entities/enemies/Slime';

export default class EntitySpawner {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    spawnFromMap(map: Phaser.Tilemaps.Tilemap): { doors: Door[], enemies: Enemy[] } {
        const doors: Door[] = [];
        const enemies: Enemy[] = [];
        
        const objectLayer = map.getObjectLayer('Entities');
        if (!objectLayer) {
            console.warn('EntitySpawner: No "Entities" layer found in map.');
            return { doors, enemies };
        }

        objectLayer.objects.forEach(obj => {
             // In Tiled, type is a property on the object
             if (obj.type === 'door') {
                 const dest = obj.properties?.find((p: any) => p.name === 'destination')?.value;
                 const targetX = obj.properties?.find((p: any) => p.name === 'targetX')?.value;
                 const targetY = obj.properties?.find((p: any) => p.name === 'targetY')?.value;
                 const triggerType = obj.properties?.find((p: any) => p.name === 'triggerType')?.value || 'press_up';
                 const nextScene = obj.properties?.find((p: any) => p.name === 'nextScene')?.value;
                 
                 if (dest && obj.x !== undefined && obj.y !== undefined) {
                     const door = new Door(this.scene, obj.x, obj.y, dest, targetX, targetY, triggerType, nextScene);
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
        });

        return { doors, enemies };
    }
}
