window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: '自动化文件合并', file: '1.自动化文件合并.html', icon: '🚀', description: '从服务器拉取语法高亮配置' },
    { name: '文件拆分器', file: '2.文件拆分器.html', icon: '📺', description: '判断视频链接是否失效' },
    { name: 'APP打包', file: '3.APP打包.html', icon: '📦', description: 'Cordova APP打包工具' },
    { name: '文件合并转JS', file: '4.文件阅读.html', icon: '📖', description: '文件内容阅读工具' },
    { name: '生成全局导航配置', file: '5.生成-全局导航.配置.html', icon: '🧭', description: '生成全局导航配置文件' },
    { name: '批量md转html', file: '6.批量md转html.html', icon: '📄', description: '批量将Markdown文件转换为HTML' }
  ],


  // 获取所有工具
  getAllTools() { return this.tools; },

  
};
