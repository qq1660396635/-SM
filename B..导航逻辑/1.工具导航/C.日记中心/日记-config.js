window.toolsConfig = {
  tools: [
    { name: '快捷便签', file: '1_快捷便签.html', icon: '📝', description: '快速记录便签的工具' },
    { name: '随身博客', file: '2_随身博客.html', icon: '📒', description: '随身博客记录工具' },
    { name: '心灵序号', file: '3.心灵序号.html', icon: '💖', description: '心灵序号工具' },
    { name: '剪切板管家', file: '4_剪切板管家.html', icon: '📋', description: '剪切板历史管理工具' },
    { name: '关键词存储', file: '5_关键词存储.html', icon: '🔑', description: '关键词存储管理工具' },
    { name: '开发者日记', file: '6_开发者日记.html', icon: '📓', description: '开发者记录工具' },
    { name: '隐私日记', file: '7_隐私日记.html', icon: '🔒', description: '隐私日记记录工具' },
  ],
  getAllTools() { return this.tools; },
  
};
