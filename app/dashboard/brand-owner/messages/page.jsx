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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner"; // <-- Import toast for notifications

// --- Skeleton Component (no changes needed) ---
const MessagePageSkeleton = () => (
  <div className="flex-1 flex h-full bg-slate-900 animate-pulse">
    <div className="w-full md:w-80 flex-shrink-0 flex flex-col border-r border-slate-700">
      <div className="p-3 border-b border-slate-700">
        <div className="h-10 bg-slate-700 rounded-lg"></div>
      </div>
      <div className="flex-1 p-2 space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-2">
            <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="hidden md:flex flex-1 flex-col">
      <div className="p-3 border-b border-slate-700 flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-3 bg-slate-700 rounded w-1/6"></div>
        </div>
      </div>
      <div className="flex-1"></div>
      <div className="p-3 border-t border-slate-700">
        <div className="h-10 bg-slate-800 rounded-full"></div>
      </div>
    </div>
  </div>
);

// --- ThreadList Component ---
const ThreadList = ({
  threads,
  selectedThread,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  const { data: session } = useSession();
  return (
    <div className="w-full mt-24 md:mt-0 md:w-80 flex flex-col border-r border-slate-700 bg-slate-900 flex-shrink-0 h-full border ">
      <div className="p-3 border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
        <div className="relative">
          <FiSearch className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => {
          const otherParticipant = thread.participants.find(
            (p) => p._id !== session?.user.id
          );
          const lastMessage = thread.lastMessage;
          const isUnread =
            lastMessage?.sender?._id !== session?.user.id &&
            !lastMessage?.recipient?.read;
          return (
            <div
              key={thread._id}
              onClick={() => onSelect(thread)}
              className={`p-3 border-b border-slate-700 cursor-pointer transition-colors ${
                selectedThread?._id === thread._id
                  ? "bg-slate-800"
                  : "hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center font-medium overflow-hidden">
                    {otherParticipant?.profilePhoto ? (
                      <Image
                        src={otherParticipant.profilePhoto}
                        alt={otherParticipant.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-indigo-400">
                        {otherParticipant?.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  {otherParticipant?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-white truncate pr-2">
                      {otherParticipant?.name || "Unknown"}
                    </h3>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {formatDistanceToNow(new Date(thread.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {lastMessage && (
                    <p
                      className={`text-xs mt-1 truncate ${
                        isUnread ? "text-white font-medium" : "text-slate-400"
                      }`}
                    >
                      {lastMessage.sender?._id === session?.user.id && "You: "}
                      {lastMessage.content?.text}
                    </p>
                  )}
                </div>
                {isUnread && (
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full self-center flex-shrink-0 ml-2"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- MessagePanel Component ---
const MessagePanel = ({
  thread,
  messages,
  onBack,
  onSendMessage,
  newMessage,
  onNewMessageChange,
}) => {
  const { data: session } = useSession();
  const messagesEndRef = useRef(null);
  const otherParticipant = thread.participants.find(
    (p) => p._id !== session?.user.id
  );
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-800/30">
      <div className="p-3 border-b border-slate-700 bg-slate-900 z-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="relative w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0">
            {otherParticipant?.profilePhoto ? (
              <Image
                src={otherParticipant.profilePhoto}
                alt="User"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
                {otherParticipant?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {otherParticipant?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">
              {otherParticipant?.name || "Unknown"}
            </h3>
            <p className="text-xs text-slate-400">
              {otherParticipant?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white">
          <FiMoreVertical />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 ${
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
      <div className="p-3 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-white">
            <FiPaperclip />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2.5 rounded-full transition-colors ${
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
  );
};

// --- EmptyState Component ---
const EmptyState = ({ onShowThreads }) => (
  <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-center p-6">
    <FiMessageSquare className="mx-auto text-slate-600" size={48} />
    <h3 className="mt-4 text-lg font-medium text-white">
      Select a conversation
    </h3>
    <p className="mt-2 text-slate-400">
      Choose an existing conversation or start a new one.
    </p>
    <button
      onClick={onShowThreads}
      className="md:hidden mt-6 p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
    >
      View Conversations
    </button>
  </div>
);

// --- Main Page Component ---
export default function MessagePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showThreadList, setShowThreadList] = useState(true);

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
      } catch (error) {
        console.error("Error fetching threads:", error);
      } finally {
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !session) return;

    const tempMessageId = Date.now().toString();
    const originalMessageText = newMessage;
    const originalThreads = [...threads];

    // 1. Optimistic UI Update
    const tempMessage = {
      _id: tempMessageId,
      threadId: selectedThread._id,
      sender: {
        _id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
      content: { text: newMessage },
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setThreads((prev) =>
      prev
        .map((t) =>
          t._id === selectedThread._id
            ? { ...t, lastMessage: tempMessage, updatedAt: new Date() }
            : t
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
    setNewMessage("");

    try {
      // 2. API Call
      const response = await fetch(
        `/api/threads/${selectedThread._id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: originalMessageText, type: "text" }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const sentMessage = await response.json();

      // 3. Reconcile UI with server response
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempMessageId ? sentMessage : msg))
      );
      setThreads((prev) =>
        prev.map((t) =>
          t._id === selectedThread._id ? { ...t, lastMessage: sentMessage } : t
        )
      );
    } catch (error) {
      // 4. Handle errors: Revert optimistic updates
      console.error("Error sending message:", error);
      toast.error("Message failed to send.");
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessageId)); // Remove temp message
      setThreads(originalThreads); // Revert thread list to its original state
      setNewMessage(originalMessageText); // Put user's text back in the input
    }
  };

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    setShowThreadList(false);
    if (threadIdFromURL) {
      router.replace(pathname, { scroll: false });
    }
  };
  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const otherParticipant = thread.participants.find(
      (p) => p._id !== session?.user.id
    );
    const nameMatches =
      otherParticipant?.name?.toLowerCase().includes(query) || false;
    const titleMatches = thread.title?.toLowerCase().includes(query) || false;
    return nameMatches || titleMatches;
  });

  if (isLoading) {
    return <MessagePageSkeleton />;
  }

  return (
    // The key fix: h-full instead of h-screen
    <div className="flex h-full bg-slate-900 overflow-hidden">
      <div
        className={`absolute md:static top-0 left-0 z-10 h-full w-full md:w-auto md:flex-shrink-0 transition-transform duration-300 ease-in-out  overflow-y-auto ${
          showThreadList
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <ThreadList
          threads={filteredThreads}
          selectedThread={selectedThread}
          onSelect={handleThreadSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showThreadList && !selectedThread ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedThread ? (
          <MessagePanel
            thread={selectedThread}
            messages={messages}
            onBack={() => setShowThreadList(true)}
            onSendMessage={handleSendMessage}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
          />
        ) : (
          <EmptyState onShowThreads={() => setShowThreadList(true)} />
        )}
      </div>
    </div>
  );
}
