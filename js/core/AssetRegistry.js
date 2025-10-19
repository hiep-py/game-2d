// Hệ thống đăng ký assets - Cho phép mỗi module tự quản lý assets của mình
export class AssetRegistry {
    constructor() {
        this.loaders = [];
    }

    // Đăng ký một asset loader
    register(loader) {
        if (typeof loader.load !== 'function') {
            console.error('Asset loader must have a load() method');
            return;
        }
        this.loaders.push(loader);
    }

    // Tải tất cả assets đã đăng ký (async)
    async loadAll(scene) {
        console.log(`Loading ${this.loaders.length} asset modules...`);
        
        for (const loader of this.loaders) {
            try {
                await loader.load(scene);
                console.log(`✓ Loaded: ${loader.name || 'Unknown'}`);
            } catch (error) {
                console.error(`✗ Failed to load: ${loader.name || 'Unknown'}`, error);
            }
        }
        
        console.log('All assets loaded!');
    }

    // Tải đồng bộ (cho Phaser preload)
    loadAllSync(scene) {
        console.log(`Loading ${this.loaders.length} asset modules...`);
        
        for (const loader of this.loaders) {
            try {
                loader.load(scene);
                console.log(`✓ Loaded: ${loader.name || 'Unknown'}`);
            } catch (error) {
                console.error(`✗ Failed to load: ${loader.name || 'Unknown'}`, error);
            }
        }
        
        console.log('All assets loaded!');
    }

    // Xóa tất cả đăng ký
    clear() {
        this.loaders = [];
    }
}

// Singleton instance
export const assetRegistry = new AssetRegistry();
