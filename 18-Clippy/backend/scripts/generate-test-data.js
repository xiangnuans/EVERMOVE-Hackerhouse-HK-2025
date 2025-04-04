/**
 * 测试数据生成脚本
 * 用于快速在开发环境中生成测试数据
 * 注意：此脚本会向数据库中添加测试数据，请谨慎在生产环境使用
 * 更新日期: 2025/04/04 - 支持最新的实体结构和文件处理逻辑
 */

const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 获取MongoDB连接URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clippy';

// 测试钱包地址(根据需要可自行替换为您的测试钱包)
const TEST_WALLET_ADDRESS = '0x9a10f0e7d3efae5dad6a73cb7e53a8a6c3aaeebf72db5fc6b48b19d5b973a15b';

// 文件下载URL的基础路径
const FILE_BASE_URL = process.env.FILE_BASE_URL || 'http://localhost:5471/api/files';

// 示例用户数据
const testUsers = [
  {
    walletAddress: TEST_WALLET_ADDRESS,
    username: '测试用户',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 示例Agent数据 (将关联到示例用户)
const testAgents = [
  {
    name: '金融分析助手',
    industry: '金融',
    description: '专注于金融市场分析和投资建议的AI助手',
    isActive: true,
    score: 85, // 评分字段 (0-100)
    feedback: '这是一个优秀的金融分析助手，能提供有价值的市场洞察',
    ratedAt: new Date(Date.now() - 3600000), // 评分时间（1小时前）
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '营销策略专家',
    industry: '市场营销',
    description: '帮助制定和优化营销策略的AI助手',
    isActive: true,
    score: 72, // 评分字段 (0-100)
    feedback: '营销建议有深度，但有时缺乏创新性',
    ratedAt: new Date(Date.now() - 7200000), // 评分时间（2小时前）
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '产品设计顾问',
    industry: '设计',
    description: '为产品设计提供创意和建议的AI助手',
    isActive: true,
    score: null, // 尚未评分
    feedback: null,
    ratedAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 上传目录检查与创建
function ensureUploadDirectoryExists() {
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    console.log(`创建上传目录: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

// 创建测试文件
function createTestFile(uploadDir, filename, content = 'This is a test file content.') {
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, content);
  return {
    path: filePath,
    size: fs.statSync(filePath).size
  };
}

// 生成测试文档数据
function generateTestDocuments(agentIds) {
  const uploadDir = ensureUploadDirectoryExists();
  const testDocs = [];
  
  // 为每个agent创建测试文档
  agentIds.forEach(agentId => {
    // 创建PDF测试文件
    const pdfFilename = `test_${crypto.randomBytes(8).toString('hex')}.pdf`;
    const pdfFile = createTestFile(uploadDir, pdfFilename, '%PDF-1.5\nTest PDF content\n%%EOF');
    
    testDocs.push({
      name: '季度财务报告',
      description: '2025年第一季度财务分析报告',
      fileName: pdfFilename,
      filePath: pdfFile.path,
      fileSize: pdfFile.size,
      fileType: 'pdf',
      agent: agentId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // 创建JPG测试文件
    const jpgFilename = `test_${crypto.randomBytes(8).toString('hex')}.jpg`;
    const jpgFile = createTestFile(uploadDir, jpgFilename, 'JFIF test image content');
    
    testDocs.push({
      name: '产品设计图',
      description: '最新产品设计概念图',
      fileName: jpgFilename,
      filePath: jpgFile.path,
      fileSize: jpgFile.size,
      fileType: 'jpg',
      agent: agentId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // 添加更多文件类型，以便测试文件控制器和下载功能
    // 创建TXT测试文件
    const txtFilename = `test_${crypto.randomBytes(8).toString('hex')}.txt`;
    const txtFile = createTestFile(uploadDir, txtFilename, '这是一个简单的文本文件，用于测试文件下载功能。');
    
    testDocs.push({
      name: '项目说明',
      description: '项目基本介绍和说明文档',
      fileName: txtFilename,
      filePath: txtFile.path,
      fileSize: txtFile.size,
      fileType: 'txt',
      agent: agentId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  
  return testDocs;
}

// 主函数
async function main() {
  console.log('==================================');
  console.log('Clippy 测试数据生成工具 (更新版)');
  console.log('==================================\n');
  
  let client;
  try {
    // 连接MongoDB
    console.log(`🔄 正在连接到数据库 ${MONGODB_URI}...`);
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ 数据库连接成功!');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    const agentsCollection = db.collection('agents');
    const documentsCollection = db.collection('documents');
    
    // 检查是否已存在测试数据
    const existingUser = await usersCollection.findOne({ walletAddress: TEST_WALLET_ADDRESS });
    if (existingUser) {
      console.log(`🔄 发现已存在的测试用户: ${existingUser._id}`);
      
      // 确认是否继续
      console.log('\n⚠️ 警告: 测试数据已存在，继续操作将添加更多测试数据.');
      console.log('要继续操作，请按Enter键；要取消操作，请按Ctrl+C');
      await new Promise(resolve => process.stdin.once('data', resolve));
    }
    
    // 插入用户数据
    console.log('\n🔄 正在创建测试用户...');
    const userResult = await usersCollection.insertMany(testUsers);
    console.log(`✅ 已创建 ${userResult.insertedCount} 个测试用户`);
    
    // 为第一个用户ID引用
    const userId = userResult.insertedIds[0];
    
    // 为Agent设置owner属性
    const agentsWithOwner = testAgents.map(agent => ({
      ...agent,
      owner: userId
    }));
    
    // 插入Agent数据
    console.log('\n🔄 正在创建测试Agent...');
    const agentResult = await agentsCollection.insertMany(agentsWithOwner);
    console.log(`✅ 已创建 ${agentResult.insertedCount} 个测试Agent`);
    
    // 获取Agent IDs
    const agentIds = Object.values(agentResult.insertedIds);
    
    // 生成Document数据
    const testDocuments = generateTestDocuments(agentIds);
    
    // 插入Document数据
    console.log('\n🔄 正在创建测试Document...');
    const docResult = await documentsCollection.insertMany(testDocuments);
    console.log(`✅ 已创建 ${docResult.insertedCount} 个测试Document`);
    
    // 打印摘要
    console.log('\n==================================');
    console.log('测试数据生成摘要:');
    console.log('==================================');
    console.log(`👤 用户: ${userResult.insertedCount}`);
    console.log(`🤖 Agent: ${agentResult.insertedCount}`);
    console.log(`📄 文档: ${docResult.insertedCount}`);
    console.log(`\n🔑 测试钱包地址: ${TEST_WALLET_ADDRESS}`);
    console.log('\n✨ 可以使用此钱包地址并利用sign-message.js生成签名来登录系统');
    
    // 内部API测试信息
    console.log('\n==================================');
    console.log('内部API测试信息:');
    console.log('==================================');
    console.log(`🔗 获取所有Agent及文件URL: GET http://localhost:5471/api/internal/agents`);
    
    // 打印第一个Agent的ID，用于评分测试
    if (agentIds.length > 0) {
      console.log(`🔗 Agent评分测试: POST http://localhost:5471/api/internal/agents/${agentIds[0]}/rating`);
      console.log(`   请求体: { "score": 90, "feedback": "这是一个测试评分" }`);
    }
    
    // 打印第一个文档的ID，用于文件下载测试
    if (docResult.insertedIds && Object.keys(docResult.insertedIds).length > 0) {
      const firstDocId = docResult.insertedIds[0];
      console.log(`🔗 文件下载测试: GET http://localhost:5471/api/files/${firstDocId}/download`);
    }
    
  } catch (error) {
    console.error('❌ 生成测试数据时出错:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔄 数据库连接已关闭');
    }
  }
}

main(); 