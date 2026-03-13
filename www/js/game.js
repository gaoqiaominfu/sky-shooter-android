/**
 * 🚀 天空战记 - 竖版飞机射击游戏
 */

// ==================== 玩家飞机 ====================
class Player {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.width = 50;
        this.height = 60;
        this.x = canvasWidth / 2 - this.width / 2;
        this.y = canvasHeight - this.height - 100;
        this.speed = 8;
        this.lives = 3;
        this.score = 0;
        this.level = 1;
        this.shootCooldown = 0;
        this.shootInterval = 12;
        this.invincible = false;
        this.invincibleTime = 0;
        this.invincibleDuration = 120;
        this.keys = { left: false, right: false, up: false, down: false };
        this.setupControls();
    }

    setupControls() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = true;
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = true;
            if (e.code === 'Space' || e.code === 'Escape') game.togglePause();
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = false;
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = false;
        });

        // 触摸/鼠标控制
        const canvas = document.getElementById('gameCanvas');
        let isPointerDown = false;

        const updatePosition = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const x = (clientX - rect.left) * scaleX - this.width / 2;
            const y = (clientY - rect.top) * (canvas.height / rect.height) - this.height / 2;
            this.x = Math.max(0, Math.min(this.canvasWidth - this.width, x));
            this.y = Math.max(0, Math.min(this.canvasHeight - this.height, y));
        };

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isPointerDown = true;
            const touch = e.touches[0];
            updatePosition(touch.clientX, touch.clientY);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isPointerDown) return;
            const touch = e.touches[0];
            updatePosition(touch.clientX, touch.clientY);
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            isPointerDown = false;
        });

        canvas.addEventListener('mousedown', (e) => {
            isPointerDown = true;
            updatePosition(e.clientX, e.clientY);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isPointerDown) return;
            updatePosition(e.clientX, e.clientY);
        });

        canvas.addEventListener('mouseup', () => { isPointerDown = false; });
        canvas.addEventListener('mouseleave', () => { isPointerDown = false; });
    }

    update(bullets) {
        // 键盘移动
        if (this.keys.left) this.x -= this.speed;
        if (this.keys.right) this.x += this.speed;
        if (this.keys.up) this.y -= this.speed;
        if (this.keys.down) this.y += this.speed;

        // 边界限制
        this.x = Math.max(0, Math.min(this.canvasWidth - this.width, this.x));
        this.y = Math.max(0, Math.min(this.canvasHeight - this.height, this.y));

        // 自动射击
        if (this.shootCooldown > 0) this.shootCooldown--;
        else {
            bullets.push(new Bullet(this.x + this.width / 2, this.y, -15, '#00d9ff', true));
            this.shootCooldown = this.shootInterval;
        }

        // 无敌时间
        if (this.invincible) {
            this.invincibleTime--;
            if (this.invincibleTime <= 0) this.invincible = false;
        }
    }

    hit() {
        if (this.invincible) return false;
        this.lives--;
        if (this.lives > 0) {
            this.invincible = true;
            this.invincibleTime = this.invincibleDuration;
            return true;
        }
        return false;
    }

    addScore(points) {
        this.score += points;
        const levelThreshold = this.level * 2000;
        if (this.score >= levelThreshold) {
            this.level++;
            this.shootInterval = Math.max(5, this.shootInterval - 1);
        }
    }

    draw(ctx) {
        if (this.invincible && Math.floor(this.invincibleTime / 5) % 2 === 0) return;

        ctx.save();
        // 机身
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, '#4a9eff');
        gradient.addColorStop(1, '#0066cc');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height - 15);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // 驾驶舱
        ctx.fillStyle = '#00d9ff';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + 25, 8, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // 引擎火焰
        ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 0, 0.8)`;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - 10, this.y + this.height - 5);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height + 15 + Math.random() * 10);
        ctx.lineTo(this.x + this.width / 2 + 10, this.y + this.height - 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// ==================== 子弹 ====================
class Bullet {
    constructor(x, y, speedY, color, isPlayerBullet) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 20;
        this.speedY = speedY;
        this.color = color;
        this.isPlayerBullet = isPlayerBullet;
        this.markedForDeletion = false;
    }

    update() {
        this.y += this.speedY;
        if (this.y < -50 || this.y > 1000) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(this.x - this.width / 2, this.y, this.width, this.height, 3);
        ctx.fill();
        ctx.restore();
    }
}

// ==================== 敌机 ====================
class Enemy {
    constructor(canvasWidth, canvasHeight, level) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.width = 45;
        this.height = 45;
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = -this.height;
        this.speedY = 2 + Math.random() * 2 + level * 0.5;
        this.speedX = (Math.random() - 0.5) * 2;
        this.health = 1 + Math.floor(level / 3);
        this.score = 100 * level;
        this.color = `hsl(${Math.random() * 60 + 330}, 80%, 55%)`;
        this.markedForDeletion = false;
        this.shootCooldown = Math.random() * 100 + 50;
    }

    update(bullets) {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.x <= 0 || this.x >= this.canvasWidth - this.width) this.speedX *= -1;
        if (this.y > this.canvasHeight + 50) this.markedForDeletion = true;

        // 敌机射击
        this.shootCooldown--;
        if (this.shootCooldown <= 0) {
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height, 8, '#ff4757', false));
            this.shootCooldown = Math.random() * 100 + 100;
        }
    }

    hit() {
        this.health--;
        return this.health <= 0;
    }

    draw(ctx) {
        ctx.save();
        // 敌机机身
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, '#880000');
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + 15);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fill();

        // 机翼
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 10);
        ctx.lineTo(this.x - 10, this.y + 25);
        ctx.lineTo(this.x, this.y + 35);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + 10);
        ctx.lineTo(this.x + this.width + 10, this.y + 25);
        ctx.lineTo(this.x + this.width, this.y + 35);
        ctx.closePath();
        ctx.fill();

        // 血条
        if (this.health > 1) {
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y - 8, this.width, 4);
            ctx.fillStyle = '#0f0';
            ctx.fillRect(this.x, this.y - 8, this.width * (this.health / (1 + Math.floor(game.player.level / 3))), 4);
        }
        ctx.restore();
    }
}

// ==================== 爆炸特效 ====================
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 3;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = (Math.random() - 0.5) * 10;
        this.color = color;
        this.life = 1;
        this.decay = Math.random() * 0.03 + 0.02;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2; // 重力
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ==================== 星空背景 ====================
class Star {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
        this.y = Math.random() * canvasHeight;
    }

    reset() {
        this.x = Math.random() * this.canvasWidth;
        this.y = -5;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 3 + 0.5;
        this.brightness = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.canvasHeight + 5) this.reset();
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ==================== 游戏主类 ====================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        this.isRunning = false;
        this.isPaused = false;
        this.frameCount = 0;

        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.stars = [];

        this.enemySpawnRate = 60;
        this.enemySpawnTimer = 0;

        this.scoreDisplay = document.getElementById('scoreValue');
        this.livesDisplay = document.getElementById('livesValue');
        this.levelDisplay = document.getElementById('levelValue');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.pauseScreen = document.getElementById('pauseScreen');
        this.finalScoreDisplay = document.getElementById('finalScore');

        this.initStars();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.render();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    initStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push(new Star(this.canvas.width, this.canvas.height));
        }
    }

    start() {
        this.resizeCanvas();
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.isRunning = true;
        this.isPaused = false;
        this.frameCount = 0;
        this.enemySpawnRate = 60;

        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        this.pauseScreen.style.display = 'none';

        this.gameLoop();
    }

    restart() {
        this.start();
    }

    togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
        this.pauseScreen.style.display = this.isPaused ? 'block' : 'none';
        if (!this.isPaused) this.gameLoop();
    }

    resume() {
        this.isPaused = false;
        this.pauseScreen.style.display = 'none';
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning || this.isPaused) return;

        this.update();
        this.render();
        this.frameCount++;
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // 更新星空
        this.stars.forEach(star => star.update());

        // 更新玩家
        this.player.update(this.bullets);

        // 更新子弹
        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);

        // 生成敌机
        this.enemySpawnTimer++;
        const currentSpawnRate = Math.max(20, this.enemySpawnRate - this.player.level * 3);
        if (this.enemySpawnTimer >= currentSpawnRate) {
            this.enemies.push(new Enemy(this.canvas.width, this.canvas.height, this.player.level));
            this.enemySpawnTimer = 0;
        }

        // 更新敌机
        this.enemies.forEach(enemy => enemy.update(this.bullets));
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // 更新粒子
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(p => p.life > 0);

        // 碰撞检测
        this.checkCollisions();

        // 更新 UI
        this.updateUI();

        // 检查游戏结束
        if (this.player.lives <= 0) {
            this.gameOver();
        }
    }

    checkCollisions() {
        // 玩家子弹击中敌机
        this.bullets.forEach(bullet => {
            if (!bullet.isPlayerBullet) return;
            this.enemies.forEach(enemy => {
                if (this.checkCollision(bullet, enemy)) {
                    bullet.markedForDeletion = true;
                    if (enemy.hit()) {
                        enemy.markedForDeletion = true;
                        this.player.addScore(enemy.score);
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
                    }
                }
            });
        });

        // 敌机子弹击中玩家
        this.bullets.forEach(bullet => {
            if (bullet.isPlayerBullet) return;
            if (this.checkCollision(bullet, this.player)) {
                bullet.markedForDeletion = true;
                if (this.player.hit()) {
                    this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#4a9eff');
                }
            }
        });

        // 敌机撞击玩家
        this.enemies.forEach(enemy => {
            if (this.checkCollision(enemy, this.player)) {
                enemy.markedForDeletion = true;
                this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
                if (this.player.hit()) {
                    this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#4a9eff');
                }
            }
        });
    }

    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    updateUI() {
        this.scoreDisplay.textContent = this.player.score;
        this.livesDisplay.textContent = '❤️'.repeat(this.player.lives);
        this.levelDisplay.textContent = this.player.level;
    }

    render() {
        // 清空画布
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制星空
        this.stars.forEach(star => star.draw(this.ctx));

        // 绘制游戏对象
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        if (this.player) this.player.draw(this.ctx);
        this.particles.forEach(particle => particle.draw(this.ctx));
    }

    gameOver() {
        this.isRunning = false;
        this.finalScoreDisplay.textContent = this.player.score;
        this.gameOverScreen.style.display = 'block';
    }
}

// 启动游戏
const game = new Game();
