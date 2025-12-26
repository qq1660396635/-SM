window.toolsConfig = {
  tools: [
    { name: '在线脚本工具', file: '1_在线脚本.html', icon: '🎗', description: '在线脚本编辑和执行工具' },
    { name: '数据可视化', file: '2.数据可视化.html', icon: '📉', description: '数据可视化分析工具' },
    { name: '签到', file: '3.签到.html', icon: '✅', description: '每日签到工具' }
  ],
  getAllTools() { return this.tools; },
  
};
