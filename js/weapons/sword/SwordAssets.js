// Quản lý assets cho Sword
export class SwordAssets {
    static name = 'SwordAssets';

    // Đăng ký với AssetRegistry
    static load(scene) {
        SwordAssets.createSprite(scene);
    }

    static createSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Lưỡi kiếm (bạc sáng)
        graphics.fillStyle(0xc0c0c0, 1);
        graphics.fillRect(0, 8, 35, 4);
        
        // Viền lưỡi kiếm (sáng hơn)
        graphics.lineStyle(1, 0xe0e0e0, 1);
        graphics.strokeRect(0, 8, 35, 4);
        
        // Mũi kiếm (nhọn)
        graphics.fillStyle(0xd0d0d0, 1);
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
        
        // Chi tiết vàng
        graphics.fillStyle(0xFFA500, 1);
        graphics.fillRect(7, 9, 2, 2);
        
        graphics.generateTexture('sword', 40, 20);
        graphics.destroy();
    }

    // Tạo hiệu ứng chém
    static createSlashEffect(scene, x, y, flipX) {
        const slash = scene.add.graphics();
        slash.lineStyle(4, 0xff0000, 0.8);
        slash.setDepth(15);
        
        const startX = flipX ? x - 30 : x + 30;
        const startY = y - 10;
        const endX = flipX ? x - 10 : x + 10;
        const endY = y + 10;
        
        // Vẽ vệt chém
        slash.beginPath();
        slash.moveTo(startX, startY);
        slash.lineTo(endX, endY);
        slash.strokePath();

        scene.tweens.add({
            targets: slash,
            alpha: 0,
            duration: 200,
            onComplete: () => slash.destroy()
        });
    }
}
