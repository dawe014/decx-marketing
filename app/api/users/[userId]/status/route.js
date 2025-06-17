import dbConnect from "@/config/database";
import User from "@/models/User";
import Influencer from "@/models/Influencer"; // Import the Influencer model
import Brand from "@/models/Brand"; // Import the Brand model
import { NextResponse } from "next/server";
import AuthUtils from "@/lib/authUtils"; // Your custom utility for authentication
export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    // --- 1. Authentication and Authorization ---
    // Ensure the request comes from an authenticated admin.
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: adminId, role: adminRole } = userInfo || {};

    if (!adminId || adminRole !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required." },
        { status: 401 }
      );
    }

    // --- 2. Get User ID from URL ---
    const { userId } = await params; // The parameter from the URL is `id`
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required in the URL." },
        { status: 400 }
      );
    }

    // --- 3. Fetch Base User Data ---
    const user = await User.findById(userId)
      .select("-password -verificationToken -resetPasswordToken -__v")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 } // 404 is more appropriate for "not found"
      );
    }
    const { status } = await req.json();
    // --- 4. Update User Status ---
    if (!["active", "suspended", "pending", "isFeatured"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value." },
        { status: 400 }
      );
    }
    if (status === "isFeatured" && user.role == "influencer") {
      await Influencer.findOneAndUpdate(
        { user: user._id },
        { isFeatured: true },
        { new: true }
      );
      user.status = "active"; // Set status to active when marking as featured
    } else if (status === "isFeatured" && user.role != "influencer") {
      return NextResponse.json(
        { success: false, message: "Only influencers can be featured." },
        { status: 400 }
      );
    } else {
      user.status = status;
    }
    await User.findByIdAndUpdate(
      userId,
      { status: user.status, isFeatured: user.isFeatured },
      { new: true }
    );

    return NextResponse.json(
      { success: true, message: "User status updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating user status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status." },
      { status: 500 }
    );
  }
}
