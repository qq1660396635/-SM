// 游戏状态
const GameState = {
    INIT: 'init',
    DEALING: 'dealing',
    BIDDING: 'bidding',
    PLAYING: 'playing',
    FINISHED: 'finished'
};

// 牌型定义
const CardType = {
    SINGLE: 'single',           // 单张
    PAIR: 'pair',               // 对子
    THREE: 'three',             // 三张
    THREE_WITH_ONE: 'three_with_one',  // 三带一
    THREE_WITH_PAIR: 'three_with_pair', // 三带二
    STRAIGHT: 'straight',       // 顺子
    PAIR_STRAIGHT: 'pair_straight', // 连对
    PLANE: 'plane',             // 飞机
    PLANE_WITH_SINGLE: 'plane_with_single',   // 飞机带单
    PLANE_WITH_PAIR: 'plane_with_pair',     // 飞机带对
    BOMB: 'bomb',               // 炸弹
    ROCKET: 'rocket'            // 王炸
};

class CompactLandlordsGame {
    constructor() {
        this.state = GameState.INIT;
        this.deck = [];
        this.playerCards = [];
        this.ai1Cards = [];
        this.ai2Cards = [];
        this.dizhuCards = [];
        this.currentPlayer = 0;
        this.dizhu = -1;
        this.currentCards = [];
        this.lastPlayer = -1;
        this.lastCards = [];
        this.lastCardType = null;
        this.selectedCards = [];
        this.bidOrder = 0;
        this.bidScore = 0;
        this.passCount = 0; // 记录连续pass次数
        
        this.init();
    }

    init() {
        this.createDeck();
        this.render();
        this.bindEvents();
        this.checkOrientation();
    }

    createDeck() {
        this.deck = [];
        const suits = ['♠', '♥', '♣', '♦'];
        const values = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
        
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    suit: suit,
                    value: value,
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                    weight: this.getCardWeight(value)
                });
            }
        }
        
        this.deck.push({ suit: '', value: '小王', color: 'black', weight: 16 });
        this.deck.push({ suit: '', value: '大王', color: 'red', weight: 17 });
    }

    getCardWeight(value) {
        const weights = {
            '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
            '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15
        };
        return weights[value] || 0;
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    async autoDealCards() {
        this.state = GameState.DEALING;
        this.showDealingAnimation(true);
        
        // 清空手牌
        this.playerCards = [];
        this.ai1Cards = [];
        this.ai2Cards = [];
        this.dizhuCards = [];
        this.selectedCards = [];
        this.currentCards = [];
        this.lastCards = [];
        this.lastCardType = null;
        this.dizhu = -1;
        this.currentPlayer = 0;
        this.lastPlayer = -1;
        this.bidOrder = 0;
        this.bidScore = 0;
        this.passCount = 0;
        
        this.shuffle();
        
        // 快速发牌动画
        for (let i = 0; i < 51; i++) {
            const card = this.deck[i];
            if (i % 3 === 0) this.playerCards.push(card);
            else if (i % 3 === 1) this.ai1Cards.push(card);
            else this.ai2Cards.push(card);
            
            // 每发几张牌更新一次显示
            if (i % 6 === 0) {
                this.render();
                await this.delay(50);
            }
        }
        
        // 发底牌
        for (let i = 51; i < 54; i++) {
            this.dizhuCards.push(this.deck[i]);
        }
        
        // 排序
        this.sortCards(this.playerCards);
        this.sortCards(this.ai1Cards);
        this.sortCards(this.ai2Cards);
        
        this.state = GameState.BIDDING;
        this.currentPlayer = Math.floor(Math.random() * 3);
        
        this.showDealingAnimation(false);
        this.render();
        this.showStatusMessage("开始抢地主");
        this.startBidding();
    }

    sortCards(cards) {
        cards.sort((a, b) => a.weight - b.weight);
    }

    bidLandlord(player, bid) {
        if (bid) {
            this.dizhu = player;
            this.bidScore++;
            
            // 地主获得底牌
            if (player === 0) {
                this.playerCards.push(...this.dizhuCards);
                this.sortCards(this.playerCards);
            } else if (player === 1) {
                this.ai1Cards.push(...this.dizhuCards);
                this.sortCards(this.ai1Cards);
            } else {
                this.ai2Cards.push(...this.dizhuCards);
                this.sortCards(this.ai2Cards);
            }
            
            this.state = GameState.PLAYING;
            this.currentPlayer = player;
            this.showStatusMessage(`${this.getPlayerName(player)} 成为地主！`);
        } else {
            this.bidOrder++;
            this.currentPlayer = (this.currentPlayer + 1) % 3;
            
            if (this.bidOrder >= 3) {
                this.showStatusMessage("无人抢地主，重新发牌");
                setTimeout(() => {
                    this.autoDealCards();
                }, 1500);
                return;
            }
        }
    }

    aiBidDecision(aiPlayer) {
        const cards = aiPlayer === 1 ? this.ai1Cards : this.ai2Cards;
        let score = 0;
        
        for (let card of cards) {
            if (card.value === '2') score += 2;
            if (card.value === '小王') score += 3;
            if (card.value === '大王') score += 4;
            if (card.weight >= 14) score += 1;
        }
        
        const cardCount = {};
        for (let card of cards) {
            cardCount[card.value] = (cardCount[card.value] || 0) + 1;
        }
        
        for (let value in cardCount) {
            if (cardCount[value] >= 4) {
                score += 5;
            }
        }
        
        const threshold = 8 + cards.length * 0.5;
        return score >= threshold;
    }

    // 识别牌型 - 完整版（包含飞机）
    getCardType(cards) {
        if (!cards || cards.length === 0) return null;
        
        const len = cards.length;
        
        // 先按值分组
        const valueGroups = {};
        for (let card of cards) {
            if (!valueGroups[card.value]) {
                valueGroups[card.value] = [];
            }
            valueGroups[card.value].push(card);
        }
        
        const values = Object.keys(valueGroups);
        const counts = values.map(v => valueGroups[v].length);
        
        // 单张
        if (len === 1) {
            return { type: CardType.SINGLE, weight: cards[0].weight, cards: cards };
        }
        
        // 对子
        if (len === 2 && counts.length === 1 && counts[0] === 2) {
            return { type: CardType.PAIR, weight: cards[0].weight, cards: cards };
        }
        
        // 王炸
        if (len === 2 && values.includes('小王') && values.includes('大王')) {
            return { type: CardType.ROCKET, weight: 100, cards: cards };
        }
        
        // 三张
        if (len === 3 && counts.length === 1 && counts[0] === 3) {
            return { type: CardType.THREE, weight: cards[0].weight, cards: cards };
        }
        
        // 炸弹
        if (len === 4 && counts.length === 1 && counts[0] === 4) {
            return { type: CardType.BOMB, weight: cards[0].weight, cards: cards };
        }
        
        // 三带一
        if (len === 4 && counts.includes(3) && counts.includes(1)) {
            const threeValue = values.find(v => valueGroups[v].length === 3);
            return { type: CardType.THREE_WITH_ONE, weight: this.getCardWeight(threeValue), cards: cards };
        }
        
        // 三带二
        if (len === 5 && counts.includes(3) && counts.includes(2)) {
            const threeValue = values.find(v => valueGroups[v].length === 3);
            return { type: CardType.THREE_WITH_PAIR, weight: this.getCardWeight(threeValue), cards: cards };
        }
        
        // 飞机（两个三张）
        if (len === 6 && counts.filter(c => c === 3).length === 2) {
            const threes = values.filter(v => valueGroups[v].length === 3);
            const weights = threes.map(v => this.getCardWeight(v)).sort((a, b) => a - b);
            if (weights[1] - weights[0] === 1 && weights[0] < 15) { // 连续且小于2
                return { type: CardType.PLANE, weight: weights[0], cards: cards };
            }
        }
        
        // 飞机带单张（两个三张带两个单张）
        if (len === 8 && counts.filter(c => c === 3).length === 2 && counts.filter(c => c === 1).length === 2) {
            const threes = values.filter(v => valueGroups[v].length === 3);
            const weights = threes.map(v => this.getCardWeight(v)).sort((a, b) => a - b);
            if (weights[1] - weights[0] === 1 && weights[0] < 15) { // 连续且小于2
                return { type: CardType.PLANE_WITH_SINGLE, weight: weights[0], cards: cards };
            }
        }
        
        // 飞机带对子（两个三张带两个对子）
        if (len === 10 && counts.filter(c => c === 3).length === 2 && counts.filter(c => c === 2).length === 2) {
            const threes = values.filter(v => valueGroups[v].length === 3);
            const weights = threes.map(v => this.getCardWeight(v)).sort((a, b) => a - b);
            if (weights[1] - weights[0] === 1 && weights[0] < 15) { // 连续且小于2
                return { type: CardType.PLANE_WITH_PAIR, weight: weights[0], cards: cards };
            }
        }
        
        // 顺子（5张或更多连续单张）
        if (len >= 5 && counts.every(c => c === 1)) {
            const weights = values.map(v => this.getCardWeight(v)).sort((a, b) => a - b);
            let isStraight = true;
            for (let i = 1; i < weights.length; i++) {
                if (weights[i] - weights[i-1] !== 1 || weights[i] >= 15) { // 不能包含2和王
                    isStraight = false;
                    break;
                }
            }
            if (isStraight) {
                return { type: CardType.STRAIGHT, weight: weights[0], cards: cards };
            }
        }
        
        // 连对（3对或更多连续对子）
        if (len >= 6 && len % 2 === 0 && counts.every(c => c === 2)) {
            const weights = values.map(v => this.getCardWeight(v)).sort((a, b) => a - b);
            let isPairStraight = true;
            for (let i = 1; i < weights.length; i++) {
                if (weights[i] - weights[i-1] !== 1 || weights[i] >= 15) { // 不能包含2和王
                    isPairStraight = false;
                    break;
                }
            }
            if (isPairStraight) {
                return { type: CardType.PAIR_STRAIGHT, weight: weights[0], cards: cards };
            }
        }
        
        return null;
    }

    // 检查出牌是否合法 - 修复版
    isValidPlay(cards, lastCards, lastCardType, lastPlayer, currentPlayer) {
        if (!cards || cards.length === 0) return false;
        
        const currentType = this.getCardType(cards);
        if (!currentType) return false;
        
        // 如果是第一个出牌或者轮到自己重新出牌
        if (!lastCards || lastCards.length === 0 || lastPlayer === currentPlayer) {
            return true;
        }
        
        // 王炸可以管任何牌
        if (currentType.type === CardType.ROCKET) {
            return true;
        }
        
        // 炸弹可以管非炸弹牌型
        if (currentType.type === CardType.BOMB) {
            if (lastCardType.type !== CardType.BOMB && lastCardType.type !== CardType.ROCKET) {
                return true;
            }
            // 炸弹对炸弹，比大小
            if (lastCardType.type === CardType.BOMB) {
                return currentType.weight > lastCardType.weight;
            }
            return false;
        }
        
        // 相同牌型比大小
        if (currentType.type === lastCardType.type && cards.length === lastCards.length) {
            return currentType.weight > lastCardType.weight;
        }
        
        return false;
    }

    playCards(player, cards) {
        if (cards.length === 0) {
            // 不出
            this.passCount++;
            this.showStatusMessage(`${this.getPlayerName(player)} 不出`);
            
            // 如果连续两个人pass，重置出牌状态
            if (this.passCount >= 2) {
                this.lastCards = [];
                this.lastCardType = null;
                this.lastPlayer = -1;
                this.passCount = 0;
                this.showStatusMessage("新一轮开始");
            }
            
            this.currentPlayer = (this.currentPlayer + 1) % 3;
            return;
        }
        
        // 检查出牌是否合法
        if (!this.isValidPlay(cards, this.lastCards, this.lastCardType, this.lastPlayer, player)) {
            this.showStatusMessage("出牌不合法！");
            return;
        }
        
        // 出牌成功
        this.currentCards = cards;
        this.lastPlayer = player;
        this.lastCards = [...cards];
        this.lastCardType = this.getCardType(cards);
        this.passCount = 0; // 重置pass计数
        
        if (player === 0) {
            this.removeCardsFromHand(this.playerCards, cards);
        } else if (player === 1) {
            this.removeCardsFromHand(this.ai1Cards, cards);
        } else {
            this.removeCardsFromHand(this.ai2Cards, cards);
        }
        
        this.showStatusMessage(`${this.getPlayerName(player)} 出牌`);
        
        // 检查游戏结束
        const winner = this.checkGameEnd();
        if (winner) {
            return;
        }
    }

    removeCardsFromHand(hand, cardsToRemove) {
        for (let card of cardsToRemove) {
            const index = hand.findIndex(c => 
                c.value === card.value && c.suit === card.suit
            );
            if (index !== -1) {
                hand.splice(index, 1);
            }
        }
    }

    // AI出牌决策 - 完善版
    aiPlayDecision(aiPlayer) {
        const cards = aiPlayer === 1 ? this.ai1Cards : this.ai2Cards;
        if (cards.length === 0) return [];
        
        // 如果是第一个出牌或者自己出的牌，出最小的单张
        if (!this.lastCards || this.lastCards.length === 0 || this.lastPlayer === aiPlayer) {
            return [cards[0]];
        }
        
        // 分析手牌
        const cardGroups = this.analyzeCards(cards);
        
        // 尝试找到能管上家的牌
        if (this.lastCardType) {
            switch (this.lastCardType.type) {
                case CardType.SINGLE:
                    // 找单张
                    for (let card of cards) {
                        if (card.weight > this.lastCardType.weight) {
                            return [card];
                        }
                    }
                    // 检查有没有炸弹
                    for (let bomb of cardGroups.bombs) {
                        return bomb;
                    }
                    // 检查王炸
                    if (cardGroups.rocket) {
                        return cardGroups.rocket;
                    }
                    break;
                    
                case CardType.PAIR:
                    // 找对子
                    for (let pair of cardGroups.pairs) {
                        if (pair[0].weight > this.lastCardType.weight) {
                            return pair;
                        }
                    }
                    // 检查炸弹
                    for (let bomb of cardGroups.bombs) {
                        return bomb;
                    }
                    // 检查王炸
                    if (cardGroups.rocket) {
                        return cardGroups.rocket;
                    }
                    break;
                    
                case CardType.THREE:
                    // 找三张
                    for (let three of cardGroups.threes) {
                        if (three[0].weight > this.lastCardType.weight) {
                            return three;
                        }
                    }
                    // 检查炸弹
                    for (let bomb of cardGroups.bombs) {
                        return bomb;
                    }
                    // 检查王炸
                    if (cardGroups.rocket) {
                        return cardGroups.rocket;
                    }
                    break;
                    
                case CardType.PLANE:
                    // 找飞机
                    for (let plane of cardGroups.planes) {
                        if (plane.weight > this.lastCardType.weight) {
                            return plane.cards;
                        }
                    }
                    // 检查炸弹
                    for (let bomb of cardGroups.bombs) {
                        return bomb;
                    }
                    // 检查王炸
                    if (cardGroups.rocket) {
                        return cardGroups.rocket;
                    }
                    break;
                    
                case CardType.BOMB:
                    // 只有用更大的炸弹或王炸才能管
                    for (let bomb of cardGroups.bombs) {
                        if (bomb[0].weight > this.lastCardType.weight) {
                            return bomb;
                        }
                    }
                    // 检查王炸
                    if (cardGroups.rocket) {
                        return cardGroups.rocket;
                    }
                    break;
            }
        }
        
        // 没有能管上的牌
        return [];
    }

    // 分析手牌，分组 - 完善版
    analyzeCards(cards) {
        const groups = {
            singles: [],
            pairs: [],
            threes: [],
            planes: [],      // 飞机
            bombs: [],
            rocket: null
        };
        
        // 按值分组
        const valueGroups = {};
        for (let card of cards) {
            if (!valueGroups[card.value]) {
                valueGroups[card.value] = [];
            }
            valueGroups[card.value].push(card);
        }
        
        // 分类
        const threes = [];
        for (let value in valueGroups) {
            const group = valueGroups[value];
            if (group.length === 1) {
                groups.singles.push(group[0]);
            } else if (group.length === 2) {
                groups.pairs.push(group);
            } else if (group.length === 3) {
                groups.threes.push(group);
                threes.push({ value: value, weight: this.getCardWeight(value), cards: group });
            } else if (group.length === 4) {
                groups.bombs.push(group);
            }
        }
        
        // 检查飞机（连续的三张）
        if (threes.length >= 2) {
            threes.sort((a, b) => a.weight - b.weight);
            for (let i = 0; i < threes.length - 1; i++) {
                if (threes[i+1].weight - threes[i].weight === 1 && threes[i].weight < 15) {
                    groups.planes.push({
                        weight: threes[i].weight,
                        cards: [...threes[i].cards, ...threes[i+1].cards]
                    });
                }
            }
        }
        
        // 检查王炸
        const smallJoker = cards.find(c => c.value === '小王');
        const bigJoker = cards.find(c => c.value === '大王');
        if (smallJoker && bigJoker) {
            groups.rocket = [smallJoker, bigJoker];
        }
        
        // 排序
        groups.singles.sort((a, b) => a.weight - b.weight);
        groups.pairs.sort((a, b) => a[0].weight - b[0].weight);
        groups.threes.sort((a, b) => a[0].weight - b[0].weight);
        groups.bombs.sort((a, b) => a[0].weight - b[0].weight);
        
        return groups;
    }

    checkGameEnd() {
        if (this.playerCards.length === 0) {
            this.state = GameState.FINISHED;
            this.showStatusMessage("🎉恭喜您赢了！");
            return 'player';
        } else if (this.ai1Cards.length === 0) {
            this.state = GameState.FINISHED;
            this.showStatusMessage("AI1 赢了！");
            return 'ai1';
        } else if (this.ai2Cards.length === 0) {
            this.state = GameState.FINISHED;
            this.showStatusMessage("AI2 赢了！");
            return 'ai2';
        }
        return null;
    }

    getPlayerName(player) {
        const names = ['您', 'AI1', 'AI2'];
        return names[player];
    }

    render() {
        this.renderPlayerCards();
        this.renderAICards();
        this.renderDizhuCards();
        this.renderCurrentCards();
        this.updateUI();
    }

    renderPlayerCards() {
        const container = document.getElementById('playerCards');
        const playerStatus = document.getElementById('playerStatus');
        
        container.innerHTML = '';
        playerStatus.textContent = `${this.playerCards.length}张`;
        
        for (let i = 0; i < this.playerCards.length; i++) {
            const card = this.playerCards[i];
            const isSelected = this.selectedCards.some(c => 
                c.value === card.value && c.suit === card.suit
            );
            
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.color} ${isSelected ? 'selected' : ''}`;
            cardElement.dataset.value = card.value;
            cardElement.dataset.suit = card.suit;
            
            if (card.value === '小王' || card.value === '大王') {
                cardElement.innerHTML = `<div class="card-value">${card.value}</div>`;
            } else {
                cardElement.innerHTML = `
                    <div class="card-value">${card.value}</div>
                    <div class="card-suit">${card.suit}</div>
                `;
            }
            
            // 修复：确保点击事件正确绑定
            cardElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCardSelect(card);
            });
            
            container.appendChild(cardElement);
        }
    }

    renderAICards() {
        // AI1
        const ai1Container = document.getElementById('ai1Cards');
        const ai1Status = document.getElementById('ai1Status');
        ai1Container.innerHTML = '';
        
        for (let i = 0; i < this.ai1Cards.length; i++) {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-back';
            cardElement.textContent = '';
            ai1Container.appendChild(cardElement);
        }
        ai1Status.textContent = `${this.ai1Cards.length}张`;
        
        // AI2
        const ai2Container = document.getElementById('ai2Cards');
        const ai2Status = document.getElementById('ai2Status');
        ai2Container.innerHTML = '';
        
        for (let i = 0; i < this.ai2Cards.length; i++) {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-back';
            cardElement.textContent = '';
            ai2Container.appendChild(cardElement);
        }
        ai2Status.textContent = `${this.ai2Cards.length}张`;
    }

    renderDizhuCards() {
        const container = document.getElementById('dizhuCards');
        container.innerHTML = '';
        
        if (this.dizhu === -1) {
            for (let i = 0; i < 3; i++) {
                const cardElement = document.createElement('div');
                cardElement.className = 'card back';
                cardElement.textContent = '?';
                container.appendChild(cardElement);
            }
        } else {
            for (let card of this.dizhuCards) {
                const cardElement = document.createElement('div');
                cardElement.className = `card ${card.color}`;
                
                if (card.value === '小王' || card.value === '大王') {
                    cardElement.innerHTML = `<div class="card-value">${card.value}</div>`;
                } else {
                    cardElement.innerHTML = `
                        <div class="card-value">${card.value}</div>
                        <div class="card-suit">${card.suit}</div>
                    `;
                }
                container.appendChild(cardElement);
            }
        }
    }

    renderCurrentCards() {
        const container = document.getElementById('currentCards');
        container.innerHTML = '';
        
        if (this.currentCards.length === 0) {
            container.innerHTML = '<div style="color: #b0bec5; font-size: 0.9rem;">暂无出牌</div>';
            return;
        }
        
        for (let card of this.currentCards) {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.color}`;
            
            if (card.value === '小王' || card.value === '大王') {
                cardElement.innerHTML = `<div class="card-value">${card.value}</div>`;
            } else {
                cardElement.innerHTML = `
                    <div class="card-value">${card.value}</div>
                    <div class="card-suit">${card.suit}</div>
                `;
            }
            container.appendChild(cardElement);
        }
    }

    updateUI() {
        const currentTurn = document.getElementById('currentTurn');
        const dizhuInfo = document.getElementById('dizhuInfo');
        const startBtn = document.getElementById('startBtn');
        const bidBtn = document.getElementById('bidBtn');
        const noBidBtn = document.getElementById('noBidBtn');
        const playBtn = document.getElementById('playBtn');
        const passBtn = document.getElementById('passBtn');
        
        // 更新回合信息
        let turnText = '';
        let dizhuText = '地主: 未定';
        
        switch (this.state) {
            case GameState.INIT:
                turnText = '点击开始游戏';
                startBtn.disabled = false;
                break;
            case GameState.DEALING:
                turnText = '发牌中...';
                startBtn.disabled = true;
                break;
            case GameState.BIDDING:
                const bidNames = ['您', 'AI1', 'AI2'];
                turnText = `${bidNames[this.currentPlayer]}抢地主`;
                
                if (this.currentPlayer === 0) {
                    bidBtn.disabled = false;
                    bidBtn.className = 'game-btn btn-bid';
                    noBidBtn.disabled = false;
                    noBidBtn.className = 'game-btn btn-bid';
                } else {
                    bidBtn.disabled = true;
                    bidBtn.className = 'game-btn btn-bid btn-disabled';
                    noBidBtn.disabled = true;
                    noBidBtn.className = 'game-btn btn-bid btn-disabled';
                }
                break;
            case GameState.PLAYING:
                const playNames = ['您', 'AI1', 'AI2'];
                turnText = `${playNames[this.currentPlayer]}出牌`;
                
                if (this.currentPlayer === 0) {
                    playBtn.disabled = this.selectedCards.length === 0;
                    playBtn.className = playBtn.disabled ? 
                        'game-btn btn-play btn-disabled' : 'game-btn btn-play';
                    passBtn.disabled = this.lastPlayer === 0;
                    passBtn.className = passBtn.disabled ? 
                        'game-btn btn-pass btn-disabled' : 'game-btn btn-pass';
                } else {
                    playBtn.disabled = true;
                    playBtn.className = 'game-btn btn-play btn-disabled';
                    passBtn.disabled = true;
                    passBtn.className = 'game-btn btn-pass btn-disabled';
                }
                break;
            case GameState.FINISHED:
                turnText = '游戏结束';
                startBtn.textContent = '重新开始';
                startBtn.disabled = false;
                break;
        }
        
        if (this.dizhu !== -1) {
            const names = ['您', 'AI1', 'AI2'];
            dizhuText = `地主: ${names[this.dizhu]}`;
        }
        
        currentTurn.textContent = turnText;
        dizhuInfo.textContent = dizhuText;
    }

    toggleCardSelect(card) {
        // 修复：确保只有在正确的状态下才能选择牌
        if (this.state !== GameState.PLAYING || this.currentPlayer !== 0) {
            return;
        }
        
        const index = this.selectedCards.findIndex(c => 
            c.value === card.value && c.suit === card.suit
        );
        
        if (index === -1) {
            this.selectedCards.push(card);
        } else {
            this.selectedCards.splice(index, 1);
        }
        
        this.updateUI();
        this.renderPlayerCards();
    }

    startBidding() {
        this.nextBiddingStep();
    }

    nextBiddingStep() {
        if (this.state !== GameState.BIDDING) return;
        
        if (this.dizhu !== -1) {
            this.state = GameState.PLAYING;
            this.render();
            return;
        }
        
        if (this.bidOrder >= 3) {
            setTimeout(() => {
                this.autoDealCards();
            }, 1500);
            return;
        }
        
        if (this.currentPlayer !== 0) {
            setTimeout(() => {
                const aiDecision = this.aiBidDecision(this.currentPlayer);
                const playerName = this.getPlayerName(this.currentPlayer);
                this.showStatusMessage(`${playerName}${aiDecision ? '抢地主' : '不抢'}`);
                
                setTimeout(() => {
                    this.bidLandlord(this.currentPlayer, aiDecision);
                    this.render();
                    this.nextBiddingStep();
                }, 1000);
            }, 800);
        }
    }

    aiTurn() {
        if (this.state !== GameState.PLAYING) return;
        
        if (this.currentPlayer === 1) {
            setTimeout(() => {
                const cardsToPlay = this.aiPlayDecision(1);
                this.playCards(1, cardsToPlay);
                this.currentPlayer = 2;
                this.render();
                
                if (this.checkGameEnd()) return;
                
                setTimeout(() => {
                    const cardsToPlay2 = this.aiPlayDecision(2);
                    this.playCards(2, cardsToPlay2);
                    this.currentPlayer = 0;
                    this.render();
                    this.checkGameEnd();
                }, 800);
            }, 600);
        } else if (this.currentPlayer === 2) {
            setTimeout(() => {
                const cardsToPlay = this.aiPlayDecision(2);
                this.playCards(2, cardsToPlay);
                this.currentPlayer = 0;
                this.render();
                this.checkGameEnd();
            }, 600);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showDealingAnimation(show) {
        const animation = document.getElementById('dealingAnimation');
        const text = document.getElementById('dealingText');
        
        if (show) {
            animation.classList.add('show');
            let dots = 0;
            this.dealingInterval = setInterval(() => {
                dots = (dots + 1) % 4;
                text.textContent = '发牌中' + '.'.repeat(dots);
            }, 500);
        } else {
            animation.classList.remove('show');
            if (this.dealingInterval) {
                clearInterval(this.dealingInterval);
            }
        }
    }

    showStatusMessage(message) {
        const status = document.getElementById('statusMessage');
        status.textContent = message;
        status.classList.add('show');
        
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.autoDealCards();
        });
        
        document.getElementById('bidBtn').addEventListener('click', () => {
            this.bidLandlord(0, true);
            this.render();
            this.nextBiddingStep();
        });
        
        document.getElementById('noBidBtn').addEventListener('click', () => {
            this.bidLandlord(0, false);
            this.render();
            this.nextBiddingStep();
        });
        
        document.getElementById('playBtn').addEventListener('click', () => {
            if (this.selectedCards.length === 0) return;
            
            // 检查玩家出牌是否合法
            if (!this.isValidPlay(this.selectedCards, this.lastCards, this.lastCardType, this.lastPlayer, 0)) {
                this.showStatusMessage("出牌不合法！");
                return;
            }
            
            this.playCards(0, [...this.selectedCards]);
            this.selectedCards = [];
            this.currentPlayer = 1;
            this.render();
            this.aiTurn();
        });
        
        document.getElementById('passBtn').addEventListener('click', () => {
            this.playCards(0, []);
            this.currentPlayer = 1;
            this.render();
            this.aiTurn();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.state = GameState.INIT;
            this.playerCards = [];
            this.ai1Cards = [];
            this.ai2Cards = [];
            this.dizhuCards = [];
            this.selectedCards = [];
            this.currentCards = [];
            this.lastCards = [];
            this.lastCardType = null;
            this.dizhu = -1;
            this.currentPlayer = 0;
            this.lastPlayer = -1;
            this.bidOrder = 0;
            this.bidScore = 0;
            this.passCount = 0;
            
            this.showDealingAnimation(false);
            this.render();
            this.showStatusMessage("游戏已重置");
        });
        
        document.getElementById('continueBtn').addEventListener('click', () => {
            document.getElementById('landscapeNotice').classList.remove('show');
        });
        
        window.addEventListener('orientationchange', () => {
            this.checkOrientation();
        });
        
        window.addEventListener('resize', () => {
            this.checkOrientation();
        });
    }

    checkOrientation() {
        const notice = document.getElementById('landscapeNotice');
        if (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) {
            notice.classList.add('show');
        } else {
            notice.classList.remove('show');
        }
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CompactLandlordsGame();
});
