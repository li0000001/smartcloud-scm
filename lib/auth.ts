// 文件路径: lib/auth.ts

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

// 定义 JWT 令牌中包含的数据结构
interface UserPayload {
    userId: string;
    email: string;
    // iat 和 exp 会被 jsonwebtoken 自动添加
    iat: number;
    exp: number;
}

// 这是我们的核心函数，用来从 session cookie 中获取用户信息
export async function getUserFromSession() {
    // 第 1 步：用 await 等待 cookies() 这个 Promise 完成，拿到真正的 cookie 管理器对象
    const cookieStore = await cookies(); 
    
    // 第 2 步：在真正的 cookie 管理器对象上，安全地调用 .get()
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decoded = jwt.verify(
            sessionCookie,
            process.env.JWT_SECRET!
        ) as UserPayload;

        // 为了性能和安全，通常直接返回解码后的用户信息即可
        // 如果需要确保用户未被删除，可以取消下面的数据库查询注释
        /*
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true },
        });
        return user;
        */

        return { id: decoded.userId, email: decoded.email };

    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (_) {
        // 如果 token 无效、过期或解密失败，jwt.verify 会抛出错误
        return null;
    }
}