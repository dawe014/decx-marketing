"use client";
import {
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiClock,
  FiMail,
  FiUser,
  FiChevronRight,
  FiSearch,
  FiArrowLeft,
  FiX,
  FiLink,
  FiCheck,
  FiExternalLink,
  FiStar,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiClock as FiPending,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const JobDetailsPage = ({ params }) => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { id: jobsId } = await params;
        const response = await fetch(`/api/campaigns/${jobsId}`);
        const applresponse = await fetch(
          `/api/applications/campaign/${jobsId}`
        );
        console.log(applresponse);

        if (!response.ok) throw new Error("Failed to fetch job details");

        if (applresponse.ok) {
          const apply = await applresponse.json();
          setApplicants(apply.applications);
        }

        const data = await response.json();
        setJob(data.campaign);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params]);

  const getSafeValue = (obj, path, defaultValue = "Not specified") => {
    const keys = path.split(".");
    let result = obj;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) return defaultValue;
    }
    return result ?? defaultValue;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      if (selectedApplicant?._id === applicationId) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400";
      case "shortlisted":
        return "bg-blue-500/10 text-blue-400";
      case "rejected":
        return "bg-red-500/10 text-red-400";
      case "hired":
        return "bg-green-500/10 text-green-400";
      case "completed":
        return "bg-purple-500/10 text-purple-400";
      default:
        return "bg-slate-700 text-slate-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FiPending className="mr-1.5" size={14} />;
      case "shortlisted":
        return <FiStar className="mr-1.5" size={14} />;
      case "rejected":
        return <FiXCircle className="mr-1.5" size={14} />;
      case "hired":
        return <FiCheckCircle className="mr-1.5" size={14} />;
      case "completed":
        return <FiAward className="mr-1.5" size={14} />;
      default:
        return null;
    }
  };

  const filteredApplicants =
    applicants?.filter((applicant) => {
      const searchMatch =
        applicant.influencer?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        applicant.influencer?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        applicant.title?.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === "all" || applicant.status === statusFilter;
      return searchMatch && statusMatch;
    }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>Error loading job: {error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p>Job not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const status = getSafeValue(job, "status", "draft");
  const statusDisplay = status || "Draft";

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-400 hover:text-indigo-300 flex items-center transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Jobs
          </button>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              status
            )}`}
          >
            {statusDisplay}
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-medium text-sm tracking-wide transition-colors ${
              activeTab === "overview"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Campaign Overview
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`px-6 py-3 font-medium text-sm tracking-wide transition-colors ${
              activeTab === "applicants"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Applicants ({job.applications?.length || 0})
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
            {/* Header Section */}
            <div className="bg-slate-700/50 p-6 border-b border-slate-700">
              <h1 className="text-2xl font-bold mb-2">
                {getSafeValue(job, "title", "Untitled Campaign")}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-400">
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-indigo-400" />
                  <span>Posted: {formatDate(job.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-2 text-indigo-400" />
                  <span>
                    {getSafeValue(job, "applications.length", 0)} Applications
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-8">
              {/* Campaign Overview */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                  Campaign Overview
                </h2>
                <p className="text-slate-300">
                  {getSafeValue(job, "description", "No description provided")}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Budget */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium mb-3">
                    <FiDollarSign className="mr-2 text-indigo-400" />
                    Budget
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Range:</span>
                      <span>
                        ${getSafeValue(job, "budget.min", 0)} - $
                        {getSafeValue(job, "budget.max", 0)}{" "}
                        {getSafeValue(job, "budget.currency", "USD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium mb-3">
                    <FiClock className="mr-2 text-indigo-400" />
                    Timeline
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Start:</span>
                      <span>{formatDate(getSafeValue(job, "startDate"))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">End:</span>
                      <span>{formatDate(getSafeValue(job, "endDate"))}</span>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium mb-3">
                    <FiBarChart2 className="mr-2 text-indigo-400" />
                    Platforms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getSafeValue(job, "platforms", []).length > 0 ? (
                      job.platforms.map((platform, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                        >
                          {platform}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Not specified</span>
                    )}
                  </div>
                </div>

                {/* Niches */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Target Niches</h3>
                  <div className="flex flex-wrap gap-2">
                    {getSafeValue(job, "niches", []).length > 0 ? (
                      job.niches.map((niche, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                        >
                          {niche}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Not specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                  Deliverables
                </h2>
                <div className="space-y-3">
                  {getSafeValue(job, "deliverables", []).length > 0 ? (
                    job.deliverables.map((deliverable, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/30 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium capitalize">
                              {getSafeValue(deliverable, "type", "unknown")}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                              Quantity:{" "}
                              {getSafeValue(deliverable, "quantity", 0)}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-slate-800 rounded text-xs">
                            {getSafeValue(deliverable, "status", "pending")}
                          </span>
                        </div>
                        {deliverable.description && (
                          <p className="mt-2 text-slate-300">
                            {deliverable.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">No deliverables specified</p>
                  )}
                </div>
              </div>

              {/* Influencer Criteria */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                  Influencer Requirements
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Engagement</h3>
                    <p>
                      <span className="text-slate-400">Minimum Rate: </span>
                      {getSafeValue(
                        job,
                        "influencerCriteria.minEngagementRate"
                      )}
                      %
                    </p>
                    <p className="mt-1">
                      <span className="text-slate-400">
                        Minimum Followers:{" "}
                      </span>
                      {getSafeValue(
                        job,
                        "influencerCriteria.minFollowers"
                      )?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Demographics</h3>
                    <p>
                      <span className="text-slate-400">Gender: </span>
                      {getSafeValue(job, "influencerCriteria.gender") === "any"
                        ? "Any"
                        : getSafeValue(job, "influencerCriteria.gender")
                            ?.charAt(0)
                            ?.toUpperCase() +
                          getSafeValue(job, "influencerCriteria.gender")?.slice(
                            1
                          )}
                    </p>
                    <p className="mt-1">
                      <span className="text-slate-400">Age Range: </span>
                      {getSafeValue(
                        job,
                        "influencerCriteria.ageRange.min",
                        "N/A"
                      )}{" "}
                      -{" "}
                      {getSafeValue(
                        job,
                        "influencerCriteria.ageRange.max",
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Requirements */}
              {getSafeValue(job, "contentRequirements") && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                    Content Requirements
                  </h2>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <p className="whitespace-pre-line">
                      {job.contentRequirements}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-700/50 p-4 border-t border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => router.push(`/brand/jobs/${job._id}/edit`)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
              >
                Edit Campaign
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    <span className="text-indigo-400">
                      {filteredApplicants.length}
                    </span>{" "}
                    Applications
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Showing {statusFilter === "all" ? "all" : statusFilter}{" "}
                    applications
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1 min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 transition-all"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {filteredApplicants.length > 0 ? (
                <div className="space-y-3">
                  {filteredApplicants.map((application) => (
                    <div
                      key={application._id}
                      className="group bg-slate-750 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 hover:border-indigo-500/30 transition-all cursor-pointer shadow-sm"
                      onClick={() => setSelectedApplicant(application)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="relative">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mt-1 overflow-hidden">
                              {application.influencer?.avatar ? (
                                <img
                                  src={application.influencer.avatar}
                                  alt={application.influencer.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiUser className="text-white" size={20} />
                              )}
                            </div>
                            {application.status === "hired" && (
                              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                                <FiCheck className="text-white text-xs" />
                              </div>
                            )}
                            {application.status === "completed" && (
                              <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5">
                                <FiAward className="text-white text-xs" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-white truncate">
                                  {application.influencer?.fullName ||
                                    "Unknown Influencer"}
                                </h3>
                                {application.title && (
                                  <p className="text-sm text-slate-400 truncate">
                                    {application.title}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`px-2.5 py-1 text-xs rounded-full capitalize flex items-center ${getStatusColor(
                                  application.status
                                )}`}
                              >
                                {getStatusIcon(application.status)}
                                {application.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center mt-3 gap-x-4 gap-y-2">
                              {application.quote && (
                                <span className="flex items-center text-sm bg-slate-700/50 px-2.5 py-1 rounded-full">
                                  <FiDollarSign
                                    className="mr-1.5 text-indigo-400"
                                    size={12}
                                  />
                                  {application.quote.toLocaleString()} ETB
                                </span>
                              )}
                              <span className="flex items-center text-sm text-slate-400">
                                <FiCalendar className="mr-1.5" size={12} />
                                Applied {formatDate(application.appliedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <FiChevronRight className="text-slate-500 group-hover:text-indigo-400 ml-2 mt-1 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-slate-600 mb-4 flex items-center justify-center">
                    <FiUsers className="w-16 h-16 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mb-1">
                    {searchTerm || statusFilter !== "all"
                      ? "No matching applications found"
                      : "No applications yet"}
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    {searchTerm
                      ? "Try adjusting your search or filter to find what you're looking for."
                      : statusFilter !== "all"
                      ? `No ${statusFilter} applications at this time.`
                      : "Check back later or share your campaign to attract more applicants."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Applicant Details Modal */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-slate-800/90 backdrop-blur-sm p-4 border-b border-slate-700 flex justify-between items-center z-10">
                <h2 className="text-xl font-semibold text-white">
                  Application Details
                </h2>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                      {selectedApplicant.influencer?.avatar ? (
                        <img
                          src={selectedApplicant.influencer.avatar}
                          alt={selectedApplicant.influencer.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-white" size={24} />
                      )}
                    </div>
                    {selectedApplicant.status === "hired" && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <FiCheck className="text-white text-xs" />
                      </div>
                    )}
                    {selectedApplicant.status === "completed" && (
                      <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1">
                        <FiAward className="text-white text-xs" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {selectedApplicant.influencer?.fullName ||
                            "Unknown Influencer"}
                        </h3>
                        <p className="text-slate-400 flex items-center">
                          <FiMail className="mr-2" />
                          {selectedApplicant.influencer?.email ||
                            "No email provided"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <select
                          value={selectedApplicant.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              selectedApplicant._id,
                              e.target.value
                            )
                          }
                          disabled={isUpdatingStatus}
                          className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(
                            selectedApplicant.status
                          )} border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option value="pending">Pending</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    {selectedApplicant.title && (
                      <div className="mt-2 bg-slate-750 inline-block px-3 py-1 rounded-lg">
                        <p className="text-sm text-slate-300">
                          {selectedApplicant.title}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-750 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      APPLICATION DATE
                    </h4>
                    <p className="text-white">
                      {formatDate(selectedApplicant.appliedAt)}
                    </p>
                  </div>

                  <div className="bg-slate-750 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      QUOTED RATE
                    </h4>
                    <p className="text-white">
                      {selectedApplicant.quote
                        ? `${selectedApplicant.quote.toLocaleString()} ETB`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {selectedApplicant.proposal && (
                  <div className="bg-slate-750 p-4 rounded-lg mb-6">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      PROPOSAL
                    </h4>
                    <p className="text-slate-300 whitespace-pre-line">
                      {selectedApplicant.proposal}
                    </p>
                  </div>
                )}

                {selectedApplicant.portfolioLinks?.length > 0 && (
                  <div className="bg-slate-750 p-4 rounded-lg mb-6">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      PORTFOLIO LINKS ({selectedApplicant.portfolioLinks.length}
                      )
                    </h4>
                    <ul className="space-y-2">
                      {selectedApplicant.portfolioLinks.map((link, index) => (
                        <li key={index} className="flex items-center">
                          <FiLink className="text-indigo-400 mr-2 flex-shrink-0" />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 hover:underline truncate transition-colors"
                          >
                            {link}
                          </a>
                          <FiExternalLink
                            className="text-slate-500 ml-1"
                            size={12}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-slate-700">
                  <Link
                    href={`/influencer/profile/${selectedApplicant.influencer?._id}`}
                    className="flex items-center justify-center px-4 py-2.5 border border-slate-600 hover:border-indigo-400 text-indigo-400 hover:text-indigo-300 rounded-lg transition-colors"
                  >
                    View Full Profile
                  </Link>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedApplicant(null)}
                      className="px-6 py-2.5 border border-slate-600 hover:border-slate-500 text-white rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedApplicant._id, "hired")
                      }
                      disabled={
                        isUpdatingStatus || selectedApplicant.status === "hired"
                      }
                      className={`px-6 py-2.5 rounded-lg font-medium flex items-center justify-center transition-colors ${
                        selectedApplicant.status === "hired"
                          ? "bg-green-600/50 text-green-200 cursor-not-allowed"
                          : isUpdatingStatus
                          ? "bg-indigo-600/70 text-white cursor-wait"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {isUpdatingStatus ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : selectedApplicant.status === "hired" ? (
                        "Already Hired"
                      ) : (
                        "Hire This Influencer"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;
