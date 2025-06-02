import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Campaign from "@/models/Campaign";
import Brand from "@/models/Brand";
import Application from "@/models/Application";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

// UPDATE Campaign - only provided fields
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret });
    const { id } = token;
    const { id: campaignId } = await params;
    const body = await req.json();
    // Check if data is empty (no keys) or undefined
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: "No data provided to update" },
        { status: 400 }
      );
    }
    const campaign = await Campaign.findById(campaignId).populate("brand");

    if (!campaign) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    // Authorization: only brand owner can update
    if (!campaign.brand.user.equals(id)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Update only provided fields
    for (const key in body) {
      if (Object.hasOwn(body, key) && body[key] !== undefined) {
        campaign[key] = body[key];
      }
    }

    campaign.updatedAt = new Date();

    const updatedCampaign = await campaign.save();

    return NextResponse.json(
      { message: "Campaign updated", campaign: updatedCampaign },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json(
      { message: "Error updating campaign", error: error.message },
      { status: 500 }
    );
  }
}
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret });
    const { id } = token;
    const { id: campaignId } = await params;

    const campaign = await Campaign.findById(campaignId).populate("brand");

    if (!campaign) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    // Authorization: only brand owner can update
    if (!campaign.brand.user.equals(id)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const data = await Campaign.findById(campaignId).populate({
      path: "applications.application",
      populate: {
        path: "influencer",
        model: "Influencer",
      },
    });
    return NextResponse.json({ campaign: data }, { status: 200 });
  } catch (error) {
    console.error("Fetching campaign error:", error);
    return NextResponse.json(
      { message: "Error fetching campaign", error: error.message },
      { status: 500 }
    );
  }
}
// DELETE CAMPAIGN
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id: campaignId } = await params;
    const token = await getToken({ req, secret });
    const { id, role } = token;
    const campaign = await Campaign.findById(campaignId).populate("brand");

    if (!campaign) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (!campaign.brand.user.equals(id) && role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await Campaign.findByIdAndDelete(campaignId);

    return NextResponse.json({ message: "Campaign deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return NextResponse.json(
      { message: "Error deleting campaign" },
      { status: 500 }
    );
  }
}
