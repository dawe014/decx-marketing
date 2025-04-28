// src/app/e-magazine/page.jsx
import Link from 'next/link';
import { FiArrowRight, FiBookOpen, FiTrendingUp, FiClock, FiBookmark } from 'react-icons/fi';

export default function MagazinePage() {
  const featuredArticles = [
    {
      id: 1,
      title: "From Bankruptcy to 7-Figure Success",
      excerpt: "How one founder pivoted during crisis and built an empire",
      category: "Success Stories",
      readTime: "8 min read",
      image: "/images/e-magazine/featured-1.jpg"
    },
    {
      id: 2,
      title: "The Psychology of Viral Content",
      excerpt: "Neuroscience behind what makes people share",
      category: "Marketing",
      readTime: "6 min read",
      image: "/images/e-magazine/featured-2.jpg"
    }
  ];

  const articles = [
    {
      id: 3,
      title: "Building Authentic Brand Partnerships",
      excerpt: "Why forced collabs fail and how to do it right",
      category: "Branding",
      readTime: "5 min read"
    },
    {
      id: 4,
      title: "The Algorithm Shift: 2024 Updates",
      excerpt: "What creators need to know about platform changes",
      category: "Trends",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "Monetizing Micro-Influencers",
      excerpt: "Strategies for under 10K followers",
      category: "Growth",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-indigo-400 mb-4">
          DECx Magazine
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          "Every successful business has a failure story, and every failure story has successful experience."
        </p>
      </div>

      {/* Featured Articles */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center">
            <FiTrendingUp className="mr-2 text-indigo-400" />
            Featured Stories
          </h2>
          <Link href="/e-magazine/category/featured" className="text-indigo-400 hover:text-indigo-300 flex items-center">
            View all <FiArrowRight className="ml-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featuredArticles.map(article => (
            <div key={article.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all">
              <div className="h-64 bg-slate-700 relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
                  <span className="inline-block px-3 py-1 bg-indigo-600 text-xs rounded-full mb-2">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold">{article.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-300 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span className="flex items-center">
                    <FiClock className="mr-1" /> {article.readTime}
                  </span>
                  <Link href={`/e-magazine/${article.id}`} className="text-indigo-400 hover:text-indigo-300 flex items-center">
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
          {articles.map(article => (
            <div key={article.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-all">
              <span className="inline-block px-3 py-1 bg-slate-700 text-xs rounded-full mb-3">
                {article.category}
              </span>
              <h3 className="text-lg font-bold mb-2">{article.title}</h3>
              <p className="text-slate-300 text-sm mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-slate-400">
                  <FiClock className="mr-1" /> {article.readTime}
                </span>
                <div className="flex space-x-3">
                  <button className="text-slate-400 hover:text-indigo-400">
                    <FiBookmark />
                  </button>
                  <Link href={`/e-magazine/${article.id}`} className="text-indigo-400 hover:text-indigo-300 flex items-center">
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
          {['Success Stories', 'Marketing', 'Branding', 'Growth', 'Trends', 'Case Studies', 'Interviews', 'Strategies'].map(category => (
            <Link 
              key={category} 
              href={`/e-magazine/category/${category.toLowerCase().replace(' ', '-')}`}
              className="bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-3 text-center transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-800 rounded-xl p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
          <p className="text-slate-300 mb-6">
            Get the latest articles, case studies and marketing insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}