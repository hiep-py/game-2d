// Module quản lý môi trường (nền, không gian)
import { GameConfig, Colors } from '../config.js';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.tiles = [];
        this.currentEnvironment = 'grass_green';
        
        // Phím để đổi môi trường
        this.envKeys = scene.input.keyboard.addKeys({
            f1: Phaser.Input.Keyboard.KeyCodes.F1,
            f2: Phaser.Input.Keyboard.KeyCodes.F2,
            f3: Phaser.Input.Keyboard.KeyCodes.F3,
            f4: Phaser.Input.Keyboard.KeyCodes.F4,
            f5: Phaser.Input.Keyboard.KeyCodes.F5
        });
        
        this.environments = [
            { name: 'grass_green', tile: 'grass_green', bg: Colors.sky, label: 'Cỏ Xanh' },
            { name: 'grass_autumn', tile: 'grass_autumn', bg: '#FFA500', label: 'Mùa Thu' },
            { name: 'snow_white', tile: 'snow_white', bg: '#B0C4DE', label: 'Tuyết' },
            { name: 'space_stars', tile: 'space_stars', bg: Colors.space, label: 'Không Gian' },
            { name: 'sand_desert', tile: 'sand_desert', bg: '#FFD700', label: 'Sa Mạc' }
        ];
    }

    // Tạo môi trường ban đầu
    create() {
        this.createTiles(this.currentEnvironment);
        this.scene.cameras.main.setBackgroundColor(Colors.sky);
    }

    // Tạo các ô nền
    createTiles(tileName) {
        // Xóa các ô cũ
        this.tiles.forEach(tile => tile.destroy());
        this.tiles = [];
        
        const tileSize = 50;
        const rows = Math.ceil(GameConfig.height / tileSize) + 1;
        const cols = Math.ceil(GameConfig.width / tileSize) + 1;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * tileSize;
                const y = row * tileSize;
                const tile = this.scene.add.image(x, y, tileName);
                tile.setOrigin(0, 0);
                tile.setDepth(-1);
                this.tiles.push(tile);
            }
        }
    }

    // Cập nhật mỗi frame
    update() {
        this.handleEnvironmentChange();
    }

    // Xử lý đổi môi trường
    handleEnvironmentChange() {
        if (Phaser.Input.Keyboard.JustDown(this.envKeys.f1)) {
            this.changeEnvironment(0);
        } else if (Phaser.Input.Keyboard.JustDown(this.envKeys.f2)) {
            this.changeEnvironment(1);
        } else if (Phaser.Input.Keyboard.JustDown(this.envKeys.f3)) {
            this.changeEnvironment(2);
        } else if (Phaser.Input.Keyboard.JustDown(this.envKeys.f4)) {
            this.changeEnvironment(3);
        } else if (Phaser.Input.Keyboard.JustDown(this.envKeys.f5)) {
            this.changeEnvironment(4);
        }
    }

    // Đổi môi trường
    changeEnvironment(index) {
        if (index >= 0 && index < this.environments.length) {
            const env = this.environments[index];
            this.currentEnvironment = env.name;
            this.createTiles(env.tile);
            this.scene.cameras.main.setBackgroundColor(env.bg);
            
            // Hiển thị thông báo
            this.showNotification(`Môi trường: ${env.label}`);
        }
    }

    // Hiển thị thông báo
    showNotification(message) {
        const text = this.scene.add.text(
            GameConfig.width / 2, 
            GameConfig.height - 50, 
            message,
            {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#000',
                padding: { x: 15, y: 10 }
            }
        );
        text.setOrigin(0.5);
        text.setDepth(1000);
        
        // Tự động ẩn sau 2 giây
        this.scene.time.delayedCall(2000, () => {
            text.destroy();
        });
    }

    // Lấy môi trường hiện tại
    getCurrentEnvironment() {
        return this.environments.find(env => env.name === this.currentEnvironment);
    }
}
