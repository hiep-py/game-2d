// Vũ khí: Rìu
import { Weapon } from './Weapon.js';
import { AxeConfig } from './axe/AxeConfig.js';
import { AxeAssets } from './axe/AxeAssets.js';
import { DamageSystem } from './core/DamageSystem.js';

export class Axe extends Weapon {
    constructor(scene, player) {
        super(scene, player, {
            name: AxeConfig.stats.name,
            damage: AxeConfig.stats.baseDamage,
            attackSpeed: AxeConfig.stats.attackSpeed,
            range: AxeConfig.stats.range,
            optimalRange: AxeConfig.stats.optimalRange,
            falloffType: AxeConfig.damage.falloffType
        });

        this.config = AxeConfig;
        this.create('axe', 25, 5);
    }

    // Override để tính sát thương với khoảng cách
    calculateDamage(targetX, targetY) {
        // Sử dụng vị trí player thay vì weapon sprite
        const playerPos = this.player.getPosition();
        const distance = DamageSystem.getDistance(
            playerPos.x,
            playerPos.y,
            targetX,
            targetY
        );

        let damage = DamageSystem.calculateDamage(
            this.damage,
            distance,
            this.optimalRange,
            this.range,
            this.falloffType
        );

        // Cơ hội chí mạng
        if (Math.random() < this.config.damage.critChance) {
            damage = Math.round(damage * this.config.damage.critMultiplier);
            this.showCritEffect();
        }

        return damage;
    }

    // Hiệu ứng chí mạng
    showCritEffect() {
        if (!this.sprite) return;

        const critText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 30,
            'SMASH!',
            {
                fontSize: '18px',
                fill: '#FF4500',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        critText.setOrigin(0.5);
        critText.setDepth(100);

        this.scene.tweens.add({
            targets: critText,
            y: critText.y - 25,
            scale: 1.5,
            alpha: 0,
            duration: 700,
            onComplete: () => critText.destroy()
        });
    }

    // Animation đánh rìu mạnh
    playAttackAnimation() {
        if (!this.sprite) return;

        const flipX = this.player.sprite.flipX;
        
        // Hiệu ứng đập mạnh
        AxeAssets.createSmashEffect(
            this.scene,
            this.sprite.x + (flipX ? -20 : 20),
            this.sprite.y,
            flipX
        );
        
        // Nâng rìu lên
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 20,
            angle: flipX ? -45 : 45,
            duration: 200,
            ease: 'Power2'
        });

        // Đập xuống
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y + 20,
            angle: flipX ? -135 : 135,
            duration: 200,
            delay: 200,
            ease: 'Power2'
        });

        // Trở về vị trí ban đầu
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y,
            angle: 0,
            duration: 200,
            delay: 400,
            ease: 'Power2',
            onComplete: () => {
                this.isAttacking = false;
            }
        });

        // Hiệu ứng chấn động
        this.createImpactEffect();
    }

    // Tạo hiệu ứng chấn động
    createImpactEffect() {
        this.scene.time.delayedCall(400, () => {
            const playerPos = this.player.getPosition();
            
            // Tạo vòng tròn chấn động
            const impact = this.scene.add.circle(
                playerPos.x,
                playerPos.y + 30,
                10,
                0xff6600,
                0.5
            );
            impact.setDepth(5);

            this.scene.tweens.add({
                targets: impact,
                scale: 3,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    impact.destroy();
                }
            });
        });
    }
}
