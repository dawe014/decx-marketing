"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiRotateCw,
  FiExternalLink,
  FiGlobe,
  FiInstagram,
  FiYoutube,
  FiTwitter,
  FiLinkedin,
  FiFacebook,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.profile &&
        user.profile.fullName &&
        user.profile.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.profile?.companyName &&
        user.profile.companyName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === "all" || user.role === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleApproveUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user.role === "influencer" && user.profile.followers < 5000) {
      alert("This influencer has less than 5,000 followers. Cannot approve.");
      return;
    }

    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, status: "active" } : user
      )
    );
  };

  const handleRejectUser = (userId) => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, status: "rejected" } : user
      )
    );
  };

  const handleSuspendUser = (userId) => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, status: "suspended" } : user
      )
    );
  };

  const handleActivateUser = (userId) => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, status: "active" } : user
      )
    );
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setUsers(
        users.map((user) => (user._id === editingUser._id ? editingUser : user))
      );
      setEditingUser(null);
      setIsSaving(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: name === "followers" ? parseInt(value) || 0 : value,
      },
    }));
  };

  const getUserTypeBadge = (type) => {
    const colors = {
      influencer: "bg-purple-900/30 text-purple-400",
      brand: "bg-blue-900/30 text-blue-400",
      agency: "bg-green-900/30 text-green-400",
      admin: "bg-yellow-900/30 text-yellow-400",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full capitalize ${
          colors[type] || "bg-slate-700"
        }`}
      >
        {type}
      </span>
    );
  };

  const getUserStatusBadge = (status) => {
    const colors = {
      active: "bg-green-900/30 text-green-400",
      pending: "bg-yellow-900/30 text-yellow-400",
      suspended: "bg-red-900/30 text-red-400",
      rejected: "bg-gray-900/30 text-gray-400",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full capitalize ${
          colors[status] || "bg-slate-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const viewUserProfile = (user) => {
    setViewingProfile(user);
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <FiInstagram className="mr-1" />;
      case "youtube":
        return <FiYoutube className="mr-1" />;
      case "twitter":
        return <FiTwitter className="mr-1" />;
      case "linkedin":
        return <FiLinkedin className="mr-1" />;
      case "facebook":
        return <FiFacebook className="mr-1" />;
      default:
        return <FiGlobe className="mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FiFilter className="text-slate-400" />
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="influencer">Influencers</option>
              <option value="brand">Brands</option>
              <option value="agency">Agencies</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden text-slate-300 font-medium mr-3">
                        {user?.profile?.profilePhoto || user?.profile?.logo ? (
                          <Image
                            src={user.profile.profilePhoto || user.profile.logo}
                            alt="Profile Image"
                            width={500}
                            height={500}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span>
                            {(
                              user?.profile?.fullName ||
                              user?.profile?.companyName
                            )
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "A"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {user.profile
                            ? (user.role == "influencer" &&
                                user.profile.fullName) ||
                              (user.role == "brand" &&
                                user.profile.companyName) ||
                              (user.role == "agency" && user.profile.agencyName)
                            : "Admin"}
                        </p>
                        <button
                          onClick={() => viewUserProfile(user)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 flex items-center"
                        >
                          View{" "}
                          {user.role === "influencer" ? "Profile" : "Details"}{" "}
                          <FiExternalLink className="ml-1" size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUserTypeBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUserStatusBadge(user.status)}
                    {user.role === "influencer" &&
                      user.status === "pending" && (
                        <div className="text-xs mt-1 text-slate-400">
                          {user.profile.followers >= 5000 ? (
                            <span className="text-green-400">
                              Meets requirements
                            </span>
                          ) : (
                            <span className="text-red-400">
                              Needs 5k+ followers
                            </span>
                          )}
                        </div>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      <FiEdit2 size={16} className="inline" />
                    </button>

                    {user.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApproveUser(user._id)}
                          disabled={
                            user.role === "influencer" &&
                            user.profile.followers < 5000
                          }
                          className={`${
                            user.role === "influencer" &&
                            user.profile.followers < 5000
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-green-400 hover:text-green-300"
                          }`}
                          title={
                            user.role === "influencer" &&
                            user.profile.followers < 5000
                              ? "Needs 5k+ followers"
                              : "Approve"
                          }
                        >
                          <FiCheck size={16} className="inline" />
                        </button>
                        <button
                          onClick={() => handleRejectUser(user._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiX size={16} className="inline" />
                        </button>
                      </>
                    ) : user.status === "suspended" ? (
                      <button
                        onClick={() => handleActivateUser(user._id)}
                        className="text-green-400 hover:text-green-300"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSuspendUser(user._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Edit User</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    {editingUser.role === "influencer"
                      ? "Full Name"
                      : "Company Name"}
                  </label>
                  <input
                    type="text"
                    name={
                      editingUser.role === "influencer"
                        ? "fullName"
                        : editingUser.role === "brand"
                        ? "companyName"
                        : "agencyName"
                    }
                    value={
                      editingUser.role === "influencer"
                        ? editingUser.profile?.fullName || ""
                        : editingUser.role === "brand"
                        ? editingUser.profile?.companyName || ""
                        : editingUser.profile?.agencyName || ""
                    }
                    onChange={handleProfileInputChange}
                    className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    User Type
                  </label>
                  <select
                    name="role"
                    value={editingUser.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  >
                    <option value="influencer">Influencer</option>
                    <option value="brand">Brand</option>
                    <option value="agency">Agency</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {editingUser.role === "influencer" && (
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-300 mb-3">
                      Influencer Profile
                    </h3>
                    {editingUser.profile.socialMedia?.map((social, index) => (
                      <div key={index} className="space-y-3 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Platform
                          </label>
                          <select
                            name="platform"
                            value={social.platform || ""}
                            onChange={(e) => handleProfileInputChange(e, index)}
                            className="w-full px-3 py-1 text-sm border border-slate-700 rounded bg-slate-800 text-white"
                          >
                            <option value="Instagram">Instagram</option>
                            <option value="YouTube">YouTube</option>
                            <option value="TikTok">TikTok</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Facebook">Facebook</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Followers
                          </label>
                          <input
                            type="number"
                            name="followers"
                            value={social.followers || 0}
                            onChange={(e) => handleProfileInputChange(e, index)}
                            className="w-full px-3 py-1 text-sm border border-slate-700 rounded bg-slate-800 text-white"
                          />
                          {social.followers < 5000 && (
                            <p className="text-xs text-red-400 mt-1">
                              Minimum 5,000 followers required
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Profile Link
                          </label>
                          <input
                            type="url"
                            name="link"
                            value={social.link || ""}
                            onChange={(e) => handleProfileInputChange(e, index)}
                            className="w-full px-3 py-1 text-sm border border-slate-700 rounded bg-slate-800 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(editingUser.role === "brand" ||
                  editingUser.role === "agency") && (
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-300 mb-3">
                      {editingUser.role === "brand" ? "Brand" : "Agency"}{" "}
                      Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Industry
                        </label>
                        <input
                          type="text"
                          name="industry"
                          value={editingUser.profile?.industry || ""}
                          onChange={handleProfileInputChange}
                          className="w-full px-3 py-1 text-sm border border-slate-700 rounded bg-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={editingUser.profile?.website || ""}
                          onChange={handleProfileInputChange}
                          className="w-full px-3 py-1 text-sm border border-slate-700 rounded bg-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editingUser.profile?.description || ""}
                          onChange={handleProfileInputChange}
                          className="w-full px-3 py-1 text-sm border border-slate-700 rounded bg-slate-800 text-white"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editingUser.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isSaving ? (
                      <>
                        <FiRotateCw className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 ">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl h-[90%] overflow-y-scroll ">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {viewingProfile.role === "influencer"
                    ? "Influencer Profile"
                    : viewingProfile.role === "brand"
                    ? "Brand Details"
                    : "Agency Details"}
                </h2>
                <button
                  onClick={() => setViewingProfile(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                      {viewingProfile.profile?.profilePhoto ||
                      viewingProfile.profile?.logo ? (
                        <Image
                          src={
                            viewingProfile.profile.profilePhoto ||
                            viewingProfile.profile.logo
                          }
                          alt="Profile"
                          width={500}
                          height={500}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-4xl text-white font-medium">
                          {(
                            viewingProfile.profile?.fullName ||
                            viewingProfile.profile?.companyName ||
                            viewingProfile.profile?.agencyName
                          )
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">
                      {viewingProfile.role === "influencer"
                        ? viewingProfile.profile?.fullName
                        : viewingProfile.role === "brand"
                        ? viewingProfile.profile?.companyName
                        : viewingProfile.profile?.agencyName}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      {viewingProfile.email}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {getUserTypeBadge(viewingProfile.role)}
                      {getUserStatusBadge(viewingProfile.status)}
                      {viewingProfile.role === "influencer" && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-400">
                          {viewingProfile.profile?.category || "General"}
                        </span>
                      )}
                    </div>

                    {viewingProfile.role !== "influencer" && (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-400">
                          <FiBriefcase className="mr-2" />
                          <span>
                            {viewingProfile.profile?.industry ||
                              "No industry specified"}
                          </span>
                        </div>
                        {viewingProfile.profile?.website && (
                          <div className="flex items-center text-sm text-slate-400">
                            <FiGlobe className="mr-2" />
                            <a
                              href={viewingProfile.profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300"
                            >
                              {viewingProfile.profile.website}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {viewingProfile.role === "influencer" ? (
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-slate-300 mb-4">
                      Social Media Profiles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingProfile.profile.socialMedia?.map(
                        (social, index) => (
                          <div
                            key={index}
                            className="bg-slate-800 p-3 rounded-lg"
                          >
                            <div className="flex items-center mb-2">
                              {getPlatformIcon(social.platform)}
                              <span className="font-medium text-white">
                                {social.platform}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs text-slate-400">
                                  Followers
                                </p>
                                <p
                                  className={`text-lg font-bold ${
                                    social.followers >= 5000
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {social.followers?.toLocaleString() || "0"}
                                </p>
                              </div>
                              <a
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                              >
                                View{" "}
                                <FiExternalLink className="ml-1" size={14} />
                              </a>
                            </div>
                            {social.followers < 5000 && (
                              <p className="text-xs text-red-400 mt-1">
                                Minimum 5,000 followers required
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-3 rounded-lg">
                        <p className="text-xs text-slate-400">
                          Engagement Rate
                        </p>
                        <p className="text-lg font-bold text-white">
                          {viewingProfile.profile?.engagementRate || "N/A"}%
                        </p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded-lg">
                        <p className="text-xs text-slate-400">Average Views</p>
                        <p className="text-lg font-bold text-white">
                          {viewingProfile.profile?.averageViews?.toLocaleString() ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    {viewingProfile.profile?.bio && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">
                          Bio
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {viewingProfile.profile.bio}
                        </p>
                      </div>
                    )}
                    {/* Public Profile Link */}
                    <div className="mt-4">
                      <a
                        href={`/influencers/${viewingProfile._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 bg-slate-800 px-4 py-2 rounded-lg"
                      >
                        <FiExternalLink className="mr-2" />
                        View Public Profile
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-slate-300 mb-4">
                      {viewingProfile.role === "brand" ? "Brand" : "Agency"}{" "}
                      Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Industry</p>
                        <p className="text-white">
                          {viewingProfile.profile?.industry || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Location</p>
                        <p className="text-white">
                          {viewingProfile.profile?.location || "Not specified"}
                        </p>
                      </div>
                      {viewingProfile.profile?.website && (
                        <div>
                          <p className="text-xs text-slate-400">Website</p>
                          <a
                            href={viewingProfile.profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            {viewingProfile.profile.website}
                          </a>
                        </div>
                      )}
                      {viewingProfile.profile?.founded && (
                        <div>
                          <p className="text-xs text-slate-400">Founded</p>
                          <p className="text-white">
                            {new Date(
                              viewingProfile.profile.founded
                            ).getFullYear()}
                          </p>
                        </div>
                      )}
                    </div>

                    {viewingProfile.profile?.description && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">
                          About
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {viewingProfile.profile.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  {viewingProfile.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          handleApproveUser(viewingProfile._id);
                          setViewingProfile(null);
                        }}
                        disabled={
                          viewingProfile.role === "influencer" &&
                          viewingProfile.profile.followers < 5000
                        }
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          viewingProfile.role !== "influencer" ||
                          viewingProfile.profile.followers >= 5000
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FiCheck className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleRejectUser(viewingProfile._id);
                          setViewingProfile(null);
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center"
                      >
                        <FiX className="mr-2" />
                        Reject
                      </button>
                    </>
                  )}

                  {viewingProfile.status === "suspended" && (
                    <button
                      onClick={() => {
                        handleActivateUser(viewingProfile._id);
                        setViewingProfile(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center"
                    >
                      <FiCheck className="mr-2" />
                      Activate
                    </button>
                  )}

                  {viewingProfile.status === "active" && (
                    <button
                      onClick={() => {
                        handleSuspendUser(viewingProfile._id);
                        setViewingProfile(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center"
                    >
                      <FiX className="mr-2" />
                      Suspend
                    </button>
                  )}

                  <button
                    onClick={() => handleEditUser(viewingProfile)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
