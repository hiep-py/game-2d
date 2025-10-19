// Module quản lý assets cho tất cả vũ khí
import { SwordAssets } from '../sword/SwordAssets.js';
import { BowAssets } from '../bow/BowAssets.js';
import { AxeAssets } from '../axe/AxeAssets.js';

export class WeaponAssets {
    static name = 'WeaponAssets';

    // Đăng ký với AssetRegistry
    static load(scene) {
        // Load từ các module riêng
        SwordAssets.load(scene);
        BowAssets.load(scene);
        AxeAssets.load(scene);
    }

    // Tạo sprite kiếm
    static createSwordSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
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
    static createBowSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
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
    static createAxeSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
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
}
