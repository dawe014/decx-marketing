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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Create new user
    const user = new User({
      email,
      password,
      role,
      verificationToken,
    });

    await user.save();

    // Construct verification URL
    const verificationUrl = `${req.nextUrl.origin}/api/auth/verify/${verificationToken}`;

    // Send HTML email with a verification button
    await sendEmail({
      email: user.email,
      subject: "Verify your DECx account",
      message: verificationUrl, // Pass verification URL here
    });

    return NextResponse.json(
      {
        message:
          "Registered Successfully. Check your email to verify your account.",
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
