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
        const distance = Phaser.Math.Distance.Between(
            playerPos.x,
            playerPos.y,
            targetX,
            targetY
        );

        // Lấy giá trị từ config nếu this.damage undefined
        const baseDamage = this.damage || BowConfig.stats.baseDamage || 45;
        const optimalRange = this.optimalRange || BowConfig.stats.optimalRange || 80;
        const maxRange = this.range || BowConfig.stats.range || 350;

        // Debug log
        if (!this.damage) {
            console.warn('[Bow] this.damage is undefined, using config:', baseDamage);
        }

        // Tính damage theo khoảng cách
        let damagePercent = 1.0;
        
        if (distance <= optimalRange) {
            // Trong phạm vi tối ưu = 100% damage
            damagePercent = 1.0;
        } else if (distance <= maxRange) {
            // Ngoài phạm vi tối ưu, giảm dần
            const falloffDistance = distance - optimalRange;
            const maxFalloffDistance = maxRange - optimalRange;
            const falloffPercent = falloffDistance / maxFalloffDistance;
            
            // Linear falloff từ 100% xuống 40%
            damagePercent = 1.0 - (falloffPercent * 0.6);
        } else {
            // Quá xa = 40% damage
            damagePercent = 0.4;
        }

        let damage = Math.round(baseDamage * damagePercent);
        
        // Đảm bảo damage tối thiểu
        damage = Math.max(damage, Math.round(baseDamage * 0.4));

        // Cơ hội chí mạng (headshot)
        if (Math.random() < this.config.damage.critChance) {
            damage = Math.round(damage * this.config.damage.critMultiplier);
            this.showCritEffect('HEADSHOT!');
        }

        console.log(`[Bow] calculateDamage - Distance: ${distance.toFixed(1)}, BaseDmg: ${baseDamage}, Percent: ${(damagePercent * 100).toFixed(1)}%, Damage: ${damage}`);

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
        arrow.active = true;
        arrow.hasHit = false; // Đánh dấu chưa trúng
        
        this.arrows.push(arrow);

        // Bay mũi tên
        this.scene.tweens.add({
            targets: arrow,
            x: flipX ? startX - this.range : startX + this.range,
            duration: 500,
            onUpdate: () => {
                // Kiểm tra va chạm trong khi bay
                if (arrow.active && !arrow.hasHit) {
                    this.checkArrowCollision(arrow);
                }
            },
            onComplete: () => {
                arrow.destroy();
                const index = this.arrows.indexOf(arrow);
                if (index > -1) {
                    this.arrows.splice(index, 1);
                }
            }
        });
    }

    // Kiểm tra va chạm của mũi tên
    checkArrowCollision(arrow) {
        if (!this.scene.enemySpawner || arrow.hasHit) return;

        const enemies = this.scene.enemySpawner.getEnemies();
        
        enemies.forEach(enemy => {
            // Kiểm tra enemy còn sống
            if (!enemy.sprite || !enemy.sprite.active || enemy.health <= 0) return;

            // Tính khoảng cách giữa mũi tên và quái
            const distance = Phaser.Math.Distance.Between(
                arrow.x,
                arrow.y,
                enemy.sprite.x,
                enemy.sprite.y
            );

            // Nếu trúng (trong phạm vi 40px - tăng để dễ trúng hơn)
            if (distance < 40) {
                arrow.hasHit = true; // Đánh dấu đã trúng
                
                // Tính damage dựa trên khoảng cách từ player
                const damage = this.calculateDamage(enemy.sprite.x, enemy.sprite.y);
                
                console.log(`[Bow] Arrow hit enemy! Distance: ${distance.toFixed(1)}px, Damage: ${damage}`);
                
                // Gây damage
                enemy.takeDamage(damage);

                // Hiệu ứng trúng đích
                this.showHitEffect(arrow.x, arrow.y);

                // Xóa mũi tên
                arrow.destroy();
                const index = this.arrows.indexOf(arrow);
                if (index > -1) {
                    this.arrows.splice(index, 1);
                }
            }
        });
    }

    // Hiệu ứng trúng đích
    showHitEffect(x, y) {
        const hit = this.scene.add.circle(x, y, 10, 0xFFD700, 0.8);
        hit.setDepth(50);

        this.scene.tweens.add({
            targets: hit,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => hit.destroy()
        });
    }

    // Override destroy để xóa mũi tên
    destroy() {
        super.destroy();
        this.arrows.forEach(arrow => arrow.destroy());
        this.arrows = [];
    }
}
