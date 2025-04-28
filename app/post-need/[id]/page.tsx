// app/jobs/[jobId]/page.jsx
'use client'

import { FiDollarSign, FiClock, FiMapPin, FiGlobe, FiHeart, FiShare2, FiMessageSquare, FiUser, FiBarChart2 } from 'react-icons/fi'
import Link from 'next/link'

export default function JobDetailsPage() {
  // Sample job data - in a real app, this would come from your API
  const job = {
    id: '123',
    title: 'Instagram Campaign for New Fitness App',
    brand: {
      name: 'FitTech Innovations',
      logo: '/brand-logos/fittech.png',
      verified: true
    },
    postedDate: '2023-11-15',
    applications: 24,
    description: 'We\'re launching a new fitness tracking app and looking for influencers to showcase its features. You\'ll need to create 3 Instagram posts and 2 stories demonstrating the app\'s workout tracking and progress visualization features. Must tag our official account and use #FitTechJourney.',
    niche: 'Fitness & Wellness',
    platforms: ['Instagram'],
    location: 'Worldwide',
    language: 'English',
    minBudget: 500,
    maxBudget: 1500,
    duration: '1 month',
    engagementReq: 'Minimum 5% engagement rate',
    contentReq: 'Must clearly show app interface in use during workout. Captions should highlight ease of use and benefits.',
    deliverables: [
      '3 Instagram feed posts',
      '2 Instagram stories',
      '1 Reel showing app features',
      'Use of branded hashtag #FitTechJourney'
    ],
    perks: [
      'Early access to premium features',
      'Featured on our official page',
      'Potential long-term partnership'
    ]
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/jobs" className="text-indigo-400 hover:text-indigo-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </Link>
          <div className="flex space-x-4">
            <button title='btn' className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
              <FiHeart size={20} />
            </button>
            <button title='btn' className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
              <FiShare2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium mr-3">
                      {job.brand.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white flex items-center">
                        {job.brand.name}
                        {job.brand.verified && (
                          <span className="ml-2 text-blue-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-slate-400">Posted {job.postedDate}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-900/30 text-indigo-400 px-3 py-1 rounded-full text-sm">
                  {job.applications} applications
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiDollarSign className="mr-2" />
                    Budget
                  </div>
                  <div className="font-medium">
                    ${job.minBudget} - ${job.maxBudget}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiClock className="mr-2" />
                    Duration
                  </div>
                  <div className="font-medium">{job.duration}</div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiMapPin className="mr-2" />
                    Location
                  </div>
                  <div className="font-medium">{job.location}</div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1">
                    <FiGlobe className="mr-2" />
                    Language
                  </div>
                  <div className="font-medium">{job.language}</div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Campaign Description</h2>
              <p className="text-slate-300 mb-6 whitespace-pre-line">{job.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-indigo-400 mb-3 flex items-center">
                    <FiBarChart2 className="mr-2" />
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="text-slate-300">Platforms: {job.platforms.join(', ')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="text-slate-300">Engagement: {job.engagementReq}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="text-slate-300">Niche: {job.niche}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-indigo-400 mb-3 flex items-center">
                    <FiUser className="mr-2" />
                    Content Requirements
                  </h3>
                  <p className="text-slate-300 whitespace-pre-line">{job.contentReq}</p>
                </div>
              </div>
            </div>

            {/* Deliverables & Perks */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Deliverables</h2>
                <ul className="space-y-3">
                  {job.deliverables.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Perks & Benefits</h2>
                <ul className="space-y-3">
                  {job.perks.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </span>
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* About Brand */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">About {job.brand.name}</h2>
              <p className="text-slate-300 mb-4">
                FitTech Innovations is a leading developer of fitness technology solutions, helping athletes and fitness enthusiasts track their progress and achieve their goals through innovative apps and wearables.
              </p>
              <div className="flex space-x-4">
                <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
                  <FiMessageSquare className="mr-2" />
                  Message Brand
                </button>
                <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Visit Website
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Application */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-6">Apply for This Job</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Rate ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your rate"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Cover Letter</label>
                <textarea
                  rows={5}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Explain why you're a good fit for this campaign..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Portfolio Links</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
                  placeholder="Instagram profile URL"
                />
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Other relevant links"
                />
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Submit Application
              </button>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Application Tips</h3>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Highlight relevant experience in fitness content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Include engagement metrics if possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Show examples of similar campaigns</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}