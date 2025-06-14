"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch, FiArrowRight, FiClock } from "react-icons/fi";

export default function MagazinePage() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch articles on page, search, or category change
  useEffect(() => {
    async function fetchArticles() {
      const params = new URLSearchParams({
        page: currentPage,
        search: searchQuery,
      });
      const res = await fetch(`/api/magazine?${params}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setTotalPages(data.totalPages || 1);
    }
    fetchArticles();
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="py-12">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-400 mb-2">
          DECx Magazine
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto">
          Discover the latest articles, insights, and stories.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-end">
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center gap-2 max-w-md"
        >
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <FiSearch />
          </button>
        </form>
      </div>

      {/* Articles List */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {articles.length === 0 ? (
          <p className="text-slate-400">No articles found.</p>
        ) : (
          articles.map((article) => (
            <div
              key={article._id}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
            >
              {article.featuredImage && (
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-slate-300 text-sm mb-4">
                  {article.excerpt || article.subtitle}
                </p>
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="flex items-center">
                    <FiClock className="mr-1" /> {article.readTime}
                  </span>
                  <Link
                    href={`/e-magazine/${article._id}`}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center"
                  >
                    Read <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300"
              } hover:bg-indigo-500 hover:text-white transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
