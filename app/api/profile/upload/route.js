import { NextResponse } from "next/server";
import { handleMediaUpload } from "@/lib/upload"; // Import the utility function
import dbConnect from "@/config/database";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;
import Influencer from "@/models/Influencer";
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PATCH(req) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = token;
    const formData = await req.formData();
    console.log("the form data from upload influencer profile", formData);
    const file = formData.get("profileImage");
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Call utility function to handle file upload
    const { url: fileUrl } = await handleMediaUpload(file, "profile");

    // Save the URL in the database
    const influencer = await Influencer.updateOne(
      { user: id },
      { $set: { profilePhoto: fileUrl } }
    );
    console.log("Influencer with profile", influencer);
    return NextResponse.json({
      message: "Profile image uploaded",
      url: fileUrl,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
