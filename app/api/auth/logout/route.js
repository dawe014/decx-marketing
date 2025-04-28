// /api/auth/logout/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.set("accessToken", "", { maxAge: 0 });
  cookieStore.set("refreshToken", "", { maxAge: 0 });

  return NextResponse.json({ success: true, message: "Logged out" });
}
