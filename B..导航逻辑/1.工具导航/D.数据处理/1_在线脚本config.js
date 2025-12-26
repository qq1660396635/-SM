window.phoneConfig = {
    // 应用列表 - 包含您要求的四个网站
    apps: [
        { name: '脚本加速站', url: 'https://soujiaoben.org/#/pages/list/list', icon: '<i class="fas fa-code"></i>', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: '在线工具', url: 'https://tool.lu/library/', icon: '<i class="fas fa-tools"></i>', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'OpenUserJS', url: 'https://openuserjs.org/?sharetype=link', icon: '<i class="fas fa-globe"></i>', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        // 新增：XSS 速查表
        { name: 'XSS 速查表', url: 'https://portswigger.net/web-security/cross-site-scripting/cheat-sheet', icon: '<i class="fas fa-bug"></i>', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' }
    ],
    
    // 站点列表（用于设置面板的快速访问）
    sites: [
        { name: '脚本加速站', url: 'https://soujiaoben.org/#/pages/list/list', icon: 'fas fa-code' },
        { name: '在线工具', url: 'https://tool.lu/library/', icon: 'fas fa-tools' },
        { name: 'OpenUserJS', url: 'https://openuserjs.org/?sharetype=link', icon: 'fas fa-globe' },
        // 新增：XSS 速查表
        { name: 'XSS 速查表', url: 'https://portswigger.net/web-security/cross-site-scripting/cheat-sheet', icon: 'fas fa-bug' }
    ],
    
    // 备选图标数组（不会被调用，但可供参考）
    iconPool: [
        { icon: 'fas fa-phone', name: '电话' },
        { icon: 'fas fa-comment', name: '信息' },
        { icon: 'fas fa-music', name: '音乐' },
        { icon: 'fas fa-sun', name: '天气' },
        { icon: 'fas fa-sticky-note', name: '备忘录' },
        { icon: 'fas fa-calculator', name: '计算器' },
        { icon: 'fas fa-camera', name: '相机' },
        { icon: 'fas fa-image', name: '相册' },
        { icon: 'fas fa-cog', name: '设置' },
        { icon: 'fas fa-clock', name: '时钟' },
        { icon: 'fas fa-map', name: '地图' },
        { icon: 'fas fa-shopping-bag', name: '商店' }
    ],
    
    // 默认打开模式
    defaultMode: 'redirect', // 可选值：'redirect'（直接跳转）, 'iframe'（嵌套）
    
    // 公共方法
    getAllApps() {
        return new Promise((resolve) => {
            // 模拟异步加载
            setTimeout(() => {
                resolve(this.apps);
            }, 300);
        });
    },
    
    getSites() {
        return new Promise((resolve) => {
            // 模拟异步加载
            setTimeout(() => {
                resolve(this.sites);
            }, 300);
        });
    },
    
    getIconPool() {
        // 获取备选图标池（不会被调用，但可供参考）
        return this.iconPool;
    },
    
    getRandomIcon() {
        // 从图标池中随机获取一个图标
        const pool = this.iconPool;
        return pool[Math.floor(Math.random() * pool.length)];
    }
};
