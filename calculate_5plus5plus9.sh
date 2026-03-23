#!/bin/bash

# 5+5+9 计算脚本

# 方法1：使用 $(( )) 进行算术扩展（推荐）
result1=$((5 + 5 + 9))
echo "方法1 (使用 \$(( ))): 5 + 5 + 9 = $result1"

# 方法2：使用 expr 命令
result2=$(expr 5 + 5 + 9)
echo "方法2 (使用 expr): 5 + 5 + 9 = $result2"

# 方法3：使用 let 命令
let "result3 = 5 + 5 + 9"
echo "方法3 (使用 let): 5 + 5 + 9 = $result3"

# 方法4：使用 bc 计算器（支持浮点运算）
result4=$(echo "5 + 5 + 9" | bc)
echo "方法4 (使用 bc): 5 + 5 + 9 = $result4"

echo ""
echo "最终结果: $result1"
