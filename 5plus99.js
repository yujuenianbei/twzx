// 5+99 脚本示例
// 这个脚本演示从 5 开始，每次加 1，执行 99 次

function calculate5Plus99() {
    let start = 5;
    let count = 99;
    
    console.log("开始计算：5 + 99");
    console.log("初始值:", start);
    console.log("累加次数:", count);
    
    // 方法1: 直接计算
    let result1 = start + count;
    console.log("\n方法1 - 直接相加结果:", result1);
    
    // 方法2: 循环累加
    let result2 = start;
    for (let i = 0; i < count; i++) {
        result2++;
    }
    console.log("方法2 - 循环累加结果:", result2);
    
    // 方法3: 显示每一步
    console.log("\n方法3 - 逐步显示:");
    let current = start;
    for (let i = 1; i <= count; i++) {
        current++;
        if (i <= 10 || i > count - 5) {
            console.log(`第${i}步: ${start} + ${i} = ${current}`);
        } else if (i === 11) {
            console.log("... (省略中间步骤) ...");
        }
    }
    
    return result1;
}

// 执行脚本
calculate5Plus99();
