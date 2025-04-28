'use client'
import { useState } from 'react'
import { FiSearch, FiDollarSign, FiGlobe, FiTag, FiMapPin, FiArrowRight } from 'react-icons/fi'

const jobs = [
  {
    id: 1,
    companyName: 'Tech Innovators',
    description: 'Looking for a tech influencer to promote our new AI tool. Must have 10K+ followers and experience with SaaS products.',
    language: 'English',
    niche: 'Technology',
    location: 'Remote',
    price: '$500 - $800',
    posted: '2 days ago',
    engagement: '3-5% required'
  },
  {
    id: 2,
    companyName: 'Fashion Forward',
    description: 'Seeking a fashion influencer for a summer campaign featuring our new swimwear collection. Content creation required.',
    language: 'French',
    niche: 'Fashion',
    location: 'Paris, France',
    price: '$800 - $1,200',
    posted: '1 week ago',
    engagement: '4-6% required'
  },
  {
    id: 3,
    companyName: 'Health & Wellness Co.',
    description: 'Need a fitness influencer to promote our new protein shake. Before/after transformation content preferred.',
    language: 'English',
    niche: 'Health & Fitness',
    location: 'New York, USA',
    price: '$600 - $900',
    posted: '3 days ago',
    engagement: '5-7% required'
  },
  {
    id: 4,
    companyName: 'Travel Luxe',
    description: 'Collaboration with travel influencers for hotel promotions in Bali. Must have beautiful aesthetic feed.',
    language: 'English',
    niche: 'Travel',
    location: 'Bali, Indonesia',
    price: '$1,000 - $1,500',
    posted: 'Just now',
    engagement: '4-5% required'
  },
  {
    id: 5,
    companyName: 'Gourmet Foods',
    description: 'Food influencers needed for recipe development using our organic product line. Video content required.',
    language: 'Spanish',
    niche: 'Food',
    location: 'Remote',
    price: '$400 - $700',
    posted: '5 days ago',
    engagement: '3-4% required'
  },
  {
    id: 6,
    companyName: 'Eco Living',
    description: 'Sustainability influencers wanted for zero-waste product campaign. Must align with eco-friendly values.',
    language: 'German',
    niche: 'Lifestyle',
    location: 'Berlin, Germany',
    price: '$700 - $1,000',
    posted: '2 days ago',
    engagement: '4-5% required'
  }
]

export default function JobsPage() {
  const [filters, setFilters] = useState({
    price: '',
    language: '',
    niche: '',
  })
  const [searchTerm, setSearchTerm] = useState('')

  const filteredJobs = jobs.filter((job) => {
    const matchesFilters =
      (filters.price === '' || job.price.includes(filters.price)) &&
      (filters.language === '' || job.language === filters.language) &&
      (filters.niche === '' || job.niche === filters.niche)

    const matchesSearch =
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.niche.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilters && matchesSearch
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className='min-h-screen bg-slate-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-white mb-3'>Influencer Job Board</h1>
          <p className='text-xl text-slate-300'>
            Find your next brand collaboration from our curated listings
          </p>
        </div>

        {/* Search and Filters */}
        <div className='mb-12 space-y-6'>
          {/* Search Bar */}
          <div className='relative max-w-2xl mx-auto'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='h-5 w-5 text-slate-400' />
            </div>
            <input
              type='text'
              placeholder='Search jobs by company, description, or niche...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            />
          </div>

          {/* Filter Row */}
          <div className='flex flex-wrap justify-center gap-4'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiTag className='h-4 w-4 text-slate-400' />
              </div>
              <select title='niche'
                name='niche'
                onChange={handleFilterChange}
                className='pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none'
              >
                <option value=''>All Niches</option>
                <option value='Technology'>Technology</option>
                <option value='Fashion'>Fashion</option>
                <option value='Health & Fitness'>Health & Fitness</option>
                <option value='Travel'>Travel</option>
                <option value='Food'>Food</option>
                <option value='Lifestyle'>Lifestyle</option>
              </select>
            </div>

            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiGlobe className='h-4 w-4 text-slate-400' />
              </div>
              <select title='language'
                name='language'
                onChange={handleFilterChange}
                className='pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none'
              >
                <option value=''>All Languages</option>
                <option value='English'>English</option>
                <option value='French'>French</option>
                <option value='Spanish'>Spanish</option>
                <option value='German'>German</option>
              </select>
            </div>

            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiDollarSign className='h-4 w-4 text-slate-400' />
              </div>
              <select title='price'
                name='price'
                onChange={handleFilterChange}
                className='pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none'
              >
                <option value=''>All Price Ranges</option>
                <option value='400'>$400+</option>
                <option value='600'>$600+</option>
                <option value='800'>$800+</option>
                <option value='1000'>$1,000+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className='bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-indigo-500 transition-colors duration-200'>
                <div className='p-6'>
                  <div className='flex justify-between items-start mb-4'>
                    <h2 className='text-xl font-bold text-white'>{job.companyName}</h2>
                    <span className='bg-indigo-900/50 text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                      {job.posted}
                    </span>
                  </div>
                  
                  <p className='text-slate-300 mb-6'>{job.description}</p>
                  
                  <div className='space-y-3 mb-6'>
                    <div className='flex items-center text-slate-400'>
                      <FiTag className='mr-2 text-indigo-500' />
                      <span>{job.niche}</span>
                    </div>
                    <div className='flex items-center text-slate-400'>
                      <FiGlobe className='mr-2 text-indigo-500' />
                      <span>{job.language}</span>
                    </div>
                    <div className='flex items-center text-slate-400'>
                      <FiMapPin className='mr-2 text-indigo-500' />
                      <span>{job.location}</span>
                    </div>
                    <div className='flex items-center text-slate-400'>
                      <FiDollarSign className='mr-2 text-indigo-500' />
                      <span className='font-medium text-white'>{job.price}</span>
                    </div>
                    <div className='text-sm text-slate-500'>
                      Engagement: {job.engagement}
                    </div>
                  </div>
                  
                  <button className='w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'>
                    View Details <FiArrowRight className='ml-2' />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <h3 className='text-xl font-medium text-slate-300 mb-2'>No jobs found</h3>
              <p className='text-slate-500'>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}