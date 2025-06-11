// 文件路径: app/dashboard/layout.tsx

import Link from "next/link";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* 侧边导航栏 */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h1 className="text-2xl font-bold mb-8">智云进销存</h1>
                <nav>
                    <ul>
                        <li>
                            <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
                                仪表盘
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/products" className="block py-2 px-4 rounded hover:bg-gray-700">
                                商品管理
                            </Link>
                        </li>
                        {/* 未来可以添加更多导航项 */}
                    </ul>
                </nav>
            </aside>

            {/* 主内容区域 */}
            <main className="flex-1 p-8 bg-gray-100">
                {children}
            </main>
        </div>
    );
}