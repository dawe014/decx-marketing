"use client";
import { useState } from "react";
import {
  FiPlus,
  FiBriefcase,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiMessageSquare,
  FiBarChart2,
  FiLogOut,
  FiChevronDown,
  FiSearch,
  FiBell,
  FiMail,
  FiX,
  FiMenu,
} from "react-icons/fi";
import NewJobPage from "./components/NewJobPage";
import Link from "next/link";
import Image from "next/image";

export default function BrandDashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState("jobs");
  const [showJobModal, setShowJobModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(2);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out
        ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex flex-col">
          <Link href="/dashboard/brand-owner" className="flex items-start">
            <Image
              src="/logo-removebg.png"
              alt="Logo"
              width={500}
              height={500}
              className="w-24 h-12"
            />
          </Link>
          <p className="text-xs text-slate-400">Brand Dashboard</p>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
            BD
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">Brand Owner</p>
            <p className="text-xs text-slate-400">Pro Plan</p>
          </div>
          <button className="text-slate-400 hover:text-white">
            <FiChevronDown size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            {
              name: "My Campaigns",
              icon: FiBriefcase,
              route: "campaigns",
              id: "jobs",
            },
            {
              name: "Messages",
              icon: FiMessageSquare,
              route: "messages",
              id: "messages",
              badge: messages,
            },
            {
              name: "Billing",
              icon: FiDollarSign,
              route: "billing",
              id: "billing",
            },
            {
              name: "Settings",
              icon: FiSettings,
              route: "settings",
              id: "settings",
            },
          ].map(({ name, icon: Icon, route, id, badge }) => (
            <Link href={`/dashboard/brand-owner/${route}`} key={id}>
              <button
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                  activeTab === id
                    ? "bg-indigo-900/30 text-indigo-400"
                    : "hover:bg-slate-700/50"
                }`}
              >
                <Icon className="flex-shrink-0" />
                <span>{name}</span>
                {badge > 0 && (
                  <span className="ml-auto bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-900/20">
            <FiLogOut className="flex-shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          {/* Hamburger Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <FiMenu size={24} />
            </button>

            {/* Search Input */}
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs, influencers..."
                className="w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
              <FiBell size={20} />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
              <FiMail size={20} />
              {messages > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {messages}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowJobModal(true)}
              className="hidden sm:flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiPlus size={18} />
              <span>New Job</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900">
          {children}
        </main>
      </div>

      {/* Job Post Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-full p-2"
                >
                  <FiX size={24} />
                </button>
              </div>
              <NewJobPage />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
