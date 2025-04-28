import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Influencer from "@/models/Influencer";
import Brand from "@/models/Brand";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  await dbConnect();
  const token = await getToken({ req, secret });
  console.log("JSON Web Token", token);

  if (!token) {
    throw new Error("Access token is missing");
  }

  const { id, role } = token;

  if (role === "admin") {
    return NextResponse.json({ redirect: "/dashboard/admin" });
  }

  if (role === "influencer") {
    console.log("from influencer", id);
    const existingInfluencer = await Influencer.findOne({ user: id });
    if (existingInfluencer) {
      return NextResponse.json({
        redirect: `/profile/${existingInfluencer._id}`,
      });
    } else {
      console.log("this is from else of influencer");
      return NextResponse.json({ redirect: "/create-profile/step-1" });
    }
  }

  if (role === "brand") {
    const existingBrand = await Brand.findOne({ user: id });
    if (existingBrand) {
      return NextResponse.json({ redirect: `/dashboard/brand-owner` });
    } else {
      return NextResponse.json({ redirect: "/brand/profile" });
    }
  }

  return NextResponse.json({ redirect: "/login" });
}
