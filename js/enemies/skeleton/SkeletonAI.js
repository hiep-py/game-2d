// AI nâng cao cho Skeleton
import { SkeletonConfig } from './SkeletonConfig.js';

export class SkeletonAI {
    constructor(skeleton) {
        this.skeleton = skeleton;
        this.config = SkeletonConfig;
        
        // Trạng thái AI
        this.state = 'idle';  // idle, chase, attack, flee, circle
        this.previousState = 'idle';
        
        // Biến cho behavior
        this.circleAngle = Math.random() * Math.PI * 2;
        this.circleDirection = Math.random() > 0.5 ? 1 : -1;
        this.fleeTimer = 0;
        this.stateChangeTime = 0;
        this.minStateTime = 500; // Thời gian tối thiểu ở một state
    }

    // Cập nhật AI mỗi frame
    update(target, deltaTime = 16) {
        if (!target || !this.skeleton.sprite.active) return;

        const distance = this.getDistanceToTarget(target);
        const healthPercent = this.skeleton.health / this.skeleton.maxHealth;

        // Quyết định state
        this.decideState(distance, healthPercent);

        // Thực hiện hành động theo state
        this.executeState(target, distance, deltaTime);
    }

    // Quyết định trạng thái AI
    decideState(distance, healthPercent) {
        const currentTime = Date.now();
        
        // Không đổi state quá nhanh
        if (currentTime - this.stateChangeTime < this.minStateTime) {
            return;
        }

        const prevState = this.state;

        // Ưu tiên cao nhất: Chạy trốn khi yếu
        if (healthPercent < this.config.ai.fleeHealthPercent) {
            this.state = 'flee';
            this.fleeTimer = this.config.cooldowns.flee;
        }
        // Nếu đang chạy trốn và còn thời gian
        else if (this.state === 'flee' && this.fleeTimer > 0) {
            this.state = 'flee';
        }
        // Trong tầm tấn công
        else if (distance < this.config.ranges.attack) {
            this.state = 'attack';
        }
        // Trong tầm đi vòng (chiến thuật)
        else if (distance < this.config.ai.circleDistance && Math.random() > 0.7) {
            this.state = 'circle';
        }
        // Trong tầm phát hiện
        else if (distance < this.config.ranges.detection) {
            this.state = 'chase';
        }
        // Ngoài tầm
        else {
            this.state = 'idle';
        }

        // Cập nhật thời gian nếu state thay đổi
        if (prevState !== this.state) {
            this.stateChangeTime = currentTime;
            this.previousState = prevState;
        }
    }

    // Thực hiện hành động theo state
    executeState(target, distance, deltaTime) {
        switch (this.state) {
            case 'idle':
                this.idle();
                break;
            case 'chase':
                this.chase(target);
                break;
            case 'attack':
                this.attack(target);
                break;
            case 'flee':
                this.flee(target, deltaTime);
                break;
            case 'circle':
                this.circle(target);
                break;
        }
    }

    // Dừng AI
    stop() {
        this.state = 'dead';
        if (this.skeleton.sprite && this.skeleton.sprite.body) {
            this.skeleton.sprite.setVelocity(0);
        }
    }

    // Đứng yên
    idle() {
        this.skeleton.sprite.setVelocity(0);
    }

    // Đuổi theo mục tiêu
    chase(target) {
        const angle = this.getAngleToTarget(target);
        const speed = this.config.stats.speed;

        this.skeleton.sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        this.skeleton.sprite.flipX = this.skeleton.sprite.body.velocity.x < 0;
    }

    // Tấn công
    attack(target) {
        this.skeleton.sprite.setVelocity(0);
        
        const currentTime = Date.now();
        if (currentTime - this.skeleton.lastAttackTime > this.config.cooldowns.attack) {
            this.skeleton.lastAttackTime = currentTime;
            this.skeleton.performAttack(target);
        }
    }

    // Chạy trốn khi yếu
    flee(target, deltaTime) {
        this.fleeTimer -= deltaTime;

        // Chạy ngược hướng với người chơi
        const angle = this.getAngleToTarget(target) + Math.PI;
        const speed = this.config.stats.runSpeed;

        this.skeleton.sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        this.skeleton.sprite.flipX = this.skeleton.sprite.body.velocity.x < 0;

        // Nếu đã đủ xa, dừng chạy
        const distance = this.getDistanceToTarget(target);
        if (distance > this.config.ranges.flee) {
            this.fleeTimer = 0;
        }
    }

    // Đi vòng quanh mục tiêu (chiến thuật)
    circle(target) {
        const targetPos = target.getPosition();
        
        // Tăng góc để đi vòng
        this.circleAngle += this.config.ai.circleSpeed * this.circleDirection;
        
        // Tính vị trí đi vòng
        const circleRadius = this.config.ai.circleDistance;
        const targetX = targetPos.x + Math.cos(this.circleAngle) * circleRadius;
        const targetY = targetPos.y + Math.sin(this.circleAngle) * circleRadius;
        
        // Di chuyển đến vị trí đó
        const angle = Math.atan2(
            targetY - this.skeleton.sprite.y,
            targetX - this.skeleton.sprite.x
        );
        
        const speed = this.config.stats.speed * 0.8;
        this.skeleton.sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        this.skeleton.sprite.flipX = this.skeleton.sprite.body.velocity.x < 0;

        // Đổi hướng ngẫu nhiên
        if (Math.random() < 0.01) {
            this.circleDirection *= -1;
        }
    }

    // Lấy khoảng cách đến mục tiêu
    getDistanceToTarget(target) {
        const targetPos = target.getPosition();
        return Phaser.Math.Distance.Between(
            this.skeleton.sprite.x,
            this.skeleton.sprite.y,
            targetPos.x,
            targetPos.y
        );
    }

    // Lấy góc đến mục tiêu
    getAngleToTarget(target) {
        const targetPos = target.getPosition();
        return Phaser.Math.Angle.Between(
            this.skeleton.sprite.x,
            this.skeleton.sprite.y,
            targetPos.x,
            targetPos.y
        );
    }

    // Lấy trạng thái hiện tại
    getState() {
        return this.state;
    }
}
