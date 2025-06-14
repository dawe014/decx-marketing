"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  FiEdit,
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";
import {
  FaTiktok,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

const socialIcons = {
  Tiktok: <FaTiktok className="text-black dark:text-white" />,
  Youtube: <FaYoutube className="text-red-600" />,
  Instagram: <FaInstagram className="text-pink-600" />,
  Twitter: <FaTwitter className="text-blue-400" />,
  LinkedIn: <FaLinkedin className="text-blue-700" />,
  Other: <FaGlobe className="text-gray-500" />,
};

export default function ProfilePreview() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/influencers/${session?.user?.id}`);
        const data = await res.json();
        if (res.ok) {
          setProfileData(data.message);
        } else {
          console.error("Failed to fetch profile:", data.message);
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

  const formatFollowers = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading your profile...</div>
      </div>
    );
  }
  console.log(profileData);

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>No profile data found. Please complete your profile setup.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile Preview</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FiEdit className="mr-2" /> Edit Profile
          </button>
        </div>
      </header>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 myt-16">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-950 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end">
            <div className="relative  mb-4 sm:mb-0 sm:mr-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/20 bg-gray-700 overflow-hidden relative flex items-center justify-center">
                {profileData.profilePhoto ? (
                  <Image
                    src={profileData.profilePhoto}
                    alt={profileData.fullName}
                    width={500}
                    height={500}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiUsers className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold capitalize">
                {profileData.fullName}
              </h2>
              <div className="flex items-center text-gray-300 mt-1 capitalize">
                <FiMapPin className="mr-1" />
                <span>
                  {profileData.location?.city}, {profileData.location?.country}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {profileData.niches?.map((niche: string) => (
                  <span
                    key={niche}
                    className="bg-white/10 px-3 py-1 rounded-full text-sm capitalize"
                  >
                    {niche}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                  About
                </h3>
                <p className="text-gray-300 whitespace-pre-line">
                  {profileData.bio || "No bio provided"}
                </p>
              </div>

              {/* Social Media */}
              {profileData.socialMedia?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                    Social Media
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profileData.socialMedia.map(
                      (social: any, index: number) => (
                        <a
                          key={index}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 transition-colors flex items-center"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                            {socialIcons[
                              social.platform as keyof typeof socialIcons
                            ] || socialIcons.Other}
                          </div>
                          <div>
                            <div className="font-medium">
                              {social.platform === "Tiktok"
                                ? "TikTok"
                                : social.platform}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center">
                              <FiUsers className="mr-1" />{" "}
                              {formatFollowers(social.followers)} followers
                            </div>
                          </div>
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {profileData.portfolio?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                    Portfolio
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profileData.portfolio.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg overflow-hidden"
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
                            <div className="text-gray-400 text-center p-4">
                              <FiGlobe className="mx-auto text-2xl mb-2" />
                              <p>Media Preview</p>
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-gray-300">
                            {item.description || "No description"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-gray-700/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                  Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiMail className="text-gray-400 mr-3" />
                    <a
                      href={`mailto:${session?.user?.email}`}
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {session?.user?.email}
                    </a>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center">
                      <FiPhone className="text-gray-400 mr-3" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              {profileData.services?.length > 0 && (
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                    Services
                  </h3>
                  <div className="space-y-4">
                    {profileData.services.map((service: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <div>{service.name}</div>
                        <div className="flex items-center text-indigo-400">
                          <FiDollarSign className="mr-1" />
                          {service.fee}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {profileData.languages?.length > 0 && (
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                    Languages
                  </h3>
                  <div className="space-y-3">
                    {profileData.languages.map(
                      (language: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{language.name}</span>
                            <span className="text-gray-400 text-sm">
                              {language.level}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{
                                width:
                                  language.level === "Basic"
                                    ? "25%"
                                    : language.level === "Conversational"
                                    ? "50%"
                                    : language.level === "Fluent"
                                    ? "75%"
                                    : "100%",
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 sm:px-8 py-6 bg-gray-800 border-t border-gray-700">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-blue-600 p-2 rounded-full mr-3 mt-0.5">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-blue-300 mb-1">
                      Verification in Progress
                    </h4>
                    <p className="text-sm text-gray-400">
                      Your profile has been successfully submitted! Our team
                      will review your information to ensure it meets our
                      guidelines. You'll be able to:
                    </p>
                    <ul className="text-sm text-gray-400 mt-2 space-y-1 pl-5 list-disc">
                      <li>Receive collaboration offers from brands</li>
                      <li>Appear in search results</li>
                      <li>Access all platform features</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/dashboard")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors w-full sm:w-auto justify-center mb-3"
              >
                Return to Dashboard
              </button>

              <p className="text-xs text-gray-500">
                Typically processed within 1-2 business days. You'll receive an
                email at
                <span className="font-medium">
                  {" "}
                  {session?.user?.email}
                </span>{" "}
                when complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
