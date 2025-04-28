import { NextResponse } from "next/server";
import PricingPlan from "@/models/PricingPlan";
import connectDB from "@/config/database";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

// GET single pricing plan
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const plan = await PricingPlan.findById(id);

    if (!plan) {
      return NextResponse.json(
        { message: "Pricing plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, plan }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching pricing plan", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH update pricing plan
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const token = request.headers.get("authorization");
    const { role } = await getUserIdFromToken(token);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    // Validate and sanitize the input data
    const planData = await request.json();
    const updatedPlan = await PricingPlan.findByIdAndUpdate(id, planData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) {
      return NextResponse.json(
        { message: "Pricing plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Pricing plan updated successfully", plan: updatedPlan },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating pricing plan", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE pricing plan
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const token = request.headers.get("authorization");
    const { role } = await getUserIdFromToken(token);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const deletedPlan = await PricingPlan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return NextResponse.json(
        { message: "Pricing plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Pricing plan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting pricing plan", error: error.message },
      { status: 500 }
    );
  }
}
