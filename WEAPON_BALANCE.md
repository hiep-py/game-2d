# Cân bằng Vũ khí - Hệ thống Sát thương Từ xa

## 🎯 Hệ thống Sát thương Mới

### **Công thức:**
- **Optimal Range**: Khoảng cách tối ưu (100% damage)
- **Max Range**: Khoảng cách tối đa (20% damage)
- **Falloff Type**: Cách giảm sát thương
  - `linear`: Giảm đều
  - `quadratic`: Giảm nhanh ở xa
  - `inverse`: Giảm chậm ở gần, nhanh ở xa

### **Công thức tính:**
```
distance <= optimalRange: 100% damage
distance > maxRange: 0% damage
optimalRange < distance <= maxRange: 
  damage = baseDamage * (1 - falloffRatio) * multiplier
  (tối thiểu 20%)
```

---

## ⚔️ Kiếm (Sword)

### Thông số:
- **Base Damage**: 35
- **Attack Speed**: 350ms (Nhanh)
- **Optimal Range**: 50px (100% damage)
- **Max Range**: 70px
- **Falloff**: Linear

### Damage theo khoảng cách:
- **0-50px**: 35 damage (100%)
- **55px**: 31 damage (89%)
- **60px**: 28 damage (80%)
- **65px**: 24 damage (69%)
- **70px**: 21 damage (60% - min)

### Đặc điểm:
- ✅ Crit chance: 10%
- ✅ Crit multiplier: 1.5x
- ✅ Tốt cho combat cận chiến
- ✅ DPS ổn định: ~100

### Số đòn giết quái (100 HP):
- Optimal range: 3 đòn
- Max range: 5 đòn

---

## 🏹 Cung (Bow)

### Thông số:
- **Base Damage**: 28
- **Attack Speed**: 500ms (Trung bình)
- **Optimal Range**: 150px (100% damage)
- **Max Range**: 250px
- **Falloff**: Quadratic (giảm nhanh ở xa)

### Damage theo khoảng cách:
- **0-150px**: 28 damage (100%)
- **170px**: 25 damage (89%)
- **200px**: 20 damage (71%)
- **230px**: 14 damage (50%)
- **250px**: 8 damage (29% - min)

### Đặc điểm:
- ✅ Crit chance: 15% (HEADSHOT)
- ✅ Crit multiplier: 2.0x
- ✅ An toàn, đánh từ xa
- ✅ DPS: ~56

### Số đòn giết quái (100 HP):
- Optimal range: 4 đòn
- 200px: 5 đòn
- Max range: 13 đòn (không hiệu quả)

---

## 🪓 Rìu (Axe)

### Thông số:
- **Base Damage**: 55 (Cao nhất)
- **Attack Speed**: 700ms (Chậm)
- **Optimal Range**: 40px (100% damage)
- **Max Range**: 60px
- **Falloff**: Inverse (giảm chậm ở gần)

### Damage theo khoảng cách:
- **0-40px**: 55 damage (100%)
- **45px**: 49 damage (89%)
- **50px**: 44 damage (80%)
- **55px**: 38 damage (69%)
- **60px**: 33 damage (60% - min)

### Đặc điểm:
- ✅ Crit chance: 20% (Cao nhất)
- ✅ Crit multiplier: 2.0x
- ✅ Cleave: Đánh nhiều mục tiêu
- ✅ DPS: ~78

### Số đòn giết quái (100 HP):
- Optimal range: 2 đòn
- Max range: 3 đòn
- Với crit: 1 đòn có thể (110 damage)

---

## 📊 So sánh DPS

| Vũ khí | Base DPS | Optimal DPS | Crit DPS |
|--------|----------|-------------|----------|
| Kiếm   | 100      | 100         | 150      |
| Cung   | 56       | 56          | 112      |
| Rìu    | 78       | 78          | 156      |

---

## 🎮 Chiến thuật

### **Kiếm ⚔️**
- Tiếp cận 40-50px
- Đánh nhanh liên tục
- Tốt cho kite và combo
- **Tình huống**: Đa năng, mọi combat

### **Cung 🏹**
- Giữ khoảng cách 120-170px
- Kite và di chuyển
- Aim cho headshot
- **Tình huống**: Nhiều quái, cần an toàn

### **Rìu 🪓**
- Sát gần 30-40px
- Chờ timing chính xác
- 1-2 đòn KO
- **Tình huống**: Boss, quái đơn lẻ

---

## 💀 Quái vật (100 HP mỗi con)

### Skeleton:
- HP: 100
- Damage: 20
- Chạy trốn khi < 30 HP

### Spider:
- HP: 100
- Damage: 15
- Nhảy đột ngột

---

## ⚖️ Kết luận

**Cân bằng tốt:**
- Kiếm: Jack of all trades
- Cung: Kite master (cần skill aim)
- Rìu: Glass cannon (high risk/reward)

**Người chơi cần 3-5 đòn để giết quái** (tùy vũ khí và khoảng cách)

**Quái cần 5 đòn để giết người chơi** (100 HP / 20 damage)
