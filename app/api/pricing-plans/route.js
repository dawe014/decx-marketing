import { NextResponse } from "next/server";
import Plan from "@/models/Plan";
import connectDB from "@/config/database";
import AuthUtils from "@/lib/authUtils";

export async function GET(req) {
  try {
    await connectDB();

    const plans = await Plan.find().sort({ price: 1 });
    return NextResponse.json({ success: true, plans }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching pricing plans", error: error.message },
      { status: 500 }
    );
  }
}

// POST a new pricing plan
export async function POST(request) {
  try {
    await connectDB();

    const { isValid, userInfo, errorResponse } =
      await AuthUtils.validateRequest(req);
    const { role } = userInfo;
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const planData = await request.json();

    // Validate required fields
    if (!planData.name || !planData.price || !planData.description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPlan = await Plan.create(planData);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating pricing plan", error: error.message },
      { status: 500 }
    );
  }
}
