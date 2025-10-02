import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import DiaryEntry from "@/models/DiaryEntry";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Tiêu đề và nội dung là bắt buộc" },
        { status: 400 }
      );
    }

    await dbConnect();

    const diary = await DiaryEntry.findOne({
      _id: id,
      authorId: (session.user as any).id,
    });

    if (!diary) {
      return NextResponse.json(
        { error: "Không tìm thấy nhật ký hoặc bạn không có quyền chỉnh sửa" },
        { status: 404 }
      );
    }

    diary.title = title;
    diary.content = content;
    diary.updatedAt = new Date();
    await diary.save();

    return NextResponse.json(
      { message: "Cập nhật nhật ký thành công", diary },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update diary error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật nhật ký" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const diary = await DiaryEntry.findById(id);

    if (!diary) {
      return NextResponse.json(
        { error: "Không tìm thấy nhật ký" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền: phải là tác giả hoặc admin của nhóm
    const isAuthor = diary.authorId === (session.user as any).id;
    const isAdmin = (session.user as any).isGroupAdmin && diary.groupId === (session.user as any).groupId;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa nhật ký này" },
        { status: 403 }
      );
    }

    await DiaryEntry.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Xóa nhật ký thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete diary error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa nhật ký" },
      { status: 500 }
    );
  }
}
