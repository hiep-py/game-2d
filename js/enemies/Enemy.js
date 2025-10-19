// Class cơ bản cho tất cả quái vật
export class Enemy {
    constructor(scene, x, y, texture, config = {}) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDepth(10); // Đảm bảo hiển thị
        
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
        this.isAlerted = false; // Trạng thái đã bị đánh thức
        this.alertRadius = 200; // Phạm vi đánh thức quái khác
        
        // Hit cooldown để tránh nhận damage nhiều lần
        this.lastHitTime = 0;
        this.hitCooldown = 200; // 200ms cooldown giữa các lần nhận damage
        
        // Tạo thanh máu
        this.createHealthBar();
    }

    // Tạo thanh máu
    createHealthBar() {
        this.healthBarBg = this.scene.add.rectangle(
            this.sprite.x,
            this.sprite.y - 45,
            42,
            5,
            0x000000
        );
        this.healthBarBg.setOrigin(0.5, 0.5);
        this.healthBarBg.setDepth(20);

        this.healthBar = this.scene.add.rectangle(
            this.sprite.x,
            this.sprite.y - 45,
            40,
            4,
            0x00ff00
        );
        this.healthBar.setOrigin(0.5, 0.5);
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
        // Kiểm tra đã chết
        if (!this.sprite || !this.sprite.active || this.health <= 0) {
            return;
        }
        
        // Kiểm tra cooldown để tránh hit nhiều lần
        const currentTime = Date.now();
        if (currentTime - this.lastHitTime < this.hitCooldown) {
            return; // Ignore hit nếu còn trong cooldown
        }
        this.lastHitTime = currentTime;

        // Kiểm tra damage hợp lệ
        if (isNaN(damage) || damage <= 0) {
            console.warn(`[${this.type || 'Enemy'}] Invalid damage: ${damage}, using default 10`);
            damage = 10;
        }
        
        // Giảm máu
        const oldHealth = this.health;
        this.health = Math.max(0, this.health - damage);
        
        console.log(`[${this.type || 'Enemy'}] Took ${damage} damage: ${oldHealth} -> ${this.health}/${this.maxHealth}`);
        
        // Đánh thức bản thân và quái xung quanh
        if (!this.isAlerted) {
            this.alert();
        }
        
        // Hiệu ứng nhận sát thương
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if (this.sprite && this.sprite.active) {
                this.sprite.clearTint();
            }
        });

        // Cập nhật thanh máu
        this.updateHealthBar();

        // Kiểm tra chết - FORCE DIE nếu health <= 0
        if (this.health <= 0) {
            console.log(`[${this.type || 'Enemy'}] Health <= 0 (${this.health}), FORCING DIE`);
            // Set health = 0 để chắc chắn
            this.health = 0;
            // Gọi die ngay lập tức
            this.die();
        }
    }

    // Đánh thức quái (khi bị tấn công)
    alert() {
        if (this.isAlerted) return;
        
        this.isAlerted = true;
        this.state = 'chase';
        
        // Hiệu ứng đánh thức
        this.showAlertEffect();
        
        // Đánh thức các quái xung quanh
        this.alertNearbyEnemies();
    }

    // Hiệu ứng đánh thức
    showAlertEffect() {
        // Dấu chấm than đỏ
        const alert = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 60,
            '!',
            {
                fontSize: '32px',
                fill: '#ff0000',
                fontStyle: 'bold',
                stroke: '#ffffff',
                strokeThickness: 3
            }
        );
        alert.setOrigin(0.5);
        alert.setDepth(100);

        this.scene.tweens.add({
            targets: alert,
            y: alert.y - 20,
            alpha: 0,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => alert.destroy()
        });

        // Vòng tròn cảnh báo
        const circle = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            this.alertRadius,
            0xff0000,
            0.1
        );
        circle.setDepth(5);

        this.scene.tweens.add({
            targets: circle,
            alpha: 0,
            scale: 1.2,
            duration: 500,
            onComplete: () => circle.destroy()
        });
    }

    // Đánh thức quái xung quanh
    alertNearbyEnemies() {
        // Lấy tất cả quái từ EnemySpawner
        if (!this.scene.enemySpawner) return;
        
        const allEnemies = this.scene.enemySpawner.getEnemies();
        
        allEnemies.forEach(enemy => {
            if (enemy === this || !enemy.sprite.active) return;
            
            // Tính khoảng cách
            const distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                enemy.sprite.x,
                enemy.sprite.y
            );
            
            // Nếu trong phạm vi, đánh thức
            if (distance <= this.alertRadius && !enemy.isAlerted) {
                enemy.alert();
            }
        });
    }

    // Cập nhật thanh máu
    updateHealthBar() {
        if (!this.healthBar || !this.healthBarBg) return;

        const healthPercent = this.health / this.maxHealth;
        
        this.healthBarBg.setPosition(this.sprite.x, this.sprite.y - 45);
        this.healthBar.setPosition(this.sprite.x, this.sprite.y - 45);
        this.healthBar.width = 40 * healthPercent;
        
        // Đổi màu theo máu
        if (healthPercent > 0.5) {
            this.healthBar.setFillStyle(0x00ff00); // Xanh
        } else if (healthPercent > 0.25) {
            this.healthBar.setFillStyle(0xffff00); // Vàng
        } else {
            this.healthBar.setFillStyle(0xff0000); // Đỏ
        }
    }

    // Chết
    die() {
        if (!this.sprite) {
            console.log(`[${this.type || 'Enemy'}] No sprite, already destroyed`);
            return;
        }
        
        if (!this.sprite.active) {
            console.log(`[${this.type || 'Enemy'}] Already dead (sprite.active = false)`);
            return; // Đã chết rồi
        }
        
        console.log(`[${this.type || 'Enemy'}] DIE METHOD EXECUTING - Health: ${this.health}, Active: ${this.sprite.active}`);
        
        // Đánh dấu không active ngay lập tức
        this.sprite.active = false;
        this.health = 0;
        
        // Dừng AI
        this.state = 'dead';
        
        // Tắt physics
        if (this.sprite.body) {
            this.sprite.body.enable = false;
        }
        
        // Hiệu ứng chết
        this.sprite.setTint(0x000000);
        
        // Xóa thanh máu ngay
        if (this.healthBar) {
            this.healthBar.destroy();
            this.healthBar = null;
        }
        if (this.healthBarBg) {
            this.healthBarBg.destroy();
            this.healthBarBg = null;
        }
        
        // Animation chết
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => {
                console.log(`[${this.type || 'Enemy'}] Animation complete, destroying sprite`);
                if (this.sprite) {
                    this.sprite.destroy();
                    this.sprite = null;
                }
            }
        });
    }

    // Lấy vị trí
    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
}
