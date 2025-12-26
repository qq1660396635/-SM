window.commandConfig = {
    // 基础命令
    basic: [
        { name: 'bash', desc: '启动 Bash 解释器', category: 'basic' },
        { name: 'sh', desc: '启动 Shell 解释器', category: 'basic' },
        { name: 'zsh', desc: '启动 Z Shell 解释器', category: 'basic' },
        { name: 'ps', desc: '查看进程快照', category: 'basic' },
        { name: 'exit', desc: '退出当前 Shell', category: 'basic' },
        { name: 'clear', desc: '清屏', category: 'basic' },
        { name: 'echo', desc: '打印文本到屏幕', category: 'basic' },
        { name: 'cal', desc: '显示月历', category: 'basic' },
        { name: 'date', desc: '显示或设置系统时间', category: 'basic' },
        { name: 'help', desc: '查看内建命令帮助', category: 'basic' }
    ],
    
    // 文件与目录操作
    file: [
        { name: 'ls', desc: '列出目录内容', category: 'file' },
        { name: 'cd', desc: '切换工作目录', category: 'file' },
        { name: 'pwd', desc: '显示当前目录', category: 'file' },
        { name: 'mkdir', desc: '创建新目录', category: 'file' },
        { name: 'rmdir', desc: '删除空目录', category: 'file' },
        { name: 'rm', desc: '删除文件或目录', category: 'file' },
        { name: 'cp', desc: '复制文件或目录', category: 'file' },
        { name: 'mv', desc: '移动/重命名文件', category: 'file' },
        { name: 'touch', desc: '创建空文件或改时间戳', category: 'file' },
        { name: 'find', desc: '按条件查找文件', category: 'file' },
        { name: 'locate', desc: '快速查找文件', category: 'file' },
        { name: 'which', desc: '定位外部命令路径', category: 'file' },
        { name: 'whereis', desc: '查找二进制文件位置', category: 'file' },
        { name: 'file', desc: '识别文件类型', category: 'file' },
        { name: 'stat', desc: '显示文件详细信息', category: 'file' }
    ],
    
    // 文本处理
    text: [
        { name: 'cat', desc: '查看或拼接文件', category: 'text' },
        { name: 'nano', desc: '终端文本编辑器', category: 'text' },
        { name: 'vim', desc: 'Vim 文本编辑器', category: 'text' },
        { name: 'head', desc: '查看文件开头', category: 'text' },
        { name: 'tail', desc: '查看文件结尾', category: 'text' },
        { name: 'less', desc: '分页查看文件', category: 'text' },
        { name: 'more', desc: '分页查看文件（旧）', category: 'text' },
        { name: 'grep', desc: '文本搜索', category: 'text' },
        { name: 'sed', desc: '流编辑器', category: 'text' },
        { name: 'awk', desc: '文本处理工具', category: 'text' },
        { name: 'sort', desc: '排序文本行', category: 'text' },
        { name: 'uniq', desc: '去除重复行', category: 'text' },
        { name: 'wc', desc: '统计字词行数', category: 'text' },
        { name: 'cut', desc: '剪切文件内容', category: 'text' },
        { name: 'tr', desc: '转换或删除字符', category: 'text' }
    ],
    
    // 系统管理
    system: [
        { name: 'top', desc: '实时进程监控', category: 'system' },
        { name: 'htop', desc: '增强版进程监控', category: 'system' },
        { name: 'kill', desc: '终止进程', category: 'system' },
        { name: 'killall', desc: '按名称终止进程', category: 'system' },
        { name: 'jobs', desc: '显示后台任务', category: 'system' },
        { name: 'bg', desc: '后台运行任务', category: 'system' },
        { name: 'fg', desc: '前台运行任务', category: 'system' },
        { name: 'nohup', desc: '忽略挂起信号运行', category: 'system' },
        { name: 'df', desc: '显示磁盘使用情况', category: 'system' },
        { name: 'du', desc: '显示目录大小', category: 'system' },
        { name: 'free', desc: '显示内存使用情况', category: 'system' },
        { name: 'uname', desc: '显示系统信息', category: 'system' },
        { name: 'uptime', desc: '显示系统运行时间', category: 'system' },
        { name: 'who', desc: '显示已登录用户', category: 'system' },
        { name: 'w', desc: '查看已登录用户详情', category: 'system' }
    ],
    
    // 用户与权限
    permission: [
        { name: 'chmod', desc: '修改文件权限', category: 'permission' },
        { name: 'chown', desc: '修改文件所有者', category: 'permission' },
        { name: 'chgrp', desc: '修改文件组', category: 'permission' },
        { name: 'sudo', desc: '以管理员权限执行', category: 'permission' },
        { name: 'su', desc: '切换用户', category: 'permission' },
        { name: 'id', desc: '显示用户 UID/GID', category: 'permission' },
        { name: 'whoami', desc: '显示当前用户名', category: 'permission' },
        { name: 'passwd', desc: '修改用户密码', category: 'permission' },
        { name: 'adduser', desc: '添加新用户', category: 'permission' },
        { name: 'userdel', desc: '删除用户', category: 'permission' }
    ],
    
    // 网络相关
    network: [
        { name: 'ping', desc: '测试网络连通性', category: 'network' },
        { name: 'curl', desc: '网络数据传输工具', category: 'network' },
        { name: 'wget', desc: '网络文件下载', category: 'network' },
        { name: 'ssh', desc: '安全远程登录', category: 'network' },
        { name: 'scp', desc: '安全文件传输', category: 'network' },
        { name: 'rsync', desc: '远程文件同步', category: 'network' },
        { name: 'netstat', desc: '显示网络状态', category: 'network' },
        { name: 'ss', desc: '显示套接字状态', category: 'network' },
        { name: 'ip', desc: '显示/配置网络接口', category: 'network' },
        { name: 'ifconfig', desc: '配置网络接口（旧）', category: 'network' },
        { name: 'traceroute', desc: '跟踪网络路由', category: 'network' },
        { name: 'nslookup', desc: 'DNS 查询', category: 'network' },
        { name: 'dig', desc: 'DNS 详细查询', category: 'network' }
    ],
    
    // 压缩解压
    archive: [
        { name: 'tar', desc: '打包/解包文件', category: 'archive' },
        { name: 'gzip', desc: 'gzip 压缩', category: 'archive' },
        { name: 'gunzip', desc: 'gzip 解压', category: 'archive' },
        { name: 'zip', desc: 'zip 压缩', category: 'archive' },
        { name: 'unzip', desc: 'zip 解压', category: 'archive' },
        { name: 'rar', desc: 'rar 压缩', category: 'archive' },
        { name: 'unrar', desc: 'rar 解压', category: 'archive' },
        { name: '7z', desc: '7z 压缩', category: 'archive' }
    ],
    
    // Termux 特有
    termux: [
        { name: 'termux-setup-storage', desc: '获取存储权限', category: 'termux' },
        { name: 'termux-wake-lock', desc: '保持唤醒', category: 'termux' },
        { name: 'termux-wake-unlock', desc: '取消唤醒锁定', category: 'termux' },
        { name: 'termux-info', desc: '显示设备信息', category: 'termux' },
        { name: 'termux-reload-settings', desc: '重载设置', category: 'termux' },
        { name: 'termux-clipboard-get', desc: '获取剪贴板内容', category: 'termux' },
        { name: 'termux-clipboard-set', desc: '设置剪贴板内容', category: 'termux' },
        { name: 'termux-sms-list', desc: '列出短信', category: 'termux' },
        { name: 'termux-sms-send', desc: '发送短信', category: 'termux' },
        { name: 'termux-contact-list', desc: '列出联系人', category: 'termux' },
        { name: 'termux-share', desc: '分享文件', category: 'termux' },
        { name: 'termux-camera-photo', desc: '拍照', category: 'termux' },
        { name: 'termux-microphone-record', desc: '录音', category: 'termux' },
        { name: 'termux-location', desc: '获取位置信息', category: 'termux' },
        { name: 'termux-notification', desc: '显示通知', category: 'termux' },
        { name: 'termux-toast', desc: '显示 Toast', category: 'termux' },
        { name: 'termux-vibrate', desc: '震动', category: 'termux' },
        { name: 'termux-battery-status', desc: '电池状态', category: 'termux' },
        { name: 'termux-brightness', desc: '调节亮度', category: 'termux' },
        { name: 'termux-volume', desc: '调节音量', category: 'termux' }
    ],
    
    // Shell 变量与环境
    variable: [
        { name: 'export', desc: '导出环境变量', category: 'variable' },
        { name: 'set', desc: '显示/设置 Shell 变量', category: 'variable' },
        { name: 'env', desc: '显示环境变量', category: 'variable' },
        { name: 'unset', desc: '删除变量', category: 'variable' },
        { name: 'alias', desc: '创建命令别名', category: 'variable' },
        { name: 'unalias', desc: '取消命令别名', category: 'variable' },
        { name: 'declare', desc: '声明变量', category: 'variable' },
        { name: 'readonly', desc: '设置只读变量', category: 'variable' }
    ],
    
    // 流程控制符号
    control: [
        { name: ';', desc: '命令分隔符', category: 'control' },
        { name: '()', desc: '在子 Shell 中执行', category: 'control' },
        { name: '{}', desc: '命令组', category: 'control' },
        { name: '&&', desc: '前成功后继续', category: 'control' },
        { name: '||', desc: '前失败后继续', category: 'control' },
        { name: '|', desc: '管道符', category: 'control' },
        { name: '&', desc: '后台运行', category: 'control' },
        { name: '!', desc: '历史命令引用', category: 'control' }
    ],
    
    // 历史命令
    history: [
        { name: 'history', desc: '显示命令历史', category: 'history' },
        { name: '!!', desc: '重复上一条命令', category: 'history' },
        { name: '!n', desc: '执行历史第 n 条', category: 'history' },
        { name: '!-n', desc: '执行倒数第 n 条', category: 'history' },
        { name: '!cmd', desc: '最近以 cmd 开头的命令', category: 'history' },
        { name: 'fc', desc: '调用编辑器修改并执行历史命令', category: 'history' }
    ],
    
    // 特殊键位
    keys: [
        { name: 'CTRL+R', desc: '反向搜索历史', category: 'keys' },
        { name: 'CTRL+C', desc: '中断当前命令', category: 'keys' },
        { name: 'CTRL+Z', desc: '挂起当前命令', category: 'keys' },
        { name: 'CTRL+D', desc: 'EOF/退出', category: 'keys' },
        { name: 'CTRL+L', desc: '清屏', category: 'keys' },
        { name: 'CTRL+A', desc: '行首', category: 'keys' },
        { name: 'CTRL+E', desc: '行尾', category: 'keys' },
        { name: 'ESC+.', desc: '插入上条最后一个参数', category: 'keys' },
        { name: 'ALT+.', desc: '同上（终端依赖）', category: 'keys' },
        { name: 'TAB', desc: '自动补全', category: 'keys' }
    ],
    
    // 扩展替换
    expansion: [
        { name: '{}', desc: '花括号扩展', category: 'expansion' },
        { name: '~', desc: '波浪线扩展（家目录）', category: 'expansion' },
        { name: '$()', desc: '命令替换（新）', category: 'expansion' },
        { name: '``', desc: '命令替换（旧）', category: 'expansion' },
        { name: '*', desc: '通配符', category: 'expansion' },
        { name: '?', desc: '单字符通配符', category: 'expansion' },
        { name: '[]', desc: '字符集', category: 'expansion' },
        { name: '$', desc: '变量引用', category: 'expansion' }
    ],
    
    // Shell 配置
    shell: [
        { name: 'shopt', desc: '设置/查看 Shell 选项', category: 'shell' },
        { name: 'source', desc: '执行脚本文件', category: 'shell' },
        { name: '.', desc: '同 source', category: 'shell' },
        { name: 'exec', desc: '替换当前进程', category: 'shell' },
        { name: 'eval', desc: '执行字符串命令', category: 'shell' },
        { name: 'type', desc: '显示命令类型', category: 'shell' },
        { name: 'builtin', desc: '执行内建命令', category: 'shell' },
        { name: 'command', desc: '执行外部命令', category: 'shell' }
    ],
    
    // 重定向
    redirect: [
        { name: '>', desc: '覆盖式输出重定向', category: 'redirect' },
        { name: '>>', desc: '追加式输出重定向', category: 'redirect' },
        { name: '<', desc: '输入重定向', category: 'redirect' },
        { name: '<<', desc: 'Here Document', category: 'redirect' },
        { name: '<<<', desc: 'Here String', category: 'redirect' },
        { name: '2>', desc: '错误输出重定向', category: 'redirect' },
        { name: '&>', desc: '所有输出重定向', category: 'redirect' },
        { name: '|', desc: '管道', category: 'redirect' }
    ],
    
    // 引用符号
    quote: [
        { name: '\\', desc: '转义字符', category: 'quote' },
        { name: '""', desc: '双引号（弱引用）', category: 'quote' },
        { name: "''", desc: '单引号（强引用）', category: 'quote' },
        { name: '$\'\'', desc: 'ANSI-C 引用', category: 'quote' }
    ]
};
