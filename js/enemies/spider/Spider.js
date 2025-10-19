// Quái vật Spider với module hoàn chỉnh
import { Enemy } from '../Enemy.js';
import { SpiderConfig } from './SpiderConfig.js';
import { SpiderAI } from './SpiderAI.js';
import { SpiderAssets } from './SpiderAssets.js';

export class Spider extends Enemy {
    constructor(scene, x, y) {
        // Lấy difficulty multipliers
        const healthMult = scene.registry.get('enemyHealthMultiplier') || 1;
        const damageMult = scene.registry.get('enemyDamageMultiplier') || 1;

        super(scene, x, y, 'spider', {
            health: Math.round(SpiderConfig.stats.maxHealth * healthMult),
            damage: Math.round(SpiderConfig.stats.damage * damageMult),
            speed: SpiderConfig.stats.speed,
            detectionRange: SpiderConfig.ranges.detection,
            attackRange: SpiderConfig.ranges.attack,
            attackCooldown: SpiderConfig.cooldowns.attack
        });

        this.type = 'spider';
        this.config = SpiderConfig;
        
        // Khởi tạo AI
        this.ai = new SpiderAI(this);
        
        this.lastUpdateTime = Date.now();
    }

    // Override update
    update(player) {
        if (!this.sprite.active) return;

        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;

        this.target = player;
        
        // Sử dụng AI
        this.ai.update(player, deltaTime);
        
        // Cập nhật thanh máu
        this.updateHealthBar();
    }

    // Thực hiện tấn công
    performAttack(target) {
        // Tạo hiệu ứng tấn công
        SpiderAssets.createAttackEffect(
            this.scene,
            this.sprite.x,
            this.sprite.y,
            this.sprite.flipX
        );

        // Gây sát thương
        if (target && target.takeDamage) {
            target.takeDamage(this.damage);
        }

        // Animation
        this.playAttackAnimation();
    }

    // Animation tấn công
    playAttackAnimation() {
        const originalScale = this.sprite.scale;
        
        // Phóng to khi cắn
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: originalScale * 1.3,
            scaleY: originalScale * 1.3,
            duration: 100,
            yoyo: true,
            onStart: () => {
                this.sprite.setTint(this.config.visual.attackTintColor);
            },
            onComplete: () => {
                this.sprite.clearTint();
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
            this.sprite.y - 25,
            `-${damage}`,
            {
                fontSize: '14px',
                fill: '#00ff00',
                fontStyle: 'bold'
            }
        );
        damageText.setOrigin(0.5);
        damageText.setDepth(30);

        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 25,
            alpha: 0,
            duration: 700,
            ease: 'Cubic.easeOut',
            onComplete: () => damageText.destroy()
        });
    }

    // Override chết
    die() {
        if (!this.sprite || !this.sprite.active) {
            return; // Đã chết rồi
        }
        
        console.log('[Spider] Die method called');
        
        // Đánh dấu không active ngay
        this.sprite.active = false;
        this.health = 0;
        this.state = 'dead';
        
        // Dừng AI
        if (this.ai && typeof this.ai.stop === 'function') {
            this.ai.stop();
        } else if (this.ai) {
            // Nếu không có stop method, set state thủ công
            this.ai.currentState = 'dead';
        }
        
        // Tắt physics
        if (this.sprite.body) {
            this.sprite.body.enable = false;
        }
        
        // Xóa thanh máu ngay
        if (this.healthBar) {
            this.healthBar.destroy();
            this.healthBar = null;
        }
        if (this.healthBarBg) {
            this.healthBarBg.destroy();
            this.healthBarBg = null;
        }
        
        // Hiệu ứng chết
        this.sprite.setTint(this.config.visual.deathTint);
        
        // Animation chết
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scale: 0.3,
            duration: this.config.visual.deathFadeDuration,
            onComplete: () => {
                console.log('[Spider] Animation complete, destroying sprite');
                if (this.sprite) {
                    this.sprite.destroy();
                    this.sprite = null;
                }
            }
        });
    }
}
