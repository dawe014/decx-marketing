import { NextResponse } from "next/server";
import Plan from "@/models/Plan";
import Brand from "@/models/Brand";
import connectDB from "@/config/database";
import AuthUtils from "@/lib/authUtils";

export async function GET(req) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: userId } = userInfo;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's current plan from Brand model
    const brand = await Brand.findOne({ user: userId }).populate(
      "subscription.planId"
    );
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Get all available plans
    const plans = await Plan.find();

    return NextResponse.json({
      currentPlan: brand.subscription.planId,
      availablePlans: plans,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch plan information" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(request);
    const { id: userId } = userInfo;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    // Verify plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Update brand's subscription
    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setMonth(expiresAt.getMonth() + 1); // Add 1 month

    const updatedBrand = await Brand.findOneAndUpdate(
      { user: userId },
      {
        subscription: {
          planId: plan._id,
          startedAt,
          expiresAt,
          status: "active",
        },
      },
      { new: true }
    ).populate("subscription.planId");

    return NextResponse.json({
      success: true,
      plan: updatedBrand.subscription.planId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}
