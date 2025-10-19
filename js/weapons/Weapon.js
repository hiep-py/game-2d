// Class cơ bản cho tất cả vũ khí
export class Weapon {
    constructor(scene, player, config) {
        this.scene = scene;
        this.player = player;
        this.name = config.name || 'Unknown';
        this.damage = config.damage || 10;
        this.attackSpeed = config.attackSpeed || 500; // milliseconds
        this.range = config.range || 50;
        this.sprite = null;
        this.isAttacking = false;
        this.lastAttackTime = 0;
    }

    // Tạo sprite vũ khí
    create(textureName, offsetX = 20, offsetY = 0) {
        this.sprite = this.scene.add.sprite(0, 0, textureName);
        this.sprite.setOrigin(0, 0.5);
        this.sprite.setDepth(10);
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    // Cập nhật vị trí vũ khí theo người chơi
    update() {
        if (!this.sprite || !this.player.sprite) return;

        const playerPos = this.player.getPosition();
        const flipX = this.player.sprite.flipX;

        if (flipX) {
            // Quay trái
            this.sprite.setPosition(
                playerPos.x - this.offsetX,
                playerPos.y + this.offsetY
            );
            this.sprite.setFlipX(true);
        } else {
            // Quay phải
            this.sprite.setPosition(
                playerPos.x + this.offsetX,
                playerPos.y + this.offsetY
            );
            this.sprite.setFlipX(false);
        }
    }

    // Tấn công
    attack() {
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime < this.attackSpeed) {
            return false; // Chưa đủ thời gian cooldown
        }

        this.isAttacking = true;
        this.lastAttackTime = currentTime;
        this.playAttackAnimation();
        
        return true;
    }

    // Animation tấn công (override trong subclass)
    playAttackAnimation() {
        if (!this.sprite) return;

        // Animation đơn giản: xoay vũ khí
        this.scene.tweens.add({
            targets: this.sprite,
            angle: this.player.sprite.flipX ? -90 : 90,
            duration: 150,
            yoyo: true,
            onComplete: () => {
                this.isAttacking = false;
                this.sprite.angle = 0;
            }
        });
    }

    // Hiển thị vũ khí
    show() {
        if (this.sprite) {
            this.sprite.setVisible(true);
        }
    }

    // Ẩn vũ khí
    hide() {
        if (this.sprite) {
            this.sprite.setVisible(false);
        }
    }

    // Hủy vũ khí
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }

    // Lấy thông tin vũ khí
    getInfo() {
        return {
            name: this.name,
            damage: this.damage,
            attackSpeed: this.attackSpeed,
            range: this.range
        };
    }
}
