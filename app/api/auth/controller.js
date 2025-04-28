import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "@/utils/email";
import connectDB from "@/config/database";

export const register = async (req) => {
    await connectDB();
    const { email, password, role } = await req.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { status: 400, message: "Email already in use" };
    }

    // Create user
    const user = new User({
        email,
        password,
        role,
        verificationToken: crypto.randomBytes(20).toString("hex"),
    });

    await user.save();

    const verificationUrl = `${req.nextUrl.origin}/api/auth/verify/${user.verificationToken}`;
    await sendEmail({
        email: user.email,
        subject: "Verify your DECx account",
        message: `Please click the following link to verify your account: ${verificationUrl}`,
    });

    return { status: 201, message: "User registered. Please check your email to verify your account." };
};

export const login = async (req) => {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
        return { status: 401, message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { status: 401, message: "Invalid credentials" };
    }

    if (!user.isVerified) {
        return { status: 401, message: "Please verify your email first" };
    }

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save();

    return {
        status: 200,
        message: "Login successful",
        userId: user._id,
        role: user.role,
        tokens: { accessToken, refreshToken },
    };
};

export const verifyEmail = async (req) => {
    await connectDB();
    const token = req.nextUrl.pathname.split("/").pop();

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return { status: 400, message: "Invalid or expired token" };
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return { status: 200, message: "Email verified successfully. You can now log in." };
};
