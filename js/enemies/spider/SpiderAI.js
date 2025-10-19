// AI cho Spider - Di chuyển nhanh, nhảy đột ngột
import { SpiderConfig } from './SpiderConfig.js';
import { SpiderAssets } from './SpiderAssets.js';

export class SpiderAI {
    constructor(spider) {
        this.spider = spider;
        this.config = SpiderConfig;
        
        // Trạng thái AI
        this.state = 'idle';
        this.previousState = 'idle';
        
        // Biến cho behavior
        this.zigzagOffset = 0;
        this.zigzagDirection = 1;
        this.lastJumpTime = 0;
        this.isJumping = false;
        this.stateChangeTime = 0;
        this.minStateTime = 300;
    }

    // Cập nhật AI
    update(target, deltaTime = 16) {
        if (!target || !this.spider.sprite.active) return;

        const distance = this.getDistanceToTarget(target);
        const healthPercent = this.spider.health / this.spider.maxHealth;

        // Quyết định state
        this.decideState(distance, healthPercent);

        // Thực hiện hành động
        this.executeState(target, distance, deltaTime);
    }

    // Quyết định trạng thái
    decideState(distance, healthPercent) {
        const currentTime = Date.now();
        
        if (currentTime - this.stateChangeTime < this.minStateTime) {
            return;
        }

        const prevState = this.state;

        // Trong tầm tấn công
        if (distance < this.config.ranges.attack) {
            this.state = 'attack';
        }
        // Trong tầm nhảy và có thể nhảy
        else if (distance < this.config.ranges.jump && 
                 currentTime - this.lastJumpTime > this.config.cooldowns.jump &&
                 Math.random() < this.config.ai.jumpChance) {
            this.state = 'jump';
        }
        // Trong tầm phát hiện
        else if (distance < this.config.ranges.detection) {
            this.state = 'chase';
        }
        // Ngoài tầm
        else {
            this.state = 'idle';
        }

        if (prevState !== this.state) {
            this.stateChangeTime = currentTime;
            this.previousState = prevState;
        }
    }

    // Thực hiện hành động
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
            case 'jump':
                this.jump(target);
                break;
        }
    }

    // Đứng yên
    idle() {
        this.spider.sprite.setVelocity(0);
    }

    // Đuổi theo với zigzag
    chase(target) {
        const angle = this.getAngleToTarget(target);
        const speed = this.config.stats.speed;

        // Di chuyển zigzag
        this.zigzagOffset += this.config.ai.zigzagSpeed;
        const zigzag = Math.sin(this.zigzagOffset) * 30;

        this.spider.sprite.setVelocity(
            Math.cos(angle) * speed + zigzag * Math.cos(angle + Math.PI / 2),
            Math.sin(angle) * speed + zigzag * Math.sin(angle + Math.PI / 2)
        );

        this.spider.sprite.flipX = this.spider.sprite.body.velocity.x < 0;
    }

    // Tấn công
    attack(target) {
        this.spider.sprite.setVelocity(0);
        
        const currentTime = Date.now();
        if (currentTime - this.spider.lastAttackTime > this.config.cooldowns.attack) {
            this.spider.lastAttackTime = currentTime;
            this.spider.performAttack(target);
        }
    }

    // Nhảy đột ngột về phía mục tiêu
    jump(target) {
        if (this.isJumping) return;

        this.isJumping = true;
        this.lastJumpTime = Date.now();

        const angle = this.getAngleToTarget(target);
        const jumpSpeed = this.config.stats.jumpSpeed;

        // Nhảy mạnh
        this.spider.sprite.setVelocity(
            Math.cos(angle) * jumpSpeed,
            Math.sin(angle) * jumpSpeed
        );

        // Hiệu ứng nhảy
        SpiderAssets.createJumpEffect(
            this.spider.scene,
            this.spider.sprite.x,
            this.spider.sprite.y
        );

        // Kết thúc nhảy sau 400ms
        this.spider.scene.time.delayedCall(400, () => {
            this.isJumping = false;
            this.state = 'chase';
        });
    }

    // Lấy khoảng cách
    getDistanceToTarget(target) {
        const targetPos = target.getPosition();
        return Phaser.Math.Distance.Between(
            this.spider.sprite.x,
            this.spider.sprite.y,
            targetPos.x,
            targetPos.y
        );
    }

    // Lấy góc
    getAngleToTarget(target) {
        const targetPos = target.getPosition();
        return Phaser.Math.Angle.Between(
            this.spider.sprite.x,
            this.spider.sprite.y,
            targetPos.x,
            targetPos.y
        );
    }

    // Lấy state
    getState() {
        return this.state;
    }
}
