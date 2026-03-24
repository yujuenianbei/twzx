#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单的加法脚本
支持两种模式：
1. 命令行参数模式：python add.py 5 3
2. 交互模式：直接运行 python add.py，然后输入两个数字
"""

import sys


def add(a, b):
    """返回两个数的和"""
    return a + b


def main():
    # 如果提供了命令行参数
    if len(sys.argv) == 3:
        try:
            num1 = float(sys.argv[1])
            num2 = float(sys.argv[2])
            result = add(num1, num2)
            print(f"{num1} + {num2} = {result}")
        except ValueError:
            print("错误：请提供有效的数字")
            sys.exit(1)
    else:
        # 交互模式
        print("=== 简单加法计算器 ===")
        print("输入 'q' 退出程序")
        
        while True:
            try:
                user_input1 = input("\n请输入第一个数字: ")
                if user_input1.lower() == 'q':
                    print("再见！")
                    break
                
                user_input2 = input("请输入第二个数字: ")
                if user_input2.lower() == 'q':
                    print("再见！")
                    break
                
                num1 = float(user_input1)
                num2 = float(user_input2)
                result = add(num1, num2)
                
                print(f"结果: {num1} + {num2} = {result}")
                
            except ValueError:
                print("错误：请输入有效的数字")
            except KeyboardInterrupt:
                print("\n\n程序中断，再见！")
                break


if __name__ == "__main__":
    main()
