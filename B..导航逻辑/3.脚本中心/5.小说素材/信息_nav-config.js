window.navConfig = {
  /* --------------------- 工具列表 --------------------- */
  tools: [
    { name: '群主日记',     file: '1_群主日记.html',     icon: '🔐', description: '群主日记记录' },
    { name: '网安词条',     file: '2_网安词条.html',     icon: '🌐', description: '网络安全词条查询' },
    { name: '管理词条',     file: '3_王的素养.html',     icon: '🧱', description: '管理者素养与技能词条' },
    { name: '国考2024',     file: '7_国考2024.html',     icon: '📝', description: '国考2024相关资料' },
    { name: '小说素材',     file: '5_小说素材.html',     icon: '📚', description: '小说创作素材收集与整理' }, 
    { name: '小说国家素材', file: '6_小说国家素材.html', icon: '🗺️', description: '国家设定与世界观构建素材库' },
        { name: '时间轴查询',   file: '4_时间轴查询.html',   icon: '📅', description: '时间轴记录与查询工具' },
    { name: '小说疾病素材', file: '8_小说疾病素材.html', icon: '🦠', description: '疾病相关设定素材库' }
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
