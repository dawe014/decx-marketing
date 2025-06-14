"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiDollarSign,
  FiGlobe,
  FiTag,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    price: "",
    language: "",
    niche: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        niche: filters.niche,
        language: filters.language,
        price: filters.price,
      }).toString();

      const res = await fetch(`/api/campaigns?${query}`);
      const data = await res.json();
      console.log("data from job", data);
      setJobs(data.campaigns || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchTerm]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  function getTimeAgo(date) {
    const now = new Date();
    const postedDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - postedDate.getTime()) / 1000
    );

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const divisions = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.34524, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Number.POSITIVE_INFINITY, name: "years" },
    ];

    let duration = diffInSeconds;
    for (const division of divisions) {
      if (duration < division.amount) {
        return rtf.format(-duration, division.name);
      }
      duration = Math.floor(duration / division.amount);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Influencer Job Board
          </h1>
          <p className="text-xl text-slate-300">
            Find your next brand collaboration from our curated listings
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs by company, description, or niche..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTag className="h-4 w-4 text-slate-400" />
              </div>
              <select
                name="niche"
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Niches</option>
                <option value="Technology">Technology</option>
                <option value="Fashion">Fashion</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiGlobe className="h-4 w-4 text-slate-400" />
              </div>
              <select
                name="language"
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-4 w-4 text-slate-400" />
              </div>
              <select
                name="price"
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Price Ranges</option>
                <option value="400">$400+</option>
                <option value="600">$600+</option>
                <option value="800">$800+</option>
                <option value="1000">$1,000+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-slate-400">
              Loading jobs...
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-indigo-500 transition-colors duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {job.brand?.companyName}
                    </h2>
                    <span className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {getTimeAgo(job.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-6">{job.title}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-slate-400">
                      <FiTag className="mr-2 text-indigo-500" />
                      <span>{job.niches.join(", ")}</span>
                    </div>
                    <div className="flex items-center text-slate-400">
                      <FiGlobe className="mr-2 text-indigo-500" />
                      <span>{job.targetLanguages.join(", ")}</span>
                    </div>
                    <div className="flex items-center text-slate-400">
                      <FiMapPin className="mr-2 text-indigo-500" />
                      <span>{job.targetLocations.join(", ")}</span>
                    </div>
                    <div className="flex items-center text-slate-400">
                      <FiDollarSign className="mr-2 text-indigo-500" />
                      <span className="font-medium text-white">
                        ${job.budget.min} - ${job.budget.max}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">
                      Engagement: {job.influencerCriteria.minEngagementRate}%+
                    </div>
                  </div>
                  <Link href={`/jobs/${job._id}`}>
                    <button className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      View Details <FiArrowRight className="ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                No jobs found
              </h3>
              <p className="text-slate-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
