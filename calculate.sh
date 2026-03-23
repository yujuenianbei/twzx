#!/bin/bash
# 5+9 计算脚本

# 方法1: 使用 expr
result1=$(expr 5 + 9)
echo "方法1 (expr): 5 + 9 = $result1"

# 方法2: 使用 $(( ))
result2=$((5 + 9))
echo "方法2 (\$(( ))): 5 + 9 = $result2"

# 方法3: 使用 let
let result3=5+9
echo "方法3 (let): 5 + 9 = $result3"

# 方法4: 使用 bc
result4=$(echo "5 + 9" | bc)
echo "方法4 (bc): 5 + 9 = $result4"

echo ""
echo "最终结果: 5 + 9 = $result2"
