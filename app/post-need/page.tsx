'use client'
import { useState } from 'react'

const jobs = [
  {
    id: 1,
    companyName: 'Tech Innovators',
    description: 'Looking for a tech influencer to promote our new AI tool.',
    language: 'English',
    niche: 'Technology',
    location: 'Remote',
    price: '$500',
  },
  {
    id: 2,
    companyName: 'Fashion Forward',
    description: 'Seeking a fashion influencer for a summer campaign.',
    language: 'French',
    niche: 'Fashion',
    location: 'Paris, France',
    price: '$800',
  },
  {
    id: 3,
    companyName: 'Health & Wellness Co.',
    description: 'Need a fitness influencer to promote our new protein shake.',
    language: 'English',
    niche: 'Health & Fitness',
    location: 'New York, USA',
    price: '$600',
  },
]

export default function JobsPage() {
  const [filters, setFilters] = useState({
    price: '',
    language: '',
    niche: '',
  })
  const [searchTerm, setSearchTerm] = useState('') // State for search term

  // Filter jobs based on filters and search term
  const filteredJobs = jobs.filter((job) => {
    const matchesFilters =
      (filters.price === '' || job.price <= filters.price) &&
      (filters.language === '' || job.language === filters.language) &&
      (filters.niche === '' || job.niche === filters.niche)

    const matchesSearch =
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())

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
    <div className='min-h-screen bg-slate-800 p-6'>
      <h1 className='text-3xl font-bold text-center mb-12'>Influencer Jobs</h1>

      {/* Search Input */}
      <div className='mb-12 flex justify-center'>
        <input
          type='text'
          placeholder='Search by company or description...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='p-2 border rounded text-slate-800 w-full max-w-md'
        />
      </div>

      {/* Filters Section */}
      <div className='mb-20 flex space-x-4 justify-center'>
        <select
          name='niche'
          onChange={handleFilterChange}
          className='p-2 border rounded text-slate-800'
        >
          <option value=''>Filter by Niche</option>
          <option value='Technology'>Technology</option>
          <option value='Fashion'>Fashion</option>
          <option value='Health & Fitness'>Health & Fitness</option>
        </select>
        <select
          name='language'
          onChange={handleFilterChange}
          className='p-2 border rounded text-slate-800'
        >
          <option value=''>Filter by Language</option>
          <option value='English'>English</option>
          <option value='French'>French</option>
        </select>
        <select
          name='price'
          onChange={handleFilterChange}
          className='p-2 border rounded text-slate-800'
        >
          <option value=''>Filter by Price</option>
          <option value='500'>$500</option>
          <option value='600'>$600</option>
          <option value='800'>$800</option>
        </select>
      </div>

      {/* Job Cards Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredJobs.map((job) => (
          <div key={job.id} className='bg-card2bg p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-2'>{job.companyName}</h2>
            <p className='text-blue-100 mb-4'>{job.description}</p>
            <div className='flex space-x-4 text-sm text-textPrimary mb-4'>
              <span>{job.language}</span>
              <span>{job.niche}</span>
              <span>{job.location}</span>
            </div>
            <p className='text-lg font-semibold mb-4'>{job.price}</p>
            <button className='bg-overlay text-white px-4 py-2 rounded hover:bg-slate-500'>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
