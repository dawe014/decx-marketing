import dbConnect from "@/config/database"; // Database connection utility
import Campaign from "@/models/Campaign"; // Campaign model
import Brand from "@/models/Brand"; // Brand model
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the authorization token from the request headers
    const token = await getToken({ req, secret });
    const { id, role } = token;
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    // Get the incoming request body (campaign data)
    const body = await req.json();
    // Check if the user is a brand user and has an existing brand profile
    const brand = await Brand.findOne({ user: id });

    if (!brand) {
      return NextResponse.json(
        { message: "Brand not found for this user" },
        { status: 404 }
      );
    }

    // Create the new campaign using the provided data and associating it with the brand

    const newCampaign = new Campaign({
      brand: brand._id, // Link the campaign to the user's brand
      ...body, // Use the incoming data for other campaign fields
    });

    // Save the campaign to the database
    const savedCampaign = await newCampaign.save();

    // Respond with a success message and the saved campaign
    return NextResponse.json(
      { message: "Campaign created successfully", campaign: savedCampaign },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the campaign" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    const campaigns = await Campaign.find()
      .populate("brand") // Populate the brand associated with the campaign
      .sort({ createdAt: -1 }); // Sort the campaigns in descending order of creation
    return NextResponse.json({ success: true, campaigns }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the campaigns" },
      { status: 500 }
    );
  }
}
