// Scene màn hình chính - Modular
import { GameConfig } from '../config.js';
import { CharacterPreview } from '../ui/home/CharacterPreview.js';
import { WeaponSelector } from '../ui/home/WeaponSelector.js';
import { DifficultySelector } from '../ui/home/DifficultySelector.js';
import { PlayButton } from '../ui/home/PlayButton.js';
import { PlayerAssets } from '../entities/assets/PlayerAssets.js';

export class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
        this.components = {};
    }

    preload() {
        // Load background
        this.load.image('background', 'js/assets/backgurd.png');
        
        // Load player assets từ AssetLoader
        this.loadPlayerAssets();
        
        // Create textures
        this.createParticleTexture();
        this.createWeaponTextures();
    }

    loadPlayerAssets() {
        // Load PlayerAssets đồng bộ
        PlayerAssets.load(this);
    }

    createParticleTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }

    createWeaponTextures() {
        // Sword icon
        let graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xc0c0c0, 1);
        graphics.fillRect(0, 8, 25, 3);
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillRect(0, 7, 5, 5);
        graphics.fillStyle(0xd0d0d0, 1);
        graphics.beginPath();
        graphics.moveTo(25, 9.5);
        graphics.lineTo(30, 9.5);
        graphics.lineTo(25, 11);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('weapon_sword_icon', 30, 20);
        graphics.destroy();

        // Bow icon
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.lineStyle(3, 0x8B4513, 1);
        const curve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(5, 0),
            new Phaser.Math.Vector2(0, 10),
            new Phaser.Math.Vector2(5, 20)
        );
        curve.draw(graphics);
        graphics.lineStyle(1, 0x666666, 1);
        graphics.beginPath();
        graphics.moveTo(5, 2);
        graphics.lineTo(5, 18);
        graphics.strokePath();
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(2, 10, 2);
        graphics.generateTexture('weapon_bow_icon', 15, 20);
        graphics.destroy();

        // Axe icon
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x654321, 1);
        graphics.fillRect(0, 8, 20, 3);
        graphics.fillStyle(0x708090, 1);
        graphics.beginPath();
        graphics.moveTo(15, 9.5);
        graphics.lineTo(28, 0);
        graphics.lineTo(28, 19);
        graphics.closePath();
        graphics.fillPath();
        graphics.lineStyle(2, 0x909090, 1);
        graphics.beginPath();
        graphics.moveTo(15, 9.5);
        graphics.lineTo(28, 0);
        graphics.strokePath();
        graphics.generateTexture('weapon_axe_icon', 28, 20);
        graphics.destroy();
    }

    create() {
        // Get screen dimensions
        const width = this.scale.width;
        const height = this.scale.height;

        // Background
        this.createBackground();

        // Title
        this.createTitle();

        // Character preview (center)
        this.components.characterPreview = new CharacterPreview(
            this,
            width / 2,
            height * 0.35
        );
        this.components.characterPreview.create();

        // Weapon selection (left)
        this.components.weaponSelector = new WeaponSelector(
            this,
            width * 0.25,
            height * 0.55
        );
        this.components.weaponSelector.create();

        // Difficulty selection (right)
        this.components.difficultySelector = new DifficultySelector(
            this,
            width * 0.75,
            height * 0.55
        );
        this.components.difficultySelector.create();

        // Play button (bottom center)
        this.components.playButton = new PlayButton(
            this,
            width / 2,
            height - 100,
            () => this.startGame()
        );
        this.components.playButton.create();

        // Instructions
        this.createInstructions();

        // Particles background
        this.createBackgroundParticles();

        // Handle resize
        this.scale.on('resize', this.resize, this);
    }

    createBackground() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Background image
        this.bg = this.add.image(width / 2, height / 2, 'background');
        
        // Scale to cover full screen
        const scaleX = width / this.bg.width;
        const scaleY = height / this.bg.height;
        const scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale * 1.1); // Slightly larger for parallax

        // Parallax effect
        this.tweens.add({
            targets: this.bg,
            x: width / 2 + 20,
            y: height / 2 + 20,
            duration: 10000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Overlay để text dễ đọc
        this.overlay = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000,
            0.5
        );
        this.overlay.setDepth(1); // Đặt depth thấp để không che components
    }

    createTitle() {
        const width = this.scale.width;

        // Title glow background
        const titleGlow = this.add.rectangle(width / 2, 100, 600, 120, 0xFFD700, 0.1);
        titleGlow.setDepth(5);
        this.tweens.add({
            targets: titleGlow,
            alpha: 0.3,
            scaleX: 1.1,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Game title
        this.title = this.add.text(
            width / 2,
            80,
            'WSS WEB',
            {
                fontSize: '84px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#FFD700',
                strokeThickness: 6,
                shadow: {
                    offsetX: 5,
                    offsetY: 5,
                    color: '#000000',
                    blur: 15,
                    fill: true
                }
            }
        );
        this.title.setOrigin(0.5);
        this.title.setDepth(10);

        // Subtitle
        this.subtitle = this.add.text(
            width / 2,
            150,
            'Survival Action Game',
            {
                fontSize: '28px',
                fill: '#FFD700',
                fontStyle: 'italic',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        this.subtitle.setOrigin(0.5);
        this.subtitle.setDepth(10);

        // Title animations
        this.tweens.add({
            targets: this.title,
            scale: 1.08,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.subtitle,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }

    createCharacterPreview() {
        // Box cho character
        const boxX = GameConfig.width / 2;
        const boxY = 280;

        // Background box
        const box = this.add.rectangle(boxX, boxY, 200, 200, 0x1a1a1a, 0.7);
        box.setStrokeStyle(3, 0xFFD700);

        // Label
        const label = this.add.text(boxX, boxY - 120, 'YOUR CHARACTER', {
            fontSize: '18px',
            fill: '#FFD700',
            fontStyle: 'bold'
        });
        label.setOrigin(0.5);

        // Tạo character sprite (giống trong game)
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Vẽ nhân vật
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(15, 10, 10, 15); // Đầu
        graphics.fillRect(12, 25, 16, 20); // Thân
        graphics.fillRect(8, 30, 6, 15); // Tay trái
        graphics.fillRect(26, 30, 6, 15); // Tay phải
        graphics.fillRect(14, 45, 5, 15); // Chân trái
        graphics.fillRect(21, 45, 5, 15); // Chân phải
        
        // Mắt
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(18, 15, 2);
        graphics.fillCircle(22, 15, 2);
        
        graphics.generateTexture('player_preview', 40, 60);
        graphics.destroy();

        // Hiển thị character
        const character = this.add.image(boxX, boxY, 'player_preview');
        character.setScale(2);

        // Animation
        this.tweens.add({
            targets: character,
            y: boxY - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createWeaponSelection() {
        const startX = 100;
        const startY = 450;

        // Title
        const title = this.add.text(startX, startY - 40, 'CHỌN VŨ KHÍ:', {
            fontSize: '20px',
            fill: '#FFD700',
            fontStyle: 'bold'
        });

        // Weapons
        const weapons = [
            { key: 'sword', name: 'Kiếm', color: 0xff0000, damage: '35', speed: 'Nhanh' },
            { key: 'bow', name: 'Cung', color: 0x8B4513, damage: '28', speed: 'Trung bình' },
            { key: 'axe', name: 'Rìu', color: 0x708090, damage: '55', speed: 'Chậm' }
        ];

        this.weaponButtons = [];

        weapons.forEach((weapon, index) => {
            const y = startY + index * 70;

            // Button background
            const button = this.add.rectangle(startX + 100, y, 180, 60, weapon.color, 0.3);
            button.setStrokeStyle(2, weapon.color);
            button.setInteractive({ useHandCursor: true });

            // Weapon name
            const nameText = this.add.text(startX + 20, y - 15, weapon.name, {
                fontSize: '18px',
                fill: '#ffffff',
                fontStyle: 'bold'
            });

            // Stats
            const statsText = this.add.text(startX + 20, y + 5, `DMG: ${weapon.damage} | ${weapon.speed}`, {
                fontSize: '12px',
                fill: '#cccccc'
            });

            // Click event
            button.on('pointerdown', () => {
                this.selectWeapon(weapon.key);
            });

            button.on('pointerover', () => {
                button.setFillStyle(weapon.color, 0.6);
                this.tweens.add({
                    targets: button,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100
                });
            });

            button.on('pointerout', () => {
                if (this.selectedWeapon !== weapon.key) {
                    button.setFillStyle(weapon.color, 0.3);
                }
                this.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            });

            this.weaponButtons.push({ key: weapon.key, button, color: weapon.color });
        });

        // Highlight default
        this.selectWeapon('sword');
    }

    createDifficultySelection() {
        const startX = GameConfig.width - 250;
        const startY = 450;

        // Title
        const title = this.add.text(startX, startY - 40, 'ĐỘ KHÓ:', {
            fontSize: '20px',
            fill: '#FFD700',
            fontStyle: 'bold'
        });

        // Difficulties
        const difficulties = [
            { key: 'easy', name: 'Dễ', color: 0x00ff00, desc: 'Ít quái, yếu' },
            { key: 'normal', name: 'Thường', color: 0xffff00, desc: 'Cân bằng' },
            { key: 'hard', name: 'Khó', color: 0xff0000, desc: 'Nhiều quái, mạnh' }
        ];

        this.difficultyButtons = [];

        difficulties.forEach((diff, index) => {
            const y = startY + index * 70;

            // Button background
            const button = this.add.rectangle(startX + 100, y, 180, 60, diff.color, 0.3);
            button.setStrokeStyle(2, diff.color);
            button.setInteractive({ useHandCursor: true });

            // Difficulty name
            const nameText = this.add.text(startX + 20, y - 15, diff.name, {
                fontSize: '18px',
                fill: '#ffffff',
                fontStyle: 'bold'
            });

            // Description
            const descText = this.add.text(startX + 20, y + 5, diff.desc, {
                fontSize: '12px',
                fill: '#cccccc'
            });

            // Click event
            button.on('pointerdown', () => {
                this.selectDifficulty(diff.key);
            });

            button.on('pointerover', () => {
                button.setFillStyle(diff.color, 0.6);
                this.tweens.add({
                    targets: button,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100
                });
            });

            button.on('pointerout', () => {
                if (this.selectedDifficulty !== diff.key) {
                    button.setFillStyle(diff.color, 0.3);
                }
                this.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            });

            this.difficultyButtons.push({ key: diff.key, button, color: diff.color });
        });

        // Highlight default
        this.selectDifficulty('normal');
    }

    createPlayButton() {
        // Play button (bottom left)
        const buttonX = 150;
        const buttonY = GameConfig.height - 80;

        // Button background
        const button = this.add.rectangle(buttonX, buttonY, 200, 70, 0x00ff00, 0.8);
        button.setStrokeStyle(4, 0xFFD700);
        button.setInteractive({ useHandCursor: true });

        // Button text
        const text = this.add.text(buttonX, buttonY, 'CHƠI NGAY', {
            fontSize: '28px',
            fill: '#000000',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);

        // Hover effect
        button.on('pointerover', () => {
            button.setFillStyle(0x00ff00, 1);
            this.tweens.add({
                targets: [button, text],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x00ff00, 0.8);
            this.tweens.add({
                targets: [button, text],
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        // Click to start game
        button.on('pointerdown', () => {
            this.startGame();
        });

        // Pulse animation
        this.tweens.add({
            targets: button,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createInstructions() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Controls background
        const controlsBg = this.add.rectangle(
            width / 2,
            height - 40,
            width * 0.8,
            50,
            0x000000,
            0.7
        );
        controlsBg.setStrokeStyle(2, 0xFFD700, 0.5);

        // Controls text
        this.controls = this.add.text(
            width / 2,
            height - 40,
            'Di chuyển: WASD/←↑→↓ | Tấn công: SPACE | Đổi vũ khí: 1,2,3 | Pause: ESC',
            {
                fontSize: '18px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        this.controls.setOrigin(0.5);

        // Pulse animation
        this.tweens.add({
            targets: this.controls,
            alpha: 0.6,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
    }

    createBackgroundParticles() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Floating particles
        this.particles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            speedY: { min: -30, max: -10 },
            speedX: { min: -10, max: 10 },
            scale: { min: 0.1, max: 0.3 },
            alpha: { start: 0.3, end: 0 },
            lifespan: 4000,
            frequency: 200,
            blendMode: 'ADD',
            tint: [0xFFD700, 0xffffff, 0x00ff00]
        });
        this.particles.setDepth(-1);
    }

    startGame() {
        // Lấy lựa chọn từ components
        const selectedWeapon = this.components.weaponSelector.getSelectedWeapon();
        const selectedDifficulty = this.components.difficultySelector.getSelectedDifficulty();

        // Lưu vào registry
        this.registry.set('selectedWeapon', selectedWeapon);
        this.registry.set('difficulty', selectedDifficulty);

        console.log(`Starting game with weapon: ${selectedWeapon}, difficulty: ${selectedDifficulty}`);

        // Flash effect
        this.cameras.main.flash(200, 255, 255, 255);

        // Fade out
        this.time.delayedCall(200, () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
        });

        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Cleanup
            Object.values(this.components).forEach(component => {
                if (component.destroy) component.destroy();
            });
            
            this.scene.start('GameScene');
        });
    }

    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;

        // Update background
        if (this.bg) {
            this.bg.setPosition(width / 2, height / 2);
            const scaleX = width / this.bg.width;
            const scaleY = height / this.bg.height;
            this.bg.setScale(Math.max(scaleX, scaleY) * 1.1);
        }

        if (this.overlay) {
            this.overlay.setPosition(width / 2, height / 2);
            this.overlay.setSize(width, height);
        }

        // Update title
        if (this.title) this.title.setPosition(width / 2, 80);
        if (this.subtitle) this.subtitle.setPosition(width / 2, 150);

        // Update controls
        if (this.controls) this.controls.setPosition(width / 2, height - 40);

        // Update components positions
        if (this.components.characterPreview) {
            this.components.characterPreview.container.setPosition(width / 2, height * 0.35);
        }
        if (this.components.weaponSelector) {
            this.components.weaponSelector.container.setPosition(width * 0.25, height * 0.55);
        }
        if (this.components.difficultySelector) {
            this.components.difficultySelector.container.setPosition(width * 0.75, height * 0.55);
        }
        if (this.components.playButton) {
            this.components.playButton.container.setPosition(width / 2, height - 100);
        }
    }
}
