import { POWER_UP_TYPES, Ball } from './GameObject.js';

export class PowerUpManager {
    constructor(game, soundManager) {
        this.game = game;
        this.powerUps = [];
        this.activePowerUps = {
            WIDE: false,
            FAST: false
        };
        this.soundManager = soundManager;
        this.POWER_UP_TYPES = POWER_UP_TYPES; // Make types accessible to Game class
    }

    createPowerUp(x, y) {
        const random = Math.random();
        let cumulative = 0;
        let type = null;

        for (const [powerType, config] of Object.entries(POWER_UP_TYPES)) {
            cumulative += config.chance;
            if (random <= cumulative) {
                type = powerType;
                break;
            }
        }

        if (type) {
            this.powerUps.push({
                x,
                y,
                type,
                width: 20,
                height: 20,
                speed: 2
            });
        }
    }

    activatePowerUp(type, paddle) {
        switch (type) {
            case 'WIDE':
                this.activateWidePaddle(paddle);
                break;
            case 'MULTI':
                this.activateMultiBall();
                break;
            case 'FAST':
                this.activateFastBalls(paddle);
                break;
        }
        this.soundManager.playPowerUpSound();
    }

    activateWidePaddle(paddle) {
        this.activePowerUps.WIDE = true;
        paddle.width = paddle.originalWidth * 1.5;
        paddle.glowColor = POWER_UP_TYPES.WIDE.glow;
        paddle.innerGlow = POWER_UP_TYPES.WIDE.glow;
        paddle.glowSize = 15;

        setTimeout(() => {
            this.activePowerUps.WIDE = false;
            paddle.width = paddle.originalWidth;
            paddle.glowSize = 10;
            paddle.glowColor = '#2ecc71';
            paddle.innerGlow = '#2ecc71';
        }, 10000);
    }

    activateMultiBall() {
        if (this.game.balls.length === 0) return;

        const numNewBalls = 2;
        const baseBall = this.game.balls[0];

        for (let i = 0; i < numNewBalls; i++) {
            const angle = (Math.PI / 4) * (i - (numNewBalls - 1) / 2);
            const speed = baseBall.speed;
            const newBall = new Ball(this.game.canvas);
            newBall.x = baseBall.x;
            newBall.y = baseBall.y;
            newBall.dx = speed * Math.sin(angle);
            newBall.dy = -speed * Math.cos(angle);
            newBall.speed = speed;
            newBall.color = POWER_UP_TYPES.MULTI.glow;
            this.game.addBall(newBall);
        }
    }

    activateFastBalls(paddle) {
        this.activePowerUps.FAST = true;
        this.game.balls.forEach(ball => {
            ball.speed *= 1.5;
            ball.dx *= 1.5;
            ball.dy *= 1.5;
            ball.color = POWER_UP_TYPES.FAST.glow;
        });

        paddle.glowColor = POWER_UP_TYPES.FAST.glow;
        paddle.innerGlow = POWER_UP_TYPES.FAST.glow;
        paddle.glowSize = 15;

        setTimeout(() => {
            this.activePowerUps.FAST = false;
            this.game.balls.forEach(ball => {
                ball.speed /= 1.5;
                ball.dx /= 1.5;
                ball.dy /= 1.5;
                ball.color = '#2ecc71';
            });
            paddle.glowSize = 10;
            paddle.glowColor = '#2ecc71';
            paddle.innerGlow = '#2ecc71';
        }, 8000);
    }

    update(paddle, canvas) {
        // Move power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.y += powerUp.speed;
        });

        // Check collisions with paddle
        this.powerUps = this.powerUps.filter(powerUp => {
            if (powerUp.y + powerUp.height > paddle.y &&
                powerUp.y < paddle.y + paddle.height &&
                powerUp.x + powerUp.width > paddle.x &&
                powerUp.x < paddle.x + paddle.width) {
                this.activatePowerUp(powerUp.type, paddle);
                return false;
            }
            return powerUp.y < canvas.height;
        });
    }

    reset() {
        this.powerUps = [];
        this.activePowerUps = {
            WIDE: false,
            FAST: false
        };
    }
}

export default PowerUpManager;
