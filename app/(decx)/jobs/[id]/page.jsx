"use client";

import { useState, useEffect, use } from "react";
import {
  FiDollarSign,
  FiClock,
  FiMapPin,
  FiGlobe,
  FiHeart,
  FiShare2,
  FiMessageSquare,
  FiUser,
  FiBarChart2,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";

export default function JobDetailsPage({ params }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [application, setApplication] = useState({
    rate: "",
    coverLetter: "",
    portfolioLinks: [""],
    termsAgreed: false,
  });
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();
  const { id } = use(params);
  const [formError, setFormError] = useState("");

  // Fetch job details
  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        const response = await fetch(`/api/campaigns/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        console.log("the returned data", data);
        setJob(data.campaign);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [params.jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
  };

  const handlePortfolioLinkChange = (index, value) => {
    const newLinks = [...application.portfolioLinks];
    newLinks[index] = value;
    setApplication((prev) => ({ ...prev, portfolioLinks: newLinks }));
  };

  const addPortfolioLink = () => {
    setApplication((prev) => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, ""],
    }));
  };

  const removePortfolioLink = (index) => {
    if (application.portfolioLinks.length > 1) {
      const newLinks = application.portfolioLinks.filter((_, i) => i !== index);
      setApplication((prev) => ({ ...prev, portfolioLinks: newLinks }));
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    setFormError(""); // Clear previous form errors

    try {
      const response = await fetch(`/api/campaigns/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...application,
          campaignId: id,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Application failed");
      }

      // router.push(
      //   `/jobs/${id}/confirmation?applicationId=${result.applicationId}`
      // );
    } catch (err) {
      setFormError(err.message); // Use form-specific error state
    } finally {
      setIsApplying(false);
    }
  };

  const formatPrice = (min, max, currency) => {
    if (currency === "ETB") {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ETB`;
    }
    return `$${min} - $${max}`;
  };

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
            Error loading job
          </h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Link href="jobs" className="text-indigo-400 hover:text-indigo-300">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">Job not found</h2>
          <Link href="/jobs" className="text-indigo-400 hover:text-indigo-300">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            href="/jobs"
            className="text-indigo-400 hover:text-indigo-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
          <div className="flex space-x-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
              <FiHeart size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
              <FiShare2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium mr-3 relative">
                      <Image
                        src={job.brand.logo}
                        alt={`${job.brand.companyName} logo`}
                        className="rounded-full object-center object-cover"
                        fill
                      />
                    </div>

                    <div>
                      <p className="font-medium text-white flex items-center">
                        {job.brand?.companyName || "Unknown Brand"}
                        {job.brand && (
                          <span className="ml-2 text-blue-400">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-slate-400">
                        Posted {format(new Date(job.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-900/30 text-indigo-400 px-3 py-1 rounded-full text-sm">
                  {job.applications?.length || 0} applications
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiDollarSign className="mr-2" />
                    Budget
                  </div>
                  <div className="font-medium">
                    {formatPrice(
                      job.budget.min,
                      job.budget.max,
                      job.budget.currency
                    )}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiClock className="mr-2" />
                    Duration
                  </div>
                  <div className="font-medium">
                    {job.startDate && job.endDate
                      ? `${format(new Date(job.startDate), "MMM d")} - ${format(
                          new Date(job.endDate),
                          "MMM d, yyyy"
                        )}`
                      : "Flexible"}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiMapPin className="mr-2" />
                    Location
                  </div>
                  <div className="font-medium">
                    {job.targetLocations?.join(", ") || "Remote"}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiGlobe className="mr-2" />
                    Language
                  </div>
                  <div className="font-medium">
                    {job.targetLanguages?.join(", ") || "Any"}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Campaign Description
              </h2>
              <p className="text-slate-300 mb-6 whitespace-pre-line">
                {job.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-indigo-400 mb-3 flex items-center">
                    <FiBarChart2 className="mr-2" />
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="text-slate-300">
                        Platforms:{" "}
                        {job.platforms?.join(", ") || "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="text-slate-300">
                        Engagement:{" "}
                        {job.influencerCriteria?.minEngagementRate
                          ? `Minimum ${job.influencerCriteria.minEngagementRate}% engagement rate`
                          : "No minimum"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="text-slate-300">
                        Niche: {job.niches?.join(", ") || "Not specified"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-indigo-400 mb-3 flex items-center">
                    <FiUser className="mr-2" />
                    Content Requirements
                  </h3>
                  <p className="text-slate-300 whitespace-pre-line">
                    {job.contentRequirements ||
                      "No specific requirements provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Deliverables & Perks */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Deliverables
                </h2>
                <ul className="space-y-3">
                  {job.deliverables?.length > 0 ? (
                    job.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-400 mr-3 mt-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span className="text-slate-300">
                          {deliverable.quantity} {deliverable.type}
                          {deliverable.description &&
                            ` - ${deliverable.description}`}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400">
                      No deliverables specified
                    </li>
                  )}
                </ul>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Perks & Benefits
                </h2>
                <ul className="space-y-3">
                  {job.perks ? (
                    job.perks.map((perk, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-400 mr-3 mt-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </span>
                        <span className="text-slate-300">{perk}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400">No perks specified</li>
                  )}
                </ul>
              </div>
            </div>

            {/* About Brand */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                About {job.brand?.companyName || "the Brand"}
              </h2>
              <p className="text-slate-300 mb-4">
                {job.brand?.description || "No brand description available."}
              </p>
              <div className="flex space-x-4">
                <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
                  <FiMessageSquare className="mr-2" />
                  Message Brand
                </button>
                {job.brand?.website && (
                  <a
                    href={job.brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Application */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Apply for This Job
              </h2>

              <form onSubmit={handleSubmitApplication}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Rate ({job.budget.currency})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      name="rate"
                      value={application.rate}
                      onChange={handleInputChange}
                      className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Enter your rate in ${job.budget.currency}`}
                      min={job.budget.min}
                      max={job.budget.max}
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Budget range:{" "}
                    {formatPrice(
                      job.budget.min,
                      job.budget.max,
                      job.budget.currency
                    )}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={application.coverLetter}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Explain why you're a good fit for this campaign..."
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Portfolio Links
                  </label>
                  {application.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) =>
                          handlePortfolioLinkChange(index, e.target.value)
                        }
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={
                          index === 0
                            ? "Primary portfolio URL"
                            : "Additional link"
                        }
                        required={index === 0}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removePortfolioLink(index)}
                          className="ml-2 bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPortfolioLink}
                    className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 flex items-center"
                  >
                    + Add another link
                  </button>
                </div>

                <div className="mb-6">
                  <label className="flex items-center text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={application.termsAgreed}
                      onChange={(e) =>
                        setApplication((prev) => ({
                          ...prev,
                          termsAgreed: e.target.checked,
                        }))
                      }
                      className="rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500 mr-2"
                      required
                    />
                    I agree to the terms and conditions
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isApplying}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying ? "Submitting..." : "Submit Application"}
                </button>

                {formError && (
                  <div className="mb-6 mt-6 bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <div className="flex items-center text-red-400">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="font-medium">Application Error</h3>
                    </div>
                    <p className="mt-2 text-sm text-red-300">{formError}</p>
                  </div>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-3">
                  Application Tips
                </h3>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>
                      Highlight relevant experience in{" "}
                      {job.niches?.join(", ") || "this niche"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Include engagement metrics if possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Show examples of similar campaigns</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
