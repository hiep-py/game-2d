// Quản lý assets cho Spider
export class SpiderAssets {
    static name = 'SpiderAssets';

    // Đăng ký với AssetRegistry
    static load(scene) {
        SpiderAssets.createSprite(scene);
    }

    static createSprite(scene) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Thân nhện (đen)
        graphics.fillStyle(0x1a1a1a, 1);
        graphics.fillEllipse(20, 25, 18, 14);
        
        // Đầu nhện (đen)
        graphics.fillStyle(0x0a0a0a, 1);
        graphics.fillEllipse(20, 15, 12, 10);
        
        // Mắt nhện (đỏ - 8 mắt)
        graphics.fillStyle(0xff0000, 1);
        // Hàng trên
        graphics.fillCircle(15, 13, 2);
        graphics.fillCircle(19, 12, 2.5);
        graphics.fillCircle(21, 12, 2.5);
        graphics.fillCircle(25, 13, 2);
        // Hàng dưới
        graphics.fillCircle(16, 16, 1.5);
        graphics.fillCircle(20, 16, 1.5);
        graphics.fillCircle(24, 16, 1.5);
        
        // Chân nhện (8 chân)
        graphics.lineStyle(2, 0x2a2a2a, 1);
        
        // Chân bên trái (4 chân)
        for (let i = 0; i < 4; i++) {
            const y = 18 + i * 4;
            graphics.beginPath();
            graphics.moveTo(10, y);
            graphics.lineTo(2, y - 8);
            graphics.lineTo(0, y - 6);
            graphics.strokePath();
        }
        
        // Chân bên phải (4 chân)
        for (let i = 0; i < 4; i++) {
            const y = 18 + i * 4;
            graphics.beginPath();
            graphics.moveTo(30, y);
            graphics.lineTo(38, y - 8);
            graphics.lineTo(40, y - 6);
            graphics.strokePath();
        }
        
        // Điểm sáng trên lưng (màu xanh lá nhạt)
        graphics.fillStyle(0x00ff00, 0.3);
        graphics.fillCircle(20, 25, 6);
        
        graphics.generateTexture('spider', 40, 35);
        graphics.destroy();
    }

    // Tạo hiệu ứng tấn công (cắn)
    static createAttackEffect(scene, x, y, flipX) {
        const bite = scene.add.graphics();
        bite.lineStyle(3, 0x00ff00, 0.9);
        bite.setDepth(15);
        
        const startX = flipX ? x - 20 : x + 20;
        const startY = y;
        
        // Vẽ răng nanh
        bite.beginPath();
        bite.moveTo(startX, startY - 5);
        bite.lineTo(startX + (flipX ? -10 : 10), startY);
        bite.lineTo(startX, startY + 5);
        bite.strokePath();

        scene.tweens.add({
            targets: bite,
            alpha: 0,
            duration: 200,
            onComplete: () => bite.destroy()
        });
    }

    // Tạo hiệu ứng nhảy
    static createJumpEffect(scene, x, y) {
        const circle = scene.add.circle(x, y, 15, 0x00ff00, 0.3);
        circle.setDepth(5);

        scene.tweens.add({
            targets: circle,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => circle.destroy()
        });
    }

    // Tạo hiệu ứng chết (nhện vỡ ra)
    static createDeathEffect(scene, x, y) {
        // Tạo các mảnh nhện bay ra
        for (let i = 0; i < 6; i++) {
            const piece = scene.add.rectangle(x, y, 6, 4, 0x1a1a1a);
            piece.setDepth(10);
            
            const angle = (Math.PI * 2 * i) / 6;
            const speed = 80 + Math.random() * 40;
            
            scene.tweens.add({
                targets: piece,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                rotation: Math.random() * Math.PI * 2,
                alpha: 0,
                duration: 500,
                ease: 'Cubic.easeOut',
                onComplete: () => piece.destroy()
            });
        }

        // Hiệu ứng tơ nhện
        const web = scene.add.graphics();
        web.lineStyle(1, 0xffffff, 0.5);
        web.setDepth(10);
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            web.beginPath();
            web.moveTo(x, y);
            web.lineTo(x + Math.cos(angle) * 30, y + Math.sin(angle) * 30);
            web.strokePath();
        }

        scene.tweens.add({
            targets: web,
            alpha: 0,
            duration: 400,
            onComplete: () => web.destroy()
        });
    }
}
