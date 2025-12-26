const keywordInstallConfig = {
  title: "一键安装 - 关键词启动脚本",
  sections: [
    {
      title: "一键安装 begin",
      steps: [
        { 
          number: 0, 
          command: "rm -f $PREFIX/2025/kw.txt $PREFIX/2025/start", 
          description: "如有旧文件先清掉（可选）" 
        },
        { 
          number: 1, 
          command: "mkdir -p $PREFIX/2025", 
          description: "确保目录存在" 
        },
        { 
          number: 2, 
          command: `cat > $PREFIX/2025/kw.txt <<'EOF'
进程调度
内存管理
虚拟文件系统
网络子系统
中断处理
系统调用
文件描述符
缺页异常
信号量
死锁
cron
EOF`, 
          description: "写入核心关键词" 
        },
        { 
          number: 3, 
          command: `cat > $PREFIX/2025/start <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
while :; do
    kw=$(shuf -n 1 $PREFIX/2025/kw.txt)
    response=$(curl -s "https://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key=$kw")
    abstract=$(echo "$response" | jq -r '.abstract // ""')
    [[ -n $abstract ]] && break
done

# 自然分段处理：将句号替换为换行，去除多余内容，每行前加两个空格
abstract=$(echo "$abstract" | sed 's/。/。\n/g' | sed 's/\\[[0-9]*\\]//g' | sed 's/^[[:space:]]*//' | sed '/^$/d' | sed 's/^/  /')
printf "【%s】\\n%s\\n" "$kw" "$abstract"
EOF`, 
          description: "生成 start 脚本" 
        },
        { 
          number: 4, 
          command: "chmod +x $PREFIX/2025/start", 
          description: "赋权 & 注入 .bashrc" 
        },
        { 
          number: 5, 
          command: "sed -i '\\|$PREFIX/.*/start|d' $HOME/.bashrc", 
          description: "清理旧配置" 
        },
        { 
          number: 6, 
          command: "echo '$PREFIX/2025/start' >> $HOME/.bashrc", 
          description: "添加到 .bashrc" 
        }
      ]
    }
  ]
};
