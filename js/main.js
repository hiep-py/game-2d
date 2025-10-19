// File chính khởi động game
import { GameConfig } from './config.js';
import { HomeScene } from './scenes/HomeScene.js';
import { GameScene } from './scenes/GameScene.js';

// Cấu hình Phaser
const config = {
    type: Phaser.AUTO,
    width: GameConfig.width,
    height: GameConfig.height,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: GameConfig.physics
    },
    scene: [HomeScene, GameScene]
};

// Khởi động game
const game = new Phaser.Game(config);
