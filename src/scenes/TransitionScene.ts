import Phaser from 'phaser';
import { GRID_SIZE } from '../config/Constants';
import { HUD_HEIGHT } from './HUDScene';

export default class TransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TransitionScene' });
    }

    create(data: { nextScene: string, startX: number, startY: number, direction?: 'left'|'right' }) {
        // Launch HUD
        this.scene.launch('HUDScene');

        // Setup Map
        const map = this.make.tilemap({ key: 'transition_test' });
        const tileset = map.addTilesetImage('placeholder_tiles', 'placeholder_tiles');
        if (tileset) {
            map.createLayer('Terrain', tileset, 0, 0);
        }

        // Camera Setup (Dynamic Zoom)
        const viewportHeight = this.cameras.main.height - HUD_HEIGHT;
        this.cameras.main.setViewport(0, 0, this.cameras.main.width, viewportHeight);
        
        const zoom = this.scale.width / (26 * GRID_SIZE);
        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.scrollY = 0; // Ensure it doesn't scroll weirdly
        
        // Calculate start/end X in world coordinates (unzoomed)
        // Map width is 160.
        const direction = data.direction || 'right';
        
        // Start off-screen relative to map bounds
        const startX = direction === 'right' ? -16 : map.widthInPixels + 16;
        const endX = direction === 'right' ? map.widthInPixels + 3*16 : -16;
        
        // Walk on floor (y=104 based on map row 13)
        const y = 104;

        // Create sprite
        const player = this.add.sprite(startX, y, 'player_spritesheet');
        player.setOrigin(0, 0); // Match Player entity origin
        player.play('player-walk');
        player.setFlipX(direction === 'left');

        // Tween across screen
        this.tweens.add({
            targets: player,
            x: endX,
            duration: 2000, 
            onComplete: () => {
                this.scene.start(data.nextScene, { startX: data.startX, startY: data.startY });
            }
        });
    }
}
