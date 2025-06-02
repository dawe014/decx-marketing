import connectDB from "@/config/database";
import Application from "@/models/Application";
import Influencer from "@/models/Influencer";
import { NextResponse } from "next/server";
// import { getUserIdFromToken } from "@/utils/auth";
import AuthUtils from "@/lib/authUtils";

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    // console.log("User ID from token:", id);
    // const token = req.headers.get("authorization");
    // const { userId } = getUserIdFromToken(token);
    const { id: userId } = await AuthUtils.getUserInfo(req);
    console.log("User ID from token:", userId);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }
    const influencer = await Influencer.findOne({ user: userId });
    if (!influencer) {
      return NextResponse.json(
        { error: "Influencer not found" },
        { status: 404 }
      );
    }

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
    if (String(application.influencer) !== String(influencer._id)) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const { proposal, qoute } = await req.json();

    const data = {};
    if (proposal !== undefined) data.proposal = proposal;
    if (qoute !== undefined) data.qoute = qoute;

    const updated = await Application.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Application updated successfully", application: updated },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const token = req.headers.get("authorization");
    const { userId } = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }
    const influencer = await Influencer.findOne({ user: userId });
    if (!influencer) {
      return NextResponse.json(
        { error: "Influencer not found" },
        { status: 404 }
      );
    }

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
    if (String(application.influencer) !== String(influencer._id)) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Application withdrawn successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
