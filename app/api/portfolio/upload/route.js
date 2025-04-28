import { NextResponse } from "next/server";
import { handleMediaUpload } from "@/lib/upload";
import { getToken } from "next-auth/jwt";
import Influencer from "@/models/Influencer";
import dbConnect from "@/config/database";

const secret = process.env.NEXTAUTH_SECRET;

export async function PATCH(req) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = token;

    console.log("form Data");
    const formData = await req.formData();
    console.log("form Data", formData);
    // Extract all portfolio items from formData
    const portfolioItems = [];

    let index = 0;
    while (true) {
      const fileKey = `portfolioItem-${index}-file`;
      const descKey = `portfolioItem-${index}-description`;

      const file = formData.get(fileKey);
      const description = formData.get(descKey)?.toString();

      if (!file || !description) {
        break; // End of items
      }

      const upload = await handleMediaUpload(file, "uploads");
      console.log("uploaded", upload);
      portfolioItems.push({
        description,
        mediaUrl: upload.url,
        mediaType: upload.type,
        date: new Date(),
      });

      index++;
    }

    if (portfolioItems.length === 0) {
      return NextResponse.json(
        { message: "No portfolio items found" },
        { status: 400 }
      );
    }
    console.log("this portifolio items", portfolioItems);
    // Save all portfolio items to user's profile
    const influencer = await Influencer.updateOne(
      { user: id },
      {
        $push: {
          portfolio: { $each: portfolioItems },
        },
      }
    );
    console.log("This is from portfolio upload api", influencer);
    return NextResponse.json({ message: "Upload successful", portfolioItems });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
