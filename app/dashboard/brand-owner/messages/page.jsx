"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FiMessageSquare,
  FiMoreVertical,
  FiPaperclip,
  FiSearch,
  FiSend,
  FiChevronLeft,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function MessagePage() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showThreadList, setShowThreadList] = useState(true);
  const messagesEndRef = useRef(null);

  const searchParams = useSearchParams();
  const threadIdFromURL = searchParams.get("threadId");

  useEffect(() => {
    if (!session) return;

    const fetchThreads = async () => {
      try {
        const response = await fetch("/api/threads");
        const data = await response.json();
        setThreads(data);

        if (threadIdFromURL) {
          const foundThread = data.find((t) => t._id === threadIdFromURL);
          if (foundThread) {
            setSelectedThread(foundThread);
            setShowThreadList(false);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching threads:", error);
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [session, threadIdFromURL]);

  useEffect(() => {
    if (!selectedThread) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/threads/${selectedThread._id}/messages`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !session) return;

    const tempMessage = {
      _id: Date.now().toString(),
      threadId: selectedThread._id,
      sender: {
        _id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      recipient: {
        user:
          selectedThread.participants.find((p) => p._id !== session.user.id)
            ?._id || null,
        read: false,
      },
      content: {
        text: newMessage,
        attachments: [],
      },
      type: "text",
      status: "sent",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    setThreads((prev) =>
      prev
        .map((thread) =>
          thread._id === selectedThread._id
            ? { ...thread, lastMessage: tempMessage, updatedAt: new Date() }
            : thread
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );

    try {
      const response = await fetch(
        `/api/threads/${selectedThread._id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newMessage,
            type: "text",
          }),
        }
      );

      if (response.ok) {
        const sentMessage = await response.json();

        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempMessage._id ? sentMessage : msg))
        );

        setThreads((prev) =>
          prev
            .map((thread) =>
              thread._id === selectedThread._id
                ? { ...thread, lastMessage: sentMessage, updatedAt: new Date() }
                : thread
            )
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
    }
  };

  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;

    const participantNames = thread.participants
      .filter((p) => p._id !== session?.user.id)
      .map((p) => p.name.toLowerCase());

    return (
      participantNames.some((name) =>
        name.includes(searchQuery.toLowerCase())
      ) ||
      (thread.title &&
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 min-h-screen">
        <div className="text-white">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-screen bg-slate-900 ">
      {/* Threads List - shown on desktop and mobile when toggled */}
      <div
        className={`w-full md:w-80 flex flex-col border-r border-slate-700 bg-slate-900 absolute md:relative z-20 h-full transition-transform duration-300 ease-in-out  ${
          showThreadList
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile back button */}
        <div className="md:hidden p-3 border-b border-slate-700 flex items-center">
          <button
            onClick={() => setShowThreadList(false)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <FiChevronLeft size={20} />
          </button>
          <h2 className="text-white ml-2 font-medium">Messages</h2>
        </div>

        {/* Fixed header */}
        <div className="p-3 border-b border-slate-700 sticky -top-8 bg-slate-900 z-10  ">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map((thread) => {
            const otherParticipants = thread.participants.filter(
              (p) => p._id !== session?.user.id
            );
            const lastMessage = thread.lastMessage;
            const isUnread =
              lastMessage?.sender._id !== session?.user.id &&
              !lastMessage?.recipient.read;

            return (
              <div
                key={thread._id}
                onClick={() => {
                  setSelectedThread(thread);
                  setShowThreadList(false);
                }}
                className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-800/50 ${
                  selectedThread?._id === thread._id ? "bg-slate-800" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium relative overflow-hidden">
                      {otherParticipants[0]?.profilePhoto ? (
                        <Image
                          src={otherParticipants[0].profilePhoto}
                          alt={otherParticipants[0].name || "Unknown"}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        otherParticipants[0]?.name?.charAt(0).toUpperCase() ||
                        "?"
                      )}
                    </div>

                    {otherParticipants.some((p) => p.online) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium text-white truncate">
                        {thread.isGroup
                          ? thread.title
                          : otherParticipants[0]?.name || "Unknown"}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(thread.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {thread.isGroup
                        ? `${otherParticipants.length} participants`
                        : otherParticipants[0]?.email || ""}
                    </p>
                    {lastMessage && (
                      <p className="text-xs mt-1 text-slate-400 truncate">
                        {lastMessage.sender._id === session?.user.id
                          ? "You: "
                          : ""}
                        {lastMessage.content.text}
                      </p>
                    )}
                  </div>
                  {isUnread && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Panel */}
      {selectedThread ? (
        <div className="flex-1 flex flex-col h-full bg-slate-800/30">
          {/* Fixed header */}
          <div className="p-3 border-b border-slate-700 sticky -top-8 bg-slate-900 z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowThreadList(true)}
                className="md:hidden p-1 text-slate-400 hover:text-white"
              >
                <FiChevronLeft size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 font-medium relative overflow-hidden">
                    {selectedThread.participants?.find(
                      (p) => p._id !== session?.user.id
                    )?.profilePhoto ? (
                      <Image
                        src={
                          selectedThread.participants?.find(
                            (p) => p._id !== session?.user.id
                          )?.profilePhoto
                        }
                        alt="User"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      selectedThread.participants
                        ?.find((p) => p._id !== session?.user.id)
                        ?.name?.charAt(0)
                        .toUpperCase()
                    )}
                  </div>
                  {selectedThread.participants?.find(
                    (p) => p._id !== session?.user.id && p.online
                  ) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {selectedThread.isGroup
                      ? selectedThread.title
                      : selectedThread.participants?.find(
                          (p) => p._id !== session?.user.id
                        )?.name || "Unknown"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedThread.participants?.find(
                      (p) => p._id !== session?.user.id && p.online
                    )
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white">
              <FiMoreVertical />
            </button>
          </div>

          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender._id === session?.user.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                    msg.sender._id === session?.user.id
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-700 text-white rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content.text}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-3 border-t border-slate-700 bg-slate-900 sticky bottom-0">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-slate-400 hover:text-white">
                <FiPaperclip />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-2 rounded-full ${
                  newMessage.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-900">
          <div className="text-center p-6 max-w-md">
            <FiMessageSquare className="mx-auto text-slate-600" size={48} />
            <h3 className="mt-4 text-lg font-medium text-white">
              Select a conversation
            </h3>
            <p className="mt-2 text-slate-400">
              Choose an existing conversation or start a new one
            </p>
          </div>
        </div>
      )}

      {/* Mobile empty state */}
      {!selectedThread && !showThreadList && (
        <div className="md:hidden flex-1 flex items-center justify-center bg-slate-900">
          <button
            onClick={() => setShowThreadList(true)}
            className="p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
          >
            View Conversations
          </button>
        </div>
      )}
    </div>
  );
}
