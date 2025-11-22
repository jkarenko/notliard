import Phaser from 'phaser';
import Door from '../entities/Door';

export default class EntitySpawner {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    spawnFromMap(map: Phaser.Tilemaps.Tilemap): { doors: Door[] } {
        const doors: Door[] = [];
        
        const objectLayer = map.getObjectLayer('Entities');
        if (!objectLayer) {
            console.warn('EntitySpawner: No "Entities" layer found in map.');
            return { doors };
        }

        objectLayer.objects.forEach(obj => {
             // In Tiled, type is a property on the object
             if (obj.type === 'door') {
                 const dest = obj.properties?.find((p: any) => p.name === 'destination')?.value;
                 const targetX = obj.properties?.find((p: any) => p.name === 'targetX')?.value;
                 const targetY = obj.properties?.find((p: any) => p.name === 'targetY')?.value;
                 
                 // Tiled objects have x, y. 
                 // Note: Tiled Y is sometimes bottom-left for tiles, but top-left for Rectangles?
                 // Usually for Insert Rectangle, it's Top-Left.
                 if (dest && obj.x !== undefined && obj.y !== undefined) {
                     const door = new Door(this.scene, obj.x, obj.y, dest, targetX, targetY);
                     doors.push(door);
                 }
             }
        });

        return { doors };
    }
}
