window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: '数据加密',       file: '1_数据加密.html',     icon: '🔐', description: '常见数据加密方式速查' },
    { name: '网站解密工具',   file: '2_网站解密工具.html', icon: '🔓', description: '网站解密工具' },
    { name: '网页在线渲染',   file: '3_网页在线渲染.html', icon: '🌐', description: '网页在线渲染工具' },
    { name: 'HTML代码高亮',   file: '4_HTML代码高亮.html', icon: '🖌️', description: 'HTML代码高亮显示' },
    { name: 'HTML结构分析',   file: '5_HTML结构分析.html', icon: '🧱', description: 'HTML结构快速解析' },
    { name: 'HTML转义工具',   file: '6_HTML转义工具.html', icon: '🔣', description: 'HTML实体编码/解码工具' },
    { name: '代码审查分析',   file: '7_HTML代码审查.html', icon: '📝', description: '一键解析网页源码结构' },
    { name: '脑图可视化',     file: '8_脑图可视化.html',   icon: '🧠', description: '将复杂数据以脑图形式展示' },
    { name: '代码差异工具',   file: '9_代码差异工具.html', icon: '🔍', description: '高亮显示代码差异' },
    { name: '工具箱',         file: '10_工具箱.html',      icon: '🧰', description: '综合工具箱，包含多种实用工具' }
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
