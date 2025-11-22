import Phaser from 'phaser';

export default class CavernScene extends Phaser.Scene {
    // private player!: Player;
    // private movementSystem!: MovementSystem;
    // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: 'CavernScene' });
    }

    create() {
        // this.movementSystem = new MovementSystem();
        // this.player = new Player(this, 10 * GRID_SIZE, 10 * GRID_SIZE, 'player_placeholder');

        this.add.text(this.cameras.main.width / 2, 50, 'Cavern Scene', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 90, 'Use arrow keys to move. Press ENTER to go to Town', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // this.cursors = this.input.keyboard!.createCursorKeys();

        this.input.keyboard!.once('keydown-ENTER', () => {
            this.scene.start('TownScene');
        });
    }

    update() {
        // Temporary: Disabled movement until CavernScene gets a tilemap
        /*
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
            this.movementSystem.move(this.player, -1, 0);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
            this.movementSystem.move(this.player, 1, 0);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
            this.movementSystem.move(this.player, 0, -1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
            this.movementSystem.move(this.player, 0, 1);
        }
        */
    }
}
