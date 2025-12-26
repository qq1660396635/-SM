const serverConfig = {
  title: "开机启动 - 服务器开发环境配置",
  sections: [
    {
      title: "备份 .bashrc",
      steps: [
        { 
          number: 1, 
          command: "cp ~/.bashrc ~/.bashrc.bak", 
          description: "备份现有配置文件" 
        }
      ]
    },
    {
      title: "在 .bashrc 末尾追加函数",
      steps: [
        { 
          number: 2, 
          command: `grep -qxF 'source $PREFIX/2025/func.sh' ~/.bashrc || echo 'source $PREFIX/2025/func.sh' >> ~/.bashrc`, 
          description: "添加函数文件到配置（避免重复）" 
        },
        { 
          number: 3, 
          command: `mkdir -p $PREFIX/2025`, 
          description: "创建脚本目录" 
        },
        { 
          number: 4, 
          command: `cat > $PREFIX/2025/func.sh <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash

# se 函数：切换到目录并运行 server.py
se(){
  read -erp "请输入目录: " dir
  [[ -d $dir ]] || { echo "目录不存在: $dir"; return 1; }
  cd "$dir" || return
  [[ -f server.py ]] && python server.py || echo "未找到 server.py"
}

# py 函数：运行指定的Python文件
py(){
  read -erp "请输入Python文件路径: " pyfile
  [[ -f "$pyfile" ]] || { echo "文件不存在: $pyfile"; return 1; }
  python "$pyfile"
}
EOF`, 
          description: "生成/更新函数文件" 
        },
        { 
          number: 5, 
          command: "chmod +x $PREFIX/2025/func.sh", 
          description: "赋予执行权限" 
        },
        { 
          number: 6, 
          command: "source ~/.bashrc", 
          description: "立即生效" 
        }
      ]
    },
    {
      title: "一键格式化 .bashrc",
      steps: [
        { 
          number: 7, 
          command: `cat > $PREFIX/2025/format_bashrc.sh <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash

# 备份原文件
cp ~/.bashrc ~/.bashrc.backup

# 创建新的 .bashrc
cat > ~/.bashrc <<'BASHRC_EOF'
# 最优先：Gradle 7.6（必须放在最前面）
export PATH=$HOME/gradle-7.6/bin:$PATH
# Android SDK
export ANDROID_HOME=$HOME/android-sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH
# 你的原有配置保持不变
$PREFIX/2025/start
$PREFIX/2025/leetcode.sh
alias s='source ~/.bashrc'
source $PREFIX/2025/func.sh
BASHRC_EOF

echo ".bashrc 格式化完成！"
echo "包含配置："
echo "- Gradle 7.6"
echo "- Android SDK"
echo "- 关键词启动"
echo "- 力扣题目"
echo "- 服务器函数(se, py)"
echo "- 快速重载别名(s)"
EOF`, 
          description: "创建格式化脚本" 
        },
        { 
          number: 8, 
          command: "chmod +x $PREFIX/2025/format_bashrc.sh", 
          description: "赋予执行权限" 
        },
        { 
          number: 9, 
          command: "$PREFIX/2025/format_bashrc.sh", 
          description: "执行格式化" 
        }
      ]
    }
  ]
};
