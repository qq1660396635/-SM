// 现代化CSS样式
const styles = `
    :root {
        --primary: #4299e1;
        --secondary: #3182ce;
        --success: #48bb78;
        --danger: #f56565;
        --warning: #ed8936;
        --dark: #2d3748;
        --light: #f7fafc;
        --board-bg: #ffffff;
        --line: #cbd5e0;
        --cell-size: min(15vw, 12vh);
        --shadow: 0 10px 25px rgba(0,0,0,0.1);
        --shadow-lg: 0 20px 40px rgba(0,0,0,0.15);
        --player-red: #fc8181;
        --player-green: #68d391;
    }
    
    * { 
        box-sizing: border-box; 
        touch-action: manipulation;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #4299e1 50%, #3182ce 100%);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        user-select: none;
    }

    .header {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow);
        z-index: 100;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .game-title {
        font-size: 1.8rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    #status {
        font-size: 1.1rem;
        color: var(--dark);
        font-weight: 500;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .role-badge {
        padding: 0.5rem 1rem;
        background: var(--light);
        border-radius: 2rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--dark);
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .role-badge.red {
        background: linear-gradient(135deg, #fff5f5, #fed7d7);
        border-color: var(--player-red);
        color: var(--danger);
    }

    .role-badge.green {
        background: linear-gradient(135deg, #f0fff4, #c6f6d5);
        border-color: var(--player-green);
        color: var(--success);
    }

    .btn {
        padding: 0.6rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        box-shadow: 0 4px 15px rgba(66, 153, 225, 0.4);
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(66, 153, 225, 0.5);
    }

    .btn-large {
        padding: 1rem 2.5rem;
        font-size: 1.2rem;
    }

    .game-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }

    .board-wrapper {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: var(--shadow-lg);
        backdrop-filter: blur(20px);
    }

    .board-container {
        background: var(--board-bg);
        border-radius: 1rem;
        width: 90vw;
        height: calc(90vw * 1.8);
        max-height: 75vh;
        max-width: calc(75vh / 1.8);
        display: flex;
        flex-direction: column;
        position: relative;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
        overflow: hidden;
    }

    .grid-area {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(6, 1fr);
        position: relative;
    }

    .river {
        height: 8%;
        background: linear-gradient(90deg, 
            rgba(66, 153, 225, 0.1) 0%, 
            rgba(49, 130, 206, 0.1) 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-top: 2px solid var(--line);
        border-bottom: 2px solid var(--line);
    }

    .river-text {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 0.5rem;
    }

    .river-decoration {
        position: absolute;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 10px,
            rgba(66, 153, 225, 0.05) 10px,
            rgba(66, 153, 225, 0.05) 20px
        );
    }

    .cell {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cell:hover {
        background: rgba(66, 153, 225, 0.05);
    }

    .cell::before {
        content: '';
        position: absolute;
        background: var(--line);
        width: 100%;
        height: 1px;
        top: 50%;
        left: 0;
        z-index: 0;
    }

    .cell::after {
        content: '';
        position: absolute;
        background: var(--line);
        width: 1px;
        height: 100%;
        top: 0;
        left: 50%;
        z-index: 0;
    }

    .cell[data-c="0"]::before { width: 50%; left: 50%; }
    .cell[data-c="4"]::before { width: 50%; left: 0; }
    .cell[data-is-top="true"][data-r="0"]::after { height: 50%; top: 50%; }
    .cell[data-is-top="true"][data-r="5"]::after { height: 50%; top: 0; }
    .cell[data-is-top="false"][data-r="6"]::after { height: 50%; top: 50%; }
    .cell[data-is-top="false"][data-r="11"]::after { height: 50%; top: 0; }

    .rail-h::before { 
        height: 3px; 
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        opacity: 0.3;
    }

    .rail-v::after { 
        width: 3px; 
        background: linear-gradient(180deg, var(--primary), var(--secondary));
        opacity: 0.3;
    }

    .camp::before, .camp::after { display: none; }

    .camp-circle {
        position: absolute;
        width: 80%;
        height: 80%;
        border: 2px solid var(--primary);
        border-radius: 50%;
        z-index: 0;
        background: radial-gradient(circle, rgba(66, 153, 225, 0.05), transparent);
    }

    .camp-x1, .camp-x2 {
        position: absolute;
        background: var(--primary);
        width: 100%;
        height: 2px;
        top: 50%;
        z-index: 0;
        opacity: 0.3;
    }

    .camp-x1 { transform: rotate(45deg); }
    .camp-x2 { transform: rotate(-45deg); }

    .hq-shape {
        position: absolute;
        width: 60%;
        height: 70%;
        border: 3px solid var(--danger);
        border-radius: 50% 50% 0 0;
        top: 15%;
        z-index: 0;
        background: radial-gradient(ellipse at center, rgba(245, 101, 101, 0.05), transparent);
    }

    .piece {
        width: 85%;
        height: 85%;
        border-radius: 0.75rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        font-size: 0.9rem;
        z-index: 5;
        transition: all 0.3s ease;
        position: relative;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .piece.hidden {
        background: linear-gradient(135deg, #4a5568, #2d3748);
        color: #a0aec0;
        font-size: 1.2rem;
        border: 2px solid #4a5568;
    }

    /* 玩家棋子颜色 */
    .piece.player-red {
        background: linear-gradient(135deg, #feb2b2, #fc8181);
        color: #742a2a;
        border: 2px solid var(--player-red);
    }

    .piece.player-green {
        background: linear-gradient(135deg, #9ae6b4, #68d391);
        color: #22543d;
        border: 2px solid var(--player-green);
    }

    .piece.selected {
        transform: scale(1.15);
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
        z-index: 10;
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1.15); }
        50% { transform: scale(1.2); }
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(10px);
        z-index: 1000;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background: white;
        padding: 3rem;
        border-radius: 1.5rem;
        text-align: center;
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .modal h2 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    @media (max-width: 768px) {
        .header {
            padding: 0.8rem 1rem;
        }
        
        .game-title {
            font-size: 1.4rem;
        }
        
        .board-wrapper {
            padding: 1rem;
        }
    }
`;

// 注入CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// 渲染函数
window.renderAll = function(board, selected, myColor) {
    const top = document.getElementById('board-top');
    const bottom = document.getElementById('board-bottom');
    top.innerHTML = ''; 
    bottom.innerHTML = '';
    
    for(let r=0; r<12; r++){
        let container = r < 6 ? top : bottom;
        for(let c=0; c<5; c++){
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = r; 
            cell.dataset.c = c;
            cell.dataset.isTop = (r < 6);
            
            // 样式标记
            if(isCamp(r,c)) {
                cell.classList.add('camp');
                cell.innerHTML = '<div class="camp-circle"></div><div class="camp-x1"></div><div class="camp-x2"></div>';
            } else if(isHQ(r,c)) {
                cell.innerHTML = '<div class="hq-shape"></div>';
            }
            if(RAIL_ROWS.includes(r)) cell.classList.add('rail-h');
            if(c===0 || c===4) {
                if(r>0 && r<11) cell.classList.add('rail-v');
            }
            
            // 放入棋子
            let p = board[r][c];
            if(p) {
                let pDiv = document.createElement('div');
                // 根据玩家颜色设置样式
                let colorClass = p.hidden ? '' : `player-${p.color}`;
                pDiv.className = `piece ${colorClass} ${p.hidden?'hidden':''}`;
                pDiv.innerText = p.hidden ? '暗' : TYPE_NAME[p.type];
                if(selected && selected.r===r && selected.c===c) pDiv.classList.add('selected');
                
                pDiv.style.pointerEvents = 'none';
                cell.appendChild(pDiv);
            }
            
            cell.onclick = () => handleInput(r, c);
            container.appendChild(cell);
        }
    }
};

// 更新状态显示
window.updateStatus = function(turn, myColor) {
    let txt = document.getElementById('status');
    if(turn === 'none') { 
        txt.innerText = "请翻棋定色"; 
        txt.style.color = 'var(--dark)';
        return;
    }
    
    let isMe = (turn === myColor);
    txt.innerText = isMe ? "轮到你了" : "AI 思考中...";
    txt.style.color = isMe ? 'var(--success)' : 'var(--warning)';
};
