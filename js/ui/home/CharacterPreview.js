// Component hiển thị nhân vật trong home screen
export class CharacterPreview {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.container = null;
    }

    create() {
        this.container = this.scene.add.container(this.x, this.y);
        this.container.setDepth(10); // Đảm bảo hiển thị trên background

        // Background glow effect
        const glow = this.scene.add.circle(0, 0, 120, 0xFFD700, 0.2);
        this.container.add(glow);

        // Animated glow
        this.scene.tweens.add({
            targets: glow,
            scale: 1.2,
            alpha: 0.3,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Character sprite (sử dụng sprite thật từ game)
        // Sử dụng player_default từ PlayerAssets
        let textureKey = 'player_default';
        
        // Fallback nếu không tìm thấy
        if (!this.scene.textures.exists(textureKey)) {
            this.createFallbackPlayer();
            textureKey = 'player_fallback';
        }
        
        const character = this.scene.add.sprite(0, 0, textureKey);
        character.setScale(2.5);
        character.setDepth(5);
        this.container.add(character);

        // Floating animation
        this.scene.tweens.add({
            targets: character,
            y: -15,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Rotation animation
        this.scene.tweens.add({
            targets: character,
            angle: 5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Particles
        this.createParticles();

        // Label
        const label = this.scene.add.text(0, -150, 'YOUR CHARACTER', {
            fontSize: '24px',
            fill: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        label.setOrigin(0.5);
        this.container.add(label);

        return this.container;
    }

    createFallbackPlayer() {
        // Tạo player texture tạm thời nếu không load được
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        
        graphics.fillStyle(0x3498db, 1);
        graphics.fillRect(10, 20, 20, 30); // Thân
        graphics.fillStyle(0xf39c12, 1);
        graphics.fillRect(12, 10, 16, 15); // Đầu
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(17, 15, 2); // Mắt trái
        graphics.fillCircle(23, 15, 2); // Mắt phải
        graphics.fillStyle(0x2c3e50, 1);
        graphics.fillRect(5, 25, 8, 20); // Tay trái
        graphics.fillRect(27, 25, 8, 20); // Tay phải
        graphics.fillRect(12, 50, 7, 20); // Chân trái
        graphics.fillRect(21, 50, 7, 20); // Chân phải
        
        graphics.generateTexture('player_fallback', 40, 70);
        graphics.destroy();
    }

    createParticles() {
        // Tạo particles xung quanh nhân vật
        const particles = this.scene.add.particles(0, 0, 'particle', {
            speed: { min: 20, max: 50 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 2000,
            frequency: 200,
            blendMode: 'ADD',
            tint: 0xFFD700
        });
        
        this.container.add(particles);
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
