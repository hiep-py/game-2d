// Cấu hình chi tiết cho Bow (Cung)
export const BowConfig = {
    // Thông số cơ bản
    stats: {
        name: 'Cung',
        baseDamage: 45,            // Tăng damage cơ bản
        attackSpeed: 400,          // Bắn nhanh hơn
        range: 350,                // Tầm xa hơn
        optimalRange: 80,          // Càng gần càng mạnh
    },

    // Hệ thống sát thương
    damage: {
        falloffType: 'linear',     // Giảm tuyến tính
        minDamagePercent: 0.4,     // Tối thiểu 40% sát thương ở xa
        critChance: 0.2,           // 20% cơ hội chí mạng
        critMultiplier: 2.5,       // x2.5 sát thương khi chí mạng (headshot)
    },

    // Mũi tên
    arrow: {
        speed: 400,
        size: 15,
        color: 0x8B4513,
        trailColor: 0xFFD700,
    },

    // Hiệu ứng visual
    visual: {
        chargeColor: 0xFFD700,
        releaseColor: 0xFF6600,
    },

    // Animation
    animation: {
        chargeDuration: 300,
        releaseDuration: 100,
    }
};
