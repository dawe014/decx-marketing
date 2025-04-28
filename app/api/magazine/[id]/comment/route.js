import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/config/database";
import Article from "@/models/Magazine";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

export async function POST(request, { params }) {
  await connectDB();
  const { id } = params;
  const { text } = await request.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid article ID" },
      { status: 400 }
    );
  }

  if (!text) {
    return NextResponse.json(
      { success: false, message: " Comment text is required" },
      { status: 400 }
    );
  }

  try {
    const token = request.headers.get("authorization");
    const { userId } = await getUserIdFromToken(token); // Assuming this returns user ID
    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    article.comments.push({
      user: new mongoose.Types.ObjectId(userId),
      text,
      createdAt: new Date(),
    });

    await article.save();

    return NextResponse.json({
      success: true,
      message: "Comment added",
      article,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
