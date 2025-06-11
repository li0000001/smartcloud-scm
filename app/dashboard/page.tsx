// 文件路径: app/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-10 text-center bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-green-600">
          🎉 欢迎来到您的仪表盘！
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          这是一个受保护的页面，只有成功登录的用户才能看到。
        </p>
        {/* 在未来，这里会放上各种酷炫的数据图表 */}
      </div>
    </div>
  );
}