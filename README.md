# Game 2D với Phaser.js

Game 2D được tạo bằng Phaser.js với kiến trúc module, dễ dàng mở rộng và phát triển.

## Tính năng
- ✅ Di chuyển nhân vật với phím mũi tên hoặc WASD
- ✅ Đồ họa 2D đơn giản
- ✅ **Hệ thống Vũ khí**: 3 vũ khí với animation riêng (Kiếm, Cung, Rìu)
- ✅ **Hệ thống Skin**: 4 skin nhân vật khác nhau (Mặc định, Ninja, Robot, Hero)
- ✅ **Hệ thống Môi trường**: 5 môi trường khác nhau (Cỏ xanh, Mùa thu, Tuyết, Không gian, Sa mạc)
- ✅ Kiến trúc module dễ mở rộng

## Cách chạy

### Cách 1: Sử dụng Live Server (Khuyến nghị)
1. Cài đặt extension "Live Server" trong VS Code
2. Click chuột phải vào file `index.html`
3. Chọn "Open with Live Server"

### Cách 2: Sử dụng Python
```bash
# Python 3
python -m http.server 8000

# Sau đó mở trình duyệt tại: http://localhost:8000
```

### Cách 3: Sử dụng Node.js
```bash
# Cài đặt http-server
npm install -g http-server

# Chạy server
http-server

# Mở trình duyệt tại địa chỉ được hiển thị
```

## Điều khiển

### Di chuyển
- **W** hoặc **↑**: Di chuyển lên
- **S** hoặc **↓**: Di chuyển xuống
- **A** hoặc **←**: Di chuyển trái
- **D** hoặc **→**: Di chuyển phải

### Vũ khí
- **SPACE**: Tấn công với vũ khí hiện tại
- **Q**: Chuyển sang vũ khí trước
- **E**: Chuyển sang vũ khí sau

**Các loại vũ khí:**
- **Kiếm**: Sát thương 25, tốc độ nhanh (400ms)
- **Cung**: Sát thương 15, tầm xa (200px), bắn mũi tên
- **Rìu**: Sát thương 35, tốc độ chậm (700ms), hiệu ứng chấn động

### Đổi Skin Nhân Vật
- **1**: Skin mặc định (Xanh dương)
- **2**: Skin Ninja (Đen)
- **3**: Skin Robot (Xám kim loại)
- **4**: Skin Hero (Đỏ)

### Đổi Môi Trường
- **F1**: Cỏ xanh (Mặc định)
- **F2**: Mùa thu (Vàng)
- **F3**: Tuyết (Trắng)
- **F4**: Không gian (Sao)
- **F5**: Sa mạc (Cát)

## Cấu trúc dự án
```
game-2d/
├── index.html                      # File HTML chính
├── README.md                       # Hướng dẫn
├── game.js                         # File game cũ (có thể xóa)
└── js/                             # Thư mục JavaScript modules
    ├── main.js                     # Entry point chính
    ├── config.js                   # Cấu hình game
    ├── assets/                     # Module quản lý assets
    │   └── AssetLoader.js          # Tải sprites, textures
    ├── entities/                   # Module các đối tượng game
    │   └── Player.js               # Nhân vật, skin và vũ khí
    ├── weapons/                    # Module vũ khí ⚔️
    │   ├── Weapon.js               # Class cơ bản cho vũ khí
    │   ├── Sword.js                # Vũ khí: Kiếm
    │   ├── Bow.js                  # Vũ khí: Cung
    │   ├── Axe.js                  # Vũ khí: Rìu
    │   └── WeaponManager.js        # Quản lý vũ khí
    ├── environment/                # Module môi trường
    │   └── Environment.js          # Quản lý nền và không gian
    └── scenes/                     # Module các scene
        └── GameScene.js            # Scene chính của game
```

## Công nghệ sử dụng
- **Phaser.js 3.70.0**: Framework game 2D
- **HTML5 Canvas**: Rendering
- **Arcade Physics**: Hệ thống vật lý đơn giản

## Hướng dẫn phát triển

### Thêm Vũ khí mới
1. Tạo file mới trong `js/weapons/`, ví dụ `Spear.js`:
```javascript
import { Weapon } from './Weapon.js';

export class Spear extends Weapon {
    constructor(scene, player) {
        super(scene, player, {
            name: 'Giáo',
            damage: 20,
            attackSpeed: 500,
            range: 80
        });
        this.create('spear', 30, 0);
    }
    
    // Tùy chỉnh animation tấn công
    playAttackAnimation() {
        // Code animation của bạn
    }
}
```

2. Tạo sprite trong `js/assets/AssetLoader.js`:
```javascript
createSpearSprite() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    // Vẽ sprite giáo
    graphics.generateTexture('spear', 50, 20);
    graphics.destroy();
}
```

3. Import và thêm vào Player trong `js/entities/Player.js`:
```javascript
import { Spear } from '../weapons/Spear.js';
// Trong initWeapons():
this.weapons.push(new Spear(this.scene, this));
```

### Thêm Skin mới
Mở file `js/assets/AssetLoader.js` và thêm skin trong hàm `loadPlayerSkins()`:
```javascript
this.createPlayerSkin('player_custom', {
    bodyColor: 0xFF0000,    // Màu thân
    headColor: 0x00FF00,    // Màu đầu
    legColor: 0x0000FF      // Màu chân
});
```

### Thêm Môi trường mới
Mở file `js/assets/AssetLoader.js` và tạo tile mới trong `loadEnvironments()`:
```javascript
this.createGrassTile('grass_custom', 0xFF0000, 0x00FF00);
```

Sau đó thêm vào danh sách trong `js/environment/Environment.js`:
```javascript
{ name: 'grass_custom', tile: 'grass_custom', bg: '#FF0000', label: 'Tên' }
```

### Thêm Scene mới
Tạo file mới trong `js/scenes/` và import vào `js/main.js`:
```javascript
import { MenuScene } from './scenes/MenuScene.js';
// Thêm vào config.scene: [MenuScene, GameScene]
```

### Cấu hình Game
Chỉnh sửa `js/config.js` để thay đổi:
- Kích thước game: `width`, `height`
- Tốc độ nhân vật: `playerSpeed`
- Màu sắc: `Colors`

## Kiến trúc Module

### 📁 config.js
Chứa tất cả cấu hình game (kích thước, tốc độ, màu sắc)

### 📁 assets/AssetLoader.js
- Quản lý việc tải và tạo sprites
- Tạo skin nhân vật
- Tạo tiles môi trường

### 📁 entities/Player.js
- Quản lý nhân vật
- Xử lý di chuyển
- Hệ thống đổi skin
- Tích hợp vũ khí

### 📁 weapons/
- **Weapon.js**: Class cơ bản cho tất cả vũ khí
- **Sword.js**: Kiếm - tấn công nhanh với hiệu ứng chém
- **Bow.js**: Cung - bắn mũi tên tầm xa
- **Axe.js**: Rìu - sát thương cao với hiệu ứng chấn động
- **WeaponManager.js**: Quản lý và tạo vũ khí

### 📁 environment/Environment.js
- Quản lý môi trường/nền
- Tạo tiles
- Hệ thống đổi không gian

### 📁 scenes/GameScene.js
- Scene chính
- Khởi tạo game objects
- Tạo UI
