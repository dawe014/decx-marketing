import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Article from "@/models/Magazine";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

// POST /api/articles - Create a new article
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // Optionally extract author from token
    const token = req.headers.get("authorization");
    const { userId: authorId, role } = await getUserIdFromToken(token); // Assuming this returns user ID
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, message: "User not authorized" },
        { status: 401 }
      );
    }
    // Construct new article object
    const newArticle = new Article({
      ...body,
      author: authorId, // Optionally overwrite if author is from token
    });

    const savedArticle = await newArticle.save();

    return NextResponse.json(
      {
        success: true,
        message: "Article created successfully",
        article: savedArticle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create article error:", error);

    // Handle unique title error
    if (error.code === 11000 && error.keyPattern?.title) {
      return NextResponse.json(
        { success: false, message: "Article title must be unique" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create article" },
      { status: 500 }
    );
  }
}

// GET /api/articles - Fetch all articles

export async function GET(req) {
  try {
    await dbConnect();

    const articles = await Article.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, articles }, { status: 200 });
  } catch (error) {
    console.error("Fetch articles error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
