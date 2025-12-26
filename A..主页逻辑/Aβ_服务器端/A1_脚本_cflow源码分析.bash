#!/data/data/com.termux/files/usr/bin/bash
# 一键中文分析：调用树 + 符号列表，接收C代码字符串
set -euo pipefail

# 1. 检查工具是否安装
check_tools() {
    local missing=()
    command -v cflow >/dev/null 2>&1 || missing+=("cflow")
    command -v ctags >/dev/null 2>&1 || missing+=("ctags")
    command -v jq >/dev/null 2>&1 || missing+=("jq")
    
    if [ ${#missing[@]} -gt 0 ]; then
        echo "❌ 缺少以下工具，请先安装："
        for tool in "${missing[@]}"; do
            case $tool in
                cflow) echo "   - cflow: 函数调用关系分析器" ;;
                ctags) echo "   - ctags: 源代码符号提取器" ;;
                jq) echo "   - jq: JSON处理器" ;;
            esac
        done
        echo ""
        echo "安装命令："
        echo "   pkg install cflow universal-ctags jq"
        return 1
    fi
    return 0
}

# 2. 检查工具
if ! check_tools; then
    exit 1
fi

# 3. 把标准输入完整读进变量
src=$(cat)

# 4. 使用mktemp创建临时文件
tmpc=$(mktemp --suffix=.c) || {
    tmpc="/data/data/com.termux/files/usr/tmp/_cflow_$$.c"
    touch "$tmpc" 2>/dev/null || {
        tmpc="./_cflow_$$.c"
        touch "$tmpc"
    }
}

# 5. 预处理：格式化C代码
if [[ "$src" != *$'\n'* ]]; then
    # 如果没有换行符，自动格式化
    src=$(echo "$src" | sed 's/#include /#include /g; s/void /\
void /g; s/int /\
int /g; /{/ { s/{/{\
    /g; }')
fi

# 6. 写入临时C文件
printf '%s\n' "$src" > "$tmpc"

# 7. 生成分析报告
echo "# C代码分析报告"
echo "> 生成时间：$(date "+%Y-%m-%d %H:%M:%S")"
echo ""

# 8. 生成调用树
echo "## 一、函数调用关系"
echo ""

if cflow "$tmpc" 2>/dev/null | awk '
BEGIN{idx=1}
/^[^ \t]/{gsub(/<.*>/,"");gsub(/\(.*\)/,"");gsub(/^[ \t]+|[ \t]+$/,"");if($0!="")printf "%2d. %s\n",idx++,$0}
/^[ \t]+/{gsub(/<.*>/,"");gsub(/\(.*\)/,"");gsub(/^[ \t]+|[ \t]+$/,"");if($0!="")printf "    ├─ %s\n",$0}
'; then
    echo "⚠️ 未检测到函数调用关系"
fi

echo ""

# 9. 生成符号列表
echo "## 二、符号列表"
echo ""

ctags --output-format=json \
    --kinds-c=+c+d+e+f+g+l+m+n+p+s+t+u+v+x \
    --kinds-c++=+c+d+e+f+g+l+m+n+p+s+t+u+v+x \
    --fields=+iafkmnsSt \
    --extras=+F+q+r \
    "$tmpc" 2>/dev/null \
| jq -r 'select(.name|startswith("__anon")|not)|(.kind+"\t"+.name)' \
| awk -v OFS="" '
BEGIN{
    map["f"]="函数"; map["p"]="原型"; map["d"]="宏定义"
    map["s"]="结构体"; map["u"]="联合体"; map["e"]="枚举"
    map["g"]="枚举值"; map["t"]="类型"; map["v"]="变量"
    map["l"]="局部"; map["h"]="头文件"; map["x"]="外部变量"
}
{
    k=(($1 in map)?map[$1]:$1); list[k]=list[k] (list[k]?" ":"") $2
}
END{
    idx=0
    for(k in list){
        n=split(list[k],arr," ")
        printf "**%s**：\n",k
        for(i=1;i<=n;i++){
            idx++
            printf " %2d. %-22s",idx,arr[i]
            if(i%3==0) printf "\n"
        }
        if(n%3) printf "\n"
        printf "\n"
    }
}'

# 10. 清理临时文件
rm -f "$tmpc"
