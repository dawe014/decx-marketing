import dbConnect from "@/config/database";
import Application from "@/models/Application";
import Campaign from "@/models/Campaign";
import Influencer from "@/models/Influencer";
import AuthUtils from "@/lib/authUtils";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id: campaignId } = await params;

    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: userId, role } = userInfo;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    // Verify user is an influencer
    if (role !== "influencer") {
      return NextResponse.json(
        { success: false, message: "Only influencers can apply to campaigns" },
        { status: 403 }
      );
    }

    // Get influencer profile
    const influencer = await Influencer.findOne({ user: userId }).populate(
      "user"
    );
    if (!influencer) {
      return NextResponse.json(
        { success: false, message: "Influencer profile not found" },
        { status: 403 }
      );
    }

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }

    // Check if campaign is active
    if (campaign.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: "This campaign is not currently accepting applications",
        },
        { status: 400 }
      );
    }

    // Check for existing application
    const existingApplication = await Application.findOne({
      campaign: campaignId,
      influencer: influencer._id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: "You've already applied to this campaign" },
        { status: 400 }
      );
    }

    // Parse and validate application data
    const { rate, coverLetter, portfolioLinks } = await req.json();

    if (!coverLetter || coverLetter.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Cover letter must be at least 50 characters",
        },
        { status: 400 }
      );
    }

    if (!portfolioLinks || portfolioLinks.length === 0 || !portfolioLinks[0]) {
      return NextResponse.json(
        { success: false, message: "At least one portfolio link is required" },
        { status: 400 }
      );
    }

    // Validate rate against campaign budget
    if (rate < campaign.budget.min || rate > campaign.budget.max) {
      return NextResponse.json(
        {
          success: false,
          message: `Your rate must be between ${campaign.budget.min} and ${campaign.budget.max} ${campaign.budget.currency}`,
        },
        { status: 400 }
      );
    }

    // Create new application
    const application = new Application({
      campaign: campaignId,
      influencer: influencer._id,
      title: campaign.title,
      proposal: coverLetter,
      quote: rate,
      portfolioLinks: portfolioLinks.filter((link) => link.trim() !== ""),
      status: "pending",
    });

    await application.save();

    // Add application reference to campaign
    campaign.applications.push({ application: application._id });
    await campaign.save();

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        applicationId: application._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit application" },
      { status: 500 }
    );
  }
}
