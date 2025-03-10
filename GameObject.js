export class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export class Paddle extends GameObject {
    constructor(canvas) {
        super(0, 0, 100, 12);
        this.speed = 8;
        this.dx = 0;
        this.originalWidth = 100;
        this.glowColor = '#2ecc71';
        this.glowSize = 10;
        this.innerGlow = '#2ecc71';
        
        // Center the paddle
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height - 30;
    }

    move(canvas) {
        this.x += this.dx;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }

    reset(canvas) {
        this.width = this.originalWidth;
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height - 30;
        this.glowColor = '#2ecc71';
        this.innerGlow = '#2ecc71';
        this.glowSize = 10;
        this.dx = 0;
    }
}

export class Ball {
    constructor(canvas) {
        this.radius = 6;
        this.x = canvas.width / 2;
        this.y = canvas.height - 50;
        this.speed = 5; // Adjusted initial speed
        this.dx = this.speed * (Math.random() > 0.5 ? 1 : -1);
        this.dy = -this.speed;
        this.color = '#2ecc71';
    }

    move(canvas) {
        // Update position
        this.x += this.dx;
        this.y += this.dy;

        // Wall collisions
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    reset(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height - 50;
        this.dx = this.speed * (Math.random() > 0.5 ? 1 : -1);
        this.dy = -this.speed;
    }
}

export class Brick extends GameObject {
    constructor(x, y, width, height, colorIndex, colors) {
        super(x, y, width, height);
        this.status = 1;
        this.colorIndex = colorIndex;
        this.colors = colors;
    }

    get color() {
        return this.colors[this.colorIndex];
    }
}

// Star Wars themed colors for bricks
export const BRICK_COLORS = [
    { inner: '#2ecc71', outer: '#27ae60' }, // Green (Jedi)
    { inner: '#e74c3c', outer: '#c0392b' }, // Red (Sith)
    { inner: '#3498db', outer: '#2980b9' }, // Blue (Force)
    { inner: '#9b59b6', outer: '#8e44ad' }, // Purple (Mace Windu)
    { inner: '#f1c40f', outer: '#f39c12' }  // Yellow (Temple Guards)
];

// Power-up configuration
export const POWER_UP_TYPES = {
    WIDE: { symbol: '🔵', color: '#3498db', chance: 0.08, glow: '#3498db' },
    MULTI: { symbol: '🔴', color: '#e74c3c', chance: 0.06, glow: '#c0392b' },
    FAST: { symbol: '⚡', color: '#f1c40f', chance: 0.04, glow: '#f39c12' }
};
