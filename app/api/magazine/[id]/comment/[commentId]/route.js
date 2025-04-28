import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/config/database";
import Article from "@/models/Magazine";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

export async function DELETE(request, { params }) {
  await connectDB();
  const { id, commentId } = await params;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(commentId)
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid article or comment ID" },
      { status: 400 }
    );
  }

  try {
    const token = request.headers.get("authorization");

    // Get the user ID from the token
    const { userId } = getUserIdFromToken(token);
    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }
    // Find the specific comment
    const comment = article.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    console.log("comment", comment);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    // Ensure the user owns the comment
    if (comment.user.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this comment",
        },
        { status: 403 }
      );
    }

    // Remove the comment using $pull
    await Article.updateOne(
      { _id: id },
      { $pull: { comments: { _id: commentId } } }
    );

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
