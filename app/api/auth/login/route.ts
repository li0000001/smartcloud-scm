// 文件路径: app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import prisma from "@/lib/prisma";
const JWT_SECRET = process.env.JWT_SECRET;
const MAX_AGE = 60 * 60 * 24 * 30; // 30天，单位是秒

export async function POST(request: Request) {
  if (!JWT_SECRET) {
    // 如果没有设置JWT_SECRET，这是严重的服务端配置错误
    console.error("JWT_SECRET is not set.");
    return new NextResponse("服务器配置错误", { status: 500 });
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. 验证输入
    if (!email || !password) {
      return new NextResponse("缺少邮箱或密码", { status: 400 });
    }

    // 2. 在数据库中查找用户
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // 为了安全，不明确提示是用户不存在还是密码错误
      return new NextResponse("无效的凭证", { status: 401 });
    }

    // 3. 比较用户输入的密码和数据库中加密的密码
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      return new NextResponse("无效的凭证", { status: 401 });
    }

    // 4. 密码正确，生成登录令牌 (JWT)
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // 令牌中包含的信息
      JWT_SECRET,                             // 使用我们的密钥签名
      { expiresIn: MAX_AGE }                   // 设置过期时间
    );

    // 5. 将令牌序列化成一个安全的、仅Http可访问的Cookie
    const sessionCookie = serialize("session", token, {
      httpOnly: true, // 防止客户端JS脚本访问
      secure: process.env.NODE_ENV === "production", // 仅在HTTPS下发送
      maxAge: MAX_AGE, // Cookie过期时间
      path: "/",       // Cookie在整个网站都可用
    });

    // 6. 在响应头中设置Cookie，并返回成功消息
    return new NextResponse(JSON.stringify({ message: "登录成功" }), {
      status: 200,
      headers: { "Set-Cookie": sessionCookie },
    });

  } catch (error) {
    console.error("登录时发生错误:", error);
    return new NextResponse("服务器内部错误", { status: 500 });
  }
}
