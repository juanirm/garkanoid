import SoundManager from './SoundManager.js';
import { Paddle, Ball, Brick, BRICK_COLORS } from './GameObject.js';
import { Renderer } from './Renderer.js';
import { PowerUpManager } from './PowerUpManager.js';
import { CollisionManager } from './CollisionManager.js';

class Game {
    constructor() {
        console.log('Game: Initializing...');
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 598; // Reduced by 2px to account for the top border

        console.log('Game: Setting up components...');
        
        // Initialize components
        this.soundManager = new SoundManager();
        this.renderer = new Renderer(this.canvas, this.ctx);
        this.powerUpManager = new PowerUpManager(this, this.soundManager);
        this.collisionManager = new CollisionManager(this.powerUpManager, this.soundManager);

        console.log('Game: Creating game objects...');
        
        // Game objects
        this.paddle = new Paddle(this.canvas);
        this.balls = [];
        this.bricks = [];

        // Game state
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameStarted = false;
        this.gameOver = false;

        // Constants
        this.MAX_LEVEL = 10;
        this.TOTAL_BRICKS = 0;

        // Initialize state
        console.log('Game: Initializing game state...');
        this.resetBall();
        this.createLevel(this.level);
        
        // Bind events and show start screen
        console.log('Game: Setting up event handlers...');
        this.bindEvents();
        this.showStartScreen();
        
        console.log('Game: Initialization complete');
        
        // Update HUD
        this.updateScore();
        this.updateLives();
        this.updateLevel();

        // Draw initial state
        this.draw();
    }

    handleKeyDown(e) {
        console.log('Game: Key down event -', e.key);
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            this.paddle.dx = this.paddle.speed;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            this.paddle.dx = -this.paddle.speed;
        } else if ((e.key === ' ' || e.key === 'Space') && !this.gameStarted) {
            console.log('Game: Starting game via spacebar');
            this.startGame();
        }
    }

    handleKeyUp(e) {
        console.log('Game: Key up event -', e.key);
        if (e.key === 'Right' || e.key === 'ArrowRight' || 
            e.key === 'Left' || e.key === 'ArrowLeft') {
            this.paddle.dx = 0;
        }
    }

    handleMouseMove(e) {
        if (this.gameStarted && !this.gameOver) {
            const rect = this.canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < this.canvas.width) {
                this.paddle.x = relativeX - this.paddle.width / 2;
            }
        }
    }

    createLevel(level) {
        console.log(`Game: Creating level ${level}`);
        this.bricks = [];
        const ROWS = 5;
        const COLS = 10;
        const BRICK_WIDTH = (this.canvas.width - 20) / COLS - 4;
        const BRICK_HEIGHT = 20;
        const BRICK_PADDING = 4;
        const OFFSET_TOP = 30;
        const OFFSET_LEFT = 10;

        let pattern;
        switch (level % 5) {
            case 1: pattern = this.createRectanglePattern(ROWS, COLS); break;
            case 2: pattern = this.createTrianglePattern(ROWS, COLS); break;
            case 3: pattern = this.createDiamondPattern(ROWS, COLS); break;
            case 4: pattern = this.createCirclePattern(ROWS, COLS); break;
            case 0: pattern = this.createRandomPattern(ROWS, COLS); break;
        }

        for (let c = 0; c < COLS; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < ROWS; r++) {
                if (pattern[r][c]) {
                    const x = c * (BRICK_WIDTH + BRICK_PADDING) + OFFSET_LEFT;
                    const y = r * (BRICK_HEIGHT + BRICK_PADDING) + OFFSET_TOP;
                    this.bricks[c][r] = new Brick(x, y, BRICK_WIDTH, BRICK_HEIGHT, (r + c) % BRICK_COLORS.length, BRICK_COLORS);
                }
            }
        }
        this.TOTAL_BRICKS = this.bricks.flat().filter(brick => brick !== undefined).length;
    }

    createRectanglePattern(rows, cols) {
        return Array(rows).fill().map(() => Array(cols).fill(1));
    }

    createTrianglePattern(rows, cols) {
        return Array(rows).fill().map((_, r) => 
            Array(cols).fill().map((_, c) => c <= r ? 1 : 0)
        );
    }

    createDiamondPattern(rows, cols) {
        const midRow = Math.floor(rows / 2);
        const midCol = Math.floor(cols / 2);
        return Array(rows).fill().map((_, r) => 
            Array(cols).fill().map((_, c) => 
                Math.abs(r - midRow) + Math.abs(c - midCol) <= midRow ? 1 : 0
            )
        );
    }

    createCirclePattern(rows, cols) {
        const centerX = cols / 2 - 0.5;
        const centerY = rows / 2 - 0.5;
        const radius = Math.min(rows, cols) / 2;
        return Array(rows).fill().map((_, r) => 
            Array(cols).fill().map((_, c) => 
                Math.sqrt(Math.pow(c - centerX, 2) + Math.pow(r - centerY, 2)) <= radius ? 1 : 0
            )
        );
    }

    createRandomPattern(rows, cols) {
        return Array(rows).fill().map(() => 
            Array(cols).fill().map(() => Math.random() > 0.3 ? 1 : 0)
        );
    }

    bindEvents() {
        console.log('Game: Binding events...');
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        const startButton = document.getElementById('startButton');
        const restartButton = document.getElementById('restartButton');
        
        if (startButton) {
            startButton.addEventListener('click', () => this.startGame());
        } else {
            console.error('Start button not found!');
        }
        
        if (restartButton) {
            restartButton.addEventListener('click', () => this.restartGame());
        } else {
            console.error('Restart button not found!');
        }

        // Resume AudioContext on user interaction
        const resumeAudio = () => {
            if (this.soundManager.audioContext?.state === 'suspended') {
                console.log('Game: Resuming audio context...');
                this.soundManager.audioContext.resume();
            }
        };
        document.addEventListener('click', resumeAudio);
        document.addEventListener('keydown', resumeAudio);
    }

    startGame() {
        console.log('Game: Starting game...');
        if (this.gameStarted) {
            console.log('Game: Already started');
            return;
        }
        
        document.getElementById('startScreen').classList.add('hidden');
        this.gameStarted = true;
        this.gameOver = false;
        
        console.log('Game: Initializing audio...');
        this.soundManager.initialize();
        
        // Wrap audio operations in a try-catch block
        try {
            this.soundManager.startBackgroundMusic();
        } catch (error) {
            console.error('Failed to start background music:', error);
        }
        
        // Update HUD
        this.updateScore();
        this.updateLives();
        this.updateLevel();
        
        console.log('Game: Starting game loop...');
        this.gameLoop();
    }

    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.balls = [];
        this.bricks = this.createBricks();
        this.powerUpManager.reset();
        this.paddle.reset(this.canvas);
        this.resetBall();
        this.powerUpManager.setBalls(this.balls);

        document.getElementById('gameOverScreen').classList.add('hidden');
        this.updateScore();
        this.updateLives();
        this.gameStarted = true;

        this.soundManager.startBackgroundMusic();
        this.gameLoop();
    }

    resetBall() {
        if (this.balls.length === 0) {
            this.balls.push(new Ball(this.canvas));
        }
    }

    addBall(ball) {
        this.balls.push(ball);
    }

    showStartScreen() {
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
    }

    showGameOverScreen() {
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
        this.soundManager.stopBackgroundMusic();
        
        if (this.collisionManager.checkWinCondition(this.bricks)) {
            this.soundManager.playVictorySound();
        } else {
            this.soundManager.playDefeatSound();
        }
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    updateLives() {
        document.getElementById('lives').textContent = this.lives;
    }

    updateLevel() {
        document.getElementById('level').textContent = this.level;
    }

    checkCollisions() {
        const destroyedBricks = this.TOTAL_BRICKS - 
            this.bricks.flat().filter(brick => brick && brick.status === 1).length;

        // Check ball collisions
        this.balls.forEach(ball => {
            // Paddle collision
            this.collisionManager.checkBallPaddleCollision(ball, this.paddle);

            // Brick collisions
            this.bricks.forEach(col => {
                col.forEach(brick => {
                    if (brick && this.collisionManager.checkBallBrickCollision(ball, brick)) {
                        this.score += 10 * this.level; // Increase score based on level
                        this.updateScore();
                        this.powerUpManager.createPowerUp(
                            brick.x + brick.width / 2,
                            brick.y + brick.height / 2
                        );
                    }
                });
            });
        });

        // Check for power-up collisions and update
        this.powerUpManager.update(this.paddle, this.canvas);

        // Check for level completion
        if (this.bricks.flat().filter(brick => brick && brick.status === 1).length === 0) {
            this.levelUp();
        }
    }

    update() {
        if (!this.gameStarted || this.gameOver) return;

        // Move paddle
        this.paddle.move(this.canvas);

        let ballLost = false;

        // Move and check balls
        this.balls = this.balls.filter(ball => {
            ball.move(this.canvas);
            
            // Check for wall collisions
            if (this.collisionManager.handleWallCollisions(ball, this.canvas)) {
                this.soundManager.playWallHitSound();
            }
            
            // Check if ball is lost (below bottom of canvas)
            if (ball.y - ball.radius > this.canvas.height) {
                ballLost = true;
                return false; // Remove this ball
            }
            
            return true; // Keep this ball in play
        });

        // Handle lost ball
        if (ballLost) {
            this.lives--;
            this.updateLives();
            if (this.lives === 0) {
                this.gameOver = true;
                this.showGameOverScreen();
            } else {
                this.resetBall();
                this.paddle.reset(this.canvas);
            }
        }

        this.checkCollisions();
    }

    levelUp() {
        this.level++;
        if (this.level > this.MAX_LEVEL) {
            this.gameOver = true;
            this.showGameOverScreen();
        } else {
            this.createLevel(this.level);
            this.resetBall();
            this.paddle.reset(this.canvas);
            this.increaseBallSpeed();
            this.updateLevel();
        }
    }

    increaseBallSpeed() {
        this.balls.forEach(ball => {
            ball.speed *= 1.1; // Increase speed by 10%
        });
    }

    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameOver = false;
        this.balls = [];
        this.createLevel(this.level);
        this.powerUpManager.reset();
        this.paddle.reset(this.canvas);
        this.resetBall();

        document.getElementById('gameOverScreen').classList.add('hidden');
        this.updateScore();
        this.updateLives();
        this.updateLevel();
        this.gameStarted = true;

        this.soundManager.startBackgroundMusic();
        this.gameLoop();
    }

    draw() {
        this.renderer.clear();

        // Draw game objects
        this.bricks.forEach(col => {
            col.forEach(brick => {
                if (brick.status === 1) {
                    this.renderer.drawForceFieldBrick(brick);
                }
            });
        });

        this.renderer.drawLightsaberPaddle(this.paddle);
        this.balls.forEach(ball => {
            if (ball.y + ball.radius <= this.canvas.height) {
                this.renderer.drawEnergyBall(ball);
            }
        });

        // Draw power-ups
        this.powerUpManager.powerUps.forEach(powerUp => {
            this.renderer.drawPowerUp(powerUp, this.powerUpManager.POWER_UP_TYPES[powerUp.type]);
        });
    }

    gameLoop() {
        if (!this.gameStarted || this.gameOver) {
            console.log('Game: Loop stopped - gameStarted:', this.gameStarted, 'gameOver:', this.gameOver);
            return;
        }

        this.update();
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.onload = () => {
    console.log('Window loaded: Creating game instance...');
    new Game();
};

export default Game;
