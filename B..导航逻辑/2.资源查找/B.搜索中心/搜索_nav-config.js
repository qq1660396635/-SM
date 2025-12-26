window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: '应用多开',       file: '1_应用多开.html',     icon: '📱', description: '应用多开工具' },
    { name: '聚合搜索',       file: '2_聚合搜索.html',     icon: '🔍', description: '聚合搜索工具' }
  ],

  /* --------------------- 背景渐变 --------------------- */
  gradients: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ],

  /* --------------------- 游动动画配置 --------------------- */
  animation: { 
    duration: 8,
    amplitude: 15,
    speed: 0.5
  },

  /* --------------------- 公共方法 --------------------- */
  getAllTools() { return this.tools; },
  getRandomGradient() { return this.gradients[Math.floor(Math.random() * this.gradients.length)]; },

  async checkFileExists(filename) {
    try {
      const response = await fetch(filename, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async getExistingTools() {
    const existingTools = [];
    for (const tool of this.tools) {
      if (await this.checkFileExists(tool.file)) {
        existingTools.push(tool);
      }
    }
    return existingTools;
  },

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
