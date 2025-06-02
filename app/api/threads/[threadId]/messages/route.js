import { NextResponse } from "next/server";
import dbConnect from "@/config/database"; // Database connection utility
import Thread from "@/models/Thread";
import Message from "@/models/Message";
import { getToken } from "next-auth/jwt";
import { Types } from "mongoose"; // Import Mongoose Types for ObjectId

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req, { params }) {
  await dbConnect();
  const { threadId } = await params; // Destructure threadId from params
  const token = await getToken({ req, secret });
  const { id, role } = token || {};

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Cast threadId to ObjectId
    const objectId = new Types.ObjectId(threadId);

    // Verify user has access to this thread
    const threadExists = await Thread.exists({
      _id: objectId,
      participants: id,
    });

    if (!threadExists) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const messages = await Message.find({
      threadId: objectId,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email image");

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages", details: error.message },
      { status: 500 }
    );
  }
}

// export async function POST(req, { params }) {
//   await dbConnect();
//   const { threadId } = params; // Destructure threadId from params
//   const token = await getToken({ req, secret });
//   const { id, role } = token || {};

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { content, attachments = [], type = "text" } = await req.json();

//     // Cast threadId to ObjectId
//     const objectId = new Types.ObjectId(threadId);

//     // Verify user has access to this thread
//     const thread = await Thread.findOne({
//       _id: objectId,
//       participants: id,
//     });

//     if (!thread) {
//       return NextResponse.json({ error: "Thread not found" }, { status: 404 });
//     }

//     // Create new message
//     const newMessage = new Message({
//       threadId: objectId,
//       sender: id,
//       recipient: {
//         user: thread.participants.find((p) => p.toString() !== id),
//         read: false,
//       },
//       content: {
//         text: content,
//         attachments: attachments.map((att) => ({
//           url: att.url,
//           type: att.type,
//           name: att.name,
//           size: att.size,
//         })),
//       },
//       type,
//       status: "sent",
//     });

//     const savedMessage = await newMessage.save();

//     // Update thread's last message and timestamp
//     await Thread.findByIdAndUpdate(objectId, {
//       lastMessage: savedMessage._id,
//       updatedAt: new Date(),
//     });

//     return NextResponse.json(savedMessage, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to send message", details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req, { params }) {
  await dbConnect();
  const { threadId } = await params; // Destructure threadId from params
  const token = await getToken({ req, secret });
  const { id, role } = token || {};

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, attachments = [], type = "text" } = await req.json();

    const thread = await Thread.findOne({
      _id: threadId,
      participants: id,
    }).populate("participants", "_id name email image");

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const newMessage = new Message({
      threadId: threadId,
      sender: id,
      recipient: {
        user:
          thread.participants.find((p) => p._id.toString() !== id)?._id || null,
        read: false,
      },
      content: {
        text: content,
        attachments: attachments.map((att) => ({
          url: att.url,
          type: att.type,
          name: att.name,
          size: att.size,
        })),
      },
      type,
      status: "sent",
    });

    const savedMessage = await newMessage.save();

    // Populate the sender information before returning
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("sender", "name email image")
      .exec();

    await Thread.findByIdAndUpdate(threadId, {
      lastMessage: populatedMessage._id,
      updatedAt: new Date(),
    });

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
