// Hệ thống máu cho người chơi
export class PlayerHealth {
    constructor(scene, player, maxHealth = 100) {
        this.scene = scene;
        this.player = player;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 1000; // 1 giây bất tử sau khi nhận sát thương
        
        this.createHealthUI();
    }

    // Tạo UI thanh máu
    createHealthUI() {
        const x = 20;
        const y = 20;
        const width = 200;
        const height = 25;

        // Background
        this.healthBarBg = this.scene.add.rectangle(
            x, y, width, height, 0x000000, 0.7
        );
        this.healthBarBg.setOrigin(0, 0);
        this.healthBarBg.setDepth(100);
        this.healthBarBg.setScrollFactor(0);

        // Viền
        this.healthBarBorder = this.scene.add.rectangle(
            x, y, width, height
        );
        this.healthBarBorder.setOrigin(0, 0);
        this.healthBarBorder.setStrokeStyle(2, 0xffffff);
        this.healthBarBorder.setDepth(101);
        this.healthBarBorder.setScrollFactor(0);
        this.healthBarBorder.setFillStyle(0x000000, 0);

        // Thanh máu
        this.healthBar = this.scene.add.rectangle(
            x + 2, y + 2, width - 4, height - 4, 0x00ff00
        );
        this.healthBar.setOrigin(0, 0);
        this.healthBar.setDepth(102);
        this.healthBar.setScrollFactor(0);

        // Text hiển thị HP
        this.healthText = this.scene.add.text(
            x + width / 2,
            y + height / 2,
            `${this.health}/${this.maxHealth}`,
            {
                fontSize: '14px',
                fill: '#fff',
                fontStyle: 'bold'
            }
        );
        this.healthText.setOrigin(0.5);
        this.healthText.setDepth(103);
        this.healthText.setScrollFactor(0);

        // Icon trái tim
        this.heartIcon = this.scene.add.text(
            x - 15,
            y + height / 2,
            '❤️',
            { fontSize: '20px' }
        );
        this.heartIcon.setOrigin(0.5);
        this.heartIcon.setDepth(103);
        this.heartIcon.setScrollFactor(0);
    }

    // Nhận sát thương
    takeDamage(damage) {
        if (this.isInvulnerable || this.health <= 0) return;

        this.health = Math.max(0, this.health - damage);
        this.updateHealthBar();
        
        // Kiểm tra chết
        if (this.health <= 0) {
            this.onDeath();
        }

        // Hiệu ứng nhận sát thương
        this.player.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.player.sprite.clearTint();
        });

        // Hiệu ứng rung camera
        this.scene.cameras.main.shake(200, 0.005);

        // Bất tử tạm thời
        this.setInvulnerable(true);
        this.scene.time.delayedCall(this.invulnerabilityDuration, () => {
            this.setInvulnerable(false);
        });

        // Hiển thị text sát thương
        this.showDamageText(damage);

        // Kiểm tra chết
        if (this.health <= 0) {
            this.onDeath();
        }
    }

    // Hồi máu
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.updateHealthBar();

        // Hiệu ứng hồi máu
        const healText = this.scene.add.text(
            this.player.sprite.x,
            this.player.sprite.y - 40,
            `+${amount}`,
            {
                fontSize: '18px',
                fill: '#00ff00',
                fontStyle: 'bold'
            }
        );
        healText.setOrigin(0.5);
        healText.setDepth(100);

        this.scene.tweens.add({
            targets: healText,
            y: healText.y - 30,
            alpha: 0,
            duration: 1000,
            onComplete: () => healText.destroy()
        });
    }

    // Cập nhật thanh máu
    updateHealthBar() {
        const healthPercent = this.health / this.maxHealth;
        const maxWidth = 196; // 200 - 4 (padding)
        
        this.healthBar.width = maxWidth * healthPercent;
        
        // Đổi màu theo % máu
        if (healthPercent > 0.5) {
            this.healthBar.setFillStyle(0x00ff00); // Xanh
        } else if (healthPercent > 0.25) {
            this.healthBar.setFillStyle(0xffff00); // Vàng
        } else {
            this.healthBar.setFillStyle(0xff0000); // Đỏ
        }

        this.healthText.setText(`${this.health}/${this.maxHealth}`);

        // Hiệu ứng nhấp nháy khi máu thấp
        if (healthPercent < 0.25 && healthPercent > 0) {
            this.healthBar.setAlpha(0.5 + Math.sin(Date.now() / 200) * 0.5);
        } else {
            this.healthBar.setAlpha(1);
        }
    }

    // Hiển thị text sát thương
    showDamageText(damage) {
        const damageText = this.scene.add.text(
            this.player.sprite.x,
            this.player.sprite.y - 40,
            `-${damage}`,
            {
                fontSize: '20px',
                fill: '#ff0000',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        damageText.setOrigin(0.5);
        damageText.setDepth(100);

        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 40,
            alpha: 0,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => damageText.destroy()
        });
    }

    // Set bất tử
    setInvulnerable(value) {
        this.isInvulnerable = value;
        
        if (value) {
            // Hiệu ứng nhấp nháy khi bất tử
            this.player.sprite.setAlpha(0.5);
            this.invulnerableFlash = this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    this.player.sprite.setAlpha(
                        this.player.sprite.alpha === 0.5 ? 1 : 0.5
                    );
                },
                loop: true
            });
        } else {
            if (this.invulnerableFlash) {
                this.invulnerableFlash.remove();
            }
            this.player.sprite.setAlpha(1);
        }
    }

    // Khi chết
    onDeath() {
        // Hiệu ứng chết
        this.scene.cameras.main.shake(500, 0.01);
        this.scene.cameras.main.fade(1000, 0, 0, 0);

        // Hiển thị game over
        this.scene.time.delayedCall(1000, () => {
            this.showGameOver();
        });
    }

    // Hiển thị màn hình game over
    showGameOver() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        // Overlay tối
        const overlay = this.scene.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000,
            0.8
        );
        overlay.setDepth(1000);
        overlay.setScrollFactor(0);

        // Panel
        const panel = this.scene.add.rectangle(
            width / 2,
            height / 2,
            500,
            400,
            0x2c3e50
        );
        panel.setDepth(1001);
        panel.setStrokeStyle(4, 0xe74c3c);
        panel.setScrollFactor(0);

        // Title
        const gameOverText = this.scene.add.text(
            width / 2,
            height / 2 - 120,
            'BẠN ĐÃ THUA!',
            {
                fontSize: '48px',
                fill: '#e74c3c',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(1002);
        gameOverText.setScrollFactor(0);

        // Subtitle
        const subtitle = this.scene.add.text(
            width / 2,
            height / 2 - 60,
            'Hãy thử lại lần nữa!',
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontStyle: 'italic'
            }
        );
        subtitle.setOrigin(0.5);
        subtitle.setDepth(1002);
        subtitle.setScrollFactor(0);

        // Nút Chơi lại
        const restartBtn = this.createGameOverButton(
            width / 2,
            height / 2 + 20,
            'CHƠI LẠI',
            () => {
                this.scene.scene.restart();
            },
            0x27ae60
        );

        // Nút Về Home
        const homeBtn = this.createGameOverButton(
            width / 2,
            height / 2 + 100,
            'VỀ HOME',
            () => {
                this.scene.scene.start('HomeScene');
            },
            0x3498db
        );

        // Animation title
        this.scene.tweens.add({
            targets: gameOverText,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // Tạo nút cho game over
    createGameOverButton(x, y, text, callback, color) {
        const container = this.scene.add.container(x, y);
        container.setDepth(1002);
        container.setScrollFactor(0);

        const bg = this.scene.add.rectangle(0, 0, 300, 60, color);
        bg.setStrokeStyle(3, 0xffffff, 0.8);
        
        const label = this.scene.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#fff',
            fontStyle: 'bold'
        });
        label.setOrigin(0.5);

        container.add([bg, label]);

        // Tương tác
        bg.setInteractive({ useHandCursor: true });
        
        bg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: container,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });
        
        bg.on('pointerout', () => {
            this.scene.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        
        bg.on('pointerdown', callback);

        return container;
    }

    // Lấy máu hiện tại
    getHealth() {
        return this.health;
    }

    // Lấy % máu
    getHealthPercent() {
        return this.health / this.maxHealth;
    }

    // Kiểm tra còn sống
    isAlive() {
        return this.health > 0;
    }
}
