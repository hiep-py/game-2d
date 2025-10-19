// Cấu hình chi tiết cho Skeleton
export const SkeletonConfig = {
    // Thông số cơ bản
    stats: {
        maxHealth: 100,
        damage: 20,
        speed: 70,
        runSpeed: 120, // Tốc độ chạy khi sợ hãi
    },

    // Phạm vi hoạt động
    ranges: {
        detection: 280,      // Phạm vi phát hiện người chơi
        attack: 40,          // Phạm vi tấn công
        flee: 100,           // Khoảng cách an toàn khi chạy trốn
    },

    // Thời gian cooldown
    cooldowns: {
        attack: 1200,        // Thời gian giữa các đòn tấn công (ms)
        flee: 3000,          // Thời gian chạy trốn khi yếu (ms)
    },

    // AI Behavior
    ai: {
        fleeHealthPercent: 0.3,    // Chạy trốn khi máu < 30%
        aggressiveDistance: 150,    // Khoảng cách tấn công tích cực
        circleDistance: 80,         // Khoảng cách đi vòng quanh mục tiêu
        circleSpeed: 0.02,          // Tốc độ đi vòng
    },

    // Hiệu ứng visual
    visual: {
        attackTintColor: 0xff0000,
        damageTintColor: 0xff0000,
        tintDuration: 100,
        deathFadeDuration: 400,
    },

    // Điểm thưởng khi tiêu diệt
    rewards: {
        experience: 10,
        dropChance: 0.3,  // 30% rơi vật phẩm
    }
};
