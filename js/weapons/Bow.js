// Vũ khí: Cung
import { Weapon } from './Weapon.js';
import { BowConfig } from './bow/BowConfig.js';
import { BowAssets } from './bow/BowAssets.js';
import { DamageSystem } from './core/DamageSystem.js';

export class Bow extends Weapon {
    constructor(scene, player) {
        super(scene, player, {
            name: BowConfig.stats.name,
            damage: BowConfig.stats.baseDamage,
            attackSpeed: BowConfig.stats.attackSpeed,
            range: BowConfig.stats.range,
            optimalRange: BowConfig.stats.optimalRange,
            falloffType: BowConfig.damage.falloffType
        });

        this.config = BowConfig;
        this.create('bow', 20, 0);
        this.arrows = [];
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

        // Cơ hội chí mạng (headshot)
        if (Math.random() < this.config.damage.critChance) {
            damage = Math.round(damage * this.config.damage.critMultiplier);
            this.showCritEffect('HEADSHOT!');
        }

        return damage;
    }

    // Hiệu ứng chí mạng
    showCritEffect(text = 'CRIT!') {
        if (!this.sprite) return;

        const critText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 30,
            text,
            {
                fontSize: '14px',
                fill: '#FFD700',
                fontStyle: 'bold'
            }
        );
        critText.setOrigin(0.5);
        critText.setDepth(100);

        this.scene.tweens.add({
            targets: critText,
            y: critText.y - 20,
            alpha: 0,
            duration: 600,
            onComplete: () => critText.destroy()
        });
    }

    // Animation bắn cung
    playAttackAnimation() {
        if (!this.sprite) return;

        // Animation kéo cung
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 0.9,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.isAttacking = false;
                this.shootArrow();
            }
        });
    }

    // Bắn mũi tên
    shootArrow() {
        const playerPos = this.player.getPosition();
        const flipX = this.player.sprite.flipX;
        
        // Tạo mũi tên
        const arrow = this.scene.add.graphics();
        arrow.fillStyle(0x8B4513, 1);
        arrow.fillRect(0, 0, 20, 3);
        arrow.setDepth(5);
        
        const startX = flipX ? playerPos.x - 30 : playerPos.x + 30;
        arrow.setPosition(startX, playerPos.y);
        
        this.arrows.push(arrow);

        // Bay mũi tên
        this.scene.tweens.add({
            targets: arrow,
            x: flipX ? startX - this.range : startX + this.range,
            duration: 500,
            onComplete: () => {
                arrow.destroy();
                const index = this.arrows.indexOf(arrow);
                if (index > -1) {
                    this.arrows.splice(index, 1);
                }
            }
        });
    }

    // Override destroy để xóa mũi tên
    destroy() {
        super.destroy();
        this.arrows.forEach(arrow => arrow.destroy());
        this.arrows = [];
    }
}
