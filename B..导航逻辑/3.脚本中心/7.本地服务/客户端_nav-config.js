window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: 'HTML截图', file: '2.html截图.html', icon: '🖼️', description: '生成HTML页面的截图' },
    { name: 'cflow项目分析', file: '3.cflow_ctags项目分析.html', icon: '🔍', description: '使用cflow和ctags进行代码流程分析' },
    { name: 'Python代码分析', file: '4_python代码分析.html', icon: '🐍', description: 'Python代码静态分析和可视化工具' },
    { name: '文件合并拆分', file: '5.文件_合并拆分.html', icon: '📁', description: '合并和拆分多个文件内容，方便统一处理' },
    { name: '文件差异分析', file: '6.文件差异分析.html', icon: '📊', description: '对比两个文件的差异，快速定位修改点' },
    { name: '网站安全测试', file: '7.网安网站测试.html', icon: '🛡️', description: '网络安全测试和漏洞扫描工具' }
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
