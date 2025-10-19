// Quái vật Skeleton với module hoàn chỉnh
import { Enemy } from '../Enemy.js';
import { SkeletonConfig } from './SkeletonConfig.js';
import { SkeletonAI } from './SkeletonAI.js';
import { SkeletonAssets } from './SkeletonAssets.js';

export class Skeleton extends Enemy {
    constructor(scene, x, y) {
        // Lấy difficulty multipliers
        const healthMult = scene.registry.get('enemyHealthMultiplier') || 1;
        const damageMult = scene.registry.get('enemyDamageMultiplier') || 1;

        // Sử dụng config từ module
        super(scene, x, y, 'skeleton', {
            health: Math.round(SkeletonConfig.stats.maxHealth * healthMult),
            damage: Math.round(SkeletonConfig.stats.damage * damageMult),
            speed: SkeletonConfig.stats.speed,
            detectionRange: SkeletonConfig.ranges.detection,
            attackRange: SkeletonConfig.ranges.attack,
            attackCooldown: SkeletonConfig.cooldowns.attack
        });

        this.type = 'skeleton';
        this.config = SkeletonConfig;
        
        // Khởi tạo AI nâng cao
        this.ai = new SkeletonAI(this);
        
        // Thời gian cho delta
        this.lastUpdateTime = Date.now();
    }

    // Override update để sử dụng AI mới
    update(player) {
        if (!this.sprite.active) return;

        // Tính delta time
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;

        this.target = player;
        
        // Sử dụng AI nâng cao
        this.ai.update(player, deltaTime);
        
        // Cập nhật thanh máu
        this.updateHealthBar();
        
        // Hiển thị state (debug - có thể tắt)
        this.updateStateDisplay();
    }

    // Hiển thị trạng thái AI (debug) - TẮT để không làm rối màn hình
    updateStateDisplay() {
        // Tắt debug display
        // Bỏ comment dòng dưới nếu muốn xem AI state
        return;
        
        /* 
        if (!this.stateText) {
            this.stateText = this.scene.add.text(
                this.sprite.x,
                this.sprite.y - 55,
                '',
                {
                    fontSize: '9px',
                    fill: '#ffff00',
                    backgroundColor: '#000000',
                    padding: { x: 2, y: 1 }
                }
            );
            this.stateText.setDepth(25);
            this.stateText.setOrigin(0.5);
        }

        const state = this.ai.getState();
        const healthPercent = Math.floor((this.health / this.maxHealth) * 100);
        this.stateText.setText(`${state} ${healthPercent}%`);
        this.stateText.setPosition(this.sprite.x, this.sprite.y - 55);
        */
    }

    // Thực hiện tấn công
    performAttack(target) {
        // Tạo hiệu ứng tấn công
        SkeletonAssets.createAttackEffect(
            this.scene,
            this.sprite.x,
            this.sprite.y,
            this.sprite.flipX
        );

        // Gây sát thương cho người chơi
        if (target && target.takeDamage) {
            target.takeDamage(this.damage);
        }

        // Animation tấn công
        this.playAttackAnimation();
    }

    // Override animation tấn công
    playAttackAnimation() {
        const originalX = this.sprite.x;
        const moveDistance = 25;
        
        // Lao về phía mục tiêu
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.target.sprite.x > this.sprite.x ? 
                this.sprite.x + moveDistance : this.sprite.x - moveDistance,
            duration: 100,
            yoyo: true,
            onStart: () => {
                this.sprite.setTint(this.config.visual.attackTintColor);
            },
            onComplete: () => {
                this.sprite.clearTint();
                this.sprite.x = originalX;
            }
        });
    }

    // Override nhận sát thương
    takeDamage(damage) {
        // Kiểm tra cooldown để tránh hit nhiều lần
        const currentTime = Date.now();
        if (currentTime - this.lastHitTime < this.hitCooldown) {
            return; // Ignore hit nếu còn trong cooldown
        }
        this.lastHitTime = currentTime;

        // Giảm máu
        this.health = Math.max(0, this.health - damage);
        
        // Hiệu ứng
        this.sprite.setTint(this.config.visual.damageTintColor);
        this.scene.time.delayedCall(this.config.visual.tintDuration, () => {
            if (this.sprite && this.sprite.active) {
                this.sprite.clearTint();
            }
        });

        // Text sát thương
        this.showDamageText(damage);

        // Cập nhật thanh máu
        this.updateHealthBar();

        // Kiểm tra chết
        if (this.health <= 0) {
            this.die();
        }
    }

    // Hiển thị text sát thương
    showDamageText(damage) {
        const damageText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 30,
            `-${damage}`,
            {
                fontSize: '16px',
                fill: '#ff0000',
                fontStyle: 'bold'
            }
        );
        damageText.setOrigin(0.5);
        damageText.setDepth(30);

        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 30,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => damageText.destroy()
        });
    }

    // Override chết
    die() {
        // Tạo hiệu ứng chết đặc biệt
        SkeletonAssets.createDeathEffect(
            this.scene,
            this.sprite.x,
            this.sprite.y
        );

        // Fade out
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scale: 0.5,
            duration: this.config.visual.deathFadeDuration,
            onComplete: () => {
                this.destroy();
            }
        });
    }

    // Override destroy
    destroy() {
        if (this.stateText) this.stateText.destroy();
        super.destroy();
    }

    // Static method để tải assets (được gọi từ AssetRegistry)
    static loadAssets(scene) {
        // Assets được tự động load qua AssetRegistry
        // Không cần làm gì ở đây
    }
}
