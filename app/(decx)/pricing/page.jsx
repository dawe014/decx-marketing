"use client";

import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [expiresAt, setExpiresAt] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isLoading, setIsLoading] = useState({
    plan: true,
    plans: true,
    form: false,
  });
  const [error, setError] = useState({
    plan: null,
    plans: null,
    form: null,
    planChange: null,
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch current plan and subscription status
      try {
        const planRes = await fetch("/api/billing/plan");
        if (planRes.ok) {
          const { currentPlan, subscriptionStatus, expiresAt, paymentInfo } =
            await planRes.json();
          setCurrentPlan(currentPlan);
          setSubscriptionStatus(subscriptionStatus);
          setExpiresAt(expiresAt);
          setFormData({
            firstName: paymentInfo?.firstName || "",
            lastName: paymentInfo?.lastName || "",
            phoneNumber: paymentInfo?.phoneNumber || "",
          });
        } else {
          throw new Error("Failed to fetch plan information");
        }
      } catch (err) {
        setError((prev) => ({ ...prev, plan: err.message }));
      } finally {
        setIsLoading((prev) => ({ ...prev, plan: false }));
      }

      // Fetch available plans
      try {
        const plansRes = await fetch("/api/plans");
        if (plansRes.ok) {
          const plansData = await plansRes.json();
          setAvailablePlans(plansData);
        } else {
          throw new Error("Failed to fetch available plans");
        }
      } catch (err) {
        setError((prev) => ({ ...prev, plans: err.message }));
      } finally {
        setIsLoading((prev) => ({ ...prev, plans: false }));
      }
    };

    fetchData();
  }, []);

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    setShowPaymentForm(true);
    setError((prev) => ({ ...prev, form: null, planChange: null }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return "First name is required";
    }
    if (!formData.phoneNumber.trim()) {
      return "Phone number is required";
    }
    if (!/^(?:\+251|0)9\d{8}$/.test(formData.phoneNumber)) {
      return "Invalid phone number (e.g., +251912345678 or 0912345678)";
    }
    return null;
  };

  const isFormValid = () => {
    return formData.firstName.trim() && formData.phoneNumber.trim();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formError = validateForm();
    if (formError) {
      setError((prev) => ({ ...prev, form: formError }));
      return;
    }

    setIsLoading((prev) => ({ ...prev, form: true }));
    try {
      const planResponse = await fetch("/api/billing/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlanId }),
      });

      if (!planResponse.ok) {
        const errorData = await planResponse.json();
        throw new Error(errorData.error || "Failed to initiate plan update");
      }

      const planData = await planResponse.json();

      if (planData.initiatePayment) {
        const paymentResponse = await fetch("/api/billing/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: selectedPlanId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
          }),
        });

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.error || "Failed to initialize payment");
        }

        const { checkoutUrl } = await paymentResponse.json();
        window.location.href = checkoutUrl;
      } else {
        setCurrentPlan(planData.plan);
        setSubscriptionStatus("active");
        setExpiresAt(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        );
        alert(`Plan updated to: ${planData.plan.name}`);
      }
    } catch (error) {
      setError((prev) => ({ ...prev, planChange: error.message }));
    } finally {
      setIsLoading((prev) => ({ ...prev, form: false }));
      setShowPaymentForm(false);
      setSelectedPlanId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, form: null }));
  };

  const dismissPlanChangeError = () => {
    setError((prev) => ({ ...prev, planChange: null }));
  };

  if (isLoading.plan || isLoading.plans) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Plan Change Error Notification */}
        {error.planChange && (
          <div className="mb-6 p-4 bg-red-900/30 text-red-400 rounded-lg flex justify-between items-center">
            <span>{error.planChange}</span>
            <button
              onClick={dismissPlanChangeError}
              className="text-red-400 hover:text-red-300"
              aria-label="Dismiss error"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 max-w-md w-full">
              <h3 className="text-lg font-bold text-white mb-4">
                Enter Payment Details
              </h3>
              {error.form && (
                <div className="mb-4 p-2 bg-red-900/30 text-red-400 rounded text-sm">
                  {error.form}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
                    placeholder="Enter your last name (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g., +251912345678 or 0912345678"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500"
                    disabled={isLoading.form}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-indigo-500 text-white rounded flex items-center ${
                      isLoading.form || !isFormValid()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-indigo-600"
                    }`}
                    disabled={isLoading.form || !isFormValid()}
                  >
                    {isLoading.form && (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                    )}
                    {isLoading.form ? "Processing..." : "Proceed to Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Connect with your audience through authentic influencer partnerships
          </p>
        </div>

        {/* Pricing Grid */}
        {error.plans ? (
          <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg">
            {error.plans}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {availablePlans.map((plan) => (
              <div
                key={plan._id}
                onClick={() => handlePlanSelect(plan._id)}
                className={`bg-slate-800 rounded-xl shadow-sm border ${
                  currentPlan?._id === plan._id &&
                  subscriptionStatus === "active"
                    ? "border-indigo-500"
                    : "border-slate-700"
                } overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex space-x-2">
                      {plan.recommended && (
                        <span className="bg-indigo-900 text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                      {currentPlan?._id === plan._id &&
                        subscriptionStatus === "active" && (
                          <span className="bg-indigo-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Current Plan
                          </span>
                        )}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 ml-1">ETB/mo</span>
                  </div>
                  {currentPlan?._id === plan._id && expiresAt && (
                    <p className="text-sm text-slate-400 mb-4">
                      {subscriptionStatus === "active"
                        ? `Expires on: ${new Date(
                            expiresAt
                          ).toLocaleDateString()}`
                        : `Expired on: ${new Date(
                            expiresAt
                          ).toLocaleDateString()}`}
                    </p>
                  )}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <button
                    className={`w-full ${
                      plan.recommended
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-slate-700 hover:bg-slate-600"
                    } text-white font-medium py-2 px-4 rounded-lg transition-colors`}
                    disabled={
                      currentPlan?._id === plan._id &&
                      subscriptionStatus === "active"
                    }
                  >
                    {currentPlan?._id === plan._id &&
                    subscriptionStatus === "active"
                      ? "Current Plan"
                      : plan.recommended
                      ? "Popular choice"
                      : "Get started"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-700">
              <h3 className="font-medium text-white">
                Can I change plans later?
              </h3>
              <p className="mt-1 text-slate-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time.
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-700">
              <h3 className="font-medium text-white">Is there a contract?</h3>
              <p className="mt-1 text-slate-400 text-sm">
                No, our plans are month-to-month with no long-term commitment.
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-700">
              <h3 className="font-medium text-white">
                Do you offer custom plans?
              </h3>
              <p className="mt-1 text-slate-400 text-sm">
                Yes, contact us to discuss your specific needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
