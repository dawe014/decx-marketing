import { NextResponse } from "next/server";
import dbConnect from "@/config/database"; // Database connection utility

import Thread from "@/models/Thread";
import Message from "@/models/Message";

import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  await dbConnect();
  const token = await getToken({ req, secret });
  const { id, role } = token;
  console.log("token from threads route", token);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const threads = await Thread.find({
      participants: id,
    })
      .populate("participants", "name email image")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return NextResponse.json(threads);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  const token = await getToken({ req, secret });
  const { id, role } = token;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { participantIds, title } = await req.json();

    // Ensure the current user is included in participants
    const participants = [...new Set([...participantIds, id])];

    const newThread = new Thread({
      participants,
      title: title || `Chat with ${participants.length} participants`,
      isGroup: participants.length > 2,
    });

    const savedThread = await newThread.save();
    return NextResponse.json(savedThread, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
