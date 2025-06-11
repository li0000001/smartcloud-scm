// 文件路径: app/api/products/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

// 定义一个类型来描述 Prisma 错误中可能包含 code 的结构
type PrismaErrorWithCode = {
    code?: string;
};

// 创建一个类型谓词函数，用于检查错误是否是我们想要的特定类型
function isPrismaP2002Error(error: unknown): error is PrismaErrorWithCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as PrismaErrorWithCode).code === 'P2002'
  );
}

// --- 处理 POST 请求 - 新增商品 ---
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


// --- 处理 GET 请求 - 获取商品列表 ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
    const user = await getUserFromSession();
    if (!user) {
        return new NextResponse("未授权访问", { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("PRODUCT_GET_ERROR", error);
        return new NextResponse("服务器内部错误", { status: 500 });
    }
}