"use client";

import { useState, useEffect } from "react";
import {
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLoader,
  FiSearch,
  FiFilter,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function ApplicationsDashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  // Fetch applications
  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        const response = await fetch("/api/applications/me");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data.applications);
      } catch (err) {
        // setError(
        //   err instanceof Error ? err.message : "An unknown error occurred"
        // );
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "hired":
        return <FiCheckCircle className="text-green-500" />;
      case "rejected":
        return <FiXCircle className="text-red-500" />;
      case "shortlisted":
        return <FiAlertCircle className="text-yellow-500" />;
      case "completed":
        return <FiCheckCircle className="text-indigo-500" />;
      default:
        return <FiLoader className="text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hired":
        return "bg-green-900/30 text-green-400";
      case "rejected":
        return "bg-red-900/30 text-red-400";
      case "shortlisted":
        return "bg-yellow-900/30 text-yellow-400";
      case "completed":
        return "bg-indigo-900/30 text-indigo-400";
      default:
        return "bg-blue-900/30 text-blue-400";
    }
  };

  const formatPrice = (amount, currency) => {
    if (currency === "ETB") {
      return `${amount.toLocaleString()} ETB`;
    }
    return `$${amount}`;
  };

  const filteredApplications = applications.filter((app) => {
    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      app.campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.campaign?.brand?.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.proposal?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">
            Error loading applications
          </h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">My Applications</h1>
          <p className="text-slate-400">
            Track all your campaign applications in one place
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-slate-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-end space-x-4 text-sm">
              <div className="text-slate-300">
                Showing{" "}
                <span className="font-medium">
                  {filteredApplications.length}
                </span>{" "}
                of <span className="font-medium">{applications.length}</span>{" "}
                applications
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <h3 className="text-lg font-medium text-white mb-2">
                No applications found
              </h3>
              <p className="text-slate-400 mb-4">
                {statusFilter === "all"
                  ? "You haven't applied to any campaigns yet."
                  : `You don't have any ${statusFilter} applications.`}
              </p>
              <Link
                href="/jobs"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Browse Campaigns
              </Link>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <Link
                key={application._id}
                href={`my-proposals/${application._id}`}
                className="block bg-slate-800 hover:bg-slate-700 rounded-xl p-6 border border-slate-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  {/* Left side */}
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <h2 className="text-xl font-bold text-white mr-3">
                        {application?.title || "Untitled Campaign"}
                      </h2>
                      <span
                        className={`${getStatusColor(
                          application.status
                        )} px-3 py-1 rounded-full text-sm flex items-center`}
                      >
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">
                          {application.status}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center text-sm text-slate-400 gap-y-1 gap-x-4">
                      <div className="flex items-center">
                        <FiClock className="mr-2" />
                        <span>
                          Applied{" "}
                          {format(
                            new Date(application.appliedAt),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                      {application.campaign?.brand?.companyName && (
                        <div>
                          <span>{application.campaign.brand.companyName}</span>
                        </div>
                      )}
                      {application.quote && (
                        <div className="flex items-center">
                          <FiDollarSign className="mr-2" />
                          <span>
                            {formatPrice(
                              application.quote,
                              application.campaign?.budget?.currency || "USD"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center">
                    <div className="text-slate-400 mr-4">
                      <FiChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
