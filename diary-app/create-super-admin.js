// Script để tạo Super Admin đầu tiên
// Chạy: node create-super-admin.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createSuperAdmin() {
  try {
    console.log('\n🛡️  Tạo Super Admin cho Diary App\n');
    console.log('='.repeat(50));
    
    // Lấy thông tin từ .env
    require('dotenv').config();
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ Không tìm thấy MONGODB_URI trong file .env');
      process.exit(1);
    }

    // Nhập thông tin Super Admin
    const name = await question('\n👤 Nhập tên Super Admin: ');
    const email = await question('📧 Nhập email: ');
    const password = await question('🔒 Nhập mật khẩu (tối thiểu 6 ký tự): ');
    const groupId = await question('🏢 Nhập mã nhóm: ');

    if (password.length < 6) {
      console.error('❌ Mật khẩu phải có ít nhất 6 ký tự');
      process.exit(1);
    }

    // Kết nối MongoDB
    console.log('\n⏳ Đang kết nối MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Kết nối thành công!');

    const db = client.db();
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      console.log('\n⚠️  Email đã tồn tại trong hệ thống.');
      const update = await question('Bạn có muốn cập nhật user này thành Super Admin? (y/n): ');
      
      if (update.toLowerCase() === 'y') {
        await db.collection('users').updateOne(
          { email },
          { $set: { isSuperAdmin: true } }
        );
        console.log('✅ Đã cập nhật user thành Super Admin!');
      } else {
        console.log('❌ Đã hủy');
      }
      await client.close();
      rl.close();
      return;
    }

    // Hash password
    console.log('\n⏳ Đang mã hóa mật khẩu...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo user mới
    const user = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      groupId,
      isGroupAdmin: false,
      isSuperAdmin: true,
      createdAt: new Date(),
    };

    await db.collection('users').insertOne(user);
    
    console.log('\n✅ ĐÃ TẠO SUPER ADMIN THÀNH CÔNG!');
    console.log('='.repeat(50));
    console.log('📧 Email:', email);
    console.log('👤 Tên:', name);
    console.log('🏢 Nhóm:', groupId);
    console.log('🛡️  Quyền: Super Admin');
    console.log('='.repeat(50));
    console.log('\n💡 Bạn có thể đăng nhập với email và mật khẩu vừa tạo.');
    console.log('💡 Truy cập /admin để vào Admin Panel.\n');

    await client.close();
    rl.close();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    rl.close();
    process.exit(1);
  }
}

createSuperAdmin();
