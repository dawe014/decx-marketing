"use client";
import { useState } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiSettings,
  FiBarChart2,
  FiShield,
  FiFlag,
  FiMessageSquare,
  FiHome,
  FiLogOut,
  FiChevronDown,
  FiSearch,
  FiBell,
  FiMail,
  FiPlus,
  FiX,
} from "react-icons/fi";
// import AdminOverview from "./components/AdminOverview";
// import UserManagement from "./components/UserManagement";
// import CampaignManagement from "./components/CampaignManagement";
// import ReportsComponent from "./components/ReportsComponent";
// import ModerationPanel from "./components/ModerationPanel";
// import SystemSettings from "./components/SystemSettings";
import Link from "next/link";
import { MdArticle } from "react-icons/md";
import Image from "next/image";

export default function AdminDashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(5);
  const [messages, setMessages] = useState(2);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState("");

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <Link
            className="flex flex-shrink-0 items-start"
            href="/dashboard/admin"
          >
            <div>
              <Image
                src="/logo-removebg.png"
                alt="Logo"
                width={500}
                height={500}
                className="w-24 h-12"
              />
            </div>
          </Link>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-b border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
            AD
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
          <button className="text-slate-400 hover:text-white">
            <FiChevronDown size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard/admin">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === "overview"
                  ? "bg-indigo-900/30 text-indigo-400"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <FiHome className="flex-shrink-0" />
              <span>Overview</span>
            </button>
          </Link>
          <Link href="/dashboard/admin/users">
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === "users"
                  ? "bg-indigo-900/30 text-indigo-400"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <FiUsers className="flex-shrink-0" />
              <span>User Management</span>
              <span className="ml-auto bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded-full">
                3 new
              </span>
            </button>
          </Link>
          <Link href="/dashboard/admin/campaigns">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === "campaigns"
                  ? "bg-indigo-900/30 text-indigo-400"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <FiBriefcase className="flex-shrink-0" />
              <span>Campaigns</span>
            </button>
          </Link>
          <Link href="/dashboard/admin/messages">
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === "messages"
                  ? "bg-indigo-900/30 text-indigo-400"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <FiMessageSquare className="flex-shrink-0" />
              <span>Messages</span>
            </button>
          </Link>
          <Link href="/dashboard/admin/e-magazine">
            <button
              onClick={() => setActiveTab("e-magazine")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === "e-magazine"
                  ? "bg-indigo-900/30 text-indigo-400"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <MdArticle className="flex-shrink-0" />
              <span>E-Magazine</span>
            </button>
          </Link>
          <Link href="/dashboard/admin/reports">
            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === "reports"
                  ? "bg-indigo-900/30 text-indigo-400"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <FiBarChart2 className="flex-shrink-0" />
              <span>Reports</span>
            </button>
          </Link>
          <Link href="/dashboard/admin/moderation">
            <button
              onClick={() => setActiveTab("moderation")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === "moderation"
                  ? "bg-indigo-900/30 text-indigo-400"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <FiFlag className="flex-shrink-0" />
              <span>Moderation</span>
              <span className="ml-auto bg-yellow-900/50 text-yellow-400 text-xs px-2 py-1 rounded-full">
                7
              </span>
            </button>
          </Link>
          <Link href="/dashboard/admin/settings">
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                activeTab === "settings"
                  ? "bg-indigo-900/30 text-indigo-400"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <FiShield className="flex-shrink-0" />
              <span>System Settings</span>
            </button>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-900/20">
            <FiLogOut className="flex-shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search users, campaigns..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
            />
          </div>

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

            <div className="relative">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FiPlus size={18} />
                <span>Create New</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              {activeTab === "overview" && "Admin Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "campaigns" && "Campaign Management"}
              {activeTab === "e-magazine" && "Manage Articles"}
              {activeTab === "reports" && "Platform Reports"}
              {activeTab === "moderation" && "Content Moderation"}
              {activeTab === "settings" && "System Settings"}
            </h1>

            <div className="flex space-x-3">
              {activeTab === "users" && (
                <button
                  onClick={() => {
                    setModalType("user");
                    setShowCreateModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <FiPlus size={18} className="mr-2" />
                  Add User
                </button>
              )}
              {activeTab === "campaigns" && (
                <button
                  onClick={() => {
                    setModalType("campaign");
                    setShowCreateModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <FiPlus size={18} className="mr-2" />
                  Create Campaign
                </button>
              )}
            </div>
          </div>

          {/* Page Content */}
          {/* {activeTab === "overview" && <AdminOverview />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "campaigns" && <CampaignManagement />}
          {activeTab === "reports" && <ReportsComponent />}
          {activeTab === "moderation" && <ModerationPanel />}
          {activeTab === "settings" && <SystemSettings />} */}
          {children}
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {modalType === "user" && "Create New User"}
                  {modalType === "campaign" && "Create New Campaign"}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              {modalType === "user" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      User Type
                    </label>
                    <select className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white">
                      <option value="influencer">Influencer</option>
                      <option value="brand">Brand Owner</option>
                      <option value="agency">Agency</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors">
                      Create User
                    </button>
                  </div>
                </div>
              )}

              {modalType === "campaign" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Brand
                    </label>
                    <select className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white">
                      <option value="">Select Brand</option>
                      <option value="1">Nike</option>
                      <option value="2">Adidas</option>
                      <option value="3">Apple</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors">
                      Create Campaign
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
