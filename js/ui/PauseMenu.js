// Menu tạm dừng game
export class PauseMenu {
    constructor(scene) {
        this.scene = scene;
        this.isPaused = false;
        this.container = null;
        
        // Phím ESC để pause
        this.pauseKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    // Tạo UI pause menu
    create() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        // Container cho pause menu
        this.container = this.scene.add.container(0, 0);
        this.container.setDepth(1000);
        this.container.setVisible(false);
        this.container.setScrollFactor(0);

        // Overlay tối
        const overlay = this.scene.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000,
            0.7
        );
        this.container.add(overlay);

        // Background menu
        const menuBg = this.scene.add.rectangle(
            width / 2,
            height / 2,
            400,
            380,
            0x2c3e50
        );
        menuBg.setStrokeStyle(4, 0xFFD700);
        this.container.add(menuBg);

        // Tiêu đề
        const title = this.scene.add.text(
            width / 2,
            height / 2 - 140,
            'GAME TẠM DỪNG',
            {
                fontSize: '36px',
                fill: '#FFD700',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        title.setOrigin(0.5);
        this.container.add(title);

        // Nút Resume
        const resumeBtn = this.createButton(
            width / 2,
            height / 2 - 60,
            'Tiếp tục (ESC)',
            () => this.resume(),
            0x27ae60
        );
        this.container.add(resumeBtn);

        // Nút Restart
        const restartBtn = this.createButton(
            width / 2,
            height / 2 + 10,
            'Chơi lại',
            () => this.restart(),
            0x3498db
        );
        this.container.add(restartBtn);

        // Nút Home
        const homeBtn = this.createButton(
            width / 2,
            height / 2 + 80,
            'Về Home',
            () => this.goHome(),
            0xe74c3c
        );
        this.container.add(homeBtn);

        // Hướng dẫn
        const hint = this.scene.add.text(
            width / 2,
            height / 2 + 160,
            'Nhấn ESC để tạm dừng/tiếp tục',
            {
                fontSize: '14px',
                fill: '#bdc3c7'
            }
        );
        hint.setOrigin(0.5);
        this.container.add(hint);
    }

    // Tạo nút bấm
    createButton(x, y, text, callback, color = 0x3498db) {
        const container = this.scene.add.container(x, y);

        const bg = this.scene.add.rectangle(0, 0, 280, 55, color);
        bg.setStrokeStyle(2, 0xffffff, 0.5);
        const label = this.scene.add.text(0, 0, text, {
            fontSize: '22px',
            fill: '#fff',
            fontStyle: 'bold'
        });
        label.setOrigin(0.5);

        container.add([bg, label]);

        // Tương tác
        bg.setInteractive({ useHandCursor: true });
        
        const originalColor = color;
        
        bg.on('pointerover', () => {
            bg.setFillStyle(Phaser.Display.Color.GetColor(
                Math.min(255, Phaser.Display.Color.IntegerToRGB(originalColor).r + 30),
                Math.min(255, Phaser.Display.Color.IntegerToRGB(originalColor).g + 30),
                Math.min(255, Phaser.Display.Color.IntegerToRGB(originalColor).b + 30)
            ));
            this.scene.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
        });
        
        bg.on('pointerout', () => {
            bg.setFillStyle(originalColor);
            this.scene.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        
        bg.on('pointerdown', callback);

        return container;
    }

    // Cập nhật
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            if (this.isPaused) {
                this.resume();
            } else {
                this.pause();
            }
        }
    }

    // Tạm dừng
    pause() {
        this.isPaused = true;
        this.scene.physics.pause();
        this.container.setVisible(true);
    }

    // Tiếp tục
    resume() {
        this.isPaused = false;
        this.scene.physics.resume();
        this.container.setVisible(false);
    }

    // Chơi lại
    restart() {
        this.resume();
        this.scene.scene.restart();
    }

    // Về màn hình Home
    goHome() {
        this.resume();
        this.scene.scene.start('HomeScene');
    }

    // Kiểm tra trạng thái pause
    getPauseState() {
        return this.isPaused;
    }
}
