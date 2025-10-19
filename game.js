// Cấu hình game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let wasd;
let grassTiles = [];

function preload() {
    // Tạo sprite đơn giản bằng graphics
    createSimpleSprites(this);
}

function createSimpleSprites(scene) {
    // Tạo sprite cỏ xanh
    const grassGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    grassGraphics.fillStyle(0x2ecc71, 1);
    grassGraphics.fillRect(0, 0, 50, 50);
    
    // Thêm chi tiết cho cỏ
    grassGraphics.fillStyle(0x27ae60, 1);
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * 50;
        const y = Math.random() * 50;
        grassGraphics.fillRect(x, y, 3, 8);
    }
    
    grassGraphics.generateTexture('grass', 50, 50);
    grassGraphics.destroy();
    
    // Tạo sprite nhân vật đơn giản
    const playerGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Thân người (hình chữ nhật)
    playerGraphics.fillStyle(0x3498db, 1);
    playerGraphics.fillRect(10, 20, 20, 30);
    
    // Đầu (hình tròn)
    playerGraphics.fillStyle(0xf39c12, 1);
    playerGraphics.fillCircle(20, 15, 10);
    
    // Mắt
    playerGraphics.fillStyle(0x000000, 1);
    playerGraphics.fillCircle(17, 13, 2);
    playerGraphics.fillCircle(23, 13, 2);
    
    // Miệng
    playerGraphics.lineStyle(2, 0x000000, 1);
    playerGraphics.beginPath();
    playerGraphics.arc(20, 15, 5, 0.2, Math.PI - 0.2);
    playerGraphics.strokePath();
    
    // Tay trái
    playerGraphics.fillStyle(0xf39c12, 1);
    playerGraphics.fillRect(5, 25, 5, 15);
    
    // Tay phải
    playerGraphics.fillRect(30, 25, 5, 15);
    
    // Chân trái
    playerGraphics.fillStyle(0x2c3e50, 1);
    playerGraphics.fillRect(12, 50, 6, 15);
    
    // Chân phải
    playerGraphics.fillRect(22, 50, 6, 15);
    
    playerGraphics.generateTexture('player', 40, 65);
    playerGraphics.destroy();
}

function create() {
    // Tạo nền trời xanh
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // Tạo lớp cỏ xanh
    const tileSize = 50;
    const rows = Math.ceil(config.height / tileSize) + 1;
    const cols = Math.ceil(config.width / tileSize) + 1;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * tileSize;
            const y = row * tileSize;
            const grass = this.add.image(x, y, 'grass');
            grass.setOrigin(0, 0);
            grassTiles.push(grass);
        }
    }
    
    // Tạo nhân vật ở giữa màn hình
    player = this.physics.add.sprite(config.width / 2, config.height / 2, 'player');
    player.setCollideWorldBounds(true);
    
    // Thiết lập điều khiển
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    // Thêm text hướng dẫn
    const instructionText = this.add.text(config.width / 2, 30, 'Sử dụng phím mũi tên hoặc WASD để di chuyển!', {
        fontSize: '18px',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 10, y: 5 }
    });
    instructionText.setOrigin(0.5);
    instructionText.setScrollFactor(0);
    instructionText.setDepth(100);
}

function update() {
    // Reset vận tốc
    player.setVelocity(0);
    
    const speed = 200;
    
    // Điều khiển di chuyển
    if (cursors.left.isDown || wasd.left.isDown) {
        player.setVelocityX(-speed);
        player.flipX = true;
    } else if (cursors.right.isDown || wasd.right.isDown) {
        player.setVelocityX(speed);
        player.flipX = false;
    }
    
    if (cursors.up.isDown || wasd.up.isDown) {
        player.setVelocityY(-speed);
    } else if (cursors.down.isDown || wasd.down.isDown) {
        player.setVelocityY(speed);
    }
    
    // Chuẩn hóa vận tốc khi di chuyển chéo
    if (player.body.velocity.x !== 0 && player.body.velocity.y !== 0) {
        player.body.velocity.normalize().scale(speed);
    }
}
