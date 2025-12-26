window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: '查询安装包', file: '1.查询安装包.html', icon: '📦', description: '查询和安装软件包的工具' },
    { name: 'Cflow项目分析', file: '2.cflow项目分析.html', icon: '🌲', description: 'Cflow调用树生成器' },
    { name: 'Ctags项目分析', file: '3.ctags项目分析.html', icon: '🏷️', description: 'Ctags代码标签分析工具' },
    { name: 'Ctags+Cflow项目分析', file: '4.ctags＋cflow项目分析.html', icon: '🔬', description: 'Ctags与Cflow结合的项目分析工具' },
    { name: '路径扫描', file: '5.路径扫描.html', icon: '📱', description: '自动化路径扫描' },
    { name: '生成图片水印', file: '6.生成图片水印.html', icon: '💧', description: '为图片添加水印的工具' },
    { name: 'JS数组转UniApp数组', file: '7.js数组转uniapp数组.html', icon: '🔄', description: '将JavaScript数组转换为UniApp格式' }  // 新增工具
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
