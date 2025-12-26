window.shortcutsConfig = {
    // Windows 系统快捷键
    windows: [
        { name: 'Win + D', desc: '显示桌面', category: 'windows' },
        { name: 'Win + E', desc: '打开资源管理器', category: 'windows' },
        { name: 'Win + L', desc: '锁定电脑', category: 'windows' },
        { name: 'Win + R', desc: '打开运行对话框', category: 'windows' },
        { name: 'Win + Tab', desc: '任务视图', category: 'windows' },
        { name: 'Alt + Tab', desc: '切换窗口', category: 'windows' },
        { name: 'Alt + F4', desc: '关闭当前窗口', category: 'windows' },
        { name: 'Ctrl + Shift + Esc', desc: '打开任务管理器', category: 'windows' },
        { name: 'Win + X', desc: '快速链接菜单', category: 'windows' },
        { name: 'Win + I', desc: '打开设置', category: 'windows' },
        { name: 'Win + P', desc: '投影设置', category: 'windows' },
        { name: 'Win + K', desc: '连接设备', category: 'windows' },
        { name: 'Win + Pause', desc: '系统属性', category: 'windows' },
        { name: 'Win + +', desc: '放大镜', category: 'windows' },
        { name: 'Win + -', desc: '缩小镜', category: 'windows' }
    ],
    
    // 浏览器快捷键
    browser: [
        { name: 'Ctrl + T', desc: '新建标签页', category: 'browser' },
        { name: 'Ctrl + W', desc: '关闭当前标签页', category: 'browser' },
        { name: 'Ctrl + Tab', desc: '切换标签页', category: 'browser' },
        { name: 'Ctrl + Shift + T', desc: '恢复关闭的标签页', category: 'browser' },
        { name: 'Ctrl + R', desc: '刷新页面', category: 'browser' },
        { name: 'Ctrl + F', desc: '查找', category: 'browser' },
        { name: 'Ctrl + H', desc: '历史记录', category: 'browser' },
        { name: 'Ctrl + J', desc: '下载记录', category: 'browser' },
        { name: 'Ctrl + D', desc: '添加书签', category: 'browser' },
        { name: 'Ctrl + L', desc: '定位地址栏', category: 'browser' },
        { name: 'F5', desc: '刷新页面', category: 'browser' },
        { name: 'F11', desc: '全屏模式', category: 'browser' },
        { name: 'Ctrl + +', desc: '放大页面', category: 'browser' },
        { name: 'Ctrl + -', desc: '缩小页面', category: 'browser' },
        { name: 'Ctrl + 0', desc: '重置缩放', category: 'browser' }
    ],
    
    // 文本编辑快捷键
    editor: [
        { name: 'Ctrl + C', desc: '复制', category: 'editor' },
        { name: 'Ctrl + X', desc: '剪切', category: 'editor' },
        { name: 'Ctrl + V', desc: '粘贴', category: 'editor' },
        { name: 'Ctrl + Z', desc: '撤销', category: 'editor' },
        { name: 'Ctrl + Y', desc: '重做', category: 'editor' },
        { name: 'Ctrl + A', desc: '全选', category: 'editor' },
        { name: 'Ctrl + S', desc: '保存', category: 'editor' },
        { name: 'Ctrl + F', desc: '查找', category: 'editor' },
        { name: 'Ctrl + H', desc: '替换', category: 'editor' },
        { name: 'Ctrl + G', desc: '定位到行', category: 'editor' },
        { name: 'Home', desc: '行首', category: 'editor' },
        { name: 'End', desc: '行尾', category: 'editor' },
        { name: 'Ctrl + Home', desc: '文档开头', category: 'editor' },
        { name: 'Ctrl + End', desc: '文档结尾', category: 'editor' },
        { name: 'Shift + 方向键', desc: '选择文本', category: 'editor' }
    ],
    
    // VS Code 快捷键
    vscode: [
        { name: 'Ctrl + P', desc: '快速打开文件', category: 'vscode' },
        { name: 'Ctrl + Shift + P', desc: '命令面板', category: 'vscode' },
        { name: 'Ctrl + `', desc: '打开终端', category: 'vscode' },
        { name: 'Ctrl + B', desc: '切换侧边栏', category: 'vscode' },
        { name: 'Ctrl + J', desc: '切换面板', category: 'vscode' },
        { name: 'F12', desc: '转到定义', category: 'vscode' },
        { name: 'Shift + F12', desc: '查找所有引用', category: 'vscode' },
        { name: 'Ctrl + G', desc: '转到行', category: 'vscode' },
        { name: 'Ctrl + /', desc: '切换注释', category: 'vscode' },
        { name: 'Ctrl + ]', desc: '增加缩进', category: 'vscode' },
        { name: 'Ctrl + [', desc: '减少缩进', category: 'vscode' },
        { name: 'Ctrl + D', desc: '选择相同内容', category: 'vscode' },
        { name: 'Alt + ↑/↓', desc: '移动行', category: 'vscode' },
        { name: 'Shift + Alt + ↑/↓', desc: '复制行', category: 'vscode' },
        { name: 'Ctrl + Shift + K', desc: '删除行', category: 'vscode' }
    ],
    
    // Mac 快捷键
    mac: [
        { name: 'Cmd + Space', desc: 'Spotlight 搜索', category: 'mac' },
        { name: 'Cmd + Tab', desc: '切换应用', category: 'mac' },
        { name: 'Cmd + Q', desc: '退出应用', category: 'mac' },
        { name: 'Cmd + W', desc: '关闭窗口', category: 'mac' },
        { name: 'Cmd + M', desc: '最小化窗口', category: 'mac' },
        { name: 'Cmd + H', desc: '隐藏应用', category: 'mac' },
        { name: 'Cmd + Option + Esc', desc: '强制退出', category: 'mac' },
        { name: 'Cmd + S', desc: '保存', category: 'mac' },
        { name: 'Cmd + C', desc: '复制', category: 'mac' },
        { name: 'Cmd + V', desc: '粘贴', category: 'mac' },
        { name: 'Cmd + X', desc: '剪切', category: 'mac' },
        { name: 'Cmd + Z', desc: '撤销', category: 'mac' },
        { name: 'Cmd + Shift + Z', desc: '重做', category: 'mac' },
        { name: 'Cmd + A', desc: '全选', category: 'mac' },
        { name: 'Cmd + F', desc: '查找', category: 'mac' }
    ],
    
    // Excel 快捷键
    excel: [
        { name: 'Ctrl + C', desc: '复制', category: 'excel' },
        { name: 'Ctrl + V', desc: '粘贴', category: 'excel' },
        { name: 'Ctrl + X', desc: '剪切', category: 'excel' },
        { name: 'Ctrl + Z', desc: '撤销', category: 'excel' },
        { name: 'Ctrl + Y', desc: '重做', category: 'excel' },
        { name: 'Ctrl + A', desc: '全选', category: 'excel' },
        { name: 'Ctrl + B', desc: '加粗', category: 'excel' },
        { name: 'Ctrl + I', desc: '斜体', category: 'excel' },
        { name: 'Ctrl + U', desc: '下划线', category: 'excel' },
        { name: 'Ctrl + S', desc: '保存', category: 'excel' },
        { name: 'F2', desc: '编辑单元格', category: 'excel' },
        { name: 'Ctrl + ;', desc: '输入当前日期', category: 'excel' },
        { name: 'Ctrl + Shift + ;', desc: '输入当前时间', category: 'excel' },
        { name: 'Ctrl + 1', desc: '设置单元格格式', category: 'excel' },
        { name: 'Ctrl + Shift + $', desc: '货币格式', category: 'excel' }
    ],
    
    // Photoshop 快捷键
    photoshop: [
        { name: 'V', desc: '移动工具', category: 'photoshop' },
        { name: 'M', desc: '选框工具', category: 'photoshop' },
        { name: 'L', desc: '套索工具', category: 'photoshop' },
        { name: 'W', desc: '魔棒工具', category: 'photoshop' },
        { name: 'C', desc: '裁剪工具', category: 'photoshop' },
        { name: 'I', desc: '吸管工具', category: 'photoshop' },
        { name: 'J', desc: '修复工具', category: 'photoshop' },
        { name: 'B', desc: '画笔工具', category: 'photoshop' },
        { name: 'E', desc: '橡皮擦工具', category: 'photoshop' },
        { name: 'G', desc: '渐变工具', category: 'photoshop' },
        { name: 'T', desc: '文字工具', category: 'photoshop' },
        { name: 'Ctrl + T', desc: '自由变换', category: 'photoshop' },
        { name: 'Ctrl + J', desc: '复制图层', category: 'photoshop' },
        { name: 'Ctrl + E', desc: '合并图层', category: 'photoshop' },
        { name: 'Ctrl + Z', desc: '撤销', category: 'photoshop' }
    ]
};
