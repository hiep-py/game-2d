// Vũ khí: Kiếm
import { Weapon } from './Weapon.js';
import { SwordConfig } from './sword/SwordConfig.js';
import { SwordAssets } from './sword/SwordAssets.js';
import { DamageSystem } from './core/DamageSystem.js';

export class Sword extends Weapon {
    constructor(scene, player) {
        super(scene, player, {
            name: SwordConfig.stats.name,
            damage: SwordConfig.stats.baseDamage,
            attackSpeed: SwordConfig.stats.attackSpeed,
            range: SwordConfig.stats.range,
            optimalRange: SwordConfig.stats.optimalRange,
            falloffType: SwordConfig.damage.falloffType
        });

        this.config = SwordConfig;
        this.create('sword', 25, 5);
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
            'CRIT!',
            {
                fontSize: '16px',
                fill: '#ff0000',
                fontStyle: 'bold'
            }
        );
        critText.setOrigin(0.5);
        critText.setDepth(100);

        this.scene.tweens.add({
            targets: critText,
            y: critText.y - 20,
            alpha: 0,
            duration: 500,
            onComplete: () => critText.destroy()
        });
    }

    // Animation tấn công đặc biệt cho kiếm
    playAttackAnimation() {
        if (!this.sprite) return;

        const flipX = this.player.sprite.flipX;
        
        // Hiệu ứng vệt chém
        SwordAssets.createSlashEffect(
            this.scene,
            this.sprite.x,
            this.sprite.y,
            flipX
        );
        
        // Hiệu ứng chém
        this.scene.tweens.add({
            targets: this.sprite,
            angle: flipX ? -120 : 120,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            ease: 'Power2'
        });

        this.scene.tweens.add({
            targets: this.sprite,
            angle: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 150,
            delay: 100,
            ease: 'Power2',
            onComplete: () => {
                this.isAttacking = false;
            }
        });

        // Tạo hiệu ứng slash
        this.createSlashEffect();
    }

    // Tạo hiệu ứng chém
    createSlashEffect() {
        const playerPos = this.player.getPosition();
        const flipX = this.player.sprite.flipX;
        
        const slash = this.scene.add.graphics();
        slash.lineStyle(3, 0xffffff, 0.8);
        slash.setDepth(15);
        
        const startX = flipX ? playerPos.x - 30 : playerPos.x + 30;
        const startY = playerPos.y - 10;
        const endX = flipX ? playerPos.x - 60 : playerPos.x + 60;
        const endY = playerPos.y + 10;
        
        slash.beginPath();
        slash.moveTo(startX, startY);
        slash.lineTo(endX, endY);
        slash.strokePath();

        // Fade out effect
        this.scene.tweens.add({
            targets: slash,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                slash.destroy();
            }
        });
    }
}
