import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import DiaryEntry from "@/models/DiaryEntry";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const groupId = (session.user as any).groupId;
    const diaries = await DiaryEntry.find({ groupId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ diaries }, { status: 200 });
  } catch (error: any) {
    console.error("Get diaries error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách nhật ký" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Tiêu đề và nội dung là bắt buộc" },
        { status: 400 }
      );
    }

    await dbConnect();

    const diary = await DiaryEntry.create({
      title,
      content,
      authorId: (session.user as any).id,
      authorName: session.user?.name || "Unknown",
      groupId: (session.user as any).groupId,
    });

    return NextResponse.json(
      { message: "Tạo nhật ký thành công", diary },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create diary error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo nhật ký" },
      { status: 500 }
    );
  }
}
