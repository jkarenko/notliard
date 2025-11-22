import Phaser from 'phaser';

export default class TransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TransitionScene' });
    }

    create(data: { nextScene: string, startX: number, startY: number, direction?: 'left'|'right' }) {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');

        // Determine direction
        // If moving to Cavern (from Town), usually Left->Right.
        // If moving to Town (from Cavern), usually Right->Left.
        // We can infer or use data.direction.
        // For now, default to Left->Right unless specified.
        
        const direction = data.direction || 'right';
        const startX = direction === 'right' ? -20 : this.cameras.main.width + 20;
        const endX = direction === 'right' ? this.cameras.main.width + 20 : -20;
        const y = this.cameras.main.height / 2;

        // Create sprite
        const player = this.add.sprite(startX, y, 'player_spritesheet');
        player.play('player-walk');
        player.setFlipX(direction === 'left'); // Flip if walking left

        // Tween across screen
        this.tweens.add({
            targets: player,
            x: endX,
            duration: 2000, // 2 seconds walk
            onComplete: () => {
                this.scene.start(data.nextScene, { startX: data.startX, startY: data.startY });
            }
        });
    }
}
