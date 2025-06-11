// 文件路径: middleware.ts (在项目根目录)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 定义需要保护的路由
const PROTECTED_ROUTES = ["/dashboard"];
// 定义认证相关的路由（登录用户不应再次访问）
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  // 场景 1: 用户已登录 (有 session cookie)
  if (sessionCookie) {
    // 如果他想访问登录或注册页面，就将他重定向到仪表盘
    if (AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 场景 2: 用户未登录 (没有 session cookie)
  if (!sessionCookie) {
    // 如果他想访问受保护的页面，就将他重定向到登录页
    if (PROTECTED_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 如果以上场景都不满足，就允许他访问请求的页面
  return NextResponse.next();
}

// 配置中间件要对哪些路径生效
export const config = {
  matcher: [
    /*
     * 匹配除了API、_next/static、_next/image和favicon.ico之外的所有请求路径
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}