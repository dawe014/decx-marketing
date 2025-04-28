import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/config/database";
import Article from "@/models/Magazine";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = await params;
  const token = req.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not logged in, Please login and try again",
      },
      { status: 401 }
    );
  }
  const { userId } = getUserIdFromToken(token);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid article ID" },
      { status: 400 }
    );
  }

  const data = await req.json();

  // Check if data is empty (no keys) or undefined
  if (!data || Object.keys(data).length === 0) {
    return NextResponse.json(
      { success: false, message: "No data provided to update" },
      { status: 400 }
    );
  }
  // Check if the user is the author of the article
  const article = await Article.findById(id);
  if (!article) {
    return NextResponse.json(
      { success: false, message: "Article not found" },
      { status: 404 }
    );
  }
  if (String(article.author._id) !== userId && role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to update this article",
      },
      { status: 403 }
    );
  }
  // Filter only defined fields
  const updateData = {};
  for (const key in data) {
    if (data[key] !== undefined) {
      updateData[key] = data[key];
    }
  }

  updateData.updatedAt = new Date();

  try {
    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove the article
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid article ID" },
      { status: 400 }
    );
  }

  try {
    const token = req.headers.get("authorization");
    const { userId } = getUserIdFromToken(token);
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }
    if (String(article.author._id) !== userId && role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this article",
        },
        { status: 403 }
      );
    }

    await Article.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
