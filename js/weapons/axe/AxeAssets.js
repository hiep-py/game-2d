// Quản lý assets cho Axe
export class AxeAssets {
    static name = 'AxeAssets';

    // Đăng ký với AssetRegistry
    static load(scene) {
        AxeAssets.createSprite(scene);
    }

    static createSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Cán rìu (nâu đậm)
        graphics.fillStyle(0x654321, 1);
        graphics.fillRect(0, 8, 25, 4);
        
        // Chi tiết cán
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(5, 9, 2, 2);
        graphics.fillRect(15, 9, 2, 2);
        
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
        
        // Phần sắc (trắng)
        graphics.lineStyle(1, 0xffffff, 0.8);
        graphics.beginPath();
        graphics.moveTo(33, 2);
        graphics.lineTo(35, 0);
        graphics.strokePath();
        
        graphics.generateTexture('axe', 35, 20);
        graphics.destroy();
    }

    // Tạo hiệu ứng đập mạnh
    static createSmashEffect(scene, x, y, flipX) {
        // Vòng tròn sốc
        const shockwave = scene.add.circle(x, y, 20, 0xFF4500, 0.5);
        shockwave.setDepth(15);

        scene.tweens.add({
            targets: shockwave,
            scale: 2.5,
            alpha: 0,
            duration: 300,
            ease: 'Cubic.easeOut',
            onComplete: () => shockwave.destroy()
        });

        // Tia sáng
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            const ray = scene.add.graphics();
            ray.lineStyle(3, 0xFFD700, 0.8);
            ray.setDepth(14);
            
            const startX = x;
            const startY = y;
            const endX = x + Math.cos(angle) * 30;
            const endY = y + Math.sin(angle) * 30;
            
            ray.beginPath();
            ray.moveTo(startX, startY);
            ray.lineTo(endX, endY);
            ray.strokePath();

            scene.tweens.add({
                targets: ray,
                alpha: 0,
                duration: 250,
                onComplete: () => ray.destroy()
            });
        }
    }
}
