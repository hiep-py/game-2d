// Cấu hình game
export const GameConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    playerSpeed: 200,
    physics: {
        gravity: { y: 0 },
        debug: false
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Cấu hình màu sắc
export const Colors = {
    sky: '#87CEEB',
    grass: {
        light: 0x2ecc71,
        dark: 0x27ae60
    },
    night: '#1a1a2e',
    space: '#0f0f1e'
};
