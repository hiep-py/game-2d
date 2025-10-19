// Component chọn độ khó
export class DifficultySelector {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.selectedDifficulty = 'normal';
        this.buttons = [];
        this.container = null;
    }

    create() {
        this.container = this.scene.add.container(this.x, this.y);
        this.container.setDepth(10);

        // Title
        const title = this.scene.add.text(0, 0, 'ĐỘ KHÓ', {
            fontSize: '28px',
            fill: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        title.setOrigin(0.5);
        this.container.add(title);

        // Glow effect
        this.scene.tweens.add({
            targets: title,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Difficulties
        const difficulties = [
            { 
                key: 'easy', 
                name: 'DỄ', 
                color: 0x00ff00, 
                desc: '2 quái | 70% HP/DMG',
                detail: 'Cho người mới'
            },
            { 
                key: 'normal', 
                name: 'THƯỜNG', 
                color: 0xffff00, 
                desc: '3 quái | 100% HP/DMG',
                detail: 'Cân bằng'
            },
            { 
                key: 'hard', 
                name: 'KHÓ', 
                color: 0xff0000, 
                desc: '5 quái | 150% HP/DMG',
                detail: 'Thử thách!'
            }
        ];

        difficulties.forEach((diff, index) => {
            const button = this.createDifficultyButton(diff, index);
            this.buttons.push({ key: diff.key, button, color: diff.color });
        });

        // Select default
        this.selectDifficulty('normal');

        return this.container;
    }

    createDifficultyButton(diff, index) {
        const buttonY = 60 + index * 100;
        const buttonContainer = this.scene.add.container(0, buttonY);

        // Background
        const bg = this.scene.add.rectangle(0, 0, 300, 85, diff.color, 0.3);
        bg.setStrokeStyle(3, diff.color, 0.8);
        buttonContainer.add(bg);

        // Glow
        const glow = this.scene.add.rectangle(0, 0, 300, 85, diff.color, 0.1);
        buttonContainer.add(glow);

        // Color indicator circle
        const indicator = this.scene.add.circle(-140, 0, 12, diff.color, 1);
        indicator.setStrokeStyle(2, 0xffffff);
        buttonContainer.add(indicator);

        // Name
        const nameText = this.scene.add.text(-110, -25, diff.name, {
            fontSize: '22px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        buttonContainer.add(nameText);

        // Description
        const descText = this.scene.add.text(-110, 0, diff.desc, {
            fontSize: '16px',
            fill: '#FFD700'
        });
        buttonContainer.add(descText);

        // Detail
        const detailText = this.scene.add.text(-110, 20, diff.detail, {
            fontSize: '13px',
            fill: '#cccccc',
            fontStyle: 'italic'
        });
        buttonContainer.add(detailText);

        // Interactive
        bg.setInteractive({ useHandCursor: true });

        bg.on('pointerdown', () => {
            this.selectDifficulty(diff.key);
            this.scene.sound.play('click', { volume: 0.3 });
        });

        bg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150,
                ease: 'Back.easeOut'
            });
            
            this.scene.tweens.add({
                targets: glow,
                alpha: 0.4,
                duration: 150
            });
        });

        bg.on('pointerout', () => {
            this.scene.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 150
            });
            
            this.scene.tweens.add({
                targets: glow,
                alpha: 0.1,
                duration: 150
            });
        });

        buttonContainer.bg = bg;
        buttonContainer.glow = glow;
        buttonContainer.diffKey = diff.key;
        
        this.container.add(buttonContainer);
        return buttonContainer;
    }

    selectDifficulty(diffKey) {
        this.selectedDifficulty = diffKey;

        this.buttons.forEach(item => {
            const isSelected = item.key === diffKey;
            
            item.button.bg.setStrokeStyle(isSelected ? 5 : 3, item.color, isSelected ? 1 : 0.8);
            item.button.bg.setFillStyle(item.color, isSelected ? 0.6 : 0.3);
            
            if (isSelected) {
                this.scene.tweens.add({
                    targets: item.button.glow,
                    alpha: 0.5,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                this.scene.tweens.killTweensOf(item.button.glow);
                item.button.glow.setAlpha(0.1);
            }
        });
    }

    getSelectedDifficulty() {
        return this.selectedDifficulty;
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
