"use client";

import { useState, useEffect, use } from "react";
import {
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLoader,
  FiExternalLink,
  FiEdit2,
  FiMessageSquare,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isError,
}) => {
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
        <div className="flex justify-end space-x-3">
          {!isError && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              {cancelText || "Cancel"}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isError
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {confirmText || (isError ? "OK" : "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ApplicationDetailsPage({ params }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    isError: false,
    onConfirm: () => {},
  });
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    async function fetchApplication() {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application details");
        }
        const data = await response.json();
        setApplication(data.application);

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

    fetchApplication();
  }, [id]);

  const getStatusIcon = () => {
    switch (application?.status) {
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

  const getStatusColor = () => {
    switch (application?.status) {
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

  const handleWithdrawApplication = async () => {
    setModalState({
      isOpen: true,
      title: "Withdraw Application",
      message:
        "Are you sure you want to withdraw your application? This action cannot be undone.",
      confirmText: "Yes, Withdraw",
      cancelText: "Cancel",
      isError: false,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/applications/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to withdraw application"
            );
          }

          setModalState({
            isOpen: true,
            title: "Application Withdrawn",
            message: "Your application has been successfully withdrawn.",
            confirmText: "OK",
            cancelText: "",
            isError: false,
            onConfirm: () => {
              setModalState({ isOpen: false });
              router.push("/my-proposals");
            },
          });
        } catch (err) {
          setModalState({
            isOpen: true,
            title: "Error",
            message:
              err.message ||
              "An error occurred while withdrawing the application.",
            confirmText: "OK",
            cancelText: "",
            isError: true,
            onConfirm: () => setModalState({ isOpen: false }),
          });
        }
      },
    });
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

  if (!application) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">
            Application not found
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

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        isError={modalState.isError}
      />

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            href="/my-proposals"
            className="text-indigo-400 hover:text-indigo-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to My Proposals
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Applied on:</span>
            <span className="text-sm font-medium">
              {format(new Date(application.appliedAt), "MMMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Application Details */}
          <div className="lg:col-span-2">
            {/* Application Header */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {campaign?.title || "Campaign"}
                  </h1>
                  <div className="flex items-center mb-4">
                    {campaign?.brand?.logo && (
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
                        {campaign?.brand?.companyName || "Brand"}
                      </p>
                      <div className="flex items-center text-sm text-slate-400">
                        {application.viewedByBrand ? (
                          <>
                            <FiEye className="mr-1 text-green-400" />
                            <span>Viewed by brand</span>
                          </>
                        ) : (
                          <>
                            <FiEyeOff className="mr-1 text-slate-500" />
                            <span>Not viewed yet</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${getStatusColor()} px-4 py-2 rounded-full flex items-center`}
                >
                  {getStatusIcon()}
                  <span className="ml-2 capitalize">{application.status}</span>
                </div>
              </div>

              {/* View Campaign Button */}
              {campaign && (
                <div className="mt-6">
                  <Link
                    href={`/jobs/${campaign._id}`}
                    className="inline-flex items-center bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    View Campaign Post
                    <FiExternalLink className="ml-2" />
                  </Link>
                </div>
              )}

              {/* Application Quick Facts */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiDollarSign className="mr-2" />
                    Your Quote
                  </div>
                  <div className="font-medium">
                    {formatPrice(
                      application.quote,
                      campaign?.budget?.currency || "USD"
                    )}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiClock className="mr-2" />
                    Duration
                  </div>
                  <div className="font-medium">
                    {campaign?.startDate && campaign?.endDate
                      ? `${format(
                          new Date(campaign.startDate),
                          "MMM d"
                        )} - ${format(
                          new Date(campaign.endDate),
                          "MMM d, yyyy"
                        )}`
                      : "Flexible"}
                  </div>
                </div>
              </div>
            </div>

            {/* Your Proposal */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Your Proposal
                </h2>
                <button
                  className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  onClick={() =>
                    router.push(`/my-proposals/${application?._id}/edit`)
                  }
                >
                  <FiEdit2 className="mr-1" /> Edit
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 whitespace-pre-line">
                  {application.proposal}
                </p>
              </div>
            </div>

            {/* Portfolio Links */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Your Portfolio Links
              </h2>
              <div className="space-y-3">
                {application.portfolioLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg"
                  >
                    <div className="truncate">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        {link}
                      </a>
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white ml-2"
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Status */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Application Status
              </h2>

              {/* Status Timeline */}
              <div className="mb-8">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-600"></div>

                  {/* Timeline items */}
                  <div className="space-y-6">
                    {/* Applied */}
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <FiCheckCircle className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Applied</h3>
                        <p className="text-sm text-slate-400">
                          {format(
                            new Date(application.appliedAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Shortlisted (conditional) */}
                    {["shortlisted", "hired", "completed"].includes(
                      application.status
                    ) && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">
                          <FiAlertCircle className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            Shortlisted
                          </h3>
                          <p className="text-sm text-slate-400">
                            {application.updatedAt &&
                              format(
                                new Date(application.updatedAt),
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hired (conditional) */}
                    {["hired", "completed"].includes(application.status) && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                          <FiCheckCircle className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Hired</h3>
                          <p className="text-sm text-slate-400">
                            {application.updatedAt &&
                              format(
                                new Date(application.updatedAt),
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Completed (conditional) */}
                    {application.status === "completed" && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                          <FiCheckCircle className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Completed</h3>
                          <p className="text-sm text-slate-400">
                            {application.updatedAt &&
                              format(
                                new Date(application.updatedAt),
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Rejected (conditional) */}
                    {application.status === "rejected" && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                          <FiXCircle className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            Not Selected
                          </h3>
                          <p className="text-sm text-slate-400">
                            {application.updatedAt &&
                              format(
                                new Date(application.updatedAt),
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {application.status === "hired" && (
                  <>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                      View Contract Details
                    </button>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                      Submit Deliverables
                    </button>
                  </>
                )}

                {application.status === "shortlisted" && (
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Schedule Interview
                  </button>
                )}

                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <FiMessageSquare className="mr-2" />
                  Message Brand
                </button>

                {application.status === "pending" && (
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    onClick={handleWithdrawApplication}
                  >
                    Withdraw Application
                  </button>
                )}
              </div>

              {/* Status Information */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-3">
                  What to expect next
                </h3>
                <ul className="text-xs text-slate-400 space-y-2">
                  {application.status === "pending" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span>
                          The brand typically reviews applications within 3-5
                          business days
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span>
                          You'll receive an email when there's an update
                        </span>
                      </li>
                    </>
                  )}
                  {application.status === "shortlisted" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span>
                          The brand may contact you to discuss next steps
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span>
                          Prepare for a potential interview or additional
                          requirements
                        </span>
                      </li>
                    </>
                  )}
                  {application.status === "hired" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span>Review the contract details carefully</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span>
                          The brand will provide campaign guidelines and
                          deadlines
                        </span>
                      </li>
                    </>
                  )}
                  {application.status === "rejected" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span>
                          Don't be discouraged - many factors influence
                          selection
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span>
                          Consider applying to other campaigns that match your
                          profile
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
