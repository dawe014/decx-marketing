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
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// --- Skeleton Components for Loading State ---

function ThreadListSkeletonItem() {
  return (
    <div className="p-3 flex items-start space-x-3">
      <div className="w-12 h-12 rounded-full bg-slate-700"></div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex justify-between items-baseline">
          <div className="h-4 w-2/3 bg-slate-700 rounded"></div>
          <div className="h-3 w-1/4 bg-slate-700 rounded"></div>
        </div>
        <div className="h-3 w-full bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}

function MessagingSkeleton() {
  return (
    <div className="flex flex-1 h-screen bg-slate-900 animate-pulse">
      {/* Skeleton Thread List */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-700 bg-slate-800/50">
        <div className="p-4 border-b border-slate-700">
          <div className="h-10 bg-slate-700 rounded-lg"></div>
        </div>
        <div className="flex-1">
          {[...Array(8)].map((_, i) => (
            <ThreadListSkeletonItem key={i} />
          ))}
        </div>
      </div>

      {/* Skeleton Message Panel */}
      <div className="flex-1 flex-col hidden md:flex">
        <div className="p-3 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700"></div>
            <div className="h-5 w-32 bg-slate-700 rounded-md"></div>
          </div>
          <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
        </div>
        <div className="flex-1"></div>
        <div className="p-3 border-t border-slate-700 flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
          <div className="h-10 flex-1 bg-slate-700 rounded-full"></div>
          <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// --- UI Components ---

function ThreadListItem({ thread, isSelected, onClick, currentUserId }) {
  const otherParticipant =
    thread.participants.find((p) => p._id !== currentUserId) || {};
  const lastMessage = thread.lastMessage;
  const isUnread =
    lastMessage?.sender._id !== currentUserId && !lastMessage?.recipient.read;

  return (
    <div
      onClick={onClick}
      className={`p-3 border-b border-slate-800 cursor-pointer transition-colors duration-200 ${
        isSelected ? "bg-indigo-600/20" : "hover:bg-slate-800/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-indigo-300 font-bold text-lg relative overflow-hidden">
            {otherParticipant.profilePhoto ? (
              <Image
                src={otherParticipant.profilePhoto}
                alt={otherParticipant.name}
                fill
                className="object-cover"
              />
            ) : (
              otherParticipant.name?.charAt(0).toUpperCase() || "?"
            )}
          </div>
          {otherParticipant.online && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-white truncate">
              {otherParticipant.name || "Unknown User"}
            </h3>
            {lastMessage && (
              <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                {formatDistanceToNow(new Date(lastMessage.createdAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
          <p
            className={`text-sm mt-1 truncate ${
              isUnread ? "text-slate-200 font-medium" : "text-slate-400"
            }`}
          >
            {lastMessage?.content?.text || "No messages yet"}
          </p>
        </div>
        {isUnread && (
          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0 self-start mt-1"></div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message, isSender }) {
  return (
    <div
      className={`flex items-end gap-2 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-xl px-4 py-2.5 rounded-2xl shadow-sm ${
          isSender
            ? "bg-indigo-600 text-white rounded-br-lg"
            : "bg-slate-700 text-slate-200 rounded-bl-lg"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">
          {message.content.text}
        </p>
        <div
          className={`text-xs mt-1.5 ${
            isSender ? "text-indigo-200" : "text-slate-400"
          } text-right`}
        >
          {format(new Date(message.createdAt), "p")}
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function MessagePage() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false); // New state for mobile detection
  const messagesEndRef = useRef(null);
  const searchParams = useSearchParams();
  const threadIdFromURL = searchParams.get("threadId");

  // --- Effects ---

  // Detect mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetching and selecting initial thread
  useEffect(() => {
    if (!session) return;
    const fetchThreads = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/threads");
        const data = await response.json();
        setThreads(data);
        if (threadIdFromURL) {
          const foundThread = data.find((t) => t._id === threadIdFromURL);
          setSelectedThread(foundThread || null);
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThreads();
  }, [session, threadIdFromURL]);

  // Fetching messages for selected thread
  useEffect(() => {
    if (!selectedThread) return;
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/threads/${selectedThread._id}/messages`
        );
        setMessages(await response.json());
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedThread]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, selectedThread]);

  // --- Handlers ---
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !session) return;
    const optimisticMessage = {
      _id: Date.now().toString(),
      sender: { _id: session.user.id },
      content: { text: newMessage },
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    try {
      const response = await fetch(
        `/api/threads/${selectedThread._id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newMessage, type: "text" }),
        }
      );
      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === optimisticMessage._id ? sentMessage : msg
          )
        );
        setThreads((prev) =>
          prev
            .map((t) =>
              t._id === selectedThread._id
                ? {
                    ...t,
                    lastMessage: sentMessage,
                    updatedAt: sentMessage.createdAt,
                  }
                : t
            )
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticMessage._id)
      );
    }
  };

  const filteredThreads = threads.filter((thread) => {
    const otherParticipant = thread.participants.find(
      (p) => p._id !== session?.user.id
    );
    return (
      !searchQuery ||
      otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) return <MessagingSkeleton />;

  const currentOtherParticipant =
    selectedThread?.participants.find((p) => p._id !== session?.user.id) || {};
  const showMessagePanel = !isMobileView || (isMobileView && selectedThread);
  const showThreadPanel = !isMobileView || (isMobileView && !selectedThread);

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* --- Thread List Panel --- */}
      {showThreadPanel && (
        <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-800 bg-slate-900 flex-shrink-0">
          <header className="p-4 border-b border-slate-800 flex-shrink-0">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => (
                <ThreadListItem
                  key={thread._id}
                  thread={thread}
                  isSelected={selectedThread?._id === thread._id}
                  onClick={() => setSelectedThread(thread)}
                  currentUserId={session?.user.id}
                />
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">
                No conversations found.
              </div>
            )}
          </div>
        </aside>
      )}

      {/* --- Message Panel --- */}
      {showMessagePanel && (
        <main className="flex-1 flex flex-col h-full bg-slate-800/20">
          {selectedThread ? (
            <>
              <header className="p-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-900">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedThread(null)}
                    className="md:hidden p-1 text-slate-400 hover:text-white"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-300 font-bold text-lg relative overflow-hidden">
                      {currentOtherParticipant.profilePhoto ? (
                        <Image
                          src={currentOtherParticipant.profilePhoto}
                          alt={currentOtherParticipant.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        currentOtherParticipant.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {currentOtherParticipant.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {currentOtherParticipant.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                  <FiMoreVertical />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    isSender={msg.sender._id === session?.user.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-slate-800 flex items-center gap-3 flex-shrink-0 bg-slate-900">
                <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                  <FiPaperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  <FiSend size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center p-6">
                <FiMessageSquare className="mx-auto text-slate-700" size={64} />
                <h3 className="mt-4 text-xl font-medium text-white">
                  Your Messages
                </h3>
                <p className="mt-2 text-slate-400">
                  Select a conversation to start chatting.
                </p>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
