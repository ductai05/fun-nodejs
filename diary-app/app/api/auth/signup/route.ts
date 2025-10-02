import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Group from "@/models/Group";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, groupId, groupPassword, isCreatingGroup } = await request.json();

    if (!name || !email || !password || !groupId || !groupPassword) {
      return NextResponse.json(
        { error: "Tất cả các trường là bắt buộc" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    if (groupPassword.length < 4) {
      return NextResponse.json(
        { error: "Mật khẩu nhóm phải có ít nhất 4 ký tự" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Kiểm tra nhóm đã tồn tại chưa
    const existingGroup = await Group.findOne({ groupId });
    
    let isGroupAdmin = false;
    
    if (existingGroup) {
      // Nhóm đã tồn tại - kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(groupPassword, existingGroup.groupPassword);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Mật khẩu nhóm không đúng" },
          { status: 400 }
        );
      }
      
      isGroupAdmin = false; // Không phải admin
    } else {
      // Nhóm chưa tồn tại - tạo mới và user này là admin
      const hashedGroupPassword = await bcrypt.hash(groupPassword, 12);
      
      // Tạo nhóm mới (sẽ cập nhật adminId sau khi tạo user)
      await Group.create({
        groupId,
        groupPassword: hashedGroupPassword,
        adminId: "temp", // Tạm thời
        adminName: name,
      });
      
      isGroupAdmin = true;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      groupId,
      isGroupAdmin,
    });

    // Nếu là admin, cập nhật lại adminId trong Group
    if (isGroupAdmin) {
      await Group.findOneAndUpdate(
        { groupId },
        { adminId: user._id.toString() }
      );
    }

    return NextResponse.json(
      {
        message: isGroupAdmin ? "Tạo nhóm và đăng ký thành công! Bạn là admin của nhóm." : "Tham gia nhóm thành công!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          groupId: user.groupId,
          isGroupAdmin: user.isGroupAdmin,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng ký" },
      { status: 500 }
    );
  }
}
