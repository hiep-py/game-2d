// Module quản lý nhân vật
import { GameConfig } from '../config.js';
import { Sword } from '../weapons/Sword.js';
import { Bow } from '../weapons/Bow.js';
import { Axe } from '../weapons/Axe.js';

export class Player {
    constructor(scene, x, y, skinName = 'player_default') {
        this.scene = scene;
        this.currentSkin = skinName;
        
        // Tạo sprite
        this.sprite = scene.physics.add.sprite(x, y, skinName);
        this.sprite.setCollideWorldBounds(true);
        
        // Thiết lập điều khiển
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Phím để đổi skin
        this.skinKeys = scene.input.keyboard.addKeys({
            key1: Phaser.Input.Keyboard.KeyCodes.ONE,
            key2: Phaser.Input.Keyboard.KeyCodes.TWO,
            key3: Phaser.Input.Keyboard.KeyCodes.THREE,
            key4: Phaser.Input.Keyboard.KeyCodes.FOUR
        });
        
        this.skins = [
            'player_default',
            'player_ninja', 
            'player_robot',
            'player_hero'
        ];

        // Hệ thống vũ khí
        this.weapons = [];
        this.currentWeaponIndex = 0;
        this.initWeapons();

        // Phím tấn công
        this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Chuột trái để tấn công
        scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.attack();
            }
        });
        
        // Phím đổi vũ khí
        this.weaponKeys = scene.input.keyboard.addKeys({
            q: Phaser.Input.Keyboard.KeyCodes.Q,
            e: Phaser.Input.Keyboard.KeyCodes.E,
            sword: Phaser.Input.Keyboard.KeyCodes.ONE,
            bow: Phaser.Input.Keyboard.KeyCodes.TWO,
            axe: Phaser.Input.Keyboard.KeyCodes.THREE
        });
    }

    // Khởi tạo vũ khí
    initWeapons() {
        // Tạo các vũ khí
        this.weapons.push(new Sword(this.scene, this));
        this.weapons.push(new Bow(this.scene, this));
        this.weapons.push(new Axe(this.scene, this));

        // Hiển thị vũ khí đầu tiên
        this.weapons.forEach((weapon, index) => {
            if (index === 0) {
                weapon.show();
            } else {
                weapon.hide();
            }
        });
    }

    // Cập nhật mỗi frame
    update() {
        this.handleMovement();
        this.handleSkinChange();
        this.handleWeaponUpdate();
        this.handleAttack();
        this.handleWeaponSwitch();
    }

    // Xử lý di chuyển
    handleMovement() {
        this.sprite.setVelocity(0);
        
        const speed = GameConfig.playerSpeed;
        
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.sprite.setVelocityX(-speed);
            this.sprite.flipX = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.sprite.setVelocityX(speed);
            this.sprite.flipX = false;
        }
        
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.sprite.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.sprite.setVelocityY(speed);
        }
        
        // Chuẩn hóa vận tốc khi di chuyển chéo
        if (this.sprite.body.velocity.x !== 0 && this.sprite.body.velocity.y !== 0) {
            this.sprite.body.velocity.normalize().scale(speed);
        }
    }

    // Xử lý đổi skin
    handleSkinChange() {
        if (Phaser.Input.Keyboard.JustDown(this.skinKeys.key1)) {
            this.changeSkin(0);
        } else if (Phaser.Input.Keyboard.JustDown(this.skinKeys.key2)) {
            this.changeSkin(1);
        } else if (Phaser.Input.Keyboard.JustDown(this.skinKeys.key3)) {
            this.changeSkin(2);
        } else if (Phaser.Input.Keyboard.JustDown(this.skinKeys.key4)) {
            this.changeSkin(3);
        }
    }

    // Đổi skin
    changeSkin(index) {
        if (index >= 0 && index < this.skins.length) {
            this.currentSkin = this.skins[index];
            this.sprite.setTexture(this.currentSkin);
        }
    }

    // Cập nhật vũ khí
    handleWeaponUpdate() {
        const currentWeapon = this.weapons[this.currentWeaponIndex];
        if (currentWeapon) {
            currentWeapon.update();
        }
    }

    // Xử lý tấn công
    handleAttack() {
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.attack();
        }
    }

    // Thực hiện tấn công
    attack() {
        const currentWeapon = this.weapons[this.currentWeaponIndex];
        if (currentWeapon) {
            currentWeapon.attack();
        }
    }

    // Xử lý đổi vũ khí
    handleWeaponSwitch() {
        if (Phaser.Input.Keyboard.JustDown(this.weaponKeys.q)) {
            this.cycleWeapon(-1); // Vũ khí trước
        } else if (Phaser.Input.Keyboard.JustDown(this.weaponKeys.e)) {
            this.cycleWeapon(1); // Vũ khí sau
        } else if (Phaser.Input.Keyboard.JustDown(this.weaponKeys.sword)) {
            this.switchWeapon('sword');
        } else if (Phaser.Input.Keyboard.JustDown(this.weaponKeys.bow)) {
            this.switchWeapon('bow');
        } else if (Phaser.Input.Keyboard.JustDown(this.weaponKeys.axe)) {
            this.switchWeapon('axe');
        }
    }

    // Chuyển vũ khí theo key (sword, bow, axe)
    switchWeapon(weaponKey) {
        // Tìm index của weapon
        const weaponMap = {
            'sword': 0,
            'bow': 1,
            'axe': 2
        };

        const newIndex = weaponMap[weaponKey];
        if (newIndex === undefined || newIndex === this.currentWeaponIndex) {
            return;
        }

        // Ẩn vũ khí hiện tại
        if (this.weapons[this.currentWeaponIndex]) {
            this.weapons[this.currentWeaponIndex].hide();
        }

        // Chuyển sang vũ khí mới
        this.currentWeaponIndex = newIndex;
        const newWeapon = this.weapons[this.currentWeaponIndex];
        
        if (newWeapon) {
            newWeapon.show();
            this.showWeaponNotification(newWeapon.getInfo().name);
        }
    }

    // Chuyển vũ khí (cycle)
    cycleWeapon(direction = 1) {
        // Ẩn vũ khí hiện tại
        const currentWeapon = this.weapons[this.currentWeaponIndex];
        if (currentWeapon) {
            currentWeapon.hide();
        }

        // Chuyển sang vũ khí mới
        this.currentWeaponIndex += direction;
        
        if (this.currentWeaponIndex < 0) {
            this.currentWeaponIndex = this.weapons.length - 1;
        } else if (this.currentWeaponIndex >= this.weapons.length) {
            this.currentWeaponIndex = 0;
        }

        // Hiển thị vũ khí mới
        const newWeapon = this.weapons[this.currentWeaponIndex];
        if (newWeapon) {
            newWeapon.show();
            this.showWeaponNotification(newWeapon.getInfo().name);
        }
    }

    // Hiển thị thông báo vũ khí
    showWeaponNotification(weaponName) {
        const text = this.scene.add.text(
            GameConfig.width / 2,
            GameConfig.height - 100,
            `Vũ khí: ${weaponName}`,
            {
                fontSize: '20px',
                fill: '#fff',
                backgroundColor: '#000',
                padding: { x: 10, y: 5 }
            }
        );
        text.setOrigin(0.5);
        text.setDepth(1000);

        this.scene.time.delayedCall(1500, () => {
            text.destroy();
        });
    }

    // Lấy vũ khí hiện tại
    getCurrentWeapon() {
        return this.weapons[this.currentWeaponIndex];
    }

    // Nhận sát thương (sẽ được gọi từ PlayerHealth)
    takeDamage(damage) {
        // Method này sẽ được override bởi PlayerHealth system
        // Giữ ở đây để tương thích
    }

    // Set health system
    setHealthSystem(healthSystem) {
        this.healthSystem = healthSystem;
        this.takeDamage = (damage) => {
            this.healthSystem.takeDamage(damage);
        };
    }

    // Lấy vị trí
    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
}
