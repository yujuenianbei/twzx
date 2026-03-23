#!/usr/bin/env node

// 555 + 999 计算脚本

console.log("=== 555 + 999 计算脚本 ===\n");

// 方法1: 直接相加
const result = 555 + 999;
console.log("方法1 - 直接相加: 555 + 999 = " + result);

// 方法2: 分解计算
const a = 555;
const b = 999;
console.log("\n方法2 - 分解计算:");
console.log("  " + a + " + " + b);
console.log("  = " + a + " + (1000 - 1)");
console.log("  = " + a + " + 1000 - 1");
console.log("  = " + (a + 1000) + " - 1");
console.log("  = " + result);

// 方法3: 位运算演示 (仅用于展示)
console.log("\n方法3 - 验证结果:");
console.log("  555 的二进制: " + 555.toString(2));
console.log("  999 的二进制: " + 999.toString(2));
console.log("  结果的二进制: " + result.toString(2));
console.log("  结果转十进制验证: " + parseInt(result.toString(2), 2) + " (应等于 " + result + ")");

console.log("\n=== 最终结果: 555 + 999 = " + result + " ===");
