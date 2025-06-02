import { NextResponse } from "next/server";
import Invoice from "@/models/Invoice";
import connectDB from "@/config/database";
import AuthUtils from "@/lib/authUtils";

export async function GET() {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: userId } = userInfo;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await Invoice.find({ userId });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
