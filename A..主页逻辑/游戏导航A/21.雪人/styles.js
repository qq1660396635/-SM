// 样式文件 - 包含所有CSS样式和样式相关的JavaScript代码

// 动态创建并插入样式
const style = document.createElement('style');
style.textContent = `
    body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Arial', sans-serif;
        overflow: hidden;
    }
    
    .game-container {
        position: relative;
        width: 100%;
        max-width: 400px;
        height: 100vh;
        max-height: 700px;
        background: #1a1a2e;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        overflow: hidden;
    }
    
    #gameCanvas {
        display: block;
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
    
    .game-ui {
    position: absolute;
    top: 0;
    right: 10px;      /* 离右边 10 px（可微调） */
    left: auto;       /* 取消占满全宽 */
    width: auto;      /* 内容多宽就占多宽 */
    display: flex;
    gap: 10px;        /* 三项之间间隔 */
    padding: 15px 0;  /* 上下保留 15 px，左右不再 padding */
    color: white;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    z-index: 10;
}

    
    .score, .floor, .best {
        background: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: 15px;
    }
    
    .controls {
        position: absolute;
        bottom: 20px;
        left: 20px;
        z-index: 10;
    }
    
    .d-pad {
        position: relative;
        width: 120px;
        height: 120px;
    }
    
    .control-btn {
        position: absolute;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid white;
        border-radius: 50%;
        color: white;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
    }
    
    .control-btn:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: scale(1.1);
    }
    
    .control-btn:active {
        transform: scale(0.95);
    }
    
    .control-btn.up {
        top: 0;
        left: 40px;
    }
    
    .control-btn.down {
        bottom: 0;
        left: 40px;
    }
    
    .control-btn.left {
        top: 40px;
        left: 0;
    }
    
    .control-btn.right {
        top: 40px;
        right: 0;
    }
    
    .action-btns {
        position: absolute;
        bottom: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 10;
    }
    
    .action-btn {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid white;
        border-radius: 50%;
        color: white;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
    }
    
    .action-btn:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: scale(1.1);
    }
    
    .action-btn:active {
        transform: scale(0.95);
    }
    
    .game-over {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        display: none;
        z-index: 20;
    }
    
    .game-over h2 {
        margin-top: 0;
        color: #ff6b6b;
    }
    
    .restart-btn {
        margin-top: 20px;
        padding: 10px 20px;
        background: #4ecdc4;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .restart-btn:hover {
        background: #45b7b8;
    }
    
    .instructions {
        position: absolute;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        text-align: center;
        background: rgba(0, 0, 0, 0.7);
        padding: 8px 15px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 10;
    }
`;

document.head.appendChild(style);

// 样式相关的JavaScript函数
 function initializeStyles() {
    console.log('样式初始化完成');
}

 function getCanvasSize() {
    return {
        width: window.innerWidth > 400 ? 400 : window.innerWidth,
        height: window.innerHeight > 700 ? 700 : window.innerHeight
    };
}
