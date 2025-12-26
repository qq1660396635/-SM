// 动态注入CSS样式
const cssText = `
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
}

/* 小清新渐变色背景 - 薄荷绿风格 */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    color: #333;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

/* 备用选项1: 浅蓝粉渐变 */
/* background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); */

/* 备用选项2: 柔和小清新 */
/* background: linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%); */

/* 备用选项3: 自然清新 */
/* background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); */

/* 备用选项4: 柔和渐变 */
/* background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%); */

/* 横屏提示- 只在需要时显示*/
.landscape-notice {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 1000;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
}

.landscape-notice.show {
    display: flex;
}

.landscape-notice h2 {
    color: #ffcc00;
    font-size: 1.8rem;
    margin-bottom: 15px;
}

.landscape-notice p {
    font-size: 1rem;
    margin-bottom: 20px;
    max-width: 300px;
    line-height: 1.4;
}

.rotate-icon {
    font-size: 3rem;
    margin-bottom: 20px;
    animation: rotate 2s infinite ease-in-out;
}

.continue-btn {
    background: #4caf50;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: 25px;
    cursor: pointer;
    margin-top: 10px;
    font-weight: bold;
}

@keyframes rotate {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(90deg); }
}

/* 紧凑游戏容器*/
.game-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 8px;
    gap: 8px;
}

/* 游戏标题栏*/
.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    flex-shrink: 0;
    height: 50px; /* 减小高度 */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.game-title h1 {
    font-size: 1.2rem; /* 减小字体 */
    color: #2c3e50;
}

.game-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.current-turn {
    font-size: 0.8rem; /* 减小字体 */
    color: #3498db;
    font-weight: bold;
}

.dizhu-info {
    font-size: 0.75rem; /* 减小字体 */
    color: #e74c3c;
}

/* 主游戏区域*/
.game-area {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 6px; /* 减小间距 */
}

/* AI 玩家区域*/
.ai-player {
    display: flex;
    align-items: center;
    padding: 6px 10px; /* 减小内边距 */
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    min-height: 60px; /* 减小最小高度 */
    flex-shrink: 0;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ai-player-top {
    border-left: 4px solid #3498db;
}

.ai-player-bottom {
    border-left: 4px solid #e74c3c;
}

.player-avatar {
    width: 35px; /* 减小尺寸 */
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.8rem; /* 减小字体 */
    margin-right: 8px;
    flex-shrink: 0;
}

.ai-avatar-1 {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
}

.ai-avatar-2 {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
}

.player-details {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.player-name {
    font-size: 0.9rem; /* 减小字体 */
    font-weight: bold;
    margin-bottom: 2px;
    color: #2c3e50;
}

.player-status {
    font-size: 0.7rem; /* 减小字体 */
    color: #7f8c8d;
}

.player-cards {
    display: flex;
    margin-left: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 2px;
    max-width: 50%; /* 减小最大宽度 */
}

.card-back {
    width: 25px; /* 减小尺寸 */
    height: 35px;
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
}

/* 中心游戏区域*/
.center-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 8px; /* 减小内边距 */
    flex: 1;
    min-height: 120px; /* 减小最小高度 */
    justify-content: center;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dizhu-section {
    margin-bottom: 8px; /* 减小间距 */
    text-align: center;
}

.section-title {
    font-size: 0.8rem; /* 减小字体 */
    color: #2c3e50;
    font-weight: bold;
    margin-bottom: 4px;
}

.dizhu-cards {
    display: flex;
    gap: 4px;
    justify-content: center;
}

.current-cards-area {
    text-align: center;
}

.current-cards {
    display: flex;
    gap: 4px;
    justify-content: center;
    min-height: 40px; /* 减小最小高度 */
    align-items: center;
}

.card {
    width: 35px; /* 减小尺寸 */
    height: 50px;
    background: white;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1rem; /* 减小字体 */
    font-weight: bold;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: transform 0.2s;
    flex-shrink: 0;
}

.card.red {
    color: #e53935;
}

.card.black {
    color: #212121;
}

.card.selected {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(255, 204, 0, 0.5);
}

.card.back {
    background: linear-gradient(135deg, #37474f, #263238);
    color: white;
}

.card-value {
    font-size: 1rem; /* 减小字体 */
}

.card-suit {
    font-size: 0.8rem; /* 减小字体 */
    margin-top: 2px;
}

/* 玩家手牌区域 - 修复按钮超出屏幕问题*/
.player-area {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 8px; /* 减小内边距 */
    border-top: 3px solid #2ecc71;
    flex-shrink: 0;
    min-height: 140px; /* 减小最小高度 */
    max-height: 35vh; /* 限制最大高度 */
    overflow-y: auto; /* 允许滚动 */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.player-header {
    display: flex;
    align-items: center;
    margin-bottom: 6px; /* 减小间距 */
}

.player-area .player-avatar {
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    color: white;
}

.player-hand {
    display: flex;
    gap: 3px; /* 减小间距 */
    overflow-x: auto;
    padding-bottom: 6px;
    min-height: 50px; /* 减小最小高度 */
    max-height: 60px; /* 限制最大高度 */
    align-items: center;
}

.player-hand::-webkit-scrollbar {
    height: 4px;
}

.player-hand::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

.player-hand::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
}

/* 控制按钮区域 - 修复按钮超出屏幕问题*/
.controls {
    display: grid; /* 改用网格布局 */
    grid-template-columns: repeat(3, 1fr); /* 3列布局 */
    gap: 6px; /* 减小间距 */
    margin-top: 8px; /* 减小间距 */
    max-height: 80px; /* 限制最大高度 */
}

.game-btn {
    padding: 8px 12px; /* 减小内边距 */
    font-size: 0.8rem; /* 减小字体 */
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
    min-width: 80px; /* 减小最小宽度 */
    max-width: 100px; /* 减小最大宽度 */
    white-space: nowrap; /* 防止文字换行 */
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.game-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-start {
    background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.btn-bid {
    background: linear-gradient(135deg, #f39c12, #d35400);
}

.btn-play {
    background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.btn-pass {
    background: linear-gradient(135deg, #95a5a6, #7f8c8d);
}

.btn-reset {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.btn-disabled {
    background: #bdc3c7;
    color: #7f8c8d;
    cursor: not-allowed;
    box-shadow: none;
}

.btn-disabled:hover {
    transform: none;
    box-shadow: none;
}

/* 状态消息*/
.status-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 0.9rem;
    z-index: 100;
    display: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    color: white;
}

.status-message.show {
    display: block;
    animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    20% { opacity: 1; transform: translateX(-50%) translateY(0); }
    80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}

/* 发牌动画*/
.dealing-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 50;
}

.dealing-animation.show {
    display: flex;
}

.dealing-text {
    font-size: 1.5rem;
    color: #ffcc00;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

/* 响应式调整 - 针对小屏幕优化*/
@media (max-height: 700px) {
    .game-header {
        height: 45px;
        padding: 5px 8px;
    }
    .game-title h1 {
        font-size: 1.1rem;
    }
    .ai-player {
        min-height: 55px;
        padding: 5px 8px;
    }
    .card-back {
        width: 22px;
        height: 30px;
    }
    .card {
        width: 30px;
        height: 42px;
    }
    .card-value {
        font-size: 0.9rem;
    }
    .card-suit {
        font-size: 0.7rem;
    }
    .player-area {
        min-height: 120px;
        padding: 6px;
        max-height: 30vh;
    }
    .game-btn {
        padding: 6px 10px;
        font-size: 0.75rem;
        min-width: 70px;
        max-width: 85px;
    }
}

@media (max-height: 600px) {
    .center-area {
        padding: 6px;
        min-height: 100px;
    }
    .player-area {
        min-height: 100px;
        max-height: 28vh;
    }
    .player-hand {
        min-height: 45px;
        max-height: 50px;
    }
    .controls {
        max-height: 70px;
    }
    .game-btn {
        padding: 5px 8px;
        font-size: 0.7rem;
        min-width: 60px;
        max-width: 75px;
    }
}

@media (orientation: landscape) {
    .landscape-notice {
        display: none !important;
    }
}

/* 横屏模式下的优化*/
@media (orientation: portrait) and (max-height: 500px) {
    .game-container {
        padding: 4px;
        gap: 4px;
    }
    .ai-player {
        min-height: 50px;
    }
    .center-area {
        min-height: 80px;
        padding: 6px;
    }
    .player-area {
        min-height: 90px;
        padding: 6px;
        max-height: 25vh;
    }
    .controls {
        max-height: 60px;
    }
    .game-btn {
        padding: 4px 6px;
        font-size: 0.65rem;
        min-width: 55px;
        max-width: 70px;
    }
}
`;

// 创建并注入样式
const styleElement = document.createElement('style');
styleElement.textContent = cssText;
document.head.appendChild(styleElement);
