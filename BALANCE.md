# Cân bằng Game

## Thông số Người chơi
- **HP**: 100
- **Tốc độ**: 200
- **Bất tử sau nhận sát thương**: 1 giây

## Vũ khí

### ⚔️ Kiếm
- **Sát thương**: 30
- **Tốc độ tấn công**: 350ms (Nhanh)
- **Tầm đánh**: 65px
- **Đặc điểm**: Cân bằng, phù hợp mọi tình huống
- **Số đòn để giết Skeleton**: 2 đòn (60 HP / 30 = 2)

### 🏹 Cung
- **Sát thương**: 22
- **Tốc độ tấn công**: 500ms (Trung bình)
- **Tầm đánh**: 220px (Xa nhất)
- **Đặc điểm**: An toàn, đánh từ xa
- **Số đòn để giết Skeleton**: 3 đòn (60 HP / 22 ≈ 3)

### 🪓 Rìu
- **Sát thương**: 45 (Cao nhất)
- **Tốc độ tấn công**: 650ms (Chậm)
- **Tầm đánh**: 55px
- **Đặc điểm**: Mạnh nhưng chậm, rủi ro cao
- **Số đòn để giết Skeleton**: 2 đòn (60 HP / 45 ≈ 1.3)

## Quái vật

### 💀 Skeleton
- **HP**: 60
- **Sát thương**: 20
- **Tốc độ**: 70
- **Tốc độ chạy trốn**: 120
- **Tầm phát hiện**: 280px
- **Tầm tấn công**: 40px
- **Cooldown tấn công**: 1200ms

**AI Behavior:**
- Chạy trốn khi HP < 30% (18 HP)
- Đi vòng quanh người chơi ở khoảng cách 80px
- Tấn công tích cực trong tầm 150px

## Chiến thuật

### Với Kiếm ⚔️
- Tiếp cận nhanh, đánh 2 đòn và lùi
- Tốt cho combat cận chiến
- DPS: 85.7 (30 / 0.35)

### Với Cung 🏹
- Giữ khoảng cách, kite quái
- An toàn nhất nhưng mất thời gian
- DPS: 44 (22 / 0.5)

### Với Rìu 🪓
- Chờ timing chính xác
- 1-2 đòn hạ gục
- Rủi ro cao vì chậm
- DPS: 69.2 (45 / 0.65)

## Tỷ lệ sống sót

**Người chơi có thể chịu**: 100 HP / 20 damage = **5 đòn** từ Skeleton

**Thời gian để Skeleton giết người chơi**: 5 đòn × 1.2s = **6 giây**

**Thời gian để người chơi giết Skeleton**:
- Kiếm: 2 đòn × 0.35s = **0.7 giây**
- Cung: 3 đòn × 0.5s = **1.5 giây**
- Rìu: 2 đòn × 0.65s = **1.3 giây**

## Kết luận
Game nghiêng về người chơi khi sử dụng vũ khí đúng cách. Skeleton nguy hiểm khi đánh hội đồng (2-4 con).
