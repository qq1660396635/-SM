window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: 'bash本地服务', file: 'a.bash_本地服务/bash本地服务.html', icon: '🏠', description: '本地服务管理' },
    { name: 'bash网络服务', file: 'b.bash_网络服务/bash网络服务.html', icon: '🌐', description: '网络服务管理' },
    { name: 'python本地服务', file: 'c.python本地服务/py本地服务.html', icon: '🐍', description: 'Python本地服务' },
    { name: 'js中心/破解导航', file: 'e.js中心/JS源码导航.html', icon: '🔓', description: 'JS破解工具导航' },
    // 新增Golang工具项
    { name: 'golang脚本', file: 'f.golang脚本/go源码导航.html', icon: '🐿', description: 'Go源码导航' }
  ],

  /* --------------------- 游动动画配置 --------------------- */
  animation: { duration: 8, amplitude: 15, speed: 0.5 },

  /* --------------------- 公共方法 --------------------- */
  // 获取所有工具
  getAllTools() { return this.tools; },

  // 获取随机渐变
  getRandomGradient() { return this.gradients[Math.floor(Math.random() * this.gradients.length)]; },

  // 检查文件是否存在（通过fetch尝试访问）
  async checkFileExists(filename) {
    try {
      const response = await fetch(filename, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // 获取存在的工具列表
  async getExistingTools() {
    const existingTools = [];
    for (const tool of this.tools) {
      if (await this.checkFileExists(tool.file)) {
        existingTools.push(tool);
      }
    }
    return existingTools;
  },

  // 将工具两两分组
  getGroupedTools(tools) {
    const groups = [];
    for (let i = 0; i < tools.length; i += 2) {
      groups.push({
        left: tools[i],
        right: tools[i + 1] || null
      });
    }
    return groups;
  }
};
