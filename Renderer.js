export class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLightsaberPaddle(paddle) {
        // Save context state
        this.ctx.save();
        
        // Outer glow
        this.ctx.shadowColor = paddle.glowColor;
        this.ctx.shadowBlur = paddle.glowSize;
        
        // Main paddle body
        this.ctx.beginPath();
        this.ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        const gradient = this.ctx.createLinearGradient(
            paddle.x, paddle.y,
            paddle.x, paddle.y + paddle.height
        );
        gradient.addColorStop(0, paddle.innerGlow);
        gradient.addColorStop(1, '#fff');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Inner glow line
        this.ctx.beginPath();
        this.ctx.moveTo(paddle.x, paddle.y + 2);
        this.ctx.lineTo(paddle.x + paddle.width, paddle.y + 2);
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Restore context state
        this.ctx.restore();
    }

    drawEnergyBall(ball) {
        // Save context state
        this.ctx.save();
        
        // Check if ball properties are valid numbers
        if (isFinite(ball.x) && isFinite(ball.y) && isFinite(ball.radius)) {
            this.ctx.shadowColor = ball.color;
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            
            const ballGradient = this.ctx.createRadialGradient(
                ball.x - 2, ball.y - 2, 0,
                ball.x, ball.y, ball.radius
            );
            ballGradient.addColorStop(0, '#fff');
            ballGradient.addColorStop(1, ball.color);
            
            this.ctx.fillStyle = ballGradient;
            this.ctx.fill();
        } else {
            console.error('Invalid ball properties:', ball);
        }
        
        // Restore context state
        this.ctx.restore();
    }

    drawForceFieldBrick(brick) {
        // Save context state
        this.ctx.save();
        
        const colors = brick.color;
        
        // Force field glow
        this.ctx.shadowColor = colors.outer;
        this.ctx.shadowBlur = 10;
        
        // Brick body
        this.ctx.beginPath();
        this.ctx.rect(brick.x, brick.y, brick.width, brick.height);
        
        const gradient = this.ctx.createLinearGradient(
            brick.x, brick.y,
            brick.x, brick.y + brick.height
        );
        gradient.addColorStop(0, colors.inner);
        gradient.addColorStop(1, colors.outer);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Highlight effect
        this.ctx.beginPath();
        this.ctx.moveTo(brick.x, brick.y + 2);
        this.ctx.lineTo(brick.x + brick.width, brick.y + 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Restore context state
        this.ctx.restore();
    }

    drawPowerUp(powerUp, type) {
        // Save context state
        this.ctx.save();
        
        this.ctx.shadowColor = type.color;
        this.ctx.shadowBlur = 10;
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = type.color;
        
        // Floating animation
        const floatOffset = Math.sin(Date.now() / 200) * 3;
        
        this.ctx.fillText(
            type.symbol,
            powerUp.x - powerUp.width / 2,
            powerUp.y + powerUp.height / 2 + floatOffset
        );
        
        // Restore context state
        this.ctx.restore();
    }

}

export default Renderer;
