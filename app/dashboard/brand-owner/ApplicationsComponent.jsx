'use client'
import { useState } from 'react'
import { FiCheck, FiX, FiSearch, FiUser, FiMail, FiClock, FiMessageSquare, FiFilter } from 'react-icons/fi'

const ApplicationsComponent = () => {
  // Sample applications data
  const [applications, setApplications] = useState([
    {
      id: 1,
      influencer: {
        name: 'Alex Johnson',
        handle: '@techwithalex',
        followers: '42.5K',
        engagement: '5.2%',
        avatar: '/avatars/alex.jpg'
      },
      jobTitle: 'AI Tool Promotion',
      status: 'pending',
      date: '2023-11-18',
      message: 'I have experience promoting SaaS tools and believe my audience would be a great fit for your product.',
      platforms: ['Instagram', 'YouTube']
    },
    {
      id: 2,
      influencer: {
        name: 'Sarah Miller',
        handle: '@sarahfitness',
        followers: '68.3K',
        engagement: '7.1%',
        avatar: '/avatars/sarah.jpg'
      },
      jobTitle: 'Protein Shake Promotion',
      status: 'approved',
      date: '2023-11-15',
      message: 'My fitness-focused audience regularly looks for quality supplements like yours.',
      platforms: ['Instagram', 'TikTok']
    },
    {
      id: 3,
      influencer: {
        name: 'David Chen',
        handle: '@davidtravels',
        followers: '112K',
        engagement: '4.8%',
        avatar: '/avatars/david.jpg'
      },
      jobTitle: 'Travel Luggage Campaign',
      status: 'rejected',
      date: '2023-11-10',
      message: 'I specialize in travel gear reviews and would love to showcase your product.',
      platforms: ['YouTube', 'Twitter']
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter applications based on status and search term
  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus
    const matchesSearch = 
      app.influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.influencer.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const approveApplication = (id) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'approved' } : app
    ))
  }

  const rejectApplication = (id) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'rejected' } : app
    ))
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1 rounded-lg text-sm flex items-center ${selectedStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            <FiFilter className="mr-1" /> All
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-3 py-1 rounded-lg text-sm ${selectedStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedStatus('approved')}
            className={`px-3 py-1 rounded-lg text-sm ${selectedStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Approved
          </button>
          <button
            onClick={() => setSelectedStatus('rejected')}
            className={`px-3 py-1 rounded-lg text-sm ${selectedStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Rejected
          </button>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-thin text-slate-400 mb-1">Total Applications</h3>
          <p className="text-2xl font-bold">{applications.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-thin text-slate-400 mb-1">Pending</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {applications.filter(app => app.status === 'pending').length}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-thin text-slate-400 mb-1">Approved</h3>
          <p className="text-2xl font-bold text-green-400">
            {applications.filter(app => app.status === 'approved').length}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-thin text-slate-400 mb-1">Rejected</h3>
          <p className="text-2xl font-bold text-red-400">
            {applications.filter(app => app.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {filteredApplications.length > 0 ? (
          <div className="divide-y divide-slate-700">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Influencer Info */}
                  <div className="flex items-start space-x-3 min-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center overflow-hidden">
                      {application.influencer.avatar ? (
                        <img 
                          src={application.influencer.avatar} 
                          alt={application.influencer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-indigo-400 text-xl" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-thin text-white">{application.influencer.name}</h3>
                      <p className="text-sm text-indigo-400">{application.influencer.handle}</p>
                      <div className="flex items-center mt-1 text-xs text-slate-400">
                        <span className="mr-2">{application.influencer.followers} followers</span>
                        <span>{application.influencer.engagement} engagement</span>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-thin text-white">{application.jobTitle}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        application.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                        application.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-3">{application.message}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center text-slate-400">
                        <FiClock className="mr-1 text-indigo-400" />
                        <span>Applied: {application.date}</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <FiMessageSquare className="mr-1 text-indigo-400" />
                        <span>Platforms: {application.platforms.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2">
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveApplication(application.id)}
                          className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                        >
                          <FiCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => rejectApplication(application.id)}
                          className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                        >
                          <FiX className="mr-1" /> Reject
                        </button>
                      </>
                    )}
                    <button className="flex items-center px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">
                      <FiMail className="mr-1" /> Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto h-24 w-24 text-slate-600 mb-4">
              <FiUser className="w-full h-full" />
            </div>
            <h3 className="text-lg font-thin text-slate-300 mb-1">No applications found</h3>
            <p className="text-slate-500 mb-6">
              {selectedStatus === 'all' 
                ? "You haven't received any applications yet" 
                : `No ${selectedStatus} applications found`}
            </p>
            {selectedStatus !== 'all' && (
              <button
                onClick={() => setSelectedStatus('all')}
                className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                View all applications
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationsComponent