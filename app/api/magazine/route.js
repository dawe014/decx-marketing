import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Article from "@/models/Magazine";
import Category from "@/models/Category";

// POST /api/articles - Create a new article
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // // Optionally extract author from token
    // const token = req.headers.get("authorization");
    // const { userId: authorId, role } = await getUserIdFromToken(token); // Assuming this returns user ID
    // if (role !== "admin") {
    //   return NextResponse.json(
    //     { success: false, message: "User not authorized" },
    //     { status: 401 }
    //   );
    // }
    // Construct new article object
    const newArticle = new Article({
      ...body,
      // author: authorId, // Optionally overwrite if author is from token
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

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const isFeatured = searchParams.get("featured");

  try {
    if (isFeatured === "true") {
      const featuredArticles = await Article.find({ featured: true }).sort({
        createdAt: -1,
      });
      return Response.json({ articles: featuredArticles });
    }

    // Default: return all
    const [featuredArticles, latestArticles, categories] = await Promise.all([
      Article.find({ featured: true }).sort({ createdAt: -1 }),
      Article.find({}).sort({ createdAt: -1 }).limit(6),
      Category.find({}),
    ]);
    const cate = await Category.find({});
    return Response.json({ featuredArticles, latestArticles, categories });
  } catch (error) {
    console.error("Fetch error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
