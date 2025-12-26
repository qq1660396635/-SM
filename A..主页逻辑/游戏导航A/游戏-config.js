window.toolsConfig = {
  tools: [
    { "name": "XSS动画演示", "file": "1_XSS动画演示.html", "icon": "🛡️", "description": "XSS攻击原理动画演示" },
    { "name": "黑客模拟器", "file": "2_黑客模拟器.html", "icon": "💻", "description": "模拟黑客操作体验" },
    { "name": "烧脑探案集", "file": "3_烧脑探案集.html", "icon": "🕵️", "description": "挑战智力的探案解谜游戏" },
    { "name": "今天去哪玩", "file": "4_今天去哪玩.html", "icon": "🧭", "description": "随机生成出行目的地推荐" },
    { "name": "修仙模拟器", "file": "5_修仙模拟器.html", "icon": "🧘", "description": "体验修仙之路，修炼成仙" },
    { "name": "塔罗牌占卜", "file": "6_塔罗牌占卜.html", "icon": "🔮", "description": "在线塔罗牌占卜，预测你的运势" },
    { "name": "萌球挤压", "file": "7_萌球挤压.html", "icon": "🎈", "description": "趣味挤压解压小游戏" },
    { "name": "模拟战场", "file": "8_模拟战场.html", "icon": "🎮", "description": "虚拟战场模拟游戏" },
    { "name": "窄路挑战", "file": "9_窄路挑战.html", "icon": "🛣️", "description": "挑战极限的窄路驾驶游戏" },
    { "name": "格斗对战", "file": "10_格斗对战.html", "icon": "🥊", "description": "刺激的格斗对战游戏" },
    { "name": "小鸟飞行", "file": "11_小鸟飞行.html", "icon": "🐦", "description": "小鸟飞行闯关游戏" },
    { "name": "雪人游戏", "file": "21.雪人/雪人游戏.html", "icon": "⛄", "description": "堆雪人趣味游戏" },
    { "name": "寻找科比", "file": "12_寻找科比.html", "icon": "🏀", "description": "在人群中寻找科比·布莱恩特" },
    { "name": "雷达模拟器", "file": "13_雷达模拟器.html", "icon": "📡", "description": "模拟雷达扫描与目标追踪" },
    { "name": "宠物养成", "file": "14_qpet.html", "icon": "🐶", "description": "虚拟宠物养成游戏" },
    
  ],

  getAllTools() { return this.tools; },
  getGradients() { return this.gradients; },
  getRandomGradient() { return this.gradients[Math.floor(Math.random() * this.gradients.length)]; }
};
