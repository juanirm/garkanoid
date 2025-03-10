export class CollisionManager {
    constructor(powerUpManager, soundManager) {
        this.powerUpManager = powerUpManager;
        this.soundManager = soundManager;
    }

    checkBallPaddleCollision(ball, paddle) {
        // Check if the ball is within the paddle's x-range
        if (ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {
            // Check if the ball is touching the paddle's top
            if (ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y) {
                // Calculate hit position relative to paddle center (-1 to 1)
                const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
                
                // Adjust ball direction based on hit position
                const angle = hitPos * (Math.PI / 3); // Max angle: 60 degrees
                ball.dx = ball.speed * Math.sin(angle);
                ball.dy = -ball.speed * Math.cos(angle);
                
                // Ensure the ball is above the paddle
                ball.y = paddle.y - ball.radius;
                
                // Play paddle hit sound
                this.soundManager.playSaberSound();
                
                return true;
            }
        }
        return false;
    }

    checkBallBrickCollision(ball, brick) {
        if (brick.status !== 1) return false;

        // Check if ball overlaps with brick
        if (ball.x > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y > brick.y &&
            ball.y < brick.y + brick.height) {
            
            // Find closest edge to determine bounce direction
            const dx = Math.min(Math.abs(ball.x - brick.x), Math.abs(ball.x - (brick.x + brick.width)));
            const dy = Math.min(Math.abs(ball.y - brick.y), Math.abs(ball.y - (brick.y + brick.height)));
            
            // Reverse appropriate velocity component
            if (dx < dy) {
                ball.dx = -ball.dx;
            } else {
                ball.dy = -ball.dy;
            }
            
            // Play sound effect
            this.soundManager.playSaberSound();
            
            // Update brick status
            brick.status = 0;
            
            return true;
        }
        return false;
    }

    handleWallCollisions(ball, canvas) {
        let collision = false;

        // Side walls
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.dx = -Math.abs(ball.dx);
            collision = true;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.dx = Math.abs(ball.dx);
            collision = true;
        }
        
        // Top wall (accounting for the 2px border)
        if (ball.y - ball.radius < 2) {
            ball.y = 2 + ball.radius;
            ball.dy = Math.abs(ball.dy);
            collision = true;
        }

        return collision;
    }

    updateBallSpeed(ball, totalBricks, destroyedBricks) {
        const progressRatio = destroyedBricks / totalBricks;
        const maxSpeedMultiplier = 1.5;
        const speedMultiplier = 1 + (progressRatio * (maxSpeedMultiplier - 1));
        
        const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        const targetSpeed = ball.speed * speedMultiplier;
        
        if (Math.abs(currentSpeed - targetSpeed) > 0.1) {
            const scale = targetSpeed / currentSpeed;
            ball.dx *= scale;
            ball.dy *= scale;
        }
    }

    checkWinCondition(bricks) {
        return bricks.every(col => col.every(brick => brick.status === 0));
    }
}

export default CollisionManager;
