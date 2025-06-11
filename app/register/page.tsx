// 文件路径: app/register/page.tsx

"use client"; // 这是一句指令，告诉系统这个组件需要在用户的浏览器里运行

import { useState } from "react";
import { useRouter } from "next/navigation";

// 这就是我们的注册页面组件
export default function RegisterPage() {
  // 使用 useState 来管理用户输入的内容和页面的状态
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");       // 用于存放错误消息
  const [success, setSuccess] = useState("");   // 用于存放成功消息
  const router = useRouter(); // 这是一个用于页面跳转的工具

  // 当用户点击“注册”按钮时，这个函数会被调用
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止浏览器默认的表单提交行为
    setError("");       // 清空之前的错误消息
    setSuccess("");     // 清空之前的成功消息

    // 检查两次输入的密码是否一致
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    // 使用 fetch 函数向我们的“注册办公室” (API) 发送请求
    const res = await fetch("/api/auth/register", {
      method: "POST", // 请求方法是 POST
      headers: {
        "Content-Type": "application/json", // 告诉服务器我们发送的是 JSON 数据
      },
      body: JSON.stringify({ email, password }), // 将用户的输入打包成 JSON 字符串
    });

    // 处理来自服务器的响应
    if (res.ok) {
      setSuccess("注册成功！2秒后将自动跳转...");
      setTimeout(() => {
        router.push("/login"); // 2秒后跳转到登录页
      }, 2000);
    } else {
      // 如果服务器返回错误，我们就显示错误信息
      const data = await res.text();
      setError(data || "注册失败，请稍后再试。");
    }
  };

  // 下面是页面的 HTML 结构和样式 (使用 Tailwind CSS)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          注册新账号
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">邮箱地址</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">密码</label>
            <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">确认密码</label>
            <input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div>
            <button type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              注册
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}