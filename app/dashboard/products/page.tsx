// 文件路径: app/dashboard/products/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { Product } from "@prisma/client"; // 直接从 Prisma Client 导入类型

// 定义表单数据类型
type ProductFormData = {
    name: string;
    sku: string;
    barcode?: string | null; // 允许是 string, null, 或 undefined
    unit: string;
    price?: number | null; // 允许是 number, null, 或 undefined
    cost?: number | null; // 允许是 number, null, 或 undefined
};

export default function ProductsPage() {
    // ...
    // useState 的初始值也要匹配这个新类型
    const [formData, setFormData] = useState<ProductFormData>({
        name: '', sku: '', unit: '个', price: 0, cost: 0, barcode: ''
    });

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<ProductFormData>>({
        name: '', sku: '', unit: '个', price: 0, cost: 0, barcode: ''
    });

    // 获取商品列表的函数
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            const data = await res.json();
            setProducts(data);
        } catch (err: unknown) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 组件加载时获取数据
    useEffect(() => {
        fetchProducts();
    }, []);

    // 处理表单提交
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(errorData || "Failed to create product");
            }

            setIsModalOpen(false); // 关闭弹窗
            fetchProducts(); // 重新获取列表
        } catch (err: unknown) {
            alert(`Error: ${err.message}`);
        }
    };

    // 处理输入框变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">商品管理</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    新增商品
                </button>
            </div>

            {/* 商品列表 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                {isLoading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
<th className="p-2 text-gray-900">商品名称</th>
                                <th className="p-2 text-gray-900">SKU</th>
                                <th className="p-2 text-gray-900">单位</th>
                                <th className="p-2 text-gray-900">售价</th>
                                <th className="p-2 text-gray-900">成本</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map(product => (
                                    <tr key={product.id} className="border-b hover:bg-gray-50">
<td className="p-2 text-gray-900">{product.name}</td>
                                        <td className="p-2 text-gray-900">{product.sku}</td>
                                        <td className="p-2 text-gray-900">{product.unit}</td>
                                        <td className="p-2 text-gray-900">{product.price?.toString() || 'N/A'}</td>
                                        <td className="p-2 text-gray-900">{product.cost?.toString() || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-4 text-gray-500">
                                        暂无商品，请点击右上角新增。
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 新增商品弹窗 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">新增商品</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-gray-700">商品名称 *</label>
                                <input type="text" name="name" required onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="text-gray-700">SKU *</label>
                                <input type="text" name="sku" required onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="text-gray-700">单位 *</label>
                                <input type="text" name="unit" required defaultValue="个" onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="text-gray-700">售价</label>
                                <input type="number" name="price" step="0.01" onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="text-gray-700">成本</label>
                                <input type="number" name="cost" step="0.01" onChange={handleInputChange} className="w-full p-2 border rounded" />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">取消</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">保存</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
