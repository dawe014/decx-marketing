// src/app/e-magazine/[slug]/page.jsx (for individual articles)
import { FiArrowLeft, FiClock, FiBookmark, FiShare2 } from 'react-icons/fi';
import Link from 'next/link'
export default function ArticlePage() {
  return (
    <article className="py-12 max-w-3xl mx-auto">
      <Link href="/e-magazine" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8">
        <FiArrowLeft className="mr-2" /> Back to Magazine
      </Link>

      <header className="mb-10">
        <span className="inline-block px-3 py-1 bg-indigo-600 text-xs rounded-full mb-4">
          Success Stories
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          From Bankruptcy to 7-Figure Success: The Pivot That Changed Everything
        </h1>
        <div className="flex items-center text-sm text-slate-400">
          <span className="mr-4">By Sarah Johnson</span>
          <span className="flex items-center">
            <FiClock className="mr-1" /> 8 min read
          </span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none mb-12">
        <img 
          src="/images/e-magazine/featured-1.jpg" 
          alt="Article cover" 
          className="w-full rounded-xl mb-8"
        />
        
        <p className="lead">
          When the pandemic hit, most businesses scrambled to survive. But for one entrepreneur, it became the catalyst for an unexpected transformation that would take her from near-bankruptcy to industry leadership.
        </p>

        <h2>The Breaking Point</h2>
        <p>
          In March 2020, Jessica Monroe's luxury event planning business evaporated overnight. With $200,000 in debt and no income, she faced the very real possibility of losing everything she'd built over seven years.
        </p>

        {/* More article content... */}
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
          <Link href="/e-magazine" className="text-indigo-400 hover:text-indigo-300">
            Back to Magazine
          </Link>
        </div>
      </div>
    </article>
  );
}