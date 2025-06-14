import { NextResponse } from "next/server";
import { handleMediaUpload } from "@/lib/upload";
import AuthUtils from "@/lib/authUtils";
import Influencer from "@/models/Influencer";
import dbConnect from "@/config/database";

export async function PATCH(req) {
  try {
    await dbConnect();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id } = userInfo;
    const formData = await req.formData();
    const portfolioItems = [];

    let index = 0;
    while (true) {
      const fileKey = `portfolioItem-${index}-file`;
      const titleKey = `portfolioItem-${index}-title`; // <-- Key for the new title
      const descKey = `portfolioItem-${index}-description`;

      const file = formData.get(fileKey);
      const title = formData.get(titleKey)?.toString(); // <-- Get the title
      const description = formData.get(descKey)?.toString();

      // Updated check to include title
      if (!file || !title || !description) {
        break; // End of items
      }

      const upload = await handleMediaUpload(file, "uploads");

      portfolioItems.push({
        title, // <-- Add title to the object
        description,
        mediaUrl: upload.url,
        mediaType: upload.type,
        date: new Date(),
      });

      index++;
    }

    if (portfolioItems.length === 0) {
      return NextResponse.json(
        { message: "No complete portfolio items found to upload." },
        { status: 400 }
      );
    }

    // Save all portfolio items to user's profile
    await Influencer.updateOne(
      { user: id },
      {
        $push: {
          portfolio: { $each: portfolioItems },
        },
      }
    );

    return NextResponse.json({ message: "Upload successful", portfolioItems });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
