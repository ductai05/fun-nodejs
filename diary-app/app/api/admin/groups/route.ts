import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";

// GET - Lấy danh sách tất cả groups
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session.user as any).isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const groups = await Group.find({}).sort({ createdAt: -1 });

    // Đếm số thành viên trong mỗi nhóm
    const groupsWithMemberCount = await Promise.all(
      groups.map(async (group) => {
        const memberCount = await User.countDocuments({ groupId: group.groupId });
        return {
          ...group.toObject(),
          memberCount,
        };
      })
    );

    return NextResponse.json({ groups: groupsWithMemberCount }, { status: 200 });
  } catch (error: any) {
    console.error("Get groups error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}

// DELETE - Xóa group
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session.user as any).isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { groupId } = await request.json();

    if (!groupId) {
      return NextResponse.json({ error: "Group ID là bắt buộc" }, { status: 400 });
    }

    await dbConnect();

    // Kiểm tra xem có user nào trong nhóm không
    const usersInGroup = await User.countDocuments({ groupId });

    if (usersInGroup > 0) {
      return NextResponse.json(
        { error: `Không thể xóa nhóm có ${usersInGroup} thành viên. Hãy xóa các thành viên trước.` },
        { status: 400 }
      );
    }

    const group = await Group.findOneAndDelete({ groupId });

    if (!group) {
      return NextResponse.json({ error: "Không tìm thấy nhóm" }, { status: 404 });
    }

    return NextResponse.json({ message: "Xóa nhóm thành công" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete group error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
