"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FiMessageSquare,
  FiMoreVertical,
  FiPaperclip,
  FiSearch,
  FiSend,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

export default function MessagePage() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch threads
  useEffect(() => {
    if (!session) return;

    const fetchThreads = async () => {
      try {
        const response = await fetch("/api/threads");
        const data = await response.json();
        setThreads(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching threads:", error);
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [session]);

  // Fetch messages when thread is selected
  useEffect(() => {
    if (!selectedThread) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/threads/${selectedThread._id}/messages`
        );
        const data = await response.json();
        console.log(data);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedThread]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !session) return;

    try {
      // Create a temporary message object with sender info
      const tempMessage = {
        _id: Date.now().toString(), // temporary ID
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

      // Optimistically update the UI
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");

      // Update threads list with new last message
      setThreads((prev) =>
        prev
          .map((thread) =>
            thread._id === selectedThread._id
              ? { ...thread, lastMessage: tempMessage, updatedAt: new Date() }
              : thread
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );

      // Send the message to the server
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

        // Replace the temporary message with the real one from the server
        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempMessage._id ? sentMessage : msg))
        );

        // Update the thread with the real last message
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
      // Rollback the optimistic update if there's an error
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
    }
  };

  // Filter threads based on search query
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
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 min-h-screen">
      {/* Messages Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Threads List */}
        <div className="w-80 border-r border-slate-700 flex flex-col">
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  onClick={() => setSelectedThread(thread)}
                  className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-800/50 ${
                    selectedThread?._id === thread._id ? "bg-slate-800" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
                        {otherParticipants[0]?.name?.charAt(0) || "?"}
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
                        <p
                          className={`text-sm mt-1 truncate ${
                            isUnread
                              ? "text-white font-medium"
                              : "text-slate-300"
                          }`}
                        >
                          {lastMessage.sender._id === session?.user.id
                            ? `You: ${lastMessage.content.text}`
                            : lastMessage.content.text}
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

        {/* Message View */}
        {selectedThread ? (
          <div className="flex-1 flex flex-col">
            {/* Thread Header */}
            <div className="p-3 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
                    {selectedThread.participants
                      .filter((p) => p._id !== session?.user.id)[0]
                      ?.name?.charAt(0) || "?"}
                  </div>
                  {selectedThread.participants.some(
                    (p) => p._id !== session?.user.id && p.online
                  ) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {selectedThread.isGroup
                      ? selectedThread.title
                      : selectedThread.participants.filter(
                          (p) => p._id !== session?.user.id
                        )[0]?.name || "Unknown"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedThread.participants.some(
                      (p) => p._id !== session?.user.id && p.online
                    )
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
                  <FiMoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-900/50">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender && message.sender._id === session?.user.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-xl p-3 ${
                        message.sender &&
                        message.sender._id === session?.user.id
                          ? "bg-indigo-600"
                          : "bg-slate-700"
                      }`}
                    >
                      {message.content.text && (
                        <p className="text-white">{message.content.text}</p>
                      )}
                      {message.content.attachments?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.content.attachments.map((att, idx) => (
                            <div key={idx} className="p-2 bg-black/20 rounded">
                              {att.type === "image" ? (
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="max-w-full h-auto rounded"
                                />
                              ) : (
                                <a
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-300 hover:underline flex items-center"
                                >
                                  <FiPaperclip className="mr-1" />
                                  {att.name}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <p
                        className={`text-xs mt-1 text-right ${
                          message.sender._id === session?.user.id
                            ? "text-indigo-200"
                            : "text-slate-400"
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
                  <FiPaperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 rounded-full"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-900/50">
            <div className="text-center p-6 max-w-md">
              <FiMessageSquare
                className="mx-auto text-slate-400 mb-4"
                size={48}
              />
              <h3 className="text-lg font-medium text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-slate-400">
                Choose an existing conversation or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
