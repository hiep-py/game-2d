// Hệ thống spawn quái vật
import { Skeleton } from '../enemies/skeleton/Skeleton.js';
import { Spider } from '../enemies/spider/Spider.js';

export class EnemySpawner {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.enemies = [];
        this.maxEnemies = 15; // Tăng số lượng quái tối đa
    }

    // Spawn quái vật ngẫu nhiên
    spawnRandomEnemies(count) {
        const minEnemies = Math.min(count, this.maxEnemies);
        const enemyCount = Phaser.Math.Between(minEnemies, this.maxEnemies);

        for (let i = 0; i < enemyCount; i++) {
            // Random spawn Skeleton hoặc Spider
            const enemyType = Math.random();
            if (enemyType < 0.5) {
                this.spawnSkeleton();
            } else {
                this.spawnSpider();
            }
        }
    }

    // Spawn người xương
    spawnSkeleton() {
        // Vị trí ngẫu nhiên ở rìa màn hình
        const side = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;

        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        switch (side) {
            case 0: // top
                x = Phaser.Math.Between(50, width - 50);
                y = 50;
                break;
            case 1: // right
                x = width - 50;
                y = Phaser.Math.Between(50, height - 50);
                break;
            case 2: // bottom
                x = Phaser.Math.Between(50, width - 50);
                y = height - 50;
                break;
            case 3: // left
                x = 50;
                y = Phaser.Math.Between(50, height - 50);
                break;
        }

        const skeleton = new Skeleton(this.scene, x, y);
        this.enemies.push(skeleton);
        console.log(`[EnemySpawner] Spawned Skeleton at (${x}, ${y})`);
    }

    // Spawn nhện
    spawnSpider() {
        // Vị trí ngẫu nhiên ở rìa màn hình
        const side = Phaser.Math.Between(0, 3);
        let x, y;

        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        switch (side) {
            case 0: // top
                x = Phaser.Math.Between(50, width - 50);
                y = 50;
                break;
            case 1: // right
                x = width - 50;
                y = Phaser.Math.Between(50, height - 50);
                break;
            case 2: // bottom
                x = Phaser.Math.Between(50, width - 50);
                y = height - 50;
                break;
            case 3: // left
                x = 50;
                y = Phaser.Math.Between(50, height - 50);
                break;
        }

        const spider = new Spider(this.scene, x, y);
        this.enemies.push(spider);
        console.log(`[EnemySpawner] Spawned Spider at (${x}, ${y})`);
    }

    // Cập nhật tất cả quái vật
    update() {
        // Xóa quái vật đã chết
        this.enemies = this.enemies.filter(enemy => enemy.sprite.active);

        // Cập nhật quái vật còn sống
        this.enemies.forEach(enemy => {
            enemy.update(this.player);
        });
    }

    // Kiểm tra va chạm vũ khí với quái vật
    checkWeaponCollision(weaponBounds, weapon) {
        this.enemies.forEach(enemy => {
            if (!enemy.sprite.active) return;

            const enemyBounds = enemy.sprite.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(weaponBounds, enemyBounds)) {
                // Tính sát thương dựa trên khoảng cách
                let damage = weapon.damage; // Default
                
                // Nếu weapon có method calculateDamage, sử dụng nó
                if (typeof weapon.calculateDamage === 'function') {
                    damage = weapon.calculateDamage(enemy.sprite.x, enemy.sprite.y);
                    
                    // Fallback nếu damage là NaN
                    if (isNaN(damage)) {
                        console.warn(`[EnemySpawner] calculateDamage returned NaN, using base damage: ${weapon.damage}`);
                        damage = weapon.damage;
                    }
                }
                
                console.log(`[EnemySpawner] Weapon hit detected, dealing ${damage} damage to ${enemy.type || 'enemy'}`);
                enemy.takeDamage(damage);
            }
        });
    }

    // Lấy danh sách quái vật
    getEnemies() {
        return this.enemies;
    }

    // Hủy tất cả quái vật
    destroyAll() {
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];
    }
}
