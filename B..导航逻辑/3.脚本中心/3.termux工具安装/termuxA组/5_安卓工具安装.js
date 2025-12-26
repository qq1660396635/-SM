const androidToolsConfig = {
    title: "安卓开发工具安装指南",
    
    // 第一页：工具表格数据
    toolsTable: {
        headers: ["序号", "名称", "安装/获取方式", "最终官方路径", "备注"],
        rows: [
            [1, "系统更新", "`pkg update && pkg upgrade`", "-", "必做"],
            [2, "wget", "`pkg install -y wget`", "/data/data/.../usr/bin", "✅"],
            [3, "unzip", "`pkg install -y unzip`", "同上", "✅"],
            [4, "zip", "`pkg install -y zip`", "同上", "✅"],
            [5, "git", "`pkg install -y git`", "同上", "✅"],
            [6, "openjdk-17", "`pkg install -y openjdk-17`", "同上", "✅"],
            [7, "nodejs", "`pkg install -y nodejs`", "同上", "✅"],
            [8, "python", "`pkg install -y python`", "同上", "✅"],
            [9, "aapt2", "`pkg install -y aapt2`", "同上", "✅"],
            [10, "apksigner", "`pkg install -y apksigner`", "同上", "✅"],
            [11, "ecj.jar", "手动下载", "PREFIX/share/ecj.jar", "启动脚本放 /usr/bin"],
            [12, "cmdline-tools", "手动下载", "HOME/android-sdk/...", "官方固定"],
            [13, "gradle-7.6", "手动下载", "HOME/gradle-7.6/bin/gradle", "只加 PATH"],
            [14, "cordova", "`npm i -g cordova`", "/data/data/.../usr/bin", "✅"],
            [15, "PATH 指向 gradle", "一行 export", "见下", "✅"]
        ]
    },
    
    // 第二页：模块化安装脚本
    installModules: [
        {
            title: "0. 授权存储",
            commands: [
                "termux-setup-storage"
            ]
        },
        {
            title: "1. 系统升级",
            commands: [
                "pkg update -y && pkg upgrade -y"
            ]
        },
        {
            title: "2. 一次装完11个pkg包（路径官方，不用拷）",
            commands: [
                "pkg install -y wget unzip zip git openjdk-17 nodejs python aapt2 apksigner"
            ]
        },
        {
            title: "3. Android SDK cmdline-tools → 官方固定位置",
            commands: [
                "# 1. 创建Android SDK命令行工具目录",
                "# 使用mkdir命令递归创建目录结构",
                "mkdir -p $HOME/android-sdk/cmdline-tools",
                "",
                "# 2. 切换到命令行工具目录",
                "# 使用cd命令进入刚创建的目录",
                "cd $HOME/android-sdk/cmdline-tools",
                "",
                "# 3. 下载Android命令行工具压缩包",
                "# 使用wget命令安静下载最新的命令行工具",
                "wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip",
                "",
                "# 4. 解压并重命名目录以满足官方要求",
                "# 解压zip文件并将目录重命名为latest",
                "unzip -q *.zip && mv cmdline-tools latest",
                "",
                "# 5. 设置ANDROID_HOME环境变量",
                "# 将Android SDK路径添加到bash配置文件中",
                "echo 'export ANDROID_HOME=$HOME/android-sdk' >> ~/.bashrc",
                "",
                "# 6. 配置PATH环境变量包含Android工具路径",
                "# 将命令行工具和平台工具添加到PATH中",
                "echo 'export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH' >> ~/.bashrc",
                "",
                "# 7. 重新加载bash配置使环境变量生效",
                "# 使用source命令立即应用更改",
                "source ~/.bashrc",
                "",
                "# 8. 静默安装Android 12（API 33）相关组件",
                "# 使用sdkmanager安装平台工具、Android 12平台和构建工具",
                "yes | sdkmanager \"platform-tools\" \"platforms;android-33\" \"build-tools;33.0.2\" >/dev/null"
            ]
        },
        {
            title: "4. Gradle 7.6 → 官方解压到$HOME，只加PATH",
            commands: [
                "# 1. 将当前工作目录切换到当前用户的家目录 ($HOME)",
                "cd $HOME",
                "",
                "# 2. 使用 wget 命令安静地（-q 选项）从指定URL下载 Gradle 7.6 的二进制分发版ZIP包",
                "wget -q https://services.gradle.org/distributions/gradle-7.6-bin.zip",
                "",
                "# 3. 使用 unzip 命令安静地（-q 选项）解压刚刚下载的 gradle-7.6-bin.zip 文件",
                "unzip -q gradle-7.6-bin.zip",
                "",
                "# 4. 将一行导出环境变量的命令追加（>>）到 ~/.bashrc 文件末尾，该命令将 Gradle 的 bin 目录添加到 PATH 中",
                "echo 'export PATH=$HOME/gradle-7.6/bin:$PATH' >> ~/.bashrc   # 唯一要改的路径",
                "",
                "# 5. 执行 source 命令使刚修改的 ~/.bashrc 配置文件在当前shell会话中立即生效",
                "source ~/.bashrc"
            ]
        },
        {
            title: "5. ecj.jar → 库放系统share，启动脚本放系统bin",
            commands: [
                "# 1. 强制删除 $PREFIX/share/ 目录下的 ecj.jar 文件（如果存在）",
                "rm -f $PREFIX/share/ecj.jar",
                "",
                "# 2. 使用 wget 安静模式下载指定URL的JAR文件，并输出保存为 $PREFIX/share/ecj.jar",
                "wget -q -O $PREFIX/share/ecj.jar \\",
                "  https://www.eclipse.org/downloads/download.php?file=/eclipse/downloads/drops4/R-4.15-202003050155/ecj-4.15.jar",
                "",
                "# 3. 使用 cat 和 here-document 将内容写入 $PREFIX/bin/ecj 文件，创建启动脚本",
                "cat > $PREFIX/bin/ecj <<'EOF'",
                "#!/bin/bash",
                "exec java -jar $PREFIX/share/ecj.jar \"$@\"",
                "EOF",
                "",
                "# 4. 为刚创建的 $PREFIX/bin/ecj 脚本添加可执行权限",
                "chmod +x $PREFIX/bin/ecj"
            ]
        },
        {
            title: "6. 全局Cordova",
            commands: [
                "npm i -g cordova"
            ]
        },
        {
            title: "7. 验证全部版本",
            commands: [
                "java -version",
                "gradle --version",
                "ecj -version",
                "cordova --version",
                "which aapt2 apksigner",
                "",
                "echo \"✅ 官方路径版15样齐活，直接 python your_script.py 开撸！\""
            ]
        }
    ]
};
