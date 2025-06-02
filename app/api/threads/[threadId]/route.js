import { NextResponse } from "next/server";
import dbConnect from "@/config/database"; // Database connection utility
import Thread from "@/models/Thread";
import Message from "@/models/Message";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req, { params }) {
  await dbConnect();
  const threadId = await params;
  const token = await getToken({ req, secret });
  const { id, role } = token;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thread = await Thread.findOne({
      _id: threadId,
      participants: id,
    })
      .populate("participants", "name email image")
      .populate("lastMessage");

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json(thread);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const threadId = await params;
  const token = await getToken({ req, secret });
  const { id, role } = token;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, muted } = await req.json();

    const update = {};
    if (title !== undefined) update.title = title;
    if (muted !== undefined) {
      if (muted) {
        update.$addToSet = { mutedBy: id };
      } else {
        update.$pull = { mutedBy: id };
      }
    }

    const updatedThread = await Thread.findOneAndUpdate(
      {
        _id: threadId,
        participants: id,
      },
      update,
      { new: true }
    );

    if (!updatedThread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json(updatedThread);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update thread" },
      { status: 500 }
    );
  }
}
