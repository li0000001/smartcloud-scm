// 文件路径: lib/auth.ts

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
// import prisma from "./prisma"; // 因为暂时不用，所以注释掉这行

// 定义 JWT 令牌中包含的数据结构
interface UserPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

// 这是我们的核心函数，用来从 session cookie 中获取用户信息
export async function getUserFromSession() {
    const cookieStore = await cookies(); 
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decoded = jwt.verify(
            sessionCookie,
            process.env.JWT_SECRET!
        ) as UserPayload;
        
        // 直接返回解码后的用户信息，性能最高
        return { id: decoded.userId, email: decoded.email };

    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (_) {
        return null;
    }
}