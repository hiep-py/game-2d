// Component chọn vũ khí
export class WeaponSelector {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.selectedWeapon = 'sword';
        this.buttons = [];
        this.container = null;
    }

    create() {
        this.container = this.scene.add.container(this.x, this.y);
        this.container.setDepth(10);

        // Title với hiệu ứng
        const title = this.scene.add.text(0, 0, 'CHỌN VŨ KHÍ', {
            fontSize: '28px',
            fill: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        title.setOrigin(0.5);
        this.container.add(title);

        // Glow effect cho title
        this.scene.tweens.add({
            targets: title,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Weapons data
        const weapons = [
            { 
                key: 'sword', 
                name: 'KIẾM', 
                icon: 'weapon_sword_icon',
                color: 0xff0000, 
                damage: '35', 
                speed: 'Nhanh',
                desc: 'Cân bằng, dễ dùng'
            },
            { 
                key: 'bow', 
                name: 'CUNG', 
                icon: 'weapon_bow_icon',
                color: 0x8B4513, 
                damage: '28', 
                speed: 'TB',
                desc: 'Tầm xa, an toàn'
            },
            { 
                key: 'axe', 
                name: 'RÌU', 
                icon: 'weapon_axe_icon',
                color: 0x708090, 
                damage: '55', 
                speed: 'Chậm',
                desc: 'Sát thương cực mạnh'
            }
        ];

        weapons.forEach((weapon, index) => {
            const button = this.createWeaponButton(weapon, index);
            this.buttons.push({ key: weapon.key, button, color: weapon.color });
        });

        // Select default
        this.selectWeapon('sword');

        return this.container;
    }

    createWeaponButton(weapon, index) {
        const buttonY = 60 + index * 100;
        const buttonContainer = this.scene.add.container(0, buttonY);

        // Background panel với gradient effect
        const bg = this.scene.add.rectangle(0, 0, 300, 85, weapon.color, 0.3);
        bg.setStrokeStyle(3, weapon.color, 0.8);
        buttonContainer.add(bg);

        // Glow effect
        const glow = this.scene.add.rectangle(0, 0, 300, 85, weapon.color, 0.1);
        buttonContainer.add(glow);

        // Weapon icon
        const icon = this.scene.add.sprite(-140, 0, weapon.icon);
        icon.setScale(2);
        buttonContainer.add(icon);

        // Weapon name
        const nameText = this.scene.add.text(-110, -25, weapon.name, {
            fontSize: '22px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        buttonContainer.add(nameText);

        // Stats
        const statsText = this.scene.add.text(-110, 0, `DMG: ${weapon.damage} | ${weapon.speed}`, {
            fontSize: '16px',
            fill: '#FFD700'
        });
        buttonContainer.add(statsText);

        // Description
        const descText = this.scene.add.text(-110, 20, weapon.desc, {
            fontSize: '13px',
            fill: '#cccccc',
            fontStyle: 'italic'
        });
        buttonContainer.add(descText);

        // Interactive
        bg.setInteractive({ useHandCursor: true });

        bg.on('pointerdown', () => {
            this.selectWeapon(weapon.key);
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
        buttonContainer.weaponKey = weapon.key;
        
        this.container.add(buttonContainer);
        return buttonContainer;
    }

    selectWeapon(weaponKey) {
        this.selectedWeapon = weaponKey;

        this.buttons.forEach(item => {
            const isSelected = item.key === weaponKey;
            
            item.button.bg.setStrokeStyle(isSelected ? 5 : 3, item.color, isSelected ? 1 : 0.8);
            item.button.bg.setFillStyle(item.color, isSelected ? 0.6 : 0.3);
            
            if (isSelected) {
                // Selected glow animation
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

    getSelectedWeapon() {
        return this.selectedWeapon;
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
