window.triangleNavConfig = {
    tools: [
        { name: 'Go服务器', file: '1.go启动服务器.html', icon: '📖', color: '#FFD700' },
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