#!/data/data/com.termux/files/usr/bin/python3
# -*- coding: utf-8 -*-
"""
Termux 专用：完全递归，目录即分类，文件进对应分类，描述无空格
300图标库随机分配，前300不重复，后续可重复
仅扫描HTML文件（.html, .htm），忽略JS文件
"""

from pathlib import Path
import json
import random

ROOT_DIR    = Path("/storage/emulated/0/Download/OnePlus Share/05_APP/苏沫V/B..导航逻辑")
CONFIG_FILE = ROOT_DIR / "/storage/emulated/0/Download/OnePlus Share/05_APP/苏沫V/A2_全局中心/全局导航/1_nav.config.js"

# 1. 创建300个图标库（包含各种主题：动物、植物、物品、符号等）
ICON_LIBRARY = [
    # 动物类 (1-50)
    "🦕", "🦖", "🐉", "🦎", "🐍", "🦕", "🦖", "🐊", "🦎", "🐍",
    "🦅", "🦆", "🦢", "🦉", "🦤", "🪶", "🦩", "🦚", "🦜", "🦃",
    "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦇", "🦋",
    "🐌", "🐛", "🐜", "🐝", "🪲", "🐞", "🦗", "🪳", "🦟", "🦗",
    "🕷️", "🕸️", "🦂", "🦀", "🦞", "🦐", "🦑", "🐙", "🦪", "🐚",
    
    # 植物类 (51-100)
    "🌳", "🌲", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂",
    "🍃", "🌱", "🌼", "🌻", "🌺", "🌸", "🌷", "🌹", "🥀", "🌾",
    "🌵", "🎄", "🌲", "🌳", "🌴", "🌿", "🍀", "🌺", "🌻", "🌹",
    "🌸", "🌷", "🌼", "🌱", "🌾", "🍃", "🍁", "🍂", "🌵", "🎋",
    "🎍", "🪴", "🪹", "🪺", "🌾", "🌿", "☘️", "🍀", "🌿", "🌱",
    
    # 食物类 (101-150)
    "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒",
    "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬",
    "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠",
    "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞",
    "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕",
    
    # 物品类 (151-200)
    "💎", "💍", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🎮", "🕹️",
    "📷", "📸", "📹", "🎥", "📼", "📞", "☎️", "📟", "📠", "📺",
    "📻", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌚", "⏳",
    "⌛", "🔓", "🔒", "🔏", "🔐", "🔑", "🗝️", "🔨", "⛏️", "⚒️",
    "🛠️", "🗡️", "⚔️", "🔫", "🏹", "🪓", "🔧", "🔩", "⚙️", "🗜️",
    
    # 符号类 (201-250)
    "⭐", "🌟", "✨", "💫", "☄️", "🌙", "🌛", "🌜", "🌚", "🌝",
    "🌞", "🪐", "💥", "🔥", "❄️", "💧", "🌊", "🎆", "🎇", "✨",
    "🎈", "🎉", "🎊", "🎋", "🎍", "🎎", "🎏", "🎐", "🎑", "🧧",
    "🎁", "🎀", "🎗️", "🎟️", "🎫", "🎖️", "🏆", "🏅", "🥇", "🥈",
    "🥉", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏",
    
    # 特殊类 (251-300)
    "🎯", "🪀", "🪁", "🎱", "🔮", "🪄", "🧿", "🎭", "🎪", "🎨",
    "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🪘", "🎷", "🎺", "🎸",
    "🪕", "🎻", "🎲", "♟️", "🃏", "🀄", "🎴", "🎰", "🧩", "🪬",
    "🪩", "🪪", "🔰", "🏧", "🚮", "🚰", "♿", "🚹", "🚺", "🚻",
    "🚼", "🚾", "🛂", "🛃", "🛄", "🛅", "⚠️", "🚸", "⛔", "🚫"
]

def scan(root: Path):
    """2. 返回 {分类名: 文件对象, ..., ...} 与总文件数"""
    cats = {}
    total = 0
    icon_index = 0  # 用于追踪图标分配
    
    def dfs(base: Path):
        nonlocal total, icon_index
        rel = str(base.relative_to(root)).replace('\\', '/')
        key = '' if rel == '.' else rel        # 根目录文件用空字符串当 key
        files = []
        
        for p in sorted(base.iterdir()):
            if p.is_file():
                # 添加文件扩展名过滤：只处理HTML文件
                if p.suffix.lower() in ['.html', '.htm']:
                    # 3. 图标分配逻辑：前300个不重复，之后可重复
                    if icon_index < len(ICON_LIBRARY):
                        icon = ICON_LIBRARY[icon_index]
                    else:
                        icon = random.choice(ICON_LIBRARY)
                    
                    files.append({
                        "name": p.stem,
                        "file": f"/B..导航逻辑/{rel}/{p.name}" if rel else f"/B..导航逻辑/{p.name}",
                        "icon": icon,
                        "description": f"{p.stem}页面"      # ← 无空格
                    })
                    total += 1
                    icon_index += 1
                # 忽略非HTML文件（包括JS文件）
            else:
                dfs(p)                             # 递归子目录
        
        if files:
            cats[key] = files
    
    dfs(root)
    return cats, total

def generate_js(cats, total):
    """4. 生成JavaScript配置文件"""
    lines = ['(function(){']
    lines.append('console.log("正在加载导航配置...");')
    lines.append(f'window.__fileCount = {total};')
    lines.append('window.navConfig = {')
    
    for cat, arr in cats.items():
        k = cat or '根目录'          # 根目录文件给个中文 key
        lines.append(f'  "{k}": [')
        for i, obj in enumerate(arr):
            comma = ',' if i < len(arr) - 1 else ''
            lines.append(f'    {json.dumps(obj, ensure_ascii=False)}{comma}')
        lines.append('  ],')
    
    # 移除最后一个逗号
    if lines[-1].endswith(','):
        lines[-1] = lines[-1][:-1]
    
    lines.append('};')
    lines.append('})();')
    
    return '\n'.join(lines)

def main():
    """5. 主函数：扫描目录并生成配置"""
    if not ROOT_DIR.exists():
        print("目录不存在：", ROOT_DIR)
        exit(1)
    
    cats, total = scan(ROOT_DIR)
    js_content = generate_js(cats, total)
    
    CONFIG_FILE.write_text(js_content, encoding='utf-8')
    print('✅ 配置已生成：', CONFIG_FILE)
    print('📁 总HTML文件数：', total)
    print('🎨 图标库大小：', len(ICON_LIBRARY))
    if total > len(ICON_LIBRARY):
        print('⚠️  文件数超过图标库，部分图标将重复使用')

if __name__ == '__main__':
    main()
