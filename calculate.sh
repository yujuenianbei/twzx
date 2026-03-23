#!/bin/bash

# 4+8 计算脚本

# 方法1：使用 expr
result1=$(expr 4 + 8)
echo "方法1 (expr): 4 + 8 = $result1"

# 方法2：使用 $(( ))
result2=$((4 + 8))
echo "方法2 (\$(( ))): 4 + 8 = $result2"

# 方法3：使用 let
let result3=4+8
echo "方法3 (let): 4 + 8 = $result3"

# 方法4：使用 bc（如果可用）
if command -v bc &> /dev/null; then
    result4=$(echo "4 + 8" | bc)
    echo "方法4 (bc): 4 + 8 = $result4"
else
    echo "方法4 (bc): bc 命令未安装，跳过"
fi

echo ""
echo "最终结果：4 + 8 = $result2"
