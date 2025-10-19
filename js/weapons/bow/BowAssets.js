// Quản lý assets cho Bow
export class BowAssets {
    static name = 'BowAssets';

    // Đăng ký với AssetRegistry
    static load(scene) {
        BowAssets.createSprite(scene);
    }

    static createSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Thân cung (nâu) - vẽ bằng đường cong
        graphics.lineStyle(3, 0x8B4513, 1);
        
        const curve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(5, 0),
            new Phaser.Math.Vector2(0, 10),
            new Phaser.Math.Vector2(5, 20)
        );
        curve.draw(graphics);
        
        // Dây cung (xám)
        graphics.lineStyle(1, 0x666666, 1);
        graphics.beginPath();
        graphics.moveTo(5, 2);
        graphics.lineTo(5, 18);
        graphics.strokePath();
        
        // Điểm giữa cung (vàng)
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(2, 10, 2);
        
        graphics.generateTexture('bow', 15, 20);
        graphics.destroy();
    }

    // Tạo mũi tên
    static createArrow(scene, x, y, targetX, targetY) {
        const arrow = scene.add.graphics();
        arrow.fillStyle(0x8B4513, 1);
        arrow.setDepth(10);
        
        // Thân mũi tên
        arrow.fillRect(0, -1, 15, 2);
        
        // Đầu mũi tên
        arrow.beginPath();
        arrow.moveTo(15, 0);
        arrow.lineTo(18, -2);
        arrow.lineTo(18, 2);
        arrow.closePath();
        arrow.fillPath();
        
        arrow.setPosition(x, y);
        
        // Tính góc bay
        const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
        arrow.setRotation(angle);
        
        // Bay về phía mục tiêu
        scene.tweens.add({
            targets: arrow,
            x: targetX,
            y: targetY,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                // Hiệu ứng va chạm
                BowAssets.createImpactEffect(scene, targetX, targetY);
                arrow.destroy();
            }
        });
        
        return arrow;
    }

    // Hiệu ứng va chạm
    static createImpactEffect(scene, x, y) {
        const impact = scene.add.circle(x, y, 8, 0xFFD700, 0.6);
        impact.setDepth(15);

        scene.tweens.add({
            targets: impact,
            scale: 2,
            alpha: 0,
            duration: 200,
            onComplete: () => impact.destroy()
        });
    }
}
