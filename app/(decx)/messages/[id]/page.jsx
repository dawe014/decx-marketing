'use client'
import React, { useState } from 'react'
import { FiMessageSquare, FiMoreVertical, FiPaperclip, FiSearch, FiSend } from 'react-icons/fi';

export default function MassagePage() {
     // Add this to your main component where you handle the activeTab state
const [activeTab, setActiveTab] = useState('jobs');
const [messages, setMessages] = useState(2);
const [conversations, setConversations] = useState([
  {
    id: 1,
    influencer: {
      name: 'Alex Johnson',
      handle: '@fitness_alex',
      avatar: 'AJ',
      online: true
    },
    job: 'Fitness App Campaign',
    lastMessage: 'Sounds great! When do you need the content by?',
    time: '2h ago',
    unread: true
  },
  {
    id: 2,
    influencer: {
      name: 'Sarah Miller',
      handle: '@tech_sarah',
      avatar: 'SM',
      online: false
    },
    job: 'Tech Gadget Review',
    lastMessage: 'I\'ve sent the draft for your review',
    time: '1d ago',
    unread: false
  }
]);
const [selectedConversation, setSelectedConversation] = useState(null);
const [newMessage, setNewMessage] = useState('');

  return (
    <div >
    
  <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 min-h-screen">


    {/* Messages Container */}
    <div className="flex-1 flex overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-slate-700 flex flex-col">
        <div className="p-3 border-b border-slate-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-800/50 ${selectedConversation?.id === conv.id ? 'bg-slate-800' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`relative ${conv.influencer.online ? 'ring-2 ring-green-500' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
                    {conv.influencer.avatar}
                  </div>
                  {conv.influencer.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-white truncate">{conv.influencer.name}</h3>
                    <span className="text-xs text-slate-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{conv.influencer.handle}</p>
                  <p className={`text-sm mt-1 truncate ${conv.unread ? 'text-white font-medium' : 'text-slate-300'}`}>
                    {conv.lastMessage}
                  </p>
                  <p className="text-xs text-indigo-400 mt-1">{conv.job}</p>
                </div>
                {conv.unread && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation View */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Conversation Header */}
          <div className="p-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`relative ${selectedConversation.influencer.online ? 'ring-2 ring-green-500' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
                  {selectedConversation.influencer.avatar}
                </div>
                {selectedConversation.influencer.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{selectedConversation.influencer.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedConversation.influencer.online ? 'Online' : 'Last seen today'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
              {/* Sample messages - in a real app these would come from your database */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md bg-slate-700 rounded-xl p-3">
                  <p className="text-white">Hi there! I saw your campaign for the fitness app and I'm very interested. Can you share more details?</p>
                  <p className="text-xs text-slate-400 mt-1 text-right">2 days ago</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md bg-indigo-600 rounded-xl p-3">
                  <p className="text-white">Absolutely! We're looking for influencers to create 3 Instagram posts showcasing the app's workout tracking features. Budget is $500-$800.</p>
                  <p className="text-xs text-indigo-200 mt-1 text-right">1 day ago</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md bg-slate-700 rounded-xl p-3">
                  <p className="text-white">Sounds great! When do you need the content by?</p>
                  <p className="text-xs text-slate-400 mt-1 text-right">2h ago</p>
                </div>
              </div>
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
                placeholder="Type a message..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button 
                className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 rounded-full"
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
            <FiMessageSquare className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-white mb-2">Select a conversation</h3>
            <p className="text-slate-400">Choose an existing conversation or start a new one</p>
          </div>
        </div>
      )}
    </div>
  </div>

    </div>
  )
}
