// AssetLoader mới - Sử dụng Registry Pattern để linh hoạt
import { assetRegistry } from '../core/AssetRegistry.js';
import { PlayerAssets } from '../entities/assets/PlayerAssets.js';
import { WeaponAssets } from '../weapons/assets/WeaponAssets.js';
import { EnvironmentAssets } from '../environment/assets/EnvironmentAssets.js';
import { SkeletonAssets } from '../enemies/skeleton/SkeletonAssets.js';
import { SpiderAssets } from '../enemies/spider/SpiderAssets.js';

export class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.setupRegistry();
    }

    // Đăng ký tất cả asset modules
    setupRegistry() {
        assetRegistry.clear();
        
        // Đăng ký các module assets
        assetRegistry.register(PlayerAssets);
        assetRegistry.register(WeaponAssets);
        assetRegistry.register(EnvironmentAssets);
        assetRegistry.register(SkeletonAssets);
        assetRegistry.register(SpiderAssets);
        
        // Dễ dàng thêm module mới:
        // assetRegistry.register(ZombieAssets);
        // assetRegistry.register(BossAssets);
    }

    // Tải tất cả assets đã đăng ký (async)
    async loadAll() {
        await assetRegistry.loadAll(this.scene);
    }

    // Tải đồng bộ (cho Phaser preload)
    loadAllSync() {
        assetRegistry.loadAllSync(this.scene);
    }

    // ===== CÁC METHOD CŨ - GIỮ LẠI ĐỂ TƯƠNG THÍCH =====
    // (Không còn được sử dụng, assets được load qua Registry)
    
    loadPlayerSkins() {
        // Skin mặc định - Người xanh
        this.createPlayerSkin('player_default', {
            bodyColor: 0x3498db,
            headColor: 0xf39c12,
            legColor: 0x2c3e50
        });

        // Skin ninja - Người đen
        this.createPlayerSkin('player_ninja', {
            bodyColor: 0x2c3e50,
            headColor: 0x34495e,
            legColor: 0x1a1a1a
        });

        // Skin robot - Người xám kim loại
        this.createPlayerSkin('player_robot', {
            bodyColor: 0x95a5a6,
            headColor: 0xbdc3c7,
            legColor: 0x7f8c8d
        });

        // Skin hero - Người đỏ
        this.createPlayerSkin('player_hero', {
            bodyColor: 0xe74c3c,
            headColor: 0xf39c12,
            legColor: 0xc0392b
        });
    }

    // Tạo sprite cho skin nhân vật
    createPlayerSkin(name, colors) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Thân người
        graphics.fillStyle(colors.bodyColor, 1);
        graphics.fillRect(10, 20, 20, 30);
        
        // Đầu
        graphics.fillStyle(colors.headColor, 1);
        graphics.fillCircle(20, 15, 10);
        
        // Mắt
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(17, 13, 2);
        graphics.fillCircle(23, 13, 2);
        
        // Miệng
        graphics.lineStyle(2, 0x000000, 1);
        graphics.beginPath();
        graphics.arc(20, 15, 5, 0.2, Math.PI - 0.2);
        graphics.strokePath();
        
        // Tay trái
        graphics.fillStyle(colors.headColor, 1);
        graphics.fillRect(5, 25, 5, 15);
        
        // Tay phải
        graphics.fillRect(30, 25, 5, 15);
        
        // Chân trái
        graphics.fillStyle(colors.legColor, 1);
        graphics.fillRect(12, 50, 6, 15);
        
        // Chân phải
        graphics.fillRect(22, 50, 6, 15);
        
        graphics.generateTexture(name, 40, 65);
        graphics.destroy();
    }

    // Tải các môi trường khác nhau
    loadEnvironments() {
        // Cỏ xanh (mặc định)
        this.createGrassTile('grass_green', 0x2ecc71, 0x27ae60);
        
        // Cỏ mùa thu (vàng)
        this.createGrassTile('grass_autumn', 0xf39c12, 0xe67e22);
        
        // Tuyết (trắng)
        this.createSnowTile('snow_white');
        
        // Không gian (sao)
        this.createSpaceTile('space_stars');
        
        // Sa mạc (cát)
        this.createSandTile('sand_desert');
    }

    // Tạo ô cỏ
    createGrassTile(name, lightColor, darkColor) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(lightColor, 1);
        graphics.fillRect(0, 0, 50, 50);
        
        // Thêm chi tiết cỏ
        graphics.fillStyle(darkColor, 1);
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * 50;
            const y = Math.random() * 50;
            graphics.fillRect(x, y, 3, 8);
        }
        
        graphics.generateTexture(name, 50, 50);
        graphics.destroy();
    }

    // Tạo ô tuyết
    createSnowTile(name) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xecf0f1, 1);
        graphics.fillRect(0, 0, 50, 50);
        
        // Thêm bông tuyết nhỏ
        graphics.fillStyle(0xffffff, 1);
        for (let i = 0; i < 6; i++) {
            const x = Math.random() * 50;
            const y = Math.random() * 50;
            graphics.fillCircle(x, y, 2);
        }
        
        graphics.generateTexture(name, 50, 50);
        graphics.destroy();
    }

    // Tạo ô không gian với sao
    createSpaceTile(name) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x0f0f1e, 1);
        graphics.fillRect(0, 0, 50, 50);
        
        // Thêm các ngôi sao
        graphics.fillStyle(0xffffff, 1);
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * 50;
            const y = Math.random() * 50;
            const size = Math.random() * 2 + 1;
            graphics.fillCircle(x, y, size);
        }
        
        graphics.generateTexture(name, 50, 50);
        graphics.destroy();
    }

    // Tạo ô cát sa mạc
    createSandTile(name) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xf4d03f, 1);
        graphics.fillRect(0, 0, 50, 50);
        
        // Thêm chi tiết cát
        graphics.fillStyle(0xf5b041, 1);
        for (let i = 0; i < 6; i++) {
            const x = Math.random() * 50;
            const y = Math.random() * 50;
            graphics.fillCircle(x, y, 3);
        }
        
        graphics.generateTexture(name, 50, 50);
        graphics.destroy();
    }

    // Tải các vũ khí
    loadWeapons() {
        this.createSwordSprite();
        this.createBowSprite();
        this.createAxeSprite();
    }

    // Tạo sprite kiếm
    createSwordSprite() {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Lưỡi kiếm (bạc)
        graphics.fillStyle(0xc0c0c0, 1);
        graphics.fillRect(0, 8, 35, 4);
        
        // Mũi kiếm (nhọn)
        graphics.beginPath();
        graphics.moveTo(35, 10);
        graphics.lineTo(40, 10);
        graphics.lineTo(35, 12);
        graphics.closePath();
        graphics.fillPath();
        
        // Chuôi kiếm (nâu)
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(0, 7, 8, 6);
        
        // Đầu chuôi (vàng)
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(2, 10, 3);
        
        graphics.generateTexture('sword', 40, 20);
        graphics.destroy();
    }

    // Tạo sprite cung
    createBowSprite() {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Thân cung (nâu) - vẽ bằng đường cong
        graphics.lineStyle(3, 0x8B4513, 1);
        
        const curve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(5, 0),
            new Phaser.Math.Vector2(0, 10),
            new Phaser.Math.Vector2(5, 20)
        );
        curve.draw(graphics);
        
        // Dây cung
        graphics.lineStyle(1, 0x666666, 1);
        graphics.beginPath();
        graphics.moveTo(5, 2);
        graphics.lineTo(5, 18);
        graphics.strokePath();
        
        graphics.generateTexture('bow', 15, 20);
        graphics.destroy();
    }

    // Tạo sprite rìu
    createAxeSprite() {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Cán rìu (nâu)
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(0, 8, 25, 4);
        
        // Lưỡi rìu (xám)
        graphics.fillStyle(0x708090, 1);
        graphics.beginPath();
        graphics.moveTo(20, 10);
        graphics.lineTo(35, 0);
        graphics.lineTo(35, 20);
        graphics.closePath();
        graphics.fillPath();
        
        // Viền lưỡi rìu (sáng hơn)
        graphics.lineStyle(2, 0x909090, 1);
        graphics.beginPath();
        graphics.moveTo(20, 10);
        graphics.lineTo(35, 0);
        graphics.strokePath();
        
        graphics.generateTexture('axe', 35, 20);
        graphics.destroy();
    }

    // Tải quái vật
    loadEnemies() {
        // Tạo sprite skeleton trực tiếp
        this.createSkeletonSprite();
    }

    // Tạo sprite người xương (đơn giản và rõ ràng)
    createSkeletonSprite() {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Clear và reset
        graphics.clear();
        
        // Đầu lâu (trắng)
        graphics.fillStyle(0xf0f0f0, 1);
        graphics.fillCircle(20, 15, 11);
        
        // Hốc mắt (đen)
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(16, 13, 3);
        graphics.fillCircle(24, 13, 3);
        
        // Mũi (tam giác)
        graphics.beginPath();
        graphics.moveTo(20, 16);
        graphics.lineTo(18, 19);
        graphics.lineTo(22, 19);
        graphics.closePath();
        graphics.fillPath();
        
        // Hàm răng
        graphics.lineStyle(1, 0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(15, 21);
        graphics.lineTo(25, 21);
        graphics.strokePath();
        
        // Răng
        for (let i = 0; i < 5; i++) {
            graphics.fillRect(15 + i * 2.5, 21, 1, 2);
        }
        
        // Xương sườn (trắng)
        graphics.fillStyle(0xf0f0f0, 1);
        graphics.fillRect(12, 28, 16, 25);
        
        // Vẽ xương sườn
        graphics.lineStyle(2, 0xd0d0d0, 1);
        for (let i = 0; i < 4; i++) {
            const y = 32 + i * 6;
            graphics.beginPath();
            graphics.moveTo(14, y);
            graphics.lineTo(26, y);
            graphics.strokePath();
        }
        
        // Tay trái (xương)
        graphics.fillStyle(0xf0f0f0, 1);
        graphics.fillRect(6, 30, 6, 18);
        
        // Tay phải
        graphics.fillRect(28, 30, 6, 18);
        
        // Chân trái (xương)
        graphics.fillRect(13, 53, 6, 18);
        
        // Chân phải
        graphics.fillRect(21, 53, 6, 18);
        
        // Khớp xương (tròn)
        graphics.fillCircle(9, 30, 3);
        graphics.fillCircle(31, 30, 3);
        graphics.fillCircle(16, 53, 3);
        graphics.fillCircle(24, 53, 3);
        
        graphics.generateTexture('skeleton', 40, 71);
        graphics.destroy();
    }
}

// ===== HƯỚNG DẪN THÊM MODULE MỚI =====
/*

1. Tạo file asset module mới, ví dụ: js/enemies/zombie/ZombieAssets.js

export class ZombieAssets {
    static name = 'ZombieAssets';
    
    static load(scene) {
        // Tạo sprites ở đây
        ZombieAssets.createSprite(scene);
    }
    
    static createSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        // Vẽ sprite...
        graphics.generateTexture('zombie', 40, 70);
        graphics.destroy();
    }
}

2. Import và đăng ký trong AssetLoader.setupRegistry():

import { ZombieAssets } from '../enemies/zombie/ZombieAssets.js';

setupRegistry() {
    assetRegistry.register(ZombieAssets);
}

3. Xong! Module tự động được load khi game khởi động.

*/
