// app/dashboard/brand-owner/interviews/[[...threadId]]/page.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import {
  FiMessageSquare,
  FiMoreVertical,
  FiPaperclip,
  FiSearch,
  FiSend,
  FiUser,
  FiInfo,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiTarget,
} from "react-icons/fi";
import { useInterviews } from "@/hooks/useInterviews"; // Adjust path

// ====================================================================================
// SUB-COMPONENT 1: ThreadsList
// ====================================================================================
const ThreadsList = ({
  threads,
  selectedThread,
  onSelectThread,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThreads = threads;

  return (
    <div className="w-full md:w-80 border-r border-slate-700 flex-col hidden md:flex">
      <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredThreads.map((thread) => {
          return (
            <div
              key={thread._id}
              onClick={() => onSelectThread(thread)}
              className={`p-3 flex items-start space-x-3 border-b border-slate-800 cursor-pointer transition-colors ${
                selectedThread?._id === thread._id
                  ? "bg-slate-800"
                  : "hover:bg-slate-800/50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold overflow-hidden">
                  {thread.profilePhoto ? (
                    <img
                      src={thread.profilePhoto}
                      alt={thread.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    thread.name?.charAt(0) || "?"
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-white truncate">
                    {thread.name}
                  </h3>
                  <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(thread.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">
                  {thread.campaign?.title || "General Inquiry"}
                </p>
                {thread.lastMessage && (
                  <p className="text-sm mt-1 text-slate-300 truncate">
                    {thread.lastMessage.sender._id === currentUser?.id
                      ? "You: "
                      : ""}
                    {thread.lastMessage.content.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ====================================================================================
// SUB-COMPONENT 2: ChatWindow
// ====================================================================================
const ChatWindow = ({ thread, messages, currentUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const otherParticipant = thread.participants.find(
    (p) => p._id !== currentUser?.id
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold overflow-hidden">
            {otherParticipant.profilePhoto ? (
              <img
                src={otherParticipant.profilePhoto}
                alt={otherParticipant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              otherParticipant.name?.charAt(0) || "?"
            )}
          </div>
          <div>
            <h3 className="font-medium text-white">{otherParticipant.name}</h3>
            <p className="text-xs text-slate-400">
              Discussing: {thread.campaign?.title}
            </p>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-white">
          <FiMoreVertical size={20} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-900/50">
          <div className="space-y-4">
            {messages.map((message) => {
              const isMe = message.sender._id === currentUser?.id;
              return (
                <div
                  key={message._id}
                  className={`flex items-end gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
                      {message.sender.image ? (
                        <img
                          src={message.sender.image}
                          alt={message.sender.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="m-auto text-slate-400" />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-md rounded-xl p-3 ${
                      isMe
                        ? "bg-indigo-600 rounded-br-none"
                        : "bg-slate-700 rounded-bl-none"
                    }`}
                  >
                    <p className="text-white">{message.content.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMe
                          ? "text-indigo-200 text-right"
                          : "text-slate-400 text-left"
                      }`}
                    >
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Interview Details Sidebar */}
        <aside className="w-80 border-l border-slate-700 p-4 overflow-y-auto hidden lg:block">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FiInfo className="mr-2 text-indigo-400" />
            Interview Details
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-400 flex items-center mb-2">
                <FiBriefcase className="mr-2" />
                Campaign
              </h4>
              <p className="text-white font-semibold">
                {thread.campaign?.title || "N/A"}
              </p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-400 flex items-center mb-2">
                <FiUser className="mr-2" />
                Influencer
              </h4>
              <p className="text-white font-semibold">
                {otherParticipant.name}
              </p>
              <p className="text-sm text-slate-400">{otherParticipant.email}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-400 flex items-center mb-2">
                <FiDollarSign className="mr-2" />
                Budget
              </h4>
              <p className="text-white">
                {thread.campaign?.budget.min} - {thread.campaign?.budget.max}{" "}
                {thread.campaign?.budget.currency}
              </p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-400 flex items-center mb-2">
                <FiCalendar className="mr-2" />
                Dates
              </h4>
              <p className="text-white">
                Start:{" "}
                {new Date(thread.campaign?.startDate).toLocaleDateString()}
              </p>
              <p className="text-white">
                End: {new Date(thread.campaign?.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-white">
            <FiPaperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2 text-indigo-400 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================================================
// MAIN PAGE COMPONENT
// ====================================================================================
export default function InterviewsPage() {
  const {
    threads,
    selectedThread,
    messages,
    isLoading,
    currentUser,
    handleSendMessage,
    selectThread,
  } = useInterviews();

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 min-h-screen text-white">
        Loading interviews...
      </div>
    );

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-900 text-white min-h-[calc(100vh-theme(headerHeight))]">
      {" "}
      {/* Adjust height if you have a global header */}
      <ThreadsList
        threads={threads}
        selectedThread={selectedThread}
        onSelectThread={selectThread}
        currentUser={currentUser}
      />
      {selectedThread ? (
        <ChatWindow
          key={selectedThread._id} // IMPORTANT: Re-mounts component on thread change
          thread={selectedThread}
          messages={messages}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-900/50">
          <div className="text-center p-6">
            <FiMessageSquare
              className="mx-auto text-slate-400 mb-4"
              size={48}
            />
            <h3 className="text-lg font-medium text-white mb-2">
              Select an Interview
            </h3>
            <p className="text-slate-400">
              Choose a conversation from the left to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
