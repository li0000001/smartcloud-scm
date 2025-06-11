// 文件路径: lib/auth.ts

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

interface UserPayload {
    userId: string;
    email: string;
}

export async function getUserFromSession() {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) {
        return null;
    }

    try {
        const decoded = jwt.verify(
            sessionCookie,
            process.env.JWT_SECRET!
        ) as UserPayload;

        // 可以选择性地从数据库再获取一次最新的用户信息
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true }, // 只选择需要的字段
        });

        return user;
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (_) {
        return null;
    }
}