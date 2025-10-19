// Module quản lý assets cho môi trường
export class EnvironmentAssets {
    static name = 'EnvironmentAssets';

    // Đăng ký với AssetRegistry
    static load(scene) {
        EnvironmentAssets.loadEnvironments(scene);
    }

    // Tải tất cả môi trường
    static loadEnvironments(scene) {
        // Cỏ xanh (mặc định)
        EnvironmentAssets.createGrassTile(scene, 'grass_green', 0x2ecc71, 0x27ae60);
        
        // Cỏ mùa thu (vàng)
        EnvironmentAssets.createGrassTile(scene, 'grass_autumn', 0xf39c12, 0xe67e22);
        
        // Tuyết (trắng)
        EnvironmentAssets.createSnowTile(scene, 'snow_white');
        
        // Không gian (sao)
        EnvironmentAssets.createSpaceTile(scene, 'space_stars');
        
        // Sa mạc (cát)
        EnvironmentAssets.createSandTile(scene, 'sand_desert');
    }

    // Tạo ô cỏ
    static createGrassTile(scene, name, lightColor, darkColor) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
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
    static createSnowTile(scene, name) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
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
    static createSpaceTile(scene, name) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
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
    static createSandTile(scene, name) {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
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
}
