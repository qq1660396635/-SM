window.toolsConfig = {
  tools: [
    { name: '网站工具导航', file: '/B..导航逻辑/1.工具导航/A.网站工具/网站工具_导航.html', icon: '🔗', description: '网站工具导航页面' },
    { name: '破解导航配置', file: '/B..导航逻辑/1.工具导航/B.功能选择/破解导航.html', icon: '⚙️', description: '破解导航配置脚本' },
    { name: '日记导航', file: '/B..导航逻辑/1.工具导航/C.日记中心/日记导航.html', icon: '📓', description: '日记中心导航' },
    { name: '数据导航', file: '/B..导航逻辑/1.工具导航/D.数据处理/数据导航.html', icon: '📊', description: '数据处理工具导航' }, // 更新了名称、路径、图标和描述
    { name: '本地答题', file: '/B..导航逻辑/1.工具导航/2_本地答题.html', icon: '📚', description: '本地答题和测试工具' },
    { name: 'TXT阅读器', file: '/B..导航逻辑/1.工具导航/4_TXT阅读器.html', icon: '📖', description: '本地TXT文件阅读工具' },
    { name: '画个画吧', file: '/B..导航逻辑/1.工具导航/5_画个画吧.html', icon: '🎨', description: '绘画和涂鸦工具' },
    { name: '在线游戏', file: '/B..导航逻辑/1.工具导航/8_在线游戏.html', icon: '🎮', description: '休闲小游戏合集' },
    { name: '在线音乐', file: '/B..导航逻辑/1.工具导航/9_在线音乐.html', icon: '🎵', description: '在线音乐播放工具' },
    { name: '广告位招租', file: '/B..导航逻辑/1.工具导航/11_广告位招租.html', icon: '📢', description: '广告合作信息展示' },
    { name: '开发者日志', file: '/B..导航逻辑/1.工具导航/12_开发者日志.html', icon: '📝', description: '项目更新历史记录' }
  ],
  getAllTools() { return this.tools; },
};
