#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# 555 + 999 计算脚本

print("=== 555 + 999 计算脚本 ===\n")

# 方法1: 直接相加
result = 555 + 999
print(f"方法1 - 直接相加：555 + 999 = {result}")

# 方法2: 分解计算
a = 555
b = 999
print(f"\n方法2 - 分解计算:")
print(f"  {a} + {b}")
print(f"  = {a} + (1000 - 1)")
print(f"  = {a} + 1000 - 1")
print(f"  = {a + 1000} - 1")
print(f"  = {result}")

# 方法3: 二进制演示
print(f"\n方法3 - 验证结果:")
print(f"  555 的二进制：{bin(555)}")
print(f"  999 的二进制：{bin(999)}")
print(f"  结果的二进制：{bin(result)}")
print(f"  结果转十进制验证：{int(bin(result), 2)} (应等于 {result})")

print(f"\n=== 最终结果：555 + 999 = {result} ===")
