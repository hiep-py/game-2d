// Hệ thống tính sát thương với khoảng cách
export class DamageSystem {
    /**
     * Tính sát thương dựa trên khoảng cách
     * @param {number} baseDamage - Sát thương cơ bản
     * @param {number} distance - Khoảng cách đến mục tiêu
     * @param {number} optimalRange - Khoảng cách tối ưu (sát thương 100%)
     * @param {number} maxRange - Khoảng cách tối đa
     * @param {string} falloffType - Loại giảm sát thương: 'linear', 'quadratic', 'none'
     * @returns {number} - Sát thương thực tế
     */
    static calculateDamage(baseDamage, distance, optimalRange, maxRange, falloffType = 'linear') {
        // Nếu ngoài tầm, không gây sát thương
        if (distance > maxRange) {
            return 0;
        }

        // Trong tầm tối ưu, sát thương 100%
        if (distance <= optimalRange) {
            return baseDamage;
        }

        // Tính tỷ lệ giảm sát thương
        const distanceBeyondOptimal = distance - optimalRange;
        const falloffRange = maxRange - optimalRange;
        const falloffRatio = distanceBeyondOptimal / falloffRange;

        let damageMultiplier;

        switch (falloffType) {
            case 'none':
                // Không giảm sát thương
                damageMultiplier = 1;
                break;

            case 'linear':
                // Giảm tuyến tính
                damageMultiplier = 1 - falloffRatio;
                break;

            case 'quadratic':
                // Giảm theo bậc 2 (giảm nhanh hơn)
                damageMultiplier = 1 - (falloffRatio * falloffRatio);
                break;

            case 'inverse':
                // Giảm chậm ở đầu, nhanh ở cuối
                damageMultiplier = Math.pow(1 - falloffRatio, 2);
                break;

            default:
                damageMultiplier = 1 - falloffRatio;
        }

        // Đảm bảo sát thương tối thiểu 20% ở tầm xa
        damageMultiplier = Math.max(damageMultiplier, 0.2);

        return Math.round(baseDamage * damageMultiplier);
    }

    /**
     * Tính khoảng cách giữa 2 điểm
     */
    static getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Kiểm tra va chạm giữa weapon và enemy
     */
    static checkCollision(weaponBounds, enemySprite) {
        const enemyBounds = enemySprite.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(weaponBounds, enemyBounds);
    }

    /**
     * Tính sát thương cho weapon hit
     */
    static calculateWeaponDamage(weapon, enemyX, enemyY) {
        const weaponX = weapon.sprite.x;
        const weaponY = weapon.sprite.y;
        const distance = this.getDistance(weaponX, weaponY, enemyX, enemyY);

        return this.calculateDamage(
            weapon.damage,
            distance,
            weapon.optimalRange || weapon.range * 0.5,
            weapon.range,
            weapon.falloffType || 'linear'
        );
    }
}
