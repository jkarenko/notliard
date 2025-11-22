import Phaser from 'phaser';
import { GRID_SIZE } from '../config/Constants';

export default class Player extends Phaser.GameObjects.Sprite {
    // Logical State (Fixed Timestep)
    gridX: number;
    logicalY: number;
    velocityY: number = 0;
    isGrounded: boolean = false;
    
    // Interpolation State
    prevGridX: number;
    prevLogicalY: number;

    // Combat State
    isAttacking: boolean = false;
    private attackTimer: number = 0;
    private readonly ATTACK_DURATION: number = 200; // ms

    // Player Stats
    hp: number = 100;
    maxHp: number = 100;
    isInvulnerable: boolean = false;
    private invulnerabilityTimer: number = 0;
    private readonly INVULNERABILITY_DURATION: number = 1000; // 1 second (longer than tint flash)

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.gridX = Math.floor(x / GRID_SIZE);
        this.logicalY = y;
        
        this.prevGridX = this.gridX;
        this.prevLogicalY = this.logicalY;

        this.setOrigin(0, 0); // Align sprite to top-left of grid cell

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(GRID_SIZE, GRID_SIZE);
        body.setOffset(0, 0);
        body.setCollideWorldBounds(true);
        body.moves = false; // Disable Phaser's physics engine from moving this sprite

        this.initAnimations();
    }

    private initAnimations() {
        if (!this.scene.anims.exists('player-walk')) {
            this.scene.anims.create({
                key: 'player-walk',
                frames: [
                    { key: this.texture.key, frame: 0 },
                    { key: this.texture.key, frame: 1 }
                ],
                frameRate: 4,
                repeat: -1
            });
        }
        if (!this.scene.anims.exists('player-idle')) {
            this.scene.anims.create({
                key: 'player-idle',
                frames: [{ key: this.texture.key, frame: 0 }],
                frameRate: 1
            });
        }
        
        this.play('player-idle');
    }

    playWalkAnimation() {
        if (this.anims.currentAnim?.key !== 'player-walk') {
            this.play('player-walk');
        }
    }

    playIdleAnimation() {
        if (this.anims.currentAnim?.key !== 'player-idle') {
            this.play('player-idle');
        }
    }

    startAttack(cursors: Phaser.Types.Input.Keyboard.CursorKeys): 'front' | 'down' | null {
        if (this.isAttacking) return null;
        this.isAttacking = true;
        this.attackTimer = this.ATTACK_DURATION;
        this.setTint(0xff0000); // Red flash for attack

        let type: 'front' | 'down' = 'front';
        // Down stab if in air and holding down
        if (!this.isGrounded && cursors.down?.isDown) {
            type = 'down';
        }

        // Visual Feedback (Placeholder Hitbox)
        const offsetX = type === 'down' ? 0 : (this.flipX ? -GRID_SIZE : GRID_SIZE);
        const offsetY = type === 'down' ? GRID_SIZE : 0;
        
        // We use logical position or visual? 
        // Visuals should match visual position.
        const effect = this.scene.add.sprite(this.x + offsetX, this.y + offsetY, 'attack_effect');
        effect.setOrigin(0, 0);
        this.scene.time.delayedCall(100, () => effect.destroy());

        return type;
    }

    takeDamage(amount: number) {
        if (this.isInvulnerable) return;

        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;

        // Visual feedback
        this.setTint(0xff0000); // Red flash for damage
        this.isInvulnerable = true;
        this.invulnerabilityTimer = this.INVULNERABILITY_DURATION;

        // Flash effect (blink)
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            ease: 'Power1',
            duration: 100,
            yoyo: true,
            repeat: Math.floor(this.INVULNERABILITY_DURATION / 200) - 1, // Blink duration / (tween duration * 2)
            onComplete: () => {
                if (this.active) { // Ensure player is still active
                    this.clearTint();
                    this.alpha = 1;
                }
            }
        });

        console.log(`Player took ${amount} damage. HP: ${this.hp}`);

        if (this.hp <= 0) {
            this.die();
        }
    }

    updateLogic(delta: number) {
        if (this.isAttacking) {
            this.attackTimer -= delta;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.clearTint();
            }
        }
        if (this.isInvulnerable) {
            this.invulnerabilityTimer -= delta;
            if (this.invulnerabilityTimer <= 0) {
                this.isInvulnerable = false;
                this.clearTint(); // Ensure tint is cleared at end of invulnerability
                this.alpha = 1; // Ensure alpha is reset
            }
        }
    }

    die() {
        console.log('Player died!');
        // For now, reset position and HP. Later: GameOverScene.
        this.hp = this.maxHp;
        this.gridX = 2; // Reset to start
        this.logicalY = 2 * GRID_SIZE;
        this.velocityY = 0;
        this.isGrounded = false;
        this.clearTint();
        this.alpha = 1;
        this.isInvulnerable = false;
    }

    // Capture current state as previous for interpolation
    captureState() {
        this.prevGridX = this.gridX;
        this.prevLogicalY = this.logicalY;
    }

    // Interpolate visual position
    updateVisuals(alpha: number) {
        const currentX = this.gridX * GRID_SIZE;
        const prevX = this.prevGridX * GRID_SIZE;
        
        this.x = Phaser.Math.Linear(prevX, currentX, alpha);
        this.y = Phaser.Math.Linear(this.prevLogicalY, this.logicalY, alpha);
        
        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.x = this.x;
            body.y = this.y;
        }
    }
}
