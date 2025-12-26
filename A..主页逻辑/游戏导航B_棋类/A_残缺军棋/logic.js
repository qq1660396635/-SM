// 游戏常量
const ROWS = 12;
const COLS = 5;
const TYPE_RANK = {
    'junqi': 0, 'zhadan': 35, 'dilei': 34, 'gongbing': 1, 'paizhang': 2, 'lianzhang': 3, 'yingzhang': 4, 'tuanzhang': 5, 'lvzhang': 6, 'shizhang': 7, 'junzhang': 8, 'siling': 9 
};
const TYPE_NAME = {
    'junqi':'军旗', 'zhadan':'炸弹', 'dilei':'地雷', 'gongbing':'工兵', 'paizhang':'排长', 'lianzhang':'连长', 'yingzhang':'营长', 'tuanzhang':'团长', 'lvzhang':'旅长', 'shizhang':'师长', 'junzhang':'军长', 'siling':'司令' 
};
const INIT_PIECES = [
    'siling','junzhang', 'shizhang','shizhang', 'lvzhang','lvzhang', 'tuanzhang','tuanzhang', 'yingzhang','yingzhang', 'lianzhang','lianzhang','lianzhang', 'paizhang','paizhang','paizhang', 'gongbing','gongbing','gongbing', 'dilei','dilei','dilei', 'zhadan','zhadan', 'junqi'
];
const CAMPS = [[2,1],[2,3],[3,2],[4,1],[4,3], [7,1],[7,3],[8,2],[9,1],[9,3]];
const RAIL_ROWS = [1, 5, 6, 10];
const HQS = [[0,1],[0,3],[11,1],[11,3]];

// 游戏状态
let gameState = {
    board: [], turn: 'none', myColor: null, aiColor: null, selected: null, isGameOver: false, moveHistory: [] 
};

// AI 状态
let aiState = {
    startTime: 0,
    maxThinkTime: 8000, 
    memory: {
        playerHabits: new Map(), 
        successfulMoves: new Set(), 
        failedMoves: new Set()
    }
};

// 辅助函数
function isCamp(r,c) {
    return CAMPS.some(p=>p[0]===r && p[1]===c);
}
function isHQ(r,c) {
    return HQS.some(p=>p[0]===r && p[1]===c);
}
function isRail(r,c) {
    if(r===1||r===5||r===6||r===10) return true;
    if((c===0||c===4) && r>0 && r<11) return true;
    return false;
}

// 初始化游戏
function init() {
    const save = localStorage.getItem('xSimpleJunqi');
    if(save) {
        try {
            const data = JSON.parse(save);
            gameState.board = data.board;
            gameState.turn = data.turn;
            gameState.myColor = data.myColor;
            gameState.aiColor = data.aiColor;
            gameState.isGameOver = data.isGameOver;
            if(data.moveHistory) gameState.moveHistory = data.moveHistory;
            renderAll(gameState.board, gameState.selected, gameState.myColor);
            updateStatus(gameState.turn, gameState.myColor);
            updateRoleBadge();
            if(!gameState.isGameOver && gameState.turn === gameState.aiColor) {
                setTimeout(aiMove, 600);
            }
            return;
        } catch(e) {
            localStorage.removeItem('xSimpleJunqi');
        }
    }
    startNewGame();
}

function startNewGame() {
    gameState.isGameOver = false;
    gameState.turn = 'none';
    gameState.myColor = null;
    gameState.aiColor = null;
    gameState.selected = null;
    gameState.moveHistory = [];
    document.getElementById('end-modal').style.display = 'none';

    // 生成棋子池
    let pool = [];
    ['red', 'green'].forEach(c => {
        INIT_PIECES.forEach(type => {
            pool.push({ type: type, color: c, hidden: true, rank: TYPE_RANK[type] });
        });
    });

    // 洗牌
    for(let i=pool.length-1; i>0; i--){
        let j = Math.floor(Math.random()*(i+1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // 放入棋盘
    gameState.board = Array(ROWS).fill(0).map(()=>Array(COLS).fill(null));
    let idx = 0;
    for(let r=0; r<ROWS; r++){
        for(let c=0; c<COLS; c++){
            if(!isCamp(r,c)) {
                if(idx < pool.length) gameState.board[r][c] = pool[idx++];
            }
        }
    }

    updateRoleBadge();
    saveGame();
    renderAll(gameState.board, gameState.selected, gameState.myColor);
    updateStatus(gameState.turn, gameState.myColor);
}

// 更新角色徽章
function updateRoleBadge() {
    const badge = document.getElementById('role-badge');
    if(gameState.myColor) {
        badge.innerText = `我方: ${gameState.myColor==='red'?'红方':'绿方'}`;
        badge.className = `role-badge ${gameState.myColor}`;
    } else {
        badge.innerText = '未选色';
        badge.className = 'role-badge';
    }
}

// 处理用户输入
function handleInput(r, c) {
    if(gameState.isGameOver) return;
    if(gameState.turn !== 'none' && gameState.turn === gameState.aiColor) return;

    let p = gameState.board[r][c];

    // 翻棋
    if(p && p.hidden) {
        if(gameState.selected) {
            gameState.selected = null;
            renderAll(gameState.board, gameState.selected, gameState.myColor);
            return;
        }
        flipPiece(r, c);
        return;
    }

    // 选择己方棋子
    if(p && !p.hidden && (gameState.myColor === null || p.color === gameState.myColor)) {
        if(gameState.turn !== 'none' && p.color !== gameState.turn) return;
        gameState.selected = {r, c};
        renderAll(gameState.board, gameState.selected, gameState.myColor);
        return;
    }

    // 移动或吃子
    if(gameState.selected) {
        if(gameState.selected.r === r && gameState.selected.c === c) {
            gameState.selected = null;
            renderAll(gameState.board, gameState.selected, gameState.myColor);
            return;
        }

        let valid = canMove(gameState.selected.r, gameState.selected.c, r, c);
        if(valid) {
            movePiece(gameState.selected.r, gameState.selected.c, r, c);
        } else {
            gameState.selected = null;
            renderAll(gameState.board, gameState.selected, gameState.myColor);
        }
    }
}

function flipPiece(r, c) {
    let p = gameState.board[r][c];
    p.hidden = false;

    if(gameState.turn === 'none') {
        gameState.myColor = p.color;
        gameState.aiColor = (gameState.myColor === 'red') ? 'green' : 'red';
        updateRoleBadge();
        gameState.turn = gameState.aiColor;
    } else {
        switchTurn();
    }

    saveGame();
    renderAll(gameState.board, gameState.selected, gameState.myColor);
    updateStatus(gameState.turn, gameState.myColor);
    checkAI();
}

function movePiece(r1, c1, r2, c2) {
    let attacker = gameState.board[r1][c1];
    let defender = gameState.board[r2][c2];
    let result = 'move';

    if(defender) {
        if(attacker.type === 'zhadan' || defender.type === 'zhadan') result = 'tie';
        else if(attacker.type === 'gongbing' && defender.type === 'dilei') result = 'win';
        else if(defender.type === 'junqi') {
            // 检查是否可以扛旗（敌方地雷是否全部清除）
            if(canCaptureFlag(attacker.color)) {
                result = 'win_game';
            } else {
                result = 'move'; // 不能扛旗，只是移动
            }
        } else {
            if(attacker.rank > defender.rank) result = 'win';
            else if(attacker.rank < defender.rank) result = 'loss';
            else result = 'tie';
        }

        if(defender.type === 'dilei' && attacker.type !== 'gongbing' && attacker.type !== 'zhadan') {
            result = 'loss';
        }
    }

    // 记录移动历史
    gameState.moveHistory.push({
        from: {r: r1, c: c1}, 
        to: {r: r2, c: c2}, 
        attacker: attacker.type, 
        defender: defender ? defender.type : null, 
        result: result, 
        turn: gameState.turn 
    });

    if(result === 'win_game') {
        gameState.board[r2][c2] = attacker;
        gameState.board[r1][c1] = null;
        renderAll(gameState.board, gameState.selected, gameState.myColor);
        endGame(attacker.color);
        return;
    }

    if(result === 'move' || result === 'win') {
        gameState.board[r2][c2] = attacker;
        gameState.board[r1][c1] = null;
    } else if(result === 'loss') {
        gameState.board[r1][c1] = null;
    } else if(result === 'tie') {
        gameState.board[r1][c1] = null;
        gameState.board[r2][c2] = null;
    }

    gameState.selected = null;
    switchTurn();
    saveGame();
    renderAll(gameState.board, gameState.selected, gameState.myColor);
    updateStatus(gameState.turn, gameState.myColor);
    checkAI();
}

// 检查是否可以扛旗
function canCaptureFlag(attackerColor) {
    let enemyColor = attackerColor === 'red' ? 'green' : 'red';
    let enemyLandmines = 0;
    for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
            let p = gameState.board[r][c];
            if(p && p.color === enemyColor && p.type === 'dilei' && !p.hidden) {
                enemyLandmines++;
            }
        }
    }
    // 只有当敌方地雷全部被清除后才能扛旗
    return enemyLandmines === 0;
}

function canMove(r1, c1, r2, c2) {
    let p = gameState.board[r1][c1];
    let target = gameState.board[r2][c2];

    if(target && target.hidden) return false;
    if(target && target.color === p.color) return false;
    if(isCamp(r2,c2) && target) return false;

    // 地雷不能移动
    if(p.type === 'dilei') return false;
    // 军旗不能移动 - 绝对禁止！
    if(p.type === 'junqi') return false;
    // 地雷不能进入军营
    if(p.type === 'dilei' && isCamp(r2, c2)) return false;
    
    // 新增：军旗必须等对方地雷全灭才能吃
    if(target && target.type === 'junqi') {
        if(!canCaptureFlag(p.color)) return false;
    }

    let dr = Math.abs(r1-r2);
    let dc = Math.abs(c1-c2);

    if(dr+dc === 1) return true;

    if(isCamp(r1,c1) || isCamp(r2,c2)) {
        if(dr<=1 && dc<=1 && (dr+dc>0)) return true;
    }

    if(isRail(r1,c1) && isRail(r2,c2)) {
        if(r1 === r2) {
            if(!RAIL_ROWS.includes(r1)) return false;
            let min = Math.min(c1,c2), max = Math.max(c1,c2);
            for(let c=min+1; c<max; c++) if(gameState.board[r1][c]) return false;
            return true;
        }
        if(c1 === c2) {
            let min = Math.min(r1,r2), max = Math.max(r1,r2);
            for(let r=min+1; r<max; r++) {
                if(!isRail(r,c1)) return false;
                if(gameState.board[r][c1]) return false;
            }
            return true;
        }
    }

    return false;
}

function switchTurn() {
    gameState.turn = (gameState.turn === 'red' ? 'green' : 'red');
}

function saveGame() {
    let data = {
        board: gameState.board, 
        turn: gameState.turn, 
        myColor: gameState.myColor, 
        aiColor: gameState.aiColor, 
        isGameOver: gameState.isGameOver, 
        moveHistory: gameState.moveHistory
    };
    localStorage.setItem('xSimpleJunqi', JSON.stringify(data));
}

function resetGame() {
    localStorage.removeItem('xSimpleJunqi');
    startNewGame();
}

function endGame(winner) {
    gameState.isGameOver = true;
    let msg = document.getElementById('end-msg');
    let win = (winner === gameState.myColor);
    msg.innerText = win ? "🎉恭喜你胜利！" : "⚔️你输了！";
    document.getElementById('end-modal').style.display = 'flex';
    localStorage.removeItem('xSimpleJunqi');
}

// ===== 优化AI 系统=====
// 检查AI
function checkAI() {
    if(!gameState.isGameOver && gameState.turn === gameState.aiColor) {
        setTimeout(aiMove, 800);
    }
}

// AI 主决策函数
function aiMove() {
    if(gameState.isGameOver) return;
    aiState.startTime = Date.now();

    // 第一步：寻找所有吃子机会
    let killMoves = findKillMoves();
    if(killMoves.length > 0) {
        // 有吃子机会，选择最优的吃子
        let bestKill = selectBestKill(killMoves);
        movePiece(bestKill.r1, bestKill.c1, bestKill.r2, bestKill.c2);
        return;
    }

    // 第二步：如果没有吃子机会，考虑占军营
    let campMoves = findCampMoves();
    if(campMoves.length > 0) {
        let bestCamp = selectBestCamp(campMoves);
        movePiece(bestCamp.r1, bestCamp.c1, bestCamp.r2, bestCamp.c2);
        return;
    }

    // 第三步：考虑其他移动
    let otherMoves = findOtherMoves();
    if(otherMoves.length > 0) {
        let bestOther = selectBestOther(otherMoves);
        movePiece(bestOther.r1, bestOther.c1, bestOther.r2, bestOther.c2);
        return;
    }

    // 第四步：翻棋
    let flipMoves = findFlipMoves();
    if(flipMoves.length > 0) {
        let bestFlip = selectBestFlip(flipMoves);
        flipPiece(bestFlip.r, bestFlip.c);
        return;
    }

    // 无路可走
    endGame(gameState.myColor);
}

// 寻找吃子机会
function findKillMoves() {
    let killMoves = [];
    for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
            let p = gameState.board[r][c];
            if(p && !p.hidden && p.color === gameState.aiColor && p.type !== 'dilei' && p.type !== 'junqi') {
                // 检查所有可能的目标
                for(let r2=0; r2<ROWS; r2++) {
                    for(let c2=0; c2<COLS; c2++) {
                        if(r === r2 && c === c2) continue;
                        let target = gameState.board[r2][c2];
                        if(target && !target.hidden && target.color !== p.color) {
                            if(canMove(r, c, r2, c2)) {
                                // 评估是否能吃掉
                                let canKill = evaluateBattle(p, target);
                                if(canKill === 'win') {
                                    let score = evaluateKillValue(p, target);
                                    killMoves.push({ 
                                        r1: r, c1: c, r2: r2, c2: c2, 
                                        score: score, attacker: p, defender: target 
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return killMoves;
}

// 评估战斗结果
function evaluateBattle(attacker, defender) {
    if(attacker.type === 'zhadan' || defender.type === 'zhadan') return 'tie';
    if(attacker.type === 'gongbing' && defender.type === 'dilei') return 'win';
    if(defender.type === 'junqi') {
        // 检查是否可以扛旗
        if(canCaptureFlag(attacker.color)) {
            return 'win';
        } else {
            return 'move'; // 不能扛旗
        }
    }
    if(defender.type === 'dilei' && attacker.type !== 'gongbing' && attacker.type !== 'zhadan') return 'loss';
    if(attacker.rank > defender.rank) return 'win';
    if(attacker.rank < defender.rank) return 'loss';
    return 'tie';
}

// 评估吃子价值
function evaluateKillValue(attacker, defender) {
    let score = 0;

    // 军旗最高优先级（但只有在可以扛旗时）
    if(defender.type === 'junqi' && canCaptureFlag(attacker.color)) {
        return 10000;
    }

    // 炸弹价值很高
    if(defender.type === 'zhadan') return 2000;

    // 地雷价值（对工兵而言）
    if(defender.type === 'dilei' && attacker.type === 'gongbing') return 1500;

    // 根据军衔评估
    score += defender.rank * 100;

    // 稀有度加成
    let remaining = countPiecesByType(defender.type, defender.color);
    if(remaining <= 1) score *= 1.5;

    // 位置价值
    if(isCamp(defender.r || 0, defender.c || 0)) score += 200;
    if(isHQ(defender.r || 0, defender.c || 0)) score += 300;

    return score;
}

// 统计棋子数量
function countPiecesByType(type, color) {
    let count = 0;
    for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
            let p = gameState.board[r][c];
            if(p && p.type === type && p.color === color) {
                count++;
            }
        }
    }
    return count;
}

// 选择最佳吃子
function selectBestKill(killMoves) {
    // 按分数排序
    killMoves.sort((a, b) => b.score - a.score);

    // 优先选择吃军旗（如果可以扛旗）
    for(let move of killMoves) {
        if(move.defender.type === 'junqi' && canCaptureFlag(move.attacker.color)) {
            return move;
        }
    }

    // 其次选择吃炸弹
    for(let move of killMoves) {
        if(move.defender.type === 'zhadan') {
            return move;
        }
    }

    // 返回最高分的
    return killMoves[0];
}

// 寻找占军营机会
function findCampMoves() {
    let campMoves = [];
    for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
            let p = gameState.board[r][c];
            if(p && !p.hidden && p.color === gameState.aiColor && p.type !== 'dilei' && p.type !== 'junqi') {
                // 如果已经在军营中，检查是否有吃子机会
                if(isCamp(r, c)) {
                    let hasKillTarget = false;
                    for(let dr=-1; dr<=1; dr++) {
                        for(let dc=-1; dc<=1; dc++) {
                            if(dr===0 && dc===0) continue;
                            let nr = r + dr, nc = c + dc;
                            if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS) {
                                let target = gameState.board[nr][nc];
                                if(target && !target.hidden && target.color !== p.color) {
                                    if(canMove(r, c, nr, nc)) {
                                        let canKill = evaluateBattle(p, target);
                                        if(canKill === 'win') {
                                            hasKillTarget = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if(hasKillTarget) break;
                    }
                    // 如果没有吃子目标，不要移动
                    if(!hasKillTarget) continue;
                }

                // 寻找空的军营
                for(let r2=0; r2<ROWS; r2++) {
                    for(let c2=0; c2<COLS; c2++) {
                        if(isCamp(r2, c2) && !gameState.board[r2][c2]) {
                            if(canMove(r, c, r2, c2)) {
                                // 避免从一个军营移动到另一个军营
                                if(isCamp(r, c)) {
                                    // 检查是否是相邻的军营
                                    let isAdjacentCamp = false;
                                    for(let dr=-1; dr<=1; dr++) {
                                        for(let dc=-1; dc<=1; dc++) {
                                            if(dr===0 && dc===0) continue;
                                            let nr = r + dr, nc = c + dc;
                                            if(nr === r2 && nc === c2) {
                                                isAdjacentCamp = true;
                                                break;
                                            }
                                        }
                                        if(isAdjacentCamp) break;
                                    }
                                    if(isAdjacentCamp) continue; // 跳过相邻军营
                                }

                                let score = evaluateCampValue(p, r, c, r2, c2);
                                campMoves.push({ 
                                    r1: r, c1: c, r2: r2, c2: c2, 
                                    score: score, piece: p 
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    return campMoves;
}

// 评估军营价值
function evaluateCampValue(piece, r1, c1, r2, c2) {
    let score = 100; // 基础占营分数

    // 如果已经在军营中，降低移动到另一个军营的欲望
    if(isCamp(r1, c1)) {
        score -= 80; // 大幅降低从军营移动的欲望
    }

    // 大子更需要占营保护
    if(piece.rank >= 7) {
        score += 50;
    }

    // 军营位置价值
    let enemyHQ = gameState.aiColor === 'red' ? [[11,1],[11,3]] : [[0,1],[0,3]];
    let minDistToHQ = Math.min(...enemyHQ.map(hq => Math.abs(r2 - hq[0]) + Math.abs(c2 - hq[1]) ));
    score += (15 - minDistToHQ) * 5;

    // 避免重复占营
    let moveKey = `${r1},${c1}-${r2},${c2}`;
    if(aiState.memory.successfulMoves.has(moveKey)) {
        score -= 30;
    }

    return score;
}

// 选择最佳占营
function selectBestCamp(campMoves) {
    campMoves.sort((a, b) => b.score - a.score);
    return campMoves[0];
}

// 寻找其他移动
function findOtherMoves() {
    let otherMoves = [];
    for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
            let p = gameState.board[r][c];
            if(p && !p.hidden && p.color === gameState.aiColor && p.type !== 'dilei' && p.type !== 'junqi') {
                // 如果在军营中且没有吃子机会，不要移动
                if(isCamp(r, c)) {
                    let hasKillTarget = false;
                    for(let dr=-1; dr<=1; dr++) {
                        for(let dc=-1; dc<=1; dc++) {
                            if(dr===0 && dc===0) continue;
                            let nr = r + dr, nc = c + dc;
                            if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS) {
                                let target = gameState.board[nr][nc];
                                if(target && !target.hidden && target.color !== p.color) {
                                    if(canMove(r, c, nr, nc)) {
                                        let canKill = evaluateBattle(p, target);
                                        if(canKill === 'win') {
                                            hasKillTarget = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if(hasKillTarget) break;
                    }
                    if(!hasKillTarget) continue;
                }

                // 寻找其他移动目标
                for(let r2=0; r2<ROWS; r2++) {
                    for(let c2=0; c2<COLS; c2++) {
                        if(r === r2 && c === c2) continue;
                        if(canMove(r, c, r2, c2)) {
                            let target = gameState.board[r2][c2];
                            if(!target || (target && !target.hidden && target.color !== p.color)) {
                                let score = evaluateOtherMove(p, r, c, r2, c2);
                                otherMoves.push({ 
                                    r1: r, c1: c, r2: r2, c2: c2, 
                                    score: score, piece: p 
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    return otherMoves;
}

// 评估其他移动
function evaluateOtherMove(piece, r1, c1, r2, c2) {
    let score = 10; // 基础移动分数
    let target = gameState.board[r2][c2];

    // 关键修复：如果目标位置是军旗，必须检查是否可以扛旗
    if(target && target.type === 'junqi') {
        if(!canCaptureFlag(piece.color)) {
            return -10000; // 不能扛旗，大幅降低分数，禁止这个移动
        } else {
            return 10000; // 可以扛旗，优先级最高
        }
    }

    // 接近敌方军旗
    let enemyHQ = gameState.aiColor === 'red' ? [[11,1],[11,3]] : [[0,1],[0,3]];
    let minDistToHQ = Math.min(...enemyHQ.map(hq => Math.abs(r2 - hq[0]) + Math.abs(c2 - hq[1]) ));
    score += (15 - minDistToHQ) * 3;

    // 铁路线价值
    if(isRail(r2, c2)) score += 20;

    // 工兵特殊价值
    if(piece.type === 'gongbing') {
        score += 15;
        if(isRail(r2, c2)) score += 10;
    }

    // 避免重复移动
    let moveKey = `${r1},${c1}-${r2},${c2}`;
    if(aiState.memory.successfulMoves.has(moveKey)) {
        score -= 20;
    }

    return score;
}

// 选择最佳其他移动
function selectBestOther(otherMoves) {
    otherMoves.sort((a, b) => b.score - a.score);
    return otherMoves[0];
}

// 寻找翻棋机会
function findFlipMoves() {
    let flipMoves = [];
    for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
            if(gameState.board[r][c] && gameState.board[r][c].hidden) {
                let score = evaluateFlipPosition(r, c);
                flipMoves.push({
                    r: r, c: c, score: score 
                });
            }
        }
    }
    return flipMoves;
}

// 评估翻棋位置
function evaluateFlipPosition(r, c) {
    let score = 50 + Math.random() * 20;

    // 优先翻关键位置
    if(isCamp(r, c)) score += 30;
    if(isHQ(r, c)) score += 25;
    if(isRail(r, c)) score += 15;

    return score;
}

// 选择最佳翻棋
function selectBestFlip(flipMoves) {
    flipMoves.sort((a, b) => b.score - a.score);
    return flipMoves[0];
}

// 启动游戏
init();
