// Cấu hình chi tiết cho Axe (Rìu)
export const AxeConfig = {
    // Thông số cơ bản
    stats: {
        name: 'Rìu',
        baseDamage: 55,
        attackSpeed: 700,
        range: 60,
        optimalRange: 40, // Sát thương tối đa trong 40px
    },

    // Hệ thống sát thương
    damage: {
        falloffType: 'inverse',    // Giảm chậm ở gần, nhanh ở xa
        minDamagePercent: 0.5,     // Tối thiểu 50% sát thương ở xa
        critChance: 0.2,           // 20% cơ hội chí mạng
        critMultiplier: 2.0,       // x2 sát thương khi chí mạng
        cleaveRadius: 80,          // Đánh nhiều mục tiêu trong 80px
    },

    // Hiệu ứng visual
    visual: {
        slashColor: 0xFF4500,
        impactColor: 0xFFD700,
        slashWidth: 5,
        spinSpeed: 720,            // Độ xoay khi đánh (độ)
    },

    // Animation
    animation: {
        windupDuration: 300,       // Thời gian nạp lực
        swingDuration: 200,
        recoveryDuration: 200,
    }
};
