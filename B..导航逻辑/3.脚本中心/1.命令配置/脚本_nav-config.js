window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: '常用命令', file: '1.常用命令.html', icon: '🐧', description: '常用Linux命令参考' },
    { name: 'ESP32 AT指令', file: '2.ESP32_AT指令.html', icon: '📶', description: 'ESP32 AT指令参考' },
    { name: 'GitHub项目', file: '3.GitHub_python项目.html', icon: '🐍', description: 'Python项目资源' },
      { name: '油猴脚本', file: '6.油猴脚本/油猴脚本.html', icon: '🐒', description: '油猴脚本管理与使用' },
    { name: '渗透测试', file: '5_渗透测试.html', icon: '🔍', description: '渗透测试相关工具和资源' },
    { name: '10月脚本', file: '4_10月脚本.html', icon: '📜', description: '10月常用脚本集合' }
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
