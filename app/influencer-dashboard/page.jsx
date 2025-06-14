"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiBriefcase,
  FiMail,
  FiSettings,
  FiBell,
  FiHome,
  FiDollarSign,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";
import Image from "next/image";

const InfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [messages, setMessages] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();

  // Map social media platforms to icons
  const socialIcons = {
    Facebook: <FaFacebook className="text-blue-500" />,
    Twitter: <FaTwitter className="text-blue-400" />,
    Instagram: <FaInstagram className="text-pink-500" />,
    Youtube: <FaYoutube className="text-red-400" />,
    Tiktok: <FaTiktok className="text-black" />,
    Linkedin: <FaLinkedin className="text-blue-600" />,
  };

  // Fetch influencer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch influencer profile
        const profileResponse = await fetch("/api/influencer/profile");
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileResponse.json();
        setInfluencer(profileData);
        setFormData(profileData);

        // Fetch messages
        const messagesResponse = await fetch("/api/influencer/messages");
        if (!messagesResponse.ok) throw new Error("Failed to fetch messages");
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);

        // Fetch proposals
        const proposalsResponse = await fetch("/api/influencer/proposals");
        if (!proposalsResponse.ok) throw new Error("Failed to fetch proposals");
        const proposalsData = await proposalsResponse.json();
        setProposals(proposalsData);

        // Fetch campaigns
        const campaignsResponse = await fetch("/api/influencer/campaigns");
        if (!campaignsResponse.ok) throw new Error("Failed to fetch campaigns");
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData);
      } catch (err) {
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (index, field, value) => {
    const updatedSocialMedia = [...formData.socialMedia];
    updatedSocialMedia[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      socialMedia: updatedSocialMedia,
    }));
  };

  const handleNicheChange = (index, value) => {
    const updatedNiches = [...formData.niches];
    updatedNiches[index] = value;
    setFormData((prev) => ({
      ...prev,
      niches: updatedNiches,
    }));
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      languages: updatedLanguages,
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      services: updatedServices,
    }));
  };

  const handlePortfolioChange = (index, field, value) => {
    const updatedPortfolio = [...formData.portfolio];
    updatedPortfolio[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      portfolio: updatedPortfolio,
    }));
  };

  const handleRatesChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      rates: {
        ...prev.rates,
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/influencer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();
      setInfluencer(updatedProfile);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeMessage) return;

    try {
      const response = await fetch("/api/influencer/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: activeMessage.id,
          content: newMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const updatedMessage = await response.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === activeMessage.id
            ? { ...msg, messages: [...msg.messages, updatedMessage] }
            : msg
        )
      );
      setNewMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProposalAction = async (proposalId, action) => {
    try {
      const response = await fetch(`/api/influencer/proposals/${proposalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} proposal`);

      const updatedProposal = await response.json();
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? updatedProposal : p))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={influencer?.profilePhoto || "/default-profile.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {influencer?.fullName}
              </h3>
              <p className="text-xs text-gray-500">Influencer</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "dashboard"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiHome className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "profile"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiUser className="mr-3" />
                My Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("proposals")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "proposals"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiBriefcase className="mr-3" />
                My Proposals
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("campaigns")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "campaigns"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiBarChart2 className="mr-3" />
                My Campaigns
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("messages")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "messages"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiMail className="mr-3" />
                Messages
                {messages.filter((m) => !m.read).length > 0 && (
                  <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                    {messages.filter((m) => !m.read).length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("earnings")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "earnings"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiDollarSign className="mr-3" />
                Earnings
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "settings"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiSettings className="mr-3" />
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden flex justify-around items-center p-2 border-t border-gray-200">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`p-3 rounded-full ${
            activeTab === "dashboard" ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          <FiHome className="text-xl" />
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`p-3 rounded-full ${
            activeTab === "profile" ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          <FiUser className="text-xl" />
        </button>
        <button
          onClick={() => setActiveTab("proposals")}
          className={`p-3 rounded-full ${
            activeTab === "proposals" ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          <FiBriefcase className="text-xl" />
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`p-3 rounded-full ${
            activeTab === "campaigns" ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          <FiBarChart2 className="text-xl" />
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`p-3 rounded-full ${
            activeTab === "messages" ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          <FiMail className="text-xl" />
          {messages.filter((m) => !m.read).length > 0 && (
            <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-1 rounded-full">
              {messages.filter((m) => !m.read).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`p-3 rounded-full ${
            activeTab === "settings" ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          <FiSettings className="text-xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "profile" && "My Profile"}
            {activeTab === "proposals" && "My Proposals"}
            {activeTab === "campaigns" && "My Campaigns"}
            {activeTab === "messages" && "Messages"}
            {activeTab === "earnings" && "Earnings"}
            {activeTab === "settings" && "Settings"}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <FiBell className="text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={influencer?.profilePhoto || "/default-profile.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">
                  Active Campaigns
                </h3>
                <p className="text-2xl font-bold mt-2">
                  {campaigns.filter((c) => c.status === "active").length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">
                  Pending Proposals
                </h3>
                <p className="text-2xl font-bold mt-2">
                  {proposals.filter((p) => p.status === "pending").length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">
                  Unread Messages
                </h3>
                <p className="text-2xl font-bold mt-2">
                  {messages.filter((m) => !m.read).length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Earnings
                </h3>
                <p className="text-2xl font-bold mt-2">
                  $
                  {campaigns
                    .filter((c) => c.status === "completed")
                    .reduce((sum, c) => sum + (c.payment?.amount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recent Campaigns */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Campaigns</h2>
                <button
                  onClick={() => setActiveTab("campaigns")}
                  className="text-indigo-600 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.slice(0, 3).map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {campaign.title}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                src={
                                  campaign.brand?.logo || "/default-brand.png"
                                }
                                alt={campaign.brand?.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {campaign.brand?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              campaign.status === "active"
                                ? "bg-green-100 text-green-800"
                                : campaign.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${campaign.payment?.amount?.toLocaleString() || "0"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(campaign.deadline)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Messages</h2>
                <button
                  onClick={() => setActiveTab("messages")}
                  className="text-indigo-600 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {messages.slice(0, 3).map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => {
                      setActiveTab("messages");
                      setActiveMessage(message);
                    }}
                  >
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        src={message.sender?.avatar || "/default-profile.png"}
                        alt={message.sender?.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {message.sender?.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatDate(message.messages[0]?.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {message.messages[0]?.content}
                      </p>
                    </div>
                    {!message.read && (
                      <div className="ml-4">
                        <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              {editMode ? (
                <div className="space-x-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="location.country"
                      value={formData.location?.country || ""}
                      onChange={(e) =>
                        setFormData({
                          ...prev,
                          location: {
                            ...formData.location,
                            country: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location?.city || ""}
                      onChange={(e) =>
                        setFormData({
                          ...prev,
                          location: {
                            ...formData.location,
                            city: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <input
                      type="text"
                      name="location.timezone"
                      value={formData.location?.timezone || ""}
                      onChange={(e) =>
                        setFormData({
                          ...prev,
                          location: {
                            ...formData.location,
                            timezone: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="available">Available</option>
                      <option value="limited">Limited</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Social Media Accounts
                  </h3>
                  <div className="space-y-4">
                    {formData.socialMedia?.map((social, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Platform
                          </label>
                          <select
                            value={social.platform || ""}
                            onChange={(e) =>
                              handleSocialMediaChange(
                                index,
                                "platform",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Select Platform</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Youtube">YouTube</option>
                            <option value="Tiktok">TikTok</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Linkedin">LinkedIn</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Handle
                          </label>
                          <input
                            type="text"
                            value={social.handle || ""}
                            onChange={(e) =>
                              handleSocialMediaChange(
                                index,
                                "handle",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Followers
                          </label>
                          <input
                            type="number"
                            value={social.followers || ""}
                            onChange={(e) =>
                              handleSocialMediaChange(
                                index,
                                "followers",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="100000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Engagement Rate (%)
                          </label>
                          <input
                            type="number"
                            value={social.engagementRate || ""}
                            onChange={(e) =>
                              handleSocialMediaChange(
                                index,
                                "engagementRate",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="2.5"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          socialMedia: [
                            ...formData.socialMedia,
                            {
                              platform: "",
                              handle: "",
                              followers: 0,
                              engagementRate: 0,
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Another Platform
                    </button>
                  </div>
                </div>

                {/* Niches */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Niches
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.niches?.map((niche, index) => (
                      <div key={index} className="flex items-center">
                        <select
                          value={niche || ""}
                          onChange={(e) =>
                            handleNicheChange(index, e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Niche</option>
                          <option value="fashion">Fashion</option>
                          <option value="beauty">Beauty</option>
                          <option value="fitness">Fitness</option>
                          <option value="food">Food</option>
                          <option value="travel">Travel</option>
                          <option value="tech">Tech</option>
                          <option value="gaming">Gaming</option>
                          <option value="lifestyle">Lifestyle</option>
                          <option value="business">Business</option>
                          <option value="education">Education</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedNiches = [...formData.niches];
                            updatedNiches.splice(index, 1);
                            setFormData({ ...formData, niches: updatedNiches });
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        niches: [...formData.niches, ""],
                      })
                    }
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Niche
                  </button>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Languages
                  </h3>
                  <div className="space-y-4">
                    {formData.languages?.map((language, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <input
                            type="text"
                            value={language.name || language.language || ""}
                            onChange={(e) =>
                              handleLanguageChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proficiency
                          </label>
                          <select
                            value={language.level || language.proficiency || ""}
                            onChange={(e) =>
                              handleLanguageChange(
                                index,
                                "level",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Select Proficiency</option>
                            <option value="basic">Basic</option>
                            <option value="conversational">
                              Conversational
                            </option>
                            <option value="fluent">Fluent</option>
                            <option value="native">Native</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          languages: [
                            ...formData.languages,
                            { name: "", level: "" },
                          ],
                        })
                      }
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Language
                    </button>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Services
                  </h3>
                  <div className="space-y-4">
                    {formData.services?.map((service, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Name
                          </label>
                          <input
                            type="text"
                            value={service.name || ""}
                            onChange={(e) =>
                              handleServiceChange(index, "name", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fee ($)
                          </label>
                          <input
                            type="number"
                            value={service.fee || ""}
                            onChange={(e) =>
                              handleServiceChange(index, "fee", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          services: [
                            ...formData.services,
                            { name: "", fee: 0 },
                          ],
                        })
                      }
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Service
                    </button>
                  </div>
                </div>

                {/* Rates */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Rates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Post Rate ($)
                      </label>
                      <input
                        type="number"
                        value={formData.rates?.postRate || ""}
                        onChange={(e) =>
                          handleRatesChange("postRate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Story Rate ($)
                      </label>
                      <input
                        type="number"
                        value={formData.rates?.storyRate || ""}
                        onChange={(e) =>
                          handleRatesChange("storyRate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video Rate ($)
                      </label>
                      <input
                        type="number"
                        value={formData.rates?.videoRate || ""}
                        onChange={(e) =>
                          handleRatesChange("videoRate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collaboration Rate ($)
                      </label>
                      <input
                        type="number"
                        value={formData.rates?.collaborationRate || ""}
                        onChange={(e) =>
                          handleRatesChange("collaborationRate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Portfolio
                  </h3>
                  <div className="space-y-4">
                    {formData.portfolio?.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) =>
                              handlePortfolioChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Media URL
                          </label>
                          <input
                            type="text"
                            value={item.mediaUrl || ""}
                            onChange={(e) =>
                              handlePortfolioChange(
                                index,
                                "mediaUrl",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Media Type
                          </label>
                          <select
                            value={item.mediaType || ""}
                            onChange={(e) =>
                              handlePortfolioChange(
                                index,
                                "mediaType",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Select Type</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="link">Link</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          portfolio: [
                            ...formData.portfolio,
                            { title: "", mediaUrl: "", mediaType: "" },
                          ],
                        })
                      }
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Portfolio Item
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Display Profile Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-gray-900">{influencer.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-gray-900">{influencer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">
                        {influencer.location.city},{" "}
                        {influencer.location.country} (
                        {influencer.location.timezone})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="text-gray-900">
                        {influencer.availability.charAt(0).toUpperCase() +
                          influencer.availability.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Bio
                  </h3>
                  <p className="text-gray-900">
                    {influencer.bio || "No bio available."}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Social Media Accounts
                  </h3>
                  <div className="space-y-2">
                    {influencer.socialMedia?.map((social, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {socialIcons[social.platform]}
                        <p className="text-gray-900">{social.platform}</p>
                        <p className="text-gray-500">@{social.handle}</p>
                        <p className="text-gray-500">
                          {social.followers.toLocaleString()} followers
                        </p>
                        <p className="text-gray-500">
                          {social.engagementRate}% engagement
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Niches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {influencer.niches?.map((niche, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Languages
                  </h3>
                  <div className="space-y-2">
                    {influencer.languages?.map((language, index) => (
                      <p key={index} className="text-gray-900">
                        {language.name} ({language.level})
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Services
                  </h3>
                  <div className="space-y-2">
                    {influencer.services?.map((service, index) => (
                      <p key={index} className="text-gray-900">
                        {service.name}: ${service.fee}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Rates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {influencer.rates?.postRate && (
                      <p className="text-gray-900">
                        Post Rate: ${influencer.rates.postRate}
                      </p>
                    )}
                    {influencer.rates?.storyRate && (
                      <p className="text-gray-900">
                        Story Rate: ${influencer.rates.storyRate}
                      </p>
                    )}
                    {influencer.rates?.videoRate && (
                      <p className="text-gray-900">
                        Video Rate: ${influencer.rates.videoRate}
                      </p>
                    )}
                    {influencer.rates?.collaborationRate && (
                      <p className="text-gray-900">
                        Collaboration Rate: $
                        {influencer.rates.collaborationRate}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Portfolio
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {influencer.portfolio?.map((item, index) => (
                      <div
                        key={index}
                        className="relative h-48 rounded-lg overflow-hidden"
                      >
                        {item.mediaType === "image" && (
                          <Image
                            src={item.mediaUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        {item.mediaType === "video" && (
                          <video
                            src={item.mediaUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                        {item.mediaType === "link" && (
                          <a
                            href={item.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center h-full bg-gray-200 text-gray-900"
                          >
                            {item.title}
                          </a>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition">
                          <p className="text-white font-semibold">
                            {item.title}
                          </p>
                          <p className="text-white text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Badges
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {influencer.badges?.map((badge, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Proposals Tab */}
        {activeTab === "proposals" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">My Proposals</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proposed Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proposals.map((proposal) => (
                    <tr key={proposal.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {proposal.campaign?.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              src={proposal.brand?.logo || "/default-brand.png"}
                              alt={proposal.brand?.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {proposal.brand?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            proposal.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : proposal.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${proposal.amount?.toLocaleString() || "0"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(proposal.submittedAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proposal.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleProposalAction(proposal.id, "accept")
                              }
                              className="text-green-600 hover:text-green-800"
                            >
                              <FiCheckCircle />
                            </button>
                            <button
                              onClick={() =>
                                handleProposalAction(proposal.id, "reject")
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <FiXCircle />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">My Campaigns</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              src={campaign.brand?.logo || "/default-brand.png"}
                              alt={campaign.brand?.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {campaign.brand?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            campaign.status === "active"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${campaign.payment?.amount?.toLocaleString() || "0"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(campaign.deadline)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Message List */}
              <div className="md:w-1/3 border-r border-gray-200 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start p-4 rounded-lg cursor-pointer ${
                        activeMessage?.id === message.id
                          ? "bg-indigo-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveMessage(message)}
                    >
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={message.sender?.avatar || "/default-profile.png"}
                          alt={message.sender?.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {message.sender?.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatDate(message.messages[0]?.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {message.messages[0]?.content}
                        </p>
                      </div>
                      {!message.read && (
                        <div className="ml-4">
                          <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Conversation */}
              <div className="md:w-2/3">
                {activeMessage ? (
                  <div className="flex flex-col h-full">
                    <div className="flex items-center p-4 border-b border-gray-200">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={
                            activeMessage.sender?.avatar ||
                            "/default-profile.png"
                          }
                          alt={activeMessage.sender?.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <h3 className="ml-4 text-lg font-medium text-gray-900">
                        {activeMessage.sender?.name}
                      </h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto max-h-96">
                      {activeMessage.messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`mb-4 ${
                            msg.senderId === influencer.user
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          <div
                            className={`inline-block p-3 rounded-lg ${
                              msg.senderId === influencer.user
                                ? "bg-indigo-100 text-indigo-900"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="ml-2 px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Select a conversation to view messages
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Earnings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Total Earnings
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {campaigns
                    .filter((c) => c.status === "completed")
                    .reduce((sum, c) => sum + (c.payment?.amount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Paid
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns
                      .filter((c) => c.status === "completed")
                      .map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {campaign.title}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Image
                                  src={
                                    campaign.brand?.logo || "/default-brand.png"
                                  }
                                  alt={campaign.brand?.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {campaign.brand?.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${campaign.payment?.amount?.toLocaleString() || "0"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(campaign.payment?.datePaid)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Notification Preferences
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      Email notifications for new messages
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      Email notifications for new proposals
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      Email notifications for campaign updates
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Account Settings
                </h3>
                <button className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerDashboard;
