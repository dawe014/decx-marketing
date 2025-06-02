"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiEye,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiClock,
  FiArchive,
} from "react-icons/fi";
import Modal from "../../components/Modal";
import ArticleForm from "../../components/ArticleForm";

export default function MagazineDashboard() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [formMode, setFormMode] = useState("create");

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/magazine");
        const data = await res.json();
        console.log("the data", data);
        // Combine featured and latest articles, removing duplicates
        const allArticles = [...data.featuredArticles, ...data.latestArticles];
        const uniqueArticles = allArticles.filter(
          (article, index, self) =>
            index === self.findIndex((a) => a._id === article._id)
        );

        setArticles(uniqueArticles);
        setFilteredArticles(uniqueArticles); // Initialize filtered articles with all articles
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = articles;

    if (searchTerm) {
      results = results.filter(
        (article) =>
          article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((article) => article.status === statusFilter);
    }

    setFilteredArticles(results);
  }, [searchTerm, statusFilter, articles]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        const res = await fetch(`/api/magazine/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setArticles(articles.filter((article) => article._id !== id));
        }
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const openEditModal = (article) => {
    setCurrentArticle(article);
    setFormMode("edit");
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentArticle(null);
    setFormMode("create");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let res;
      let data;

      if (formMode === "create") {
        // 1. Create the article
        res = await fetch("/api/magazine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        data = await res.json();

        // 2. Upload the image if exists
        if (res.ok && formData.featuredImageFile) {
          const imageData = new FormData();
          imageData.append("featuredImage", formData.featuredImageFile);

          const imageUploadRes = await fetch(
            `/api/magazine/${data.article._id}/upload`,
            {
              method: "PATCH",
              body: imageData,
            }
          );

          if (!imageUploadRes.ok) {
            console.error("Image upload failed.");
          }
        }
      } else {
        // 3. Edit existing article
        res = await fetch(`/api/magazine/${currentArticle._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        data = await res.json();

        if (res.ok && formData.featuredImageFile) {
          const imageData = new FormData();
          imageData.append("featuredImage", formData.featuredImageFile);

          const imageUploadRes = await fetch(
            `/api/magazine/${currentArticle._id}/upload`,
            {
              method: "PATCH",
              body: imageData,
            }
          );

          if (!imageUploadRes.ok) {
            console.error("Image upload failed.");
          }
        }
      }

      // 4. Handle UI update
      if (res.ok) {
        if (formMode === "create") {
          setArticles([data.article, ...articles]);
        } else {
          setArticles(
            articles.map((article) =>
              article._id === currentArticle._id ? data.article : article
            )
          );
        }
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return (
          <span className="bg-green-800/30 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
            <FiCheckCircle className="mr-1" /> Published
          </span>
        );
      case "draft":
        return (
          <span className="bg-yellow-800/30 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center">
            <FiClock className="mr-1" /> Draft
          </span>
        );
      case "archived":
        return (
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full flex items-center">
            <FiArchive className="mr-1" /> Archived
          </span>
        );
      default:
        return (
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 min-h-screen">
      <div className="flex justify-end items-center mb-8">
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center transition-all"
        >
          <FiPlus className="mr-2" /> New Article
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-4 mb-6 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2.5 w-full border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
            >
              <FiFilter /> Filters
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Status
              </label>
              <select
                className="w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="bg-slate-700">
                  All Statuses
                </option>
                <option value="draft" className="bg-slate-700">
                  Draft
                </option>
                <option value="published" className="bg-slate-700">
                  Published
                </option>
                <option value="archived" className="bg-slate-700">
                  Archived
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Articles Table */}
      <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Categories
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Views
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Published
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filteredArticles?.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr
                    key={article._id}
                    className="hover:bg-slate-750 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {article.featuredImage && (
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <img
                              className="h-10 w-10 rounded-md object-cover border border-slate-600"
                              src={article.featuredImage}
                              alt={article.title}
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-100">
                            {article.title}
                          </div>
                          <div className="text-sm text-slate-400">
                            {article.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {article.categories?.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded"
                          >
                            {category}
                          </span>
                        ))}
                        {article.categories?.length > 2 && (
                          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                            +{article.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {article.views?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/e-magazine/${article._id}`}
                          target="_blank"
                          className="text-indigo-400 hover:text-indigo-300 p-1 transition-colors"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                        <button
                          onClick={() => openEditModal(article)}
                          className="text-yellow-400 hover:text-yellow-300 p-1 transition-colors"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-red-400 hover:text-red-300 p-1 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-slate-400"
                  >
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Article Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${formMode === "create" ? "Create New" : "Edit"} Article`}
      >
        <ArticleForm
          article={currentArticle}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          mode={formMode}
        />
      </Modal>
    </div>
  );
}
