import Phaser from 'phaser';

export default class TransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TransitionScene' });
    }

    create(data: { nextScene: string, startX: number, startY: number, direction?: 'left'|'right' }) {
        // Setup Map
        const map = this.make.tilemap({ key: 'transition_test' });
        const tileset = map.addTilesetImage('placeholder_tiles', 'placeholder_tiles');
        if (tileset) {
            map.createLayer('Terrain', tileset, 0, 0);
        }

        // Zoom 2x to match other scenes
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Calculate start/end X in world coordinates (unzoomed)
        // Map width is 160.
        const direction = data.direction || 'right';
        
        // Start off-screen relative to map bounds
        const startX = direction === 'right' ? -16 : map.widthInPixels + 16;
        const endX = direction === 'right' ? map.widthInPixels + 16 : -16;
        
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
