// Module quản lý assets cho Player (skins)
export class PlayerAssets {
    static name = 'PlayerAssets';

    // Đăng ký với AssetRegistry
    static load(scene) {
        PlayerAssets.loadSkins(scene);
    }

    // Tải tất cả skin
    static loadSkins(scene) {
        // Skin mặc định - Người xanh
        PlayerAssets.createSkin(scene, 'player_default', {
            bodyColor: 0x3498db,
            headColor: 0xf39c12,
            legColor: 0x2c3e50
        });

        // Skin ninja - Người đen
        PlayerAssets.createSkin(scene, 'player_ninja', {
            bodyColor: 0x2c3e50,
            headColor: 0x34495e,
            legColor: 0x1a1a1a
        });

        // Skin robot - Người xám kim loại
        PlayerAssets.createSkin(scene, 'player_robot', {
            bodyColor: 0x95a5a6,
            headColor: 0xbdc3c7,
            legColor: 0x7f8c8d
        });

        // Skin hero - Người đỏ
        PlayerAssets.createSkin(scene, 'player_hero', {
            bodyColor: 0xe74c3c,
            headColor: 0xf39c12,
            legColor: 0xc0392b
        });
    }

    // Tạo sprite cho skin
    static createSkin(scene, name, colors) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
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
}
