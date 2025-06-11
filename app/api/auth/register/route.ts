// 文件路径: app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

// 创建一个数据库连接的实例
const prisma = new PrismaClient();

// 定义一个处理 POST 请求的函数
export async function POST(request: Request) {
  try {
    // 1. 从用户请求中解析出 JSON 数据 (即邮箱和密码)
    const body = await request.json();
    const { email, password } = body;

    // 2. 基本验证：确保邮箱和密码都已提供
    if (!email || !password) {
      return new NextResponse("缺少邮箱或密码", { status: 400 });
    }

    // 3. 检查数据库，看看这个邮箱是否已经被注册了
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return new NextResponse("该邮箱已被注册", { status: 409 });
    }

    // 4. 使用 bcrypt 工具将原始密码加密
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. 在数据库的 User 表中创建一条新的用户记录
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword, // 存储的是加密后的密码
      },
    });

    // 6. 向用户返回一个成功的响应，告诉他注册成功了
    return NextResponse.json(user);

  } catch (error) {
    // 如果中间任何环节出错，打印错误日志并返回服务器错误
    console.error("注册时发生错误:", error);
    return new NextResponse("服务器内部错误", { status: 500 });
  }
}