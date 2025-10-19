// Quái vật: Người xương
import { Enemy } from './Enemy.js';

export class Skeleton extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'skeleton', {
            health: 50,
            damage: 15,
            speed: 60,
            detectionRange: 250,
            attackRange: 35,
            attackCooldown: 1500
        });

        this.type = 'skeleton';
    }

    // Override animation tấn công
    playAttackAnimation() {
        // Hiệu ứng tấn công đặc biệt
        const originalX = this.sprite.x;
        
        // Lao về phía người chơi
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.target.sprite.x > this.sprite.x ? 
                this.sprite.x + 20 : this.sprite.x - 20,
            duration: 100,
            yoyo: true,
            onStart: () => {
                this.sprite.setTint(0xff0000);
            },
            onComplete: () => {
                this.sprite.clearTint();
                this.sprite.x = originalX;
            }
        });
    }
}
