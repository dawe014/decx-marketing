import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "@/utils/email"; // Correct import path
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password, role } = await req.json();
    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    if (role !== "influencer" && role !== "brand") {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      email,
      password,
      role,
      isVerified: true,
      status: "pending",
    });

    await user.save();

    return NextResponse.json(
      {
        message: "Registered Successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}
