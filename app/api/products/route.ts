// 文件路径: app/api/products/route.ts (用于 POST 和 GET)

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth"; // 我们需要一个新的工具函数来获取用户信息

// 处理 POST 请求 - 新增商品
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
                userId: user.id, // 将商品与当前登录用户关联
            },
        });

        return NextResponse.json(product);
    } catch (error: unknown) {
        // 处理 sku 唯一性冲突的错误
        if (error.code === 'P2002') {
            return new NextResponse("该SKU已存在，请使用其他SKU", { status: 409 });
        }
        console.error("PRODUCT_POST_ERROR", error);
        return new NextResponse("服务器内部错误", { status: 500 });
    }
}

// 处理 GET 请求 - 获取商品列表
export async function GET(_request: Request) {
    const user = await getUserFromSession();
    if (!user) {
        return new NextResponse("未授权访问", { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                userId: user.id, // 只获取当前登录用户的商品
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
