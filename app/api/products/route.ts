// 文件路径: app/api/products/route.ts (用于 POST 和 GET)

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth"; // 我们需要一个新的工具函数来获取用户信息

// 处理 POST 请求 - 新增商品
// 文件路径: app/api/products/route.ts

// ... (文件顶部的其他 import 语句保持不变)

// 在文件顶部，或者函数外部，定义一个类型来描述 Prisma 的错误结构
type PrismaError = {
  code?: string;
};

// 创建一个类型谓词函数，用于检查错误是否是我们想要的特定类型
function isPrismaP2002Error(error: unknown): error is PrismaError & { code: 'P2002' } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as PrismaError).code === 'P2002'
  );
}

// --- 这是你要替换的整个 POST 函数 ---
export async function POST(request: Request) {
    const user = await getUserFromSession();
    if (!user) {
        return new NextResponse("未授权访问", { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, sku, unit, price, cost, barcode } = body;

        if (!name || !sku || !unit) {
            return new NextResponse("缺少必填字段", { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                sku,
                unit,
                price,
                cost,
                barcode,
                userId: user.id,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        // 使用我们创建的类型谓词函数进行检查
        if (isPrismaP2002Error(error)) {
            return new NextResponse("该SKU已存在，请使用其他SKU", { status: 409 });
        }
        
        // 如果不是我们预期的特定错误，就按通用方式处理
        console.error("PRODUCT_POST_ERROR", error);
        return new NextResponse("服务器内部错误", { status: 500 });
    }
}

