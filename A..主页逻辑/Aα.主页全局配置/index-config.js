window.gameConfig = {
    // 导航工具 - 固定在前面
    navigations: [
        { name: '工具导航', file: 'B..导航逻辑/导航配置/1.工具导航.html', icon: '🛠️', category: 'navigation', fixed: true, description: '常用工具集合' },
        { name: '搜索导航', file: 'B..导航逻辑/导航配置/2.搜索导航.html', icon: '🔍', category: 'navigation', fixed: true, description: '搜索聚合导航' },
        { name: '脚本导航', file: 'B..导航逻辑/3.脚本中心/3.脚本导航.html', icon: '📁', category: 'navigation', fixed: true, description: '脚本中心导航' },
        { name: '快速抵达', file: 'A2_全局中心/全局导航/1_用户自定义导航.html', icon: '⚡', category: 'navigation', fixed: true, description: '快捷导航入口' },
        { name: '游戏导航', file: 'A..主页逻辑/游戏导航A/游戏导航.html', icon: '🎮', category: 'navigation', fixed: true, description: '游戏集合导航' },
        { name: '棋类游戏导航', file: 'A..主页逻辑/游戏导航B_棋类/游戏导航B.html', icon: '♟️', category: 'navigation', fixed: true, description: '棋类游戏导航' }
    ],
    
    // 二级导航配置
    secondaryNav: {
        name: '小世界',
        file: 'B..导航逻辑/导航配置/二级导航.html',
        title: '二级导航'
    },
    
    // 脚本网站B 合集 - 修正文件夹名称
    siteB: [
        { name: '消消乐', file: 'A..主页逻辑/脚本网站B_合集_单页面/01_消消乐.html', category: 'siteB' },
        { name: '推箱子', file: 'A..主页逻辑/脚本网站B_合集_单页面/02_推箱子.html', category: 'siteB' },
        { name: '俄罗斯方块', file: 'A..主页逻辑/脚本网站B_合集_单页面/03_俄罗斯方块.html', category: 'siteB' },
        { name: '打地鼠', file: 'A..主页逻辑/脚本网站B_合集_单页面/04_打地鼠.html', category: 'siteB' },
        { name: '点灯游戏', file: 'A..主页逻辑/脚本网站B_合集_单页面/05_点灯游戏.html', category: 'siteB' },
        { name: '飞机大战', file: 'A..主页逻辑/脚本网站B_合集_单页面/06.飞机大战.html', category: 'siteB' },
        { name: '跳一跳', file: 'A..主页逻辑/脚本网站B_合集_单页面/07_跳一跳.html', category: 'siteB' },
        { name: '星际逃生', file: 'A..主页逻辑/脚本网站B_合集_单页面/08_星际逃生.html', category: 'siteB' },
        { name: '切水果', file: 'A..主页逻辑/脚本网站B_合集_单页面/09_切水果.html', category: 'siteB' },
        { name: '塔防游戏', file: 'A..主页逻辑/脚本网站B_合集_单页面/10_塔防游戏.html', category: 'siteB' },
        { name: '打砖块max', file: 'A..主页逻辑/脚本网站B_合集_单页面/11_打砖块max.html', category: 'siteB' },
        { name: '尼姆博弈', file: 'A..主页逻辑/脚本网站B_合集_单页面/12_尼姆博弈.html', category: 'siteB' },
        { name: '台球', file: 'A..主页逻辑/脚本网站B_合集_单页面/13_台球.html', category: 'siteB' }
    ],
    
    // 脚本网站C 合集 - 修正文件夹名称
    siteC: [
        { name: '记忆翻牌大师', file: 'A..主页逻辑/脚本网站C_合集_单页面/14_记忆翻牌大师.html', category: 'siteC' },
        { name: '坦克大战', file: 'A..主页逻辑/脚本网站C_合集_单页面/15_坦克大战.html', category: 'siteC' },
        { name: '跳棋', file: 'A..主页逻辑/脚本网站C_合集_单页面/16_跳棋［后端算法暂未优化］.html', category: 'siteC' },
        { name: '3D迷宫', file: 'A..主页逻辑/脚本网站C_合集_单页面/17_3D迷宫「1.2版」.html', category: 'siteC' },
        { name: '32关跑酷', file: 'A..主页逻辑/脚本网站C_合集_单页面/18_32关跑酷.html', category: 'siteC' },
        { name: '迷宫逃离', file: 'A..主页逻辑/脚本网站C_合集_单页面/19_迷宫逃离.html', category: 'siteC' },
        { name: '猜黑红', file: 'A..主页逻辑/脚本网站C_合集_单页面/20_猜黑红.html', category: 'siteC' },
        { name: '青蛙过河', file: 'A..主页逻辑/脚本网站C_合集_单页面/21_青蛙过河.html', category: 'siteC' },
        { name: '太阳系模拟器', file: 'A..主页逻辑/脚本网站C_合集_单页面/22_太阳系模拟器.html', category: 'siteC' },
        { name: '斗兽棋', file: 'A..主页逻辑/脚本网站C_合集_单页面/23_斗兽棋［算法未引入］.html', category: 'siteC' },
        { name: '军棋', file: 'A..主页逻辑/脚本网站C_合集_单页面/24_军棋（算法未引入）.html', category: 'siteC' },
        { name: '个人网站', file: 'A..主页逻辑/脚本网站C_合集_单页面/25_个人网站.html', category: 'siteC' },
        { name: '自定义转盘', file: 'A..主页逻辑/脚本网站C_合集_单页面/26_自定义转盘.html', category: 'siteC' }
    ],
    
    // 脚本网站D 合集 - 修正文件夹名称和分类错误
    siteD: [
        { name: '生命游戏', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/1_生命游戏「规则！」.html', category: 'siteD' },
        { name: 'AI数独', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/2_AI数独.html', category: 'siteD' },
        { name: '扫雷', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/3_扫雷.html', category: 'siteD' },

        { name: '解谜猜数字', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/6_解谜猜数字.html', category: 'siteD' },
        { name: '智商测试', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/7_智商测试.html', category: 'siteD' }, 
        { name: '上划解锁', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/9_上划解锁.html', category: 'siteD' },
        { name: '人生模拟器', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/10_人生模拟器.html', category: 'siteD' },
        { name: '弹跳小球', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/11_弹跳小球.html', category: 'siteD' },
        { name: '请选择你的职业', file: 'A..主页逻辑/脚本网站D_合集_单页面耐玩/12_请选择你的职业.html', category: 'siteD' }
    ],
    
    // 获取所有项目（导航固定在前面，其他游戏按原始顺序）
    getAllGames() {
        // 直接合并所有数组，不进行排序
        return [...this.navigations, ...this.siteB, ...this.siteC, ...this.siteD];
    }
};
