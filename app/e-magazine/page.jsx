"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiBookOpen,
  FiTrendingUp,
  FiClock,
  FiBookmark,
} from "react-icons/fi";

export default function MagazinePage() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchMagazineData() {
      try {
        const [featuredRes, latestRes, categoriesRes] = await Promise.all([
          fetch("/api/magazine?featured=true"),
          fetch("/api/magazine?latest=true"),
          fetch("/api/magazine/"),
        ]);

        if (!featuredRes.ok || !latestRes.ok || !categoriesRes.ok) {
          throw new Error("One or more API requests failed");
        }

        const featuredData = await featuredRes.json();
        const latestData = await latestRes.json();
        const categoriesData = await categoriesRes.json();

        setFeaturedArticles(featuredData.articles || []);
        setLatestArticles(latestData.latestArticles || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error("Failed to fetch magazine data:", error);
      }
    }

    fetchMagazineData();
  }, []);

  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-indigo-400 mb-4">
          DECx Magazine
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          "Every successful business has a failure story, and every failure
          story has successful experience."
        </p>
      </div>

      {/* Featured Articles */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center">
            <FiTrendingUp className="mr-2 text-indigo-400" />
            Featured Stories
          </h2>
          <Link
            href="/e-magazine/category/featured"
            className="text-indigo-400 hover:text-indigo-300 flex items-center"
          >
            View all <FiArrowRight className="ml-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featuredArticles.map((article) => (
            <div
              key={article._id}
              className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all"
            >
              <div className="h-64 bg-slate-700 relative overflow-hidden">
                <img
                  src={`${article.featuredImage}`}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
                  <span className="inline-block px-3 py-1 bg-indigo-600 text-xs rounded-full mb-2">
                    {article.categories || "Uncategorized"}
                  </span>
                  <h3 className="text-xl font-bold">{article.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-300 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span className="flex items-center">
                    <FiClock className="mr-1" /> {article.readTime || "5 min"}
                  </span>
                  <Link
                    href={`/e-magazine/${article._id}`}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center"
                  >
                    Read more <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Articles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <FiBookOpen className="mr-2 text-indigo-400" />
          Latest Articles
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <div
              key={article._id}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-all"
            >
              <span className="inline-block px-3 py-1 bg-slate-700 text-xs rounded-full mb-3">
                {article.categories || "Uncategorized"}
              </span>
              <h3 className="text-lg font-bold mb-2">{article.title}</h3>
              <p className="text-slate-300 text-sm mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-slate-400">
                  <FiClock className="mr-1" /> {article.readTime || "5 min"}
                </span>
                <div className="flex space-x-3">
                  <button className="text-slate-400 hover:text-indigo-400">
                    <FiBookmark />
                  </button>
                  <Link
                    href={`/e-magazine/${article._id}`}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center"
                  >
                    Read <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/e-magazine/category/${category.slug}`}
              className="bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-3 text-center transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-800 rounded-xl p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
          <p className="text-slate-300 mb-6">
            Get the latest articles, case studies and marketing insights
            delivered to your inbox.
          </p>
          <form
            action="/api/subscribe"
            method="POST"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
