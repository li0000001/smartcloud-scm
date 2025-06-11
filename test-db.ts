// 文件路径: test-db.ts

// 导入 dotenv 来加载 .env 文件中的环境变量
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// 明确地打印出将要使用的 DATABASE_URL，确保我们读取的是正确的
console.log('Attempting to connect with DATABASE_URL:', process.env.DATABASE_URL);

// 创建一个新的 PrismaClient 实例
const prisma = new PrismaClient({
    // 在日志中打印出所有查询和错误，获取更多信息
    log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
    ],
});

async function main() {
    try {
        console.log('Connecting to the database...');
        // 这是 Prisma 推荐的测试连接的方法
        await prisma.$connect();
        console.log('✅ Database connection successful!');

        console.log('Testing a simple query...');
        // 尝试执行一个最简单的查询
        const userCount = await prisma.user.count();
        console.log(`✅ Query successful! Found ${userCount} users in the database.`);

    } catch (error) {
        console.error('❌ Failed to connect to the database or execute query:');
        // 打印出完整的错误对象，而不是仅仅是错误信息
        console.error(error);
    } finally {
        console.log('Disconnecting from the database...');
        // 无论成功与否，都断开连接
        await prisma.$disconnect();
    }
}

// 执行主函数
main();