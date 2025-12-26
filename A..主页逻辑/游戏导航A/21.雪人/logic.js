// 游戏逻辑文件 - 包含所有游戏逻辑代码

// 导入样式函数
 

// 初始化样式
initializeStyles();

// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布大小
function resizeCanvas() {
    const size = getCanvasSize();
    canvas.width = size.width;
    canvas.height = size.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 游戏状态
let gameRunning = true;
let score = 0;
let currentFloor = 1;
let cameraY = 0;
let targetCameraY = 0;

// 从localStorage读取最高层数
let bestFloor = localStorage.getItem('snowmanBestFloor') || 0;
document.getElementById('bestValue').textContent = bestFloor;

// 游戏对象
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 4;
        this.jumpPower = 10;
        this.onGround = false;
        this.facing = 1;
        this.shootCooldown = 0;
    }
    
    update() {
        // 重力
        this.velocityY += 0.4;
        
        // 更新位置
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 边界检查
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
        
        // 平台碰撞检测
        this.onGround = false;
        platforms.forEach(platform => {
            if (this.checkPlatformCollision(platform)) {
                this.onGround = true;
                this.velocityY = 0;
                this.y = platform.y - this.height;
            }
        });
        
        // 更新射击冷却
        if (this.shootCooldown > 0) this.shootCooldown--;
        
        // 摩擦力
        this.velocityX *= 0.8;
        
        // 更新相机位置
        if (this.y < canvas.height / 2 + cameraY) {
            targetCameraY = this.y - canvas.height / 2;
        }
    }
    
    checkPlatformCollision(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y &&
               this.velocityY >= 0;
    }
    
    draw() {
        const drawY = this.y - cameraY;
        
        // 绘制雪人
        ctx.fillStyle = 'white';
        
        // 身体
        ctx.fillRect(this.x + 8, drawY + 15, 14, 20);
        
        // 头部
        ctx.fillRect(this.x + 10, drawY + 5, 10, 12);
        
        // 眼睛
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 12, drawY + 8, 2, 2);
        ctx.fillRect(this.x + 16, drawY + 8, 2, 2);
        
        // 嘴巴
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x + 13, drawY + 11, 3, 1);
        
        // 手臂
        ctx.fillStyle = 'white';
        if (this.facing === 1) {
            ctx.fillRect(this.x + 22, drawY + 18, 8, 2);
        } else {
            ctx.fillRect(this.x, drawY + 18, 8, 2);
        }
    }
    
    jump() {
        if (this.onGround) {
            this.velocityY = -this.jumpPower;
        }
    }
    
    moveLeft() {
        this.velocityX = -this.speed;
        this.facing = -1;
    }
    
    moveRight() {
        this.velocityX = this.speed;
        this.facing = 1;
    }
    
    shoot() {
        if (this.shootCooldown <= 0) {
            snowballs.push(new Snowball(
                this.x + (this.facing === 1 ? this.width : 0),
                this.y + this.height / 2,
                this.facing
            ));
            this.shootCooldown = 15;
        }
    }
}

class Enemy {
    constructor(x, y, platform) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.velocityX = (Math.random() > 0.5 ? 1 : -1) * 1.5;
        this.platform = platform;
        this.frozen = false;
        this.frozenTimer = 0;
        this.health = 1;
        this.startX = x;
        this.moveRange = platform.width - this.width;
    }
    
    update() {
        if (this.frozen) {
            this.frozenTimer--;
            if (this.frozenTimer <= 0) {
                this.frozen = false;
            }
            return;
        }
        
        // 在平台上左右移动
        this.x += this.velocityX;
        
        // 边界检测，只在当前平台范围内移动
        if (this.x <= this.platform.x || this.x + this.width >= this.platform.x + this.platform.width) {
            this.velocityX *= -1;
            this.x = Math.max(this.platform.x, Math.min(this.x, this.platform.x + this.platform.width - this.width));
        }
        
        // 始终保持在平台上
        this.y = this.platform.y - this.height;
    }
    
    draw() {
        const drawY = this.y - cameraY;
        
        if (this.frozen) {
            // 绘制冰冻状态
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(this.x - 3, drawY - 3, this.width + 6, this.height + 6);
            
            // 冰块效果
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 3, drawY - 3, this.width + 6, this.height + 6);
        }
        
        // 绘制敌人
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(this.x, drawY, this.width, this.height);
        
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 4, drawY + 6, 5, 5);
        ctx.fillRect(this.x + 16, drawY + 6, 5, 5);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 5, drawY + 7, 2, 2);
        ctx.fillRect(this.x + 17, drawY + 7, 2, 2);
    }
    
    freeze() {
        this.frozen = true;
        this.frozenTimer = 120;
    }
    
    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}

class Snowball {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 12;
        this.height = 12;
        this.velocityX = direction * 6;
        this.velocityY = 0;
        this.active = true;
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 边界检查
        if (this.x < 0 || this.x > canvas.width) {
            this.active = false;
        }
        
        // 检查是否离开视野
        if (this.y < cameraY - 100 || this.y > cameraY + canvas.height + 100) {
            this.active = false;
        }
    }
    
    draw() {
        const drawY = this.y - cameraY;
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, drawY + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // 雪花纹理
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2 - 2, drawY + this.height/2 - 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Platform {
    constructor(x, y, width, height, floor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.floor = floor;
    }
    
    draw() {
        const drawY = this.y - cameraY;
        
        // 只绘制在视野内的平台
        if (drawY + this.height < 0 || drawY > canvas.height) return;
        
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(this.x, drawY, this.width, this.height);
        
        // 平台纹理
        ctx.fillStyle = '#cc6600';
        ctx.fillRect(this.x, drawY, this.width, 4);
        
        // 层数标记
        if (this.floor % 5 === 0) {
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(`F${this.floor}`, this.x + 5, drawY - 5);
        }
    }
}

// 游戏对象初始化
const player = new Player(canvas.width / 2 - 15, canvas.height - 100);
let enemies = [];
let snowballs = [];
let platforms = [];

// 生成无限关卡 - 随机平台数量和位置
function generateInfiniteLevel() {
    platforms = [];
    enemies = [];
    
    // 生成起始平台
    platforms.push(new Platform(50, canvas.height - 30, canvas.width - 100, 20, 0));
    
    // 生成向上的无限平台
    const SNOWMAN_WIDTH = 30;          // 雪人宽度
    const MIN_PLATFORM_WIDTH = 120;    // 最短4个雪人宽
    const MAX_PLATFORM_WIDTH = 240;    // 最长8个雪人宽
    const FLOOR_HEIGHT = 120;          // 每层固定高度
    
    for (let floor = 1; floor <= 50; floor++) {
        const y = canvas.height - 30 - (floor * FLOOR_HEIGHT);
        
        // 随机决定这一层有几个平台（1-3个）
        const platformCount = Math.floor(Math.random() * 3) + 1;
        
        if (platformCount === 1) {
            // 只有一个平台，必须足够长
            const width = 200 + Math.random() * 150; // 200-350px
            const x = (canvas.width - width) / 2;
            platforms.push(new Platform(x, y, width, 15, floor));
            
        } else if (platformCount === 2) {
            // 两个平台
            const width1 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
            const width2 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
            
            // 确保两个平台之间有足够的跳跃空间
            const gap = 60 + Math.random() * 40; // 60-100px间隙
            
            // 左右分布
            const totalWidth = width1 + width2 + gap;
            const startX = (canvas.width - totalWidth) / 2;
            
            platforms.push(new Platform(startX, y, width1, 15, floor));
            platforms.push(new Platform(startX + width1 + gap, y, width2, 15, floor));
            
        } else {
            // 三个平台
            const width1 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
            const width2 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
            const width3 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
            
            const gap = 40 + Math.random() * 30; // 40-70px间隙
            const totalWidth = width1 + width2 + width3 + gap * 2;
            const startX = (canvas.width - totalWidth) / 2;
            
            platforms.push(new Platform(startX, y, width1, 15, floor));
            platforms.push(new Platform(startX + width1 + gap, y, width2, 15, floor));
            platforms.push(new Platform(startX + width1 + gap + width2 + gap, y, width3, 15, floor));
        }
        
        // 在平台上生成敌人
        const floorPlatforms = platforms.filter(p => p.floor === floor);
        floorPlatforms.forEach(platform => {
            if (Math.random() > 0.4 && floor > 1) {
                const enemyX = platform.x + Math.random() * (platform.width - 25);
                enemies.push(new Enemy(enemyX, platform.y - 25, platform));
            }
        });
    }
}

// 碰撞检测
function checkCollisions() {
    // 玩家与敌人碰撞
    enemies.forEach(enemy => {
        if (!enemy.frozen && 
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            gameOver();
        }
    });
    
    // 雪球与敌人碰撞
    snowballs.forEach(snowball => {
        if (!snowball.active) return;
        
        enemies.forEach(enemy => {
            if (snowball.x < enemy.x + enemy.width &&
                snowball.x + snowball.width > enemy.x &&
                snowball.y < enemy.y + enemy.height &&
                snowball.y + snowball.height > enemy.y) {
                
                if (enemy.frozen) {
                    // 敌人已被冰冻，消灭
                    if (enemy.takeDamage()) {
                        enemies = enemies.filter(e => e !== enemy);
                        score += 100;
                        updateUI();
                    }
                } else {
                    // 冰冻敌人
                    enemy.freeze();
                    score += 50;
                    updateUI();
                }
                
                snowball.active = false;
            }
        });
    });
    
    // 移除不活跃的雪球
    snowballs = snowballs.filter(s => s.active);
}

// 更新UI
function updateUI() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('floorValue').textContent = currentFloor;
    
    // 计算当前层数
    const playerFloor = Math.max(1, Math.floor((canvas.height - player.y - 100) / 120) + 1);
    if (playerFloor > currentFloor) {
        currentFloor = playerFloor;
        document.getElementById('floorValue').textContent = currentFloor;
        
        // 更新最高层数
        if (currentFloor > bestFloor) {
            bestFloor = currentFloor;
            localStorage.setItem('snowmanBestFloor', bestFloor);
            document.getElementById('bestValue').textContent = bestFloor;
        }
    }
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    document.getElementById('finalFloor').textContent = currentFloor;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').style.display = 'block';
}

// 重新开始游戏
function restartGame() {
    gameRunning = true;
    score = 0;
    currentFloor = 1;
    cameraY = 0;
    targetCameraY = 0;
    
    player.x = canvas.width / 2 - 15;
    player.y = canvas.height - 100;
    player.velocityX = 0;
    player.velocityY = 0;
    
    generateInfiniteLevel();
    updateUI();
    
    document.getElementById('gameOverScreen').style.display = 'none';
    gameLoop();
}

// 绘制背景
function drawBackground() {
    // 天空渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(1, '#87ceeb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制云朵
    for (let i = 0; i < 5; i++) {
        const cloudY = (i * 150 - cameraY * 0.3) % (canvas.height + 100);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(50 + i * 80, cloudY, 20, 0, Math.PI * 2);
        ctx.arc(70 + i * 80, cloudY, 25, 0, Math.PI * 2);
        ctx.arc(90 + i * 80, cloudY, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 游戏主循环
function gameLoop() {
    if (!gameRunning) return;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 平滑相机移动
    cameraY += (targetCameraY - cameraY) * 0.1;
    
    // 绘制背景
    drawBackground();
    
    // 绘制平台
    platforms.forEach(platform => platform.draw());
    
    // 更新和绘制敌人
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    
    // 更新和绘制雪球
    snowballs.forEach(snowball => {
        snowball.update();
        snowball.draw();
    });
    
    // 更新和绘制玩家
    player.update();
    player.draw();
    
    // 碰撞检测
    checkCollisions();
    
    // 更新UI
    updateUI();
    
    // 生成新的平台（如果需要）
    const highestPlatform = Math.min(...platforms.map(p => p.y));
    if (highestPlatform > cameraY - 200) {
        const lastFloor = Math.max(...platforms.map(p => p.floor));
        
        const SNOWMAN_WIDTH = 30;
        const MIN_PLATFORM_WIDTH = 120;
        const MAX_PLATFORM_WIDTH = 240;
        const FLOOR_HEIGHT = 120;
        
        for (let floor = lastFloor + 1; floor <= lastFloor + 10; floor++) {
            const y = canvas.height - 30 - (floor * FLOOR_HEIGHT);
            
            // 随机决定这一层有几个平台（1-3个）
            const platformCount = Math.floor(Math.random() * 3) + 1;
            
            if (platformCount === 1) {
                // 只有一个平台，必须足够长
                const width = 200 + Math.random() * 150;
                const x = (canvas.width - width) / 2;
                platforms.push(new Platform(x, y, width, 15, floor));
                
            } else if (platformCount === 2) {
                // 两个平台
                const width1 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
                const width2 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
                
                const gap = 60 + Math.random() * 40;
                const totalWidth = width1 + width2 + gap;
                const startX = (canvas.width - totalWidth) / 2;
                
                platforms.push(new Platform(startX, y, width1, 15, floor));
                platforms.push(new Platform(startX + width1 + gap, y, width2, 15, floor));
                
            } else {
                // 三个平台
                const width1 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
                const width2 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
                const width3 = MIN_PLATFORM_WIDTH + Math.random() * (MAX_PLATFORM_WIDTH - MIN_PLATFORM_WIDTH);
                
                const gap = 40 + Math.random() * 30;
                const totalWidth = width1 + width2 + width3 + gap * 2;
                const startX = (canvas.width - totalWidth) / 2;
                
                platforms.push(new Platform(startX, y, width1, 15, floor));
                platforms.push(new Platform(startX + width1 + gap, y, width2, 15, floor));
                platforms.push(new Platform(startX + width1 + gap + width2 + gap, y, width3, 15, floor));
            }
            
            // 在新平台上生成敌人
            const floorPlatforms = platforms.filter(p => p.floor === floor);
            floorPlatforms.forEach(platform => {
                if (Math.random() > 0.4) {
                    const enemyX = platform.x + Math.random() * (platform.width - 25);
                    enemies.push(new Enemy(enemyX, platform.y - 25, platform));
                }
            });
        }
    }
    
    // 清理离开视野太远的平台
    platforms = platforms.filter(p => p.y < cameraY + canvas.height + 200);
    enemies = enemies.filter(e => e.y < cameraY + canvas.height + 200);
    
    requestAnimationFrame(gameLoop);
}

// 键盘控制
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === ' ') {
        e.preventDefault();
        player.jump();
    }
    
    if (e.key === 'z' || e.key === 'Z') {
        player.shoot();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 持续按键处理
function handleInput() {
    if (keys['ArrowUp']) {
        player.jump();
    }
    if (keys['ArrowLeft']) {
        player.moveLeft();
    }
    if (keys['ArrowRight']) {
        player.moveRight();
    }
    
    if (gameRunning) {
        requestAnimationFrame(handleInput);
    }
}

// 触摸控制
let touchInterval;

function startTouch(action) {
    action();
    touchInterval = setInterval(action, 50);
}

function stopTouch() {
    clearInterval(touchInterval);
}

document.getElementById('upBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    startTouch(() => player.jump());
});

document.getElementById('downBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
});

document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    startTouch(() => player.moveLeft());
});

document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    startTouch(() => player.moveRight());
});

document.getElementById('jumpBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    player.jump();
});

document.getElementById('shootBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    player.shoot();
});

// 停止触摸
['upBtn', 'downBtn', 'leftBtn', 'rightBtn'].forEach(id => {
    document.getElementById(id).addEventListener('touchend', stopTouch);
    document.getElementById(id).addEventListener('touchcancel', stopTouch);
});

// 鼠标控制（用于桌面测试）
document.getElementById('upBtn').addEventListener('mousedown', () => player.jump());
document.getElementById('leftBtn').addEventListener('mousedown', () => player.moveLeft());
document.getElementById('rightBtn').addEventListener('mousedown', () => player.moveRight());
document.getElementById('jumpBtn').addEventListener('mousedown', () => player.jump());
document.getElementById('shootBtn').addEventListener('mousedown', () => player.shoot());

// 重新开始按钮
document.getElementById('restartBtn').addEventListener('click', restartGame);

// 初始化游戏
generateInfiniteLevel();
updateUI();
handleInput();
gameLoop();
