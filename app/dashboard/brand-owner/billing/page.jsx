"use client";
import { useState, useEffect } from "react";
import {
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { FaCheck } from "react-icons/fa";

export default function BillingComponent() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState({
    plan: true,
    paymentMethods: true,
    invoices: true,
  });
  const [error, setError] = useState({
    plan: null,
    paymentMethods: null,
    invoices: null,
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plan information
        const planRes = await fetch("/api/billing/plan");
        if (planRes.ok) {
          const { currentPlan, availablePlans } = await planRes.json();
          setCurrentPlan(currentPlan);
          setAvailablePlans(availablePlans);
        } else {
          throw new Error("Failed to fetch plan information");
        }
      } catch (err) {
        setError((prev) => ({ ...prev, plan: err.message }));
      } finally {
        setIsLoading((prev) => ({ ...prev, plan: false }));
      }

      try {
        // Fetch payment methods
        const pmRes = await fetch("/api/billing/payment-methods");
        if (pmRes.ok) {
          const pmData = await pmRes.json();
          setPaymentMethods(pmData);
        } else {
          throw new Error("Failed to fetch payment methods");
        }
      } catch (err) {
        setError((prev) => ({ ...prev, paymentMethods: err.message }));
      } finally {
        setIsLoading((prev) => ({ ...prev, paymentMethods: false }));
      }

      try {
        // Fetch invoices
        const invoicesRes = await fetch("/api/billing/invoices");
        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json();
          setInvoices(invoicesData);
        } else {
          throw new Error("Failed to fetch invoices");
        }
      } catch (err) {
        setError((prev) => ({ ...prev, invoices: err.message }));
      } finally {
        setIsLoading((prev) => ({ ...prev, invoices: false }));
      }
    };

    fetchData();
  }, []);

  // Update plan
  const updatePlan = async (planId) => {
    try {
      const response = await fetch("/api/billing/plan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update plan");
      }

      const { plan } = await response.json();
      setCurrentPlan(plan);
      alert(`Plan updated to: ${plan.name}`);
    } catch (error) {
      alert(`Error updating plan: ${error.message}`);
    }
  };

  // Set default payment method
  const setDefaultMethod = async (id) => {
    try {
      const response = await fetch("/api/billing/payment-methods", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to set default payment method");
      }

      const updated = paymentMethods.map((m) =>
        m.id === id ? { ...m, isDefault: true } : { ...m, isDefault: false }
      );
      setPaymentMethods(updated);
    } catch (error) {
      alert(`Error setting default payment method: ${error.message}`);
    }
  };

  // Delete payment method
  const deletePaymentMethod = async (id) => {
    try {
      const response = await fetch(`/api/billing/payment-methods?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete payment method");
      }

      const filtered = paymentMethods.filter((m) => m.id !== id);
      setPaymentMethods(filtered);
    } catch (error) {
      alert(`Error deleting payment method: ${error.message}`);
    }
  };

  // Add payment method
  const addPaymentMethod = async () => {
    try {
      const response = await fetch("/api/billing/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add payment method");
      }

      const newMethod = await response.json();
      setPaymentMethods([...paymentMethods, newMethod]);
    } catch (error) {
      alert(`Error adding payment method: ${error.message}`);
    }
  };

  if (isLoading.plan || isLoading.paymentMethods || isLoading.invoices) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FiDollarSign className="mr-2" /> Current Plan
        </h2>

        {error.plan && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg">
            {error.plan}
          </div>
        )}

        {currentPlan && (
          <div className="mb-6 p-6 bg-slate-700/30 rounded-lg border border-indigo-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {currentPlan.name}
                </h3>
                <p className="text-indigo-300 text-sm mt-1">
                  {currentPlan.description}
                </p>
              </div>
              <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-white">
                {currentPlan.price.split("/")[0]}
              </span>
              <span className="text-slate-400 ml-1">
                /{currentPlan.price.split("/")[1]}
              </span>
            </div>
            <ul className="mt-4 space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start text-slate-300">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <h3 className="text-lg font-bold text-white mb-4">Change Plan</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availablePlans.map((plan) => (
            <div
              key={plan._id}
              onClick={() => updatePlan(plan._id)}
              className={`p-5 rounded-lg border cursor-pointer transition-all ${
                currentPlan?._id === plan._id
                  ? "border-indigo-500 bg-indigo-900/20"
                  : "border-slate-700 hover:border-slate-600"
              } ${plan.recommended ? "ring-2 ring-yellow-500" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {plan.description}
                  </p>
                </div>
                {currentPlan?._id === plan._id && (
                  <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
                {plan.recommended && !(currentPlan?._id === plan._id) && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <div className="mt-3">
                <span className="text-xl font-bold text-white">
                  {plan.price.split("/")[0]}
                </span>
                <span className="text-slate-400 ml-1">
                  /{plan.price.split("/")[1]}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                    {feature}
                  </li>
                ))}
                {plan.features.length > 3 && (
                  <li className="text-slate-500 text-xs">
                    +{plan.features.length - 3} more features
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FiCreditCard className="mr-2" /> Payment Methods
        </h2>

        {error.paymentMethods && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg">
            {error.paymentMethods}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {paymentMethods.length === 0 ? (
            <p className="text-slate-400">No payment methods found</p>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-700"
              >
                <div className="flex items-center">
                  <div className="w-10 h-6 bg-slate-600 rounded flex items-center justify-center mr-4">
                    <span className="text-xs font-bold">
                      {method.brand === "visa" ? "VISA" : "MC"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      •••• •••• •••• {method.last4}
                    </p>
                    <p className="text-sm text-slate-400">
                      Expires {method.exp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {method.isDefault && (
                    <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefaultMethod(method.id)}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => deletePaymentMethod(method.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={addPaymentMethod}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <FiPlus size={18} className="mr-2" />
          Add Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FiFileText className="mr-2" /> Billing History
        </h2>

        {error.invoices && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg">
            {error.invoices}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Invoice
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-slate-400"
                  >
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-2 text-white">
                      {invoice.invoiceId || invoice.id}
                    </td>
                    <td className="px-4 py-2 text-slate-300">{invoice.date}</td>
                    <td className="px-4 py-2 text-slate-300">
                      {invoice.amount}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`${
                          invoice.status === "paid"
                            ? "text-green-400 bg-green-900/20"
                            : invoice.status === "pending"
                            ? "text-yellow-400 bg-yellow-900/20"
                            : "text-red-400 bg-red-900/20"
                        } text-xs px-2 py-1 rounded-full`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
