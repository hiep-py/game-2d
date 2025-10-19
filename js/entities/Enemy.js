// Class cơ bản cho tất cả quái vật
export class Enemy {
    constructor(scene, x, y, texture, config = {}) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
        
        // Thuộc tính
        this.maxHealth = config.health || 50;
        this.health = this.maxHealth;
        this.damage = config.damage || 10;
        this.speed = config.speed || 80;
        this.detectionRange = config.detectionRange || 200;
        this.attackRange = config.attackRange || 40;
        this.attackCooldown = config.attackCooldown || 1000;
        this.lastAttackTime = 0;
        
        // AI state
        this.target = null;
        this.state = 'idle'; // idle, chase, attack
        
        // Tạo thanh máu
        this.createHealthBar();
    }

    // Tạo thanh máu
    createHealthBar() {
        this.healthBarBg = this.scene.add.rectangle(
            this.sprite.x,
            this.sprite.y - 40,
            40,
            4,
            0x000000
        );
        this.healthBarBg.setDepth(20);

        this.healthBar = this.scene.add.rectangle(
            this.sprite.x,
            this.sprite.y - 40,
            40,
            4,
            0xff0000
        );
        this.healthBar.setDepth(21);
    }

    // Cập nhật mỗi frame
    update(player) {
        if (!this.sprite.active) return;

        this.target = player;
        this.updateAI();
        this.updateHealthBar();
    }

    // AI đơn giản
    updateAI() {
        if (!this.target) return;

        const distance = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            this.target.sprite.x,
            this.target.sprite.y
        );

        // Phát hiện người chơi
        if (distance < this.detectionRange) {
            if (distance < this.attackRange) {
                this.state = 'attack';
                this.attack();
            } else {
                this.state = 'chase';
                this.chaseTarget();
            }
        } else {
            this.state = 'idle';
            this.sprite.setVelocity(0);
        }
    }

    // Đuổi theo mục tiêu
    chaseTarget() {
        if (!this.target) return;

        const angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            this.target.sprite.x,
            this.target.sprite.y
        );

        this.sprite.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );

        // Flip sprite theo hướng di chuyển
        this.sprite.flipX = this.sprite.body.velocity.x < 0;
    }

    // Tấn công
    attack() {
        this.sprite.setVelocity(0);
        
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime > this.attackCooldown) {
            this.lastAttackTime = currentTime;
            // Gây sát thương cho người chơi (sẽ implement sau)
            this.playAttackAnimation();
        }
    }

    // Animation tấn công
    playAttackAnimation() {
        // Hiệu ứng nhấp nháy đỏ
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.sprite.clearTint();
        });
    }

    // Nhận sát thương
    takeDamage(damage) {
        this.health -= damage;
        
        // Hiệu ứng nhận sát thương
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.sprite.clearTint();
        });

        if (this.health <= 0) {
            this.die();
        }
    }

    // Cập nhật thanh máu
    updateHealthBar() {
        if (!this.healthBar || !this.healthBarBg) return;

        const healthPercent = this.health / this.maxHealth;
        
        this.healthBarBg.setPosition(this.sprite.x, this.sprite.y - 40);
        this.healthBar.setPosition(
            this.sprite.x - 20 + (healthPercent * 20),
            this.sprite.y - 40
        );
        this.healthBar.width = 40 * healthPercent;
    }

    // Chết
    die() {
        // Hiệu ứng chết
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scale: 0.5,
            duration: 300,
            onComplete: () => {
                this.destroy();
            }
        });
    }

    // Hủy enemy
    destroy() {
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.sprite) this.sprite.destroy();
    }

    // Lấy vị trí
    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
}
