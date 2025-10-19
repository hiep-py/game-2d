// Quản lý assets cho Skeleton - Module tự quản lý hoàn toàn
export class SkeletonAssets {
    static name = 'SkeletonAssets';

    // Method để đăng ký với AssetRegistry
    static load(scene) {
        SkeletonAssets.createSprite(scene);
    }

    static createSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Đầu lâu (trắng)
        graphics.fillStyle(0xf0f0f0, 1);
        graphics.fillCircle(20, 15, 12);
        
        // Hốc mắt (đen)
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(16, 13, 3);
        graphics.fillCircle(24, 13, 3);
        
        // Ánh đỏ trong mắt
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(16, 13, 1.5);
        graphics.fillCircle(24, 13, 1.5);
        
        // Mũi (tam giác)
        graphics.fillStyle(0x000000, 1);
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
        graphics.fillStyle(0xffffff, 1);
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

    // Tạo hiệu ứng tấn công
    static createAttackEffect(scene, x, y, flipX) {
        const slash = scene.add.graphics();
        slash.lineStyle(4, 0xff0000, 0.8);
        slash.setDepth(15);
        
        const startX = flipX ? x - 25 : x + 25;
        const startY = y - 15;
        const endX = flipX ? x - 50 : x + 50;
        const endY = y + 15;
        
        slash.beginPath();
        slash.moveTo(startX, startY);
        slash.lineTo(endX, endY);
        slash.strokePath();

        scene.tweens.add({
            targets: slash,
            alpha: 0,
            duration: 250,
            onComplete: () => slash.destroy()
        });
    }

    // Tạo hiệu ứng chết
    static createDeathEffect(scene, x, y) {
        // Tạo các mảnh xương bay ra
        for (let i = 0; i < 8; i++) {
            const bone = scene.add.rectangle(x, y, 8, 3, 0xf0f0f0);
            bone.setDepth(10);
            
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 100 + Math.random() * 50;
            
            scene.tweens.add({
                targets: bone,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                rotation: Math.random() * Math.PI * 2,
                alpha: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => bone.destroy()
            });
        }
    }
}
