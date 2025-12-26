window.triangleNavConfig = {
    tools: [
        { name: '插件源码阅读', file: '1.插件源码阅读.html', icon: '📖', color: '#FFD700' },

    ],
    
    getAllTools() {
        return this.tools;
    },
    
    getToolByIndex(index) {
        return this.tools[index] || null;
    },
    
    isToolAvailable(tool) {
        return tool && tool.file && tool.file !== '#';
    }
};

// 添加调试信息
console.log('配置文件已加载，工具数量:', window.triangleNavConfig.getAllTools().length);
console.log('第一个工具已更新为插件源码阅读');
console.log('第二个工具:聊天修改器');
console.log('第三个工具:二维码生成器');
console.log('第四个工具:密码生成器');
console.log('第五个工具:多语言-代码高亮');

console.log('可用工具:');
window.triangleNavConfig.getAllTools().forEach((tool, index) => {
    if (window.triangleNavConfig.isToolAvailable(tool)) {
        console.log(`  ${index + 1}. ${tool.name} (${tool.file})`);
    }
});
