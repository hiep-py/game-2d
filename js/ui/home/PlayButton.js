// Component nút chơi
export class PlayButton {
    constructor(scene, x, y, onClickCallback) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.onClickCallback = onClickCallback;
        this.container = null;
    }

    create() {
        this.container = this.scene.add.container(this.x, this.y);
        this.container.setDepth(10);

        // Shadow
        const shadow = this.scene.add.rectangle(5, 5, 280, 90, 0x000000, 0.5);
        shadow.setOrigin(0.5);
        this.container.add(shadow);

        // Background gradient effect
        const bgGlow = this.scene.add.rectangle(0, 0, 280, 90, 0x00ff00, 0.3);
        bgGlow.setOrigin(0.5);
        this.container.add(bgGlow);

        // Main button
        const button = this.scene.add.rectangle(0, 0, 280, 90, 0x00ff00, 0.9);
        button.setStrokeStyle(5, 0xFFD700);
        button.setOrigin(0.5);
        button.setInteractive({ useHandCursor: true });
        this.container.add(button);

        // Icon (triangle play button)
        const icon = this.scene.make.graphics({ x: 0, y: 0, add: false });
        icon.fillStyle(0x000000, 1);
        icon.beginPath();
        icon.moveTo(-10, -15);
        icon.lineTo(10, 0);
        icon.lineTo(-10, 15);
        icon.closePath();
        icon.fillPath();
        icon.generateTexture('play_icon', 20, 30);
        icon.destroy();

        const iconSprite = this.scene.add.sprite(-90, 0, 'play_icon');
        iconSprite.setScale(1.5);
        this.container.add(iconSprite);

        // Text
        const text = this.scene.add.text(0, 0, 'CHƠI NGAY', {
            fontSize: '32px',
            fill: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        });
        text.setOrigin(0.5);
        this.container.add(text);

        // Pulse animation
        this.scene.tweens.add({
            targets: [button, bgGlow],
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Glow pulse
        this.scene.tweens.add({
            targets: bgGlow,
            alpha: 0.6,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Hover effects
        button.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this.container,
                scaleX: 1.15,
                scaleY: 1.15,
                duration: 200,
                ease: 'Back.easeOut'
            });

            button.setFillStyle(0x00ff00, 1);
            
            // Shake icon
            this.scene.tweens.add({
                targets: icon,
                x: -95,
                duration: 100,
                yoyo: true,
                repeat: 3
            });
        });

        button.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this.container,
                scaleX: 1,
                scaleY: 1,
                duration: 200
            });

            button.setFillStyle(0x00ff00, 0.9);
        });

        // Click
        button.on('pointerdown', () => {
            // Flash effect
            this.scene.tweens.add({
                targets: button,
                alpha: 0.5,
                duration: 100,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    if (this.onClickCallback) {
                        this.onClickCallback();
                    }
                }
            });

            // Explosion particles
            this.createClickParticles();
        });

        return this.container;
    }

    createClickParticles() {
        const particles = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 600,
            quantity: 20,
            blendMode: 'ADD',
            tint: [0x00ff00, 0xFFD700, 0xffffff]
        });

        this.scene.time.delayedCall(700, () => {
            particles.destroy();
        });
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
