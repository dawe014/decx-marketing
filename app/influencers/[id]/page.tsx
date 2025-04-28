"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiInfo,
  FiPlus,
  FiX,
  FiGlobe,
  FiDollarSign,
  FiSave,
  FiUpload,
  FiUsers,
  FiLink2,
  FiCheck,
  FiImage,
  FiVideo,
  FiTrash2,
} from "react-icons/fi";
import {
  FaTiktok,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const socialIcons = {
  Tiktok: <FaTiktok className="text-black" />,
  Youtube: <FaYoutube className="text-red-600" />,
  Instagram: <FaInstagram className="text-pink-600" />,
  Twitter: <FaTwitter className="text-blue-400" />,
  LinkedIn: <FaLinkedin className="text-blue-700" />,
};

const platformOptions = [
  { value: "Tiktok", label: "TikTok" },
  { value: "Youtube", label: "YouTube" },
  { value: "Instagram", label: "Instagram" },
  { value: "Twitter", label: "Twitter/X" },
  { value: "LinkedIn", label: "LinkedIn" },
];

const nicheOptions = [
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

const languageLevels = ["Basic", "Conversational", "Fluent", "Native"] as const;

export default function ProfileUpdatePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    location: { city: "", country: "" },
    phone: "",
    email: "",
    bio: "",
    niches: [] as string[],
    socialMedia: [] as Array<{
      platform: string;
      link: string;
      followers: number;
    }>,
    profilePhoto: "",
    services: [] as Array<{ name: string; fee: string }>,
    languages: [] as Array<{ name: string; level: string }>,
    portfolio: [] as Array<{
      _id?: string;
      mediaUrl: string;
      description: string;
      mediaType?: string;
      isNew?: boolean;
    }>,
  });

  // Social link inputs
  const [newSocialLink, setNewSocialLink] = useState({
    platform: "",
    link: "",
    followers: "",
  });

  // Add to the component
  const [newPortfolioItem, setNewPortfolioItem] = useState<{
    file: File | null;
    description: string;
    previewUrl: string | null;
  }>({
    file: null,
    description: "",
    previewUrl: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/influencers/${session?.user?.id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData(data.message);
          if (data.message.profilePhoto) {
            setProfilePhoto(data.message.profilePhoto);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  // Handle form changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle nested location changes
  const handleLocationChange = (field: "city" | "country", value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileToUpload(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfilePhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle social link addition
  const addSocialLink = () => {
    if (
      newSocialLink.platform &&
      newSocialLink.link &&
      newSocialLink.followers
    ) {
      handleChange("socialMedia", [
        ...formData.socialMedia,
        {
          platform: newSocialLink.platform,
          link: newSocialLink.link,
          followers: parseInt(newSocialLink.followers) || 0,
        },
      ]);
      setNewSocialLink({ platform: "", link: "", followers: "" });
    }
  };

  // Remove social link
  const removeSocialLink = (index: number) => {
    const newLinks = formData.socialMedia.filter((_, i) => i !== index);
    handleChange("socialMedia", newLinks);
  };

  // Handle niche selection
  const toggleNiche = (niche: string) => {
    const newNiches = formData.niches.includes(niche)
      ? formData.niches.filter((n) => n !== niche)
      : [...formData.niches, niche];
    handleChange("niches", newNiches);
  };

  // Handle service changes
  const handleServiceChange = (
    index: number,
    field: "name" | "fee",
    value: string
  ) => {
    const updatedServices = formData.services.map((service, i) =>
      i === index ? { ...service, [field]: value } : service
    );
    handleChange("services", updatedServices);
  };

  const addService = () => {
    handleChange("services", [...formData.services, { name: "", fee: "" }]);
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    handleChange("services", updatedServices);
  };

  // Handle language changes
  const handleLanguageChange = (
    index: number,
    field: "name" | "level",
    value: string
  ) => {
    const updatedLanguages = formData.languages.map((language, i) =>
      i === index ? { ...language, [field]: value } : language
    );
    handleChange("languages", updatedLanguages);
  };

  const addLanguage = () => {
    handleChange("languages", [
      ...formData.languages,
      { name: "", level: "Conversational" },
    ]);
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = formData.languages.filter((_, i) => i !== index);
    handleChange("languages", updatedLanguages);
  };

  const handlePortfolioFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setNewPortfolioItem({
      file, // Store the actual File object
      description: newPortfolioItem.description,
      previewUrl,
    });
  };

  const addPortfolioItem = () => {
    if (!newPortfolioItem.file || !newPortfolioItem.description) return;

    const newItem = {
      _id: undefined, // Will be assigned by the server for new items
      mediaUrl: newPortfolioItem.previewUrl, // For client-side preview
      description: newPortfolioItem.description,
      mediaType: newPortfolioItem.file.type,
      isNew: true,
      file: newPortfolioItem.file, // Store the actual File object
    };

    handleChange("portfolio", [...formData.portfolio, newItem]);
    setNewPortfolioItem({ file: null, description: "", previewUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removePortfolioItem = (index: number) => {
    const updatedItems = formData.portfolio.filter((_, i) => i !== index);
    handleChange("portfolio", updatedItems);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // First upload image if changed
      let imageUrl = formData.profilePhoto;
      if (fileToUpload) {
        const imageFormData = new FormData();
        imageFormData.append("file", fileToUpload);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      // Then update profile with all data
      const updateRes = await fetch(`/api/influencers/${session?.user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          profilePhoto: imageUrl,
        }),
      });

      if (updateRes.ok) {
        router.push("/dashboard?updated=true");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading your profile...</div>
      </div>
    );
  }
  console.log("Profile photo link", profilePhoto);
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Update Your Profile</h1>
          <p className="text-gray-400">
            Keep your information current to attract the best brand
            collaborations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiUser className="mr-2" /> Profile Picture
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/30 bg-gray-700 relative flex items-center justify-center">
                  {profilePhoto ? (
                    <Image
                      src={profilePhoto}
                      alt="Profile"
                      width={500}
                      height={500}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser className="text-4xl text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 w-full">
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profile-upload"
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg cursor-pointer transition-colors text-center"
                >
                  <FiUpload className="inline mr-2" />
                  {profilePhoto ? "Change Photo" : "Upload Photo"}
                </label>
                <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
                  Recommended: Square image, at least 500x500 pixels
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiUser className="mr-2" /> Basic Information
            </h2>
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    title="btin"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      title="btin"
                      type="text"
                      value={formData.location.city}
                      onChange={(e) =>
                        handleLocationChange("city", e.target.value)
                      }
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      title="btin"
                      type="text"
                      value={formData.location.country}
                      onChange={(e) =>
                        handleLocationChange("country", e.target.value)
                      }
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <PhoneInput
                  country={"us"}
                  value={formData.phone}
                  onChange={(value) => handleChange("phone", value)}
                  inputClass="w-full bg-gray-700/50 border !border-gray-600 rounded-lg py-2.5 px-4 pl-12 text-white !bg-slate-700"
                  buttonClass="!bg-gray-700/50 !border-gray-600 !rounded-l-lg !text-white !focus:bg-slate-700 !hover:bg-slate-700"
                  dropdownClass="!bg-gray-800 !border-gray-700 !focus:bg-slate-700 !hover:bg-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    title="btin"
                    type="email"
                    value={session?.user?.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  About You
                </label>
                <div className="relative">
                  <FiInfo className="absolute left-3 top-4 text-gray-400" />
                  <textarea
                    title="btin"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white min-h-[120px]"
                    required
                    minLength={50}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 50 characters ({formData.bio.length}/50)
                </p>
              </div>
            </div>
          </div>

          {/* Niches */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiUsers className="mr-2" /> Your Niches
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {nicheOptions.map((niche) => (
                <label
                  key={niche}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    formData.niches.includes(niche)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.niches.includes(niche)}
                    onChange={() => toggleNiche(niche)}
                    className="hidden"
                  />
                  {formData.niches.includes(niche) && (
                    <FiCheck className="flex-shrink-0" />
                  )}
                  <span>{niche}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiLink2 className="mr-2" /> Social Media Profiles
            </h2>
            <div className="space-y-6">
              {/* Existing Social Links */}
              {formData.socialMedia.length > 0 && (
                <div className="space-y-3">
                  {formData.socialMedia.map((social, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                          {socialIcons[
                            social.platform as keyof typeof socialIcons
                          ] || <FiLink2 className="text-gray-400" />}
                        </div>
                        <div>
                          <div className="font-medium">
                            {social.platform === "Tiktok"
                              ? "TikTok"
                              : social.platform}
                          </div>
                          <div className="text-sm text-gray-400">
                            {social.link}
                          </div>
                        </div>
                      </div>
                      <button
                        title="btin"
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="text-gray-400 hover:text-red-400 p-2"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Social Link Form */}
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Platform
                    </label>
                    <select
                      title="btin"
                      value={newSocialLink.platform}
                      onChange={(e) =>
                        setNewSocialLink({
                          ...newSocialLink,
                          platform: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white"
                    >
                      <option value="">Select Platform</option>
                      {platformOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile URL
                    </label>
                    <div className="relative">
                      <FiLink2 className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newSocialLink.link}
                        onChange={(e) =>
                          setNewSocialLink({
                            ...newSocialLink,
                            link: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Followers
                    </label>
                    <div className="relative">
                      <FiUsers className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        placeholder="10000"
                        value={newSocialLink.followers}
                        onChange={(e) =>
                          setNewSocialLink({
                            ...newSocialLink,
                            followers: e.target.value,
                          })
                        }
                        min="0"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addSocialLink}
                    disabled={
                      !newSocialLink.platform ||
                      !newSocialLink.link ||
                      !newSocialLink.followers
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg disabled:bg-gray-700 disabled:text-gray-500"
                  >
                    <FiPlus className="inline mr-2" /> Add Social Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiDollarSign className="mr-2" /> Your Services
            </h2>
            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Service Name
                      </label>
                      <input
                        title="btin"
                        type="text"
                        value={service.name}
                        onChange={(e) =>
                          handleServiceChange(index, "name", e.target.value)
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Fee
                      </label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
                        <input
                          title="btin"
                          type="number"
                          min="0"
                          value={service.fee}
                          onChange={(e) =>
                            handleServiceChange(index, "fee", e.target.value)
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {formData.services.length > 1 && (
                    <button
                      title="btin"
                      type="button"
                      onClick={() => removeService(index)}
                      className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg"
              >
                <FiPlus className="inline mr-2" /> Add Another Service
              </button>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiGlobe className="mr-2" /> Languages
            </h2>
            <div className="space-y-4">
              {formData.languages.map((language, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Language
                      </label>
                      <div className="relative">
                        <FiGlobe className="absolute left-3 top-3 text-gray-400" />
                        <input
                          title="btin"
                          type="text"
                          value={language.name}
                          onChange={(e) =>
                            handleLanguageChange(index, "name", e.target.value)
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Proficiency
                      </label>
                      <select
                        title="btin"
                        value={language.level}
                        onChange={(e) =>
                          handleLanguageChange(index, "level", e.target.value)
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white"
                      >
                        {languageLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.languages.length > 1 && (
                    <button
                      title="btin"
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLanguage}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg"
              >
                <FiPlus className="inline mr-2" /> Add Another Language
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiImage className="mr-2" /> Portfolio
            </h2>

            {/* Existing Portfolio Items */}
            {formData.portfolio.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {formData.portfolio.map((item, index) => (
                  <div
                    key={index}
                    className="group relative bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600"
                  >
                    {item.mediaType?.startsWith("image") ? (
                      <div className="aspect-video bg-gray-700 relative">
                        <Image
                          src={item.mediaUrl}
                          alt={item.description || "Portfolio item"}
                          width={500}
                          height={500}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-700 flex items-center justify-center">
                        <FiVideo className="text-4xl text-gray-400" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                    <button
                      title="remove"
                      type="button"
                      onClick={() => removePortfolioItem(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Portfolio Item */}
            <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-medium mb-4">
                Add New Portfolio Item
              </h3>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Media (Image or Video)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePortfolioFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                  id="portfolio-upload"
                />
                <label
                  htmlFor="portfolio-upload"
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors text-center"
                >
                  <FiUpload className="inline mr-2" />
                  {newPortfolioItem.file
                    ? newPortfolioItem.file.name
                    : "Choose File"}
                </label>

                {/* Preview */}
                {newPortfolioItem.previewUrl && (
                  <div className="mt-4 aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                    {newPortfolioItem.file?.type.startsWith("image") ? (
                      <Image
                        src={newPortfolioItem.previewUrl}
                        alt="Preview"
                        width={500}
                        height={500}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiVideo className="text-4xl text-gray-400" />
                        <span className="sr-only">Video Preview</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newPortfolioItem.description}
                  onChange={(e) =>
                    setNewPortfolioItem({
                      ...newPortfolioItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe this work and your role in it..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white min-h-[100px]"
                />
              </div>

              <button
                type="button"
                onClick={addPortfolioItem}
                disabled={
                  !newPortfolioItem.file || !newPortfolioItem.description
                }
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg disabled:bg-gray-700 disabled:text-gray-500"
              >
                <FiPlus className="inline mr-2" /> Add to Portfolio
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg flex items-center disabled:opacity-70"
            >
              <FiSave className="mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
