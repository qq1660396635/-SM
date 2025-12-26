const ubuntuFontInstallConfig = {
    title: "Ubuntu字体安装",
    sections: [
        {
            title: "第一步：下载字体",
            steps: [
                {
                    number: 0,
                    command: "https://design.ubuntu.com/font/",
                    description: "访问官网下载字体压缩包到手机下载目录"
                }
            ]
        },
        {
            title: "第二步：安装字体",
            steps: [
                {
                    number: 0,
                    command: "mkdir -p $PREFIX/2025",
                    description: "确保2025目录存在"
                },
                {
                    number: 1,
                    command: "termux-setup-storage",
                    description: "请求存储权限（如果之前没做过）"
                },
                {
                    number: 2,
                    command: "cp /storage/emulated/0/Download/ubuntu-font-family-0.83.zip $PREFIX/2025/",
                    description: "将字体压缩包从下载目录复制到2025目录"
                },
                {
                    number: 3,
                    command: "cd $PREFIX/2025",
                    description: "进入2025目录"
                },
                {
                    number: 4,
                    command: "pkg install unzip -y",
                    description: "安装unzip（如果尚未安装）"
                },
                {
                    number: 5,
                    command: "rm -rf $PREFIX/2025/ubuntu-font-family-0.83 $PREFIX/2025/__MACOSX",
                    description: "清理之前的解压尝试（如果有）"
                },
                {
                    number: 6,
                    command: "unzip -o ubuntu-font-family-0.83.zip",
                    description: "使用非交互式方式解压，自动覆盖所有文件"
                },
                {
                    number: 7,
                    command: "mkdir -p ~/.termux",
                    description: "创建Termux的字体目录"
                },
                {
                    number: 8,
                    command: "cp $PREFIX/2025/ubuntu-font-family-0.83/UbuntuMono-R.ttf ~/.termux/font.ttf",
                    description: "将Ubuntu Mono字体复制到Termux的字体目录"
                },
                {
                    number: 9,
                    command: "echo \"字体安装完成！请完全关闭并重新打开Termux应用查看效果\"",
                    description: "重启Termux应用使更改生效"
                }
            ]
        }
    ]
};
