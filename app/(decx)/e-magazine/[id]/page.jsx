"use client";
import { FiArrowLeft, FiClock, FiBookmark, FiShare2 } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";

export default function ArticlePage({ params: paramsPromise }) {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unwrap params using React.use()
  const params = use(paramsPromise);
  const { id: slug } = params;

  console.log("slug", slug);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/magazine/${slug}`, {
          next: { revalidate: 60 },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch article data");
        }
        const articleData = await response.json();
        console.log("Fetched article data:", articleData);
        setArticle(articleData);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }
  console.log("article", article);
  return (
    <article className="py-12 max-w-3xl mx-auto">
      <Link
        href="/e-magazine"
        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8"
      >
        <FiArrowLeft className="mr-2" /> Back to Magazine
      </Link>

      <header className="mb-10">
        <span className="inline-block px-3 py-1 bg-indigo-600 text-xs rounded-full mb-4">
          {article.categories}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center text-sm text-slate-400">
          <span className="flex items-center">
            <FiClock className="mr-1" /> {article.readTime || "8"} min read
          </span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none mb-12">
        <img
          src={article.featuredImage}
          alt="Article cover"
          className="w-full rounded-xl mb-8"
        />

        <p className="lead">{article.content}</p>

        {article.content && (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </div>

      <div className="border-t border-slate-700 pt-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="text-slate-400 hover:text-indigo-400 flex items-center">
              <FiBookmark className="mr-2" /> Save
            </button>
            <button className="text-slate-400 hover:text-indigo-400 flex items-center">
              <FiShare2 className="mr-2" /> Share
            </button>
          </div>
          <Link
            href="/e-magazine"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to Magazine
          </Link>
        </div>
      </div>
    </article>
  );
}
