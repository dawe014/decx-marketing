import connectDB from "@/config/database";
import Application from "@/models/Application";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id: campaignId } = await params;
    if (!campaignId) {
      return NextResponse.json(
        { success: false, message: "Campaign ID is required" },
        { status: 400 }
      );
    }
    const applications = await Application.find({
      campaign: campaignId,
    }).populate("influencer");
    if (!applications) {
      return NextResponse.json(
        { success: false, message: "No applications found for this campaign" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        applications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("�� Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
