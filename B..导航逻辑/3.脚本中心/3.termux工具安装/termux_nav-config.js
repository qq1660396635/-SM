window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: '开机_关键词', file: 'termuxA组/1.开机_关键词.html', icon: '🚀', description: '启动项和关键词管理' },
    { name: '开机_力扣题目', file: 'termuxA组/2.开机_力扣题目.html', icon: '💻', description: '力扣题目和开机启动管理' },
    { name: '开机_服务器', file: 'termuxA组/3.开机_服务器.html', icon: '🖥️', description: '服务器开机管理' },
    { name: '乌班图字体', file: 'termuxA组/4_乌班图字体.html', icon: '🔤', description: 'Ubuntu字体设置与优化' },
    { name: 'cordova工具安装', file: 'termuxA组/5_安卓工具安装.html', icon: '📱', description: 'Termux常用工具安装指南' },
    { name: 'cflow一键安装', file: 'termuxA组/6.cflow一键安装.html', icon: '🔧', description: 'cflow工具安装配置' },
    { name: 'Python文件处理', file: 'termuxA组/7.Python文件处理安装.html', icon: '🐍', description: 'Python文件处理工具安装' }
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
