// Scene chính của game
import { GameConfig } from '../config.js';
import { AssetLoader } from '../assets/AssetLoader.js';
import { Player } from '../entities/Player.js';
import { Environment } from '../environment/Environment.js';
import { EnemySpawner } from '../systems/EnemySpawner.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { PlayerHealth } from '../systems/PlayerHealth.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Tải tất cả assets - Đồng bộ để đảm bảo load xong
        this.assetLoader = new AssetLoader(this);
        
        // Phaser không hỗ trợ async preload, nên load đồng bộ
        this.assetLoader.loadAllSync();
    }

    create() {
        // Fade in effect
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Lấy settings từ HomeScene
        const selectedWeapon = this.registry.get('selectedWeapon') || 'sword';
        const difficulty = this.registry.get('difficulty') || 'normal';

        console.log(`Game started with weapon: ${selectedWeapon}, difficulty: ${difficulty}`);

        // Tạo môi trường
        this.environment = new Environment(this);
        this.environment.create();
        
        // Tạo người chơi
        this.player = new Player(this, GameConfig.width / 2, GameConfig.height / 2);
        
        // Set weapon được chọn
        this.player.switchWeapon(selectedWeapon);
        
        // Tạo hệ thống máu cho người chơi
        this.playerHealth = new PlayerHealth(this, this.player, 100);
        this.player.setHealthSystem(this.playerHealth);
        
        // Tạo hệ thống spawn quái vật với difficulty
        this.enemySpawner = new EnemySpawner(this, this.player);
        this.applyDifficulty(difficulty);
        
        // Tạo pause menu
        this.pauseMenu = new PauseMenu(this);
        this.pauseMenu.create();
        
        // Tạo UI
        this.createUI();
    }

    applyDifficulty(difficulty) {
        let enemyCount = 7;
        let enemyHealthMultiplier = 1;
        let enemyDamageMultiplier = 1;

        switch (difficulty) {
            case 'easy':
                enemyCount = 5;
                enemyHealthMultiplier = 0.7;
                enemyDamageMultiplier = 0.7;
                break;
            case 'normal':
                enemyCount = 8;
                enemyHealthMultiplier = 1;
                enemyDamageMultiplier = 1;
                break;
            case 'hard':
                enemyCount = 12;
                enemyHealthMultiplier = 1.5;
                enemyDamageMultiplier = 1.3;
                break;
        }

        // Lưu multipliers để EnemySpawner sử dụng
        this.registry.set('enemyHealthMultiplier', enemyHealthMultiplier);
        this.registry.set('enemyDamageMultiplier', enemyDamageMultiplier);

        // Spawn enemies
        this.enemySpawner.spawnRandomEnemies(enemyCount);
        
        // Debug: Kiểm tra quái có spawn không
        if (this.enemySpawner.enemies.length === 0) {
            console.error('[GameScene] No enemies spawned!');
        }
    }

    update() {
        // Kiểm tra pause
        this.pauseMenu.update();
        
        // Nếu game đang pause thì không update
        if (this.pauseMenu.getPauseState()) {
            return;
        }
        
        // Cập nhật nhân vật
        this.player.update();
        
        // Cập nhật môi trường
        this.environment.update();
        
        // Cập nhật quái vật
        this.enemySpawner.update();
        
        // Cập nhật thanh máu
        this.playerHealth.updateHealthBar();
        
        // Kiểm tra va chạm vũ khí với quái vật
        this.checkWeaponCollisions();
    }
    
    checkWeaponCollisions() {
        const weapon = this.player.getCurrentWeapon();
        if (weapon && weapon.isAttacking && weapon.sprite) {
            const weaponBounds = weapon.sprite.getBounds();
            
            // Gọi với weapon object để tính damage theo khoảng cách
            this.enemySpawner.checkWeaponCollision(weaponBounds, weapon);
        }
    }

    createUI() {
        // Nút Pause ở góc phải trên
        const pauseBtn = this.add.text(
            this.scale.width - 20,
            20,
            '⏸ PAUSE',
            {
                fontSize: '20px',
                fill: '#ffffff',
                backgroundColor: '#e74c3c',
                padding: { x: 15, y: 8 },
                fontStyle: 'bold'
            }
        );
        pauseBtn.setOrigin(1, 0);
        pauseBtn.setDepth(100);
        pauseBtn.setInteractive({ useHandCursor: true });
        
        pauseBtn.on('pointerover', () => {
            pauseBtn.setScale(1.1);
        });
        
        pauseBtn.on('pointerout', () => {
            pauseBtn.setScale(1);
        });
        
        pauseBtn.on('pointerdown', () => {
            this.pauseMenu.pause();
        });
    }
}
