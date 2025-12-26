// 应用导航配置文件
window.magnetConfig = {
    /* --------------------- 站点列表 --------------------- */
    sites: [
        { name: '应用宝', url: 'https://sj.qq.com/', icon: '🔮', description: '腾讯官方应用市场，海量应用一键下载' },
        { name: '百度手机助手', url: 'https://mobile.baidu.com/', icon: '💠', description: '百度旗下应用商店，安全放心' },
        { name: '4399游戏盒子', url: 'https://h.4399.com/wap/', icon: '🔛', description: '精品手游平台，热门游戏推荐' },
        { name: 'TapTap', url: 'https://www.taptap.cn/', icon: '📇', description: '好游戏在这里，发现优质手游' },
        { name: '九游', url: 'https://a.9game.cn/', icon: '🧿', description: '热门游戏下载，游戏社区互动' }
    ],

    /* --------------------- 获取所有站点 --------------------- */
    getAllSites: function() {
        return this.sites;
    }
};
