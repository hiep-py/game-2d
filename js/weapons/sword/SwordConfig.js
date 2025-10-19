// Cấu hình chi tiết cho Sword (Kiếm)
export const SwordConfig = {
    // Thông số cơ bản
    stats: {
        name: 'Kiếm',
        baseDamage: 35,
        attackSpeed: 350,
        range: 70,
        optimalRange: 50, // Sát thương tối đa trong 50px
    },

    // Hệ thống sát thương
    damage: {
        falloffType: 'linear',     // Giảm tuyến tính
        minDamagePercent: 0.6,     // Tối thiểu 60% sát thương ở xa
        critChance: 0.1,           // 10% cơ hội chí mạng
        critMultiplier: 1.5,       // x1.5 sát thương khi chí mạng
    },

    // Hiệu ứng visual
    visual: {
        slashColor: 0xff0000,
        slashDuration: 200,
        swingAngle: 120,           // Góc vung kiếm
        attackScale: 1.3,
    },

    // Animation
    animation: {
        swingDuration: 200,
        returnDuration: 150,
    }
};
