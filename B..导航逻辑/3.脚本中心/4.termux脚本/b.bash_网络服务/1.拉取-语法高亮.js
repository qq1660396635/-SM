const prismDownloadConfig = {
  title: "Prism「三大件」下载脚本",
  sections: [
    {
      title: "Prism 语法高亮全家桶下载",
      steps: [
        {
          number: 1,
          command: `#!/usr/bin/env bash
# 0. 建目录
mkdir -p ~/storage/downloads/prism-down && cd ~/storage/downloads/prism-down

# 一. 必须下载（Prism 运行所需）
# 1. 核心解析器 prism.min.js
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js
# 2. 默认主题 prism.min.css
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css
# 3. 自动加载插件 prism-autoloader.min.js
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js`,
          description: "1. 创建目录并下载核心文件"
        },
        {
          number: 2,
          command: `# 二. 可选语言（按需留行）
# 4. Python
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js
# 5. C
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js
# 6. Java
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js
# 7. JavaScript
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js
# 8. HTML/XML
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js
# 9. CSS
curl -sO https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js

echo "✔ 全部下载完成，文件在 ~/storage/downloads/prism-down"`,
          description: "2. 下载常用语言包"
        }
      ]
    }
  ]
};
