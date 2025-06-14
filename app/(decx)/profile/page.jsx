"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  FiSave,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import PortfolioManager from "@/components/PortfolioManager"; // Adjust path if needed

// --- Helper Components ---
const FormSection = ({ title, children }) => (
  <div className="bg-slate-800/50 rounded-xl p-6 md:p-8 mb-8">
    <h2 className="text-2xl font-bold mb-6 text-indigo-400">{title}</h2>
    {children}
  </div>
);
const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-300 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    />
  </div>
);
const Select = ({ label, name, value, onChange, children }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-300 mb-1"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    >
      {children}
    </select>
  </div>
);
const Textarea = ({ label, name, value, onChange, placeholder, rows = 4 }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-300 mb-1"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    />
  </div>
);
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const isSuccess = type === "success";
  const colors = isSuccess
    ? { bg: "bg-green-500/10", text: "text-green-400", Icon: FiCheckCircle }
    : { bg: "bg-red-500/10", text: "text-red-400", Icon: FiAlertTriangle };
  return (
    <div
      className={`fixed top-20 right-5 ${colors.bg} ${colors.text} p-4 rounded-lg flex items-center shadow-lg z-50`}
    >
      <colors.Icon className="mr-3" size={20} />
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 text-xl">
        ×
      </button>
    </div>
  );
};

// Niche options from your schema
const NICHE_OPTIONS = [
  "fashion",
  "beauty",
  "fitness",
  "food",
  "travel",
  "tech",
  "gaming",
  "lifestyle",
  "business",
  "education",
];

// --- Main Page Component ---
const EditInfluencerProfilePage = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/influencers/me");
      if (!response.ok) throw new Error("Failed to fetch profile data.");
      const data = await response.json();
      // Initialize all nested objects and arrays to prevent errors
      setFormData({
        ...data.influencer,
        location: data.influencer.location || {},
        languages: data.influencer.languages || [],
        niches: data.influencer.niches || [],
        socialMedia: data.influencer.socialMedia || [],
        portfolio: data.influencer.portfolio || [],
        rates: data.influencer.rates || {},
        services: data.influencer.services || [],
      });
    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProfile();
  }, [fetchProfile]);
  const dismissNotification = () => setNotification({ message: "", type: "" });

  // --- Generic State Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNestedInputChange = (section, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };
  const handleDynamicListChange = (section, index, e) => {
    const { name, value } = e.target;
    const list = [...formData[section]];
    list[index] = { ...list[index], [name]: value };
    setFormData((prev) => ({ ...prev, [section]: list }));
  };
  const addListItem = (section, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };
  const removeListItem = (section, index) => {
    const list = [...formData[section]];
    list.splice(index, 1);
    setFormData((prev) => ({ ...prev, [section]: list }));
  };

  // Specific handler for checkbox groups (niches)
  const handleNicheChange = (e) => {
    const { value, checked } = e.target;
    const currentNiches = formData.niches || [];
    if (checked) {
      setFormData((prev) => ({ ...prev, niches: [...currentNiches, value] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        niches: currentNiches.filter((niche) => niche !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    dismissNotification();
    try {
      const { portfolio, ...profileData } = formData;
      const response = await fetch("/api/influencers/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error("Failed to save profile details.");
      setNotification({
        message: "Profile details updated successfully!",
        type: "success",
      });
    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => {
        if (notification.type === "success") dismissNotification();
      }, 3000);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <FiLoader className="animate-spin mr-3" /> Loading Profile...
      </div>
    );
  if (!formData)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-500">
        Could not load profile data.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <Notification
        message={notification.message}
        type={notification.type}
        onDismiss={dismissNotification}
      />
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Edit Your Profile
            </h1>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg flex items-center transition-all duration-300"
            >
              {saving ? (
                <FiLoader className="animate-spin mr-2" />
              ) : (
                <FiSave className="mr-2" />
              )}
              {saving ? "Saving..." : "Save Details"}
            </button>
          </div>

          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell brands about yourself..."
                />
              </div>
              <Input
                label="Country"
                name="country"
                value={formData.location.country}
                onChange={(e) => handleNestedInputChange("location", e)}
              />
              <Input
                label="City"
                name="city"
                value={formData.location.city}
                onChange={(e) => handleNestedInputChange("location", e)}
              />
              <Input
                label="Timezone"
                name="timezone"
                value={formData.location.timezone}
                onChange={(e) => handleNestedInputChange("location", e)}
                placeholder="e.g., America/New_York"
              />
              <Select
                label="Availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
              >
                <option value="available">Available</option>
                <option value="limited">Limited Availability</option>
                <option value="unavailable">Not Available</option>
              </Select>
            </div>
          </FormSection>

          <FormSection title="Expertise & Languages">
            <h3 className="text-lg font-semibold mb-3 text-slate-200">
              Your Niches
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {NICHE_OPTIONS.map((niche) => (
                <label
                  key={niche}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={niche}
                    checked={formData.niches.includes(niche)}
                    onChange={handleNicheChange}
                    className="form-checkbox h-5 w-5 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-300 capitalize">{niche}</span>
                </label>
              ))}
            </div>
            <h3 className="text-lg font-semibold mb-3 text-slate-200">
              Languages You Speak
            </h3>
            {formData.languages.map((lang, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end"
              >
                <Input
                  label="Language"
                  name="name"
                  value={lang.name}
                  onChange={(e) =>
                    handleDynamicListChange("languages", index, e)
                  }
                  placeholder="e.g., English"
                />
                <Input
                  label="Proficiency"
                  name="level"
                  value={lang.level}
                  onChange={(e) =>
                    handleDynamicListChange("languages", index, e)
                  }
                  placeholder="e.g., Native"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("languages", index)}
                  className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-3 rounded-lg h-fit"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("languages", { name: "", level: "" })}
              className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium mt-4"
            >
              <FiPlus className="mr-2" /> Add Language
            </button>
          </FormSection>

          <FormSection title="Social Media Presence">
            {formData.socialMedia.map((account, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end"
              >
                <Select
                  label="Platform"
                  name="platform"
                  value={account.platform}
                  onChange={(e) =>
                    handleDynamicListChange("socialMedia", index, e)
                  }
                >
                  <option>Instagram</option>
                  <option>Youtube</option>
                  <option>Tiktok</option>
                  <option>Twitter</option>
                  <option>Facebook</option>
                  <option>Linkedin</option>
                </Select>
                <Input
                  label="Handle"
                  name="handle"
                  value={account.handle}
                  onChange={(e) =>
                    handleDynamicListChange("socialMedia", index, e)
                  }
                  placeholder="@handle"
                />
                <Input
                  label="Followers"
                  name="followers"
                  type="number"
                  value={account.followers}
                  onChange={(e) =>
                    handleDynamicListChange("socialMedia", index, e)
                  }
                  placeholder="50000"
                />
                <Input
                  label="Profile Link"
                  name="link"
                  value={account.link}
                  onChange={(e) =>
                    handleDynamicListChange("socialMedia", index, e)
                  }
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => removeListItem("socialMedia", index)}
                  className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-3 rounded-lg h-fit"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addListItem("socialMedia", {
                  platform: "Instagram",
                  handle: "",
                  followers: 0,
                  link: "",
                })
              }
              className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium mt-4"
            >
              <FiPlus className="mr-2" /> Add Social Account
            </button>
          </FormSection>

          <FormSection title="Services & Rates">
            <h3 className="text-lg font-semibold mb-3 text-slate-200">
              Standard Rates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Input
                label="Standard Post Rate ($)"
                name="postRate"
                type="number"
                value={formData.rates.postRate}
                onChange={(e) => handleNestedInputChange("rates", e)}
                placeholder="500"
              />
              <Input
                label="Standard Story Rate ($)"
                name="storyRate"
                type="number"
                value={formData.rates.storyRate}
                onChange={(e) => handleNestedInputChange("rates", e)}
                placeholder="250"
              />
              <Input
                label="Standard Video Rate ($)"
                name="videoRate"
                type="number"
                value={formData.rates.videoRate}
                onChange={(e) => handleNestedInputChange("rates", e)}
                placeholder="1000"
              />
              <Input
                label="Collaboration Rate ($)"
                name="collaborationRate"
                type="number"
                value={formData.rates.collaborationRate}
                onChange={(e) => handleNestedInputChange("rates", e)}
                placeholder="1500"
              />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-slate-200">
              Custom Services
            </h3>
            {formData.services.map((service, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end"
              >
                <Input
                  label="Service Name"
                  name="name"
                  value={service.name}
                  onChange={(e) =>
                    handleDynamicListChange("services", index, e)
                  }
                  placeholder="e.g., Product Unboxing"
                />
                <Input
                  label="Fee ($)"
                  name="fee"
                  type="number"
                  value={service.fee}
                  onChange={(e) =>
                    handleDynamicListChange("services", index, e)
                  }
                  placeholder="750"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("services", index)}
                  className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-3 rounded-lg h-fit"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("services", { name: "", fee: 0 })}
              className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium mt-4"
            >
              <FiPlus className="mr-2" /> Add Custom Service
            </button>
          </FormSection>
        </form>

        <FormSection title="Manage Your Portfolio">
          <PortfolioManager
            existingItems={formData.portfolio}
            onDataChange={fetchProfile}
          />
        </FormSection>
      </div>
    </div>
  );
};

export default EditInfluencerProfilePage;
