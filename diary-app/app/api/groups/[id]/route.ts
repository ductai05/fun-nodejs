import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Group from '@/models/Group';
import bcrypt from 'bcryptjs';

// GET: Lấy thông tin nhóm (chỉ admin hoặc super admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: groupId } = await params;
    await dbConnect();

    // Lấy thông tin nhóm
    const group = await Group.findOne({ groupId });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Kiểm tra quyền: phải là group admin của nhóm này hoặc super admin
    const isGroupAdmin = (session.user as any).isGroupAdmin && (session.user as any).groupId === groupId;
    const isSuperAdmin = (session.user as any).isSuperAdmin;

    if (!isGroupAdmin && !isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      groupId: group.groupId,
      adminId: group.adminId,
      adminName: group.adminName,
      createdAt: group.createdAt,
      // Không trả về password đã hash ra ngoài
    });
  } catch (error) {
    console.error('Error getting group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Cập nhật mật khẩu nhóm (chỉ admin hoặc super admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: groupId } = await params;
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Lấy thông tin nhóm
    const group = await Group.findOne({ groupId });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Kiểm tra quyền: phải là group admin của nhóm này hoặc super admin
    const isGroupAdmin = (session.user as any).isGroupAdmin && (session.user as any).groupId === groupId;
    const isSuperAdmin = (session.user as any).isSuperAdmin;

    if (!isGroupAdmin && !isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật mật khẩu
    group.groupPassword = hashedPassword;
    group.updatedAt = new Date();
    await group.save();

    return NextResponse.json({ 
      success: true,
      message: 'Đã cập nhật mật khẩu nhóm thành công'
    });
  } catch (error) {
    console.error('Error updating group password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
