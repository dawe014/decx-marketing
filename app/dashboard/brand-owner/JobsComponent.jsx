"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiSearch,
  FiTrash2,
  FiEye,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiBriefcase,
  FiPlus,
} from "react-icons/fi";
import { toast } from "sonner";

const JobsComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const session = useSession();
  console.log(session);
  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("from the effect");
        setLoading(true);
        const response = await fetch("/api/campaigns/brand");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        console.log("the data returned", data);
        setJobs(data.campaigns);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Delete job function
  const deleteJob = async (id) => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      // Optimistically update UI
      toast.success("Campaign deleted successfully");
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      toast.info("Failed to delete job");
    }
  };

  // Filter jobs based on status and search term
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      selectedStatus === "all" || job.status === selectedStatus;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.platforms.join(", ").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format budget
  const formatBudget = (budget) => {
    return `$${budget.min}-$${budget.max}`;
  };

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
        <p>Error loading jobs: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedStatus === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedStatus("active")}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedStatus === "active"
                ? "bg-green-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setSelectedStatus("draft")}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedStatus === "draft"
                ? "bg-yellow-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setSelectedStatus("completed")}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedStatus === "completed"
                ? "bg-slate-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Completed
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-thin text-slate-400 mb-1">Total Jobs</h3>
          <p className="text-2xl font-bold">{jobs.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-thin text-slate-400 mb-1">
            Active Campaigns
          </h3>
          <p className="text-2xl font-bold text-green-400">
            {jobs.filter((job) => job.status === "active").length}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-thin text-slate-400 mb-1">
            Total Applications
          </h3>
          <p className="text-2xl font-bold">
            {jobs.reduce(
              (sum, job) => sum + (job.applications?.length || 0),
              0
            )}
          </p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-thin text-slate-300 uppercase tracking-wider"
                >
                  Job Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-thin text-slate-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-thin text-slate-300 uppercase tracking-wider"
                >
                  Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-thin text-slate-300 uppercase tracking-wider"
                >
                  Applications
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-thin text-slate-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4 whitespace-wrap">
                      <div className="font-thin text-white">{job.title}</div>
                      <div className="text-sm text-slate-400">
                        {job.platforms.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === "active"
                            ? "bg-green-900/30 text-green-400"
                            : job.status === "draft"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() +
                          job.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-400">
                        <FiDollarSign className="mr-1 text-indigo-400" />
                        <span className="mr-3">{formatBudget(job.budget)}</span>
                        <FiClock className="mr-1 text-indigo-400" />
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiUsers className="mr-2 text-indigo-400" />
                        <span
                          className={
                            job.applications?.length > 0
                              ? "text-white"
                              : "text-slate-400"
                          }
                        >
                          {job.applications?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-thin">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`campaigns/${job._id}`}
                          className="text-indigo-400 hover:text-indigo-300 p-1"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`brand-owner/campaigns/${job._id}/edit`}
                          className="text-blue-400 hover:text-blue-300 p-1"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => deleteJob(job._id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-slate-400"
                  >
                    No jobs found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State (for when no jobs exist) */}
      {jobs.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-slate-600 mb-4">
            <FiBriefcase className="w-full h-full" />
          </div>
          <h3 className="text-lg font-thin text-slate-300 mb-1">
            No jobs posted yet
          </h3>
          <p className="text-slate-500 mb-6">
            Get started by creating your first influencer campaign
          </p>
          <Link
            href="/brand/jobs/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <FiPlus className="mr-2" />
            Create New Job
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobsComponent;
