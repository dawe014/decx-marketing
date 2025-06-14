"use client";

import { useState, useEffect, use } from "react";
import {
  FiArrowLeft,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Modal = ({ isOpen, onClose, title, message, confirmText, isError }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-md w-full mx-4">
        <h3
          className={`text-xl font-semibold ${
            isError ? "text-red-400" : "text-white"
          } mb-4`}
        >
          {title}
        </h3>
        <p className="text-slate-300 text-sm mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            {confirmText || "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditApplicationPage({ params }) {
  const [application, setApplication] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    proposal: "",
    quote: "",
    portfolioLinks: [""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    isError: false,
  });
  const router = useRouter();
  const { id } = use(params);

  // Fetch application and campaign details
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application details");
        }
        const data = await response.json();
        setApplication(data.application);
        setFormData({
          proposal: data.application.proposal || "",
          quote: data.application.quote || "",
          portfolioLinks:
            data.application.portfolioLinks.length > 0
              ? data.application.portfolioLinks
              : [""],
        });

        if (data.application.campaign) {
          const campaignResponse = await fetch(
            `/api/campaigns/${data.application.campaign}`
          );
          if (campaignResponse.ok) {
            const campaignData = await campaignResponse.json();
            setCampaign(campaignData.campaign);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePortfolioLinkChange = (index, value) => {
    const newLinks = [...formData.portfolioLinks];
    newLinks[index] = value;
    setFormData((prev) => ({ ...prev, portfolioLinks: newLinks }));
  };

  const addPortfolioLink = () => {
    setFormData((prev) => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, ""],
    }));
  };

  const removePortfolioLink = (index) => {
    if (formData.portfolioLinks.length > 1) {
      const newLinks = formData.portfolioLinks.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, portfolioLinks: newLinks }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposal: formData.proposal,
          quote: Number(formData.quote),
          portfolioLinks: formData.portfolioLinks.filter(
            (link) => link.trim() !== ""
          ),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update application");
      }

      setModalState({
        isOpen: true,
        title: "Application Updated",
        message: "Your application has been successfully updated.",
        confirmText: "OK",
        isError: false,
        onClose: () => {
          setModalState({ isOpen: false });
          router.push(`/my-proposals/${id}`);
        },
      });
    } catch (err) {
      setModalState({
        isOpen: true,
        title: "Error",
        message:
          err.message || "An error occurred while updating the application.",
        confirmText: "OK",
        isError: true,
        onClose: () => setModalState({ isOpen: false }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (amount, currency) => {
    if (currency === "ETB") {
      return `${amount.toLocaleString()} ETB`;
    }
    return `$${amount}`;
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
            Error loading application
          </h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Link
            href="/influencer/dashboard"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!application || !campaign) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">
            Application or Campaign not found
          </h2>
          <Link
            href="/influencer/dashboard"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (application.status !== "pending") {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">
            Cannot edit application
          </h2>
          <p className="text-slate-400 mb-4">
            Only pending applications can be edited.
          </p>
          <Link
            href={`/applications/${id}`}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={modalState.onClose || (() => setModalState({ isOpen: false }))}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        isError={modalState.isError}
      />

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            href={`/applications/${id}`}
            className="text-indigo-400 hover:text-indigo-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Application
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h1 className="text-2xl font-bold text-white mb-4">
                Edit Application for {campaign.title}
              </h1>
              <div className="flex items-center mb-6">
                {campaign.brand?.logo && (
                  <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium mr-3 relative">
                    <Image
                      src={campaign.brand.logo}
                      alt={`${campaign.brand.companyName} logo`}
                      className="rounded-full object-center object-cover"
                      fill
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">
                    {campaign.brand?.companyName || "Brand"}
                  </p>
                  <p className="text-sm text-slate-400">
                    Budget:{" "}
                    {formatPrice(campaign.budget.min, campaign.budget.currency)}{" "}
                    -{" "}
                    {formatPrice(campaign.budget.max, campaign.budget.currency)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Rate ({campaign.budget.currency})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      name="quote"
                      value={formData.quote}
                      onChange={handleInputChange}
                      className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Enter your rate in ${campaign.budget.currency}`}
                      min={campaign.budget.min}
                      max={campaign.budget.max}
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Budget range:{" "}
                    {formatPrice(campaign.budget.min, campaign.budget.currency)}{" "}
                    -{" "}
                    {formatPrice(campaign.budget.max, campaign.budget.currency)}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="proposal"
                    value={formData.proposal}
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
                  {formData.portfolioLinks.map((link, index) => (
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <FiLoader className="animate-spin mr-2" />
                      Updating...
                    </span>
                  ) : (
                    "Update Application"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Campaign Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Campaign Details
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-1">
                    Status
                  </h3>
                  <div className="bg-indigo-900/30 text-indigo-400 px-3 py-1 rounded-full text-sm inline-flex items-center">
                    <FiCheckCircle className="mr-2" />
                    {application.status}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-1">
                    Niches
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {campaign.niches?.join(", ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-1">
                    Requirements
                  </h3>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>
                      Platforms:{" "}
                      {campaign.platforms?.join(", ") || "Not specified"}
                    </li>
                    <li>
                      Engagement:{" "}
                      {campaign.influencerCriteria?.minEngagementRate
                        ? `Minimum ${campaign.influencerCriteria.minEngagementRate}%`
                        : "No minimum"}
                    </li>
                  </ul>
                </div>
                <Link
                  href={`/jobs/${campaign._id}`}
                  className="block w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-blue-600 transition-colors"
                >
                  View Campaign
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
