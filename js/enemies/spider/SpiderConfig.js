// Cấu hình chi tiết cho Spider (Nhện)
export const SpiderConfig = {
    // Thông số cơ bản
    stats: {
        maxHealth: 100,
        damage: 15,
        speed: 90,
        jumpSpeed: 150, // Tốc độ nhảy đột ngột
    },

    // Phạm vi hoạt động
    ranges: {
        detection: 250,      // Phạm vi phát hiện người chơi
        attack: 45,          // Phạm vi tấn công
        jump: 120,           // Khoảng cách để nhảy vào
    },

    // Thời gian cooldown
    cooldowns: {
        attack: 800,         // Thời gian giữa các đòn tấn công (ms)
        jump: 2000,          // Thời gian giữa các cú nhảy (ms)
    },

    // AI Behavior
    ai: {
        jumpChance: 0.3,           // 30% cơ hội nhảy khi trong tầm
        zigzagSpeed: 0.05,         // Tốc độ di chuyển zigzag
        webCooldown: 5000,         // Thời gian giữa các lần bắn tơ (ms)
    },

    // Hiệu ứng visual
    visual: {
        attackTintColor: 0x00ff00,
        damageTintColor: 0xff0000,
        tintDuration: 100,
        deathFadeDuration: 350,
    },

    // Điểm thưởng khi tiêu diệt
    rewards: {
        experience: 8,
        dropChance: 0.25,
    }
};
