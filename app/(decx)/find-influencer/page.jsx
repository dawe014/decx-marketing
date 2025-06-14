"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiGlobe,
  FiMapPin,
  FiStar,
  FiArrowRight,
  FiTag,
} from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const FindInfluencer = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    niche: "",
    location: "",
    language: "",
  });
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch influencers from API
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/influencers");
        if (!response.ok) {
          throw new Error("Failed to fetch influencers");
        }
        const data = await response.json();
        setInfluencers(data.influencers);
        setFilteredInfluencers(data.influencers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  // Handle search and filtering
  const handleSearch = () => {
    const results = influencers.filter((influencer) => {
      return (
        influencer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filters.niche === "" || influencer.niches.includes(filters.niche)) &&
        (filters.location === "" ||
          influencer.location.city === filters.location) &&
        (filters.language === "" ||
          influencer.languages.some((lang) => lang.name === filters.language))
      );
    });
    setFilteredInfluencers(results);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    handleSearch();
  }, [filters, searchTerm, influencers]);

  // Render loading or error states
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <p className="text-white text-lg">Loading influencers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }
  console.log("Influencers", influencers);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <section className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            <span className="bg-clip-text text-transparent text-primary bg-primary">
              Discover
            </span>{" "}
            the Best Influencers
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Connect with inspiring influencers across various niches and
            locations.
          </p>
        </section>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row md:justify-end items-baseline gap-4 mb-8">
          <div className="flex flex-col lg:flex-row w-full gap-2">
            <div className="relative flex-grow w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search influencers by name..."
                className="block w-full pl-10 pr-12 py-3 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                title="search"
                className="absolute right-0 top-0 bottom-0 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-r-lg transition-colors duration-300"
                onClick={handleSearch}
              >
                <FiSearch />
              </button>
            </div>

            <div className="md:hidden w-full">
              <button
                className="w-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block mb-8 w-full`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  name="niche"
                  onChange={handleFilterChange}
                  value={filters.niche}
                  className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  <option value="">All Niches</option>
                  {Array.from(
                    new Set(influencers.flatMap((i) => i.niches))
                  ).map((niche) => (
                    <option key={niche} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  name="location"
                  onChange={handleFilterChange}
                  value={filters.location}
                  className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  <option value="">All Locations</option>
                  {Array.from(
                    new Set(influencers.map((i) => i.location.city))
                  ).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  name="language"
                  onChange={handleFilterChange}
                  value={filters.language}
                  className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  <option value="">All Languages</option>
                  {Array.from(
                    new Set(
                      influencers.flatMap((i) => i.languages.map((l) => l.name))
                    )
                  ).map((lang, ind) => (
                    <option key={ind} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Influencer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInfluencers.length > 0 ? (
            filteredInfluencers.map((influencer) => {
              // Map social media platforms to icons
              const socialIcons = {
                Facebook: FaFacebook,
                Twitter: FaTwitter,
                Instagram: FaInstagram,
                instagram: FaInstagram,
                Youtube: FaYoutube,
                youtube: FaYoutube,
                Tiktok: FaTiktok,
                Linkedin: FaLinkedin,
              };

              return (
                <div
                  key={influencer._id}
                  className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-indigo-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/30 ${
                    influencer.isFeatured
                      ? "ring-2 ring-indigo-500 ring-opacity-50"
                      : ""
                  }`}
                >
                  {/* Featured Badge */}
                  {influencer.isFeatured && (
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                      Featured
                    </div>
                  )}

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex flex-col items-center mb-4 flex-grow">
                      <div className="relative w-28 h-28 mb-4 group">
                        <Image
                          src={
                            influencer.profilePhoto || "/default-profile.png"
                          }
                          alt={influencer.fullName}
                          fill
                          className="rounded-full object-cover border-4 border-indigo-500/20 group-hover:border-indigo-500 transition-all duration-300 group-hover:ring-4 group-hover:ring-indigo-400/30"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <h2 className="text-2xl font-extrabold text-white text-center tracking-tight">
                        {influencer.fullName}
                      </h2>
                      <div className="flex items-center mt-2 mb-3">
                        <FiStar className="text-yellow-400 mr-1 text-lg" />
                        <span className="text-white font-semibold">
                          {influencer.rating.average.toFixed(1)} (
                          {influencer.rating.count})
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {influencer.niches.map((niche, index) => (
                          <span
                            key={index}
                            className="bg-indigo-600/20 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors duration-200"
                          >
                            {niche}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col space-y-2 w-full mt-auto text-slate-300">
                        <div className="flex items-center">
                          <FiMapPin className="mr-2 text-indigo-400 flex-shrink-0 text-lg" />
                          <span className="truncate text-sm font-medium">
                            {influencer.location.city},{" "}
                            {influencer.location.country}
                          </span>
                        </div>
                        {influencer.languages.length > 0 && (
                          <div className="flex items-center">
                            <FiGlobe className="mr-2 text-indigo-400 flex-shrink-0 text-lg" />
                            <span className="truncate text-sm font-medium">
                              {influencer?.languages
                                ?.map((l) => l.name)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4 mb-4">
                      {influencer.socialMedia.map((social, index) => {
                        const Icon = socialIcons[social.platform];
                        return Icon ? (
                          <Link
                            key={index}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 transition-transform duration-300 transform hover:scale-110"
                            aria-label={social.platform}
                          >
                            <Icon className="text-2xl" />
                          </Link>
                        ) : null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/find-influencer/${influencer._id}`)
                      }
                      className="mt-auto w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      View Profile <FiArrowRight className="ml-2 text-lg" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                No influencers found
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
};

export default FindInfluencer;
