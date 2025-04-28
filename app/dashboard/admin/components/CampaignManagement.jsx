'use client'
import { useState } from 'react'
import { FiBriefcase, FiDollarSign, FiUsers, FiClock, FiCheck, FiX, FiExternalLink, FiCalendar, FiBarChart2, FiLayers, FiTag } from 'react-icons/fi'

export default function CampaignManagement() {
  const [activeTab, setActiveTab] = useState('active')
  const [viewingCampaign, setViewingCampaign] = useState(null)
  
  const campaigns = [
    { 
      id: 1, 
      name: 'Summer Collection', 
      brand: 'Nike', 
      budget: '$25,000', 
      influencers: 24, 
      status: 'active', 
      endDate: '2023-12-15',
      description: 'Promoting the new summer sportswear collection featuring top athletes',
      startDate: '2023-06-01',
      engagementRate: '4.8%',
      platforms: ['Instagram', 'TikTok'],
      tags: ['sports', 'fashion', 'summer'],
      content: [
        { type: 'Post', count: 18 },
        { type: 'Story', count: 32 },
        { type: 'Reel', count: 12 }
      ]
    },
    { 
      id: 2, 
      name: 'New Phone Launch', 
      brand: 'Apple', 
      budget: '$50,000', 
      influencers: 12, 
      status: 'active', 
      endDate: '2023-11-30',
      description: 'Exclusive launch campaign for the new iPhone model',
      startDate: '2023-09-15',
      engagementRate: '6.2%',
      platforms: ['YouTube', 'Instagram'],
      tags: ['tech', 'gadgets'],
      content: [
        { type: 'Review', count: 8 },
        { type: 'Unboxing', count: 4 },
        { type: 'Demo', count: 5 }
      ]
    },
    { 
      id: 3, 
      name: 'Fitness Challenge', 
      brand: 'Adidas', 
      budget: '$18,000', 
      influencers: 8, 
      status: 'pending', 
      endDate: '2024-01-10',
      description: '30-day fitness challenge featuring our new training shoes',
      startDate: '2023-12-10',
      engagementRate: null,
      platforms: ['Instagram', 'YouTube'],
      tags: ['fitness', 'health'],
      content: []
    },
    { 
      id: 4, 
      name: 'Beauty Products', 
      brand: 'L\'Oreal', 
      budget: '$32,000', 
      influencers: 19, 
      status: 'completed', 
      endDate: '2023-09-15',
      description: 'Seasonal campaign for our new line of organic beauty products',
      startDate: '2023-07-01',
      engagementRate: '5.4%',
      platforms: ['Instagram', 'TikTok', 'YouTube'],
      tags: ['beauty', 'skincare'],
      content: [
        { type: 'Tutorial', count: 15 },
        { type: 'Review', count: 10 },
        { type: 'Before/After', count: 7 }
      ]
    },
    { 
      id: 5, 
      name: 'Car Promotion', 
      brand: 'Toyota', 
      budget: '$75,000', 
      influencers: 5, 
      status: 'active', 
      endDate: '2023-12-01',
      description: 'Luxury car promotion targeting high-income professionals',
      startDate: '2023-10-01',
      engagementRate: '3.9%',
      platforms: ['YouTube', 'LinkedIn'],
      tags: ['automotive', 'luxury'],
      content: [
        { type: 'Test Drive', count: 3 },
        { type: 'Feature', count: 2 }
      ]
    }
  ]

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'active') return campaign.status === 'active'
    if (activeTab === 'pending') return campaign.status === 'pending'
    if (activeTab === 'completed') return campaign.status === 'completed'
    return true
  })

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-900/30 text-green-400',
      pending: 'bg-yellow-900/30 text-yellow-400',
      completed: 'bg-blue-900/30 text-blue-400'
    }
    return (
      <span className={`text-xs px-2 py-1 rounded-full capitalize ${colors[status] || 'bg-slate-700'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {['all', 'active', 'pending', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map(campaign => (
          <div key={campaign.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
              {getStatusBadge(campaign.status)}
            </div>
            
            <p className="text-sm text-slate-400 mb-6">Brand: {campaign.brand}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-400">Budget</p>
                <p className="text-white font-medium">{campaign.budget}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Influencers</p>
                <p className="text-white font-medium">{campaign.influencers}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">End Date</p>
                <p className="text-white font-medium">{campaign.endDate}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setViewingCampaign(campaign)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                View Details
              </button>
              {campaign.status === 'pending' && (
                <>
                  <button className="text-green-400 hover:text-green-300 p-2">
                    <FiCheck size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300 p-2">
                    <FiX size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Details Modal */}
      {viewingCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{viewingCampaign.name}</h2>
                  <p className="text-indigo-400">{viewingCampaign.brand}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(viewingCampaign.status)}
                  <button 
                    onClick={() => setViewingCampaign(null)} 
                    className="text-slate-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiBriefcase className="mr-2 text-indigo-400" />
                      Campaign Details
                    </h3>
                    <p className="text-slate-300">{viewingCampaign.description}</p>
                  </div>
                  
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Timeline</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Start Date</p>
                        <p className="text-white font-medium flex items-center">
                          <FiCalendar className="mr-2 text-indigo-400" />
                          {viewingCampaign.startDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">End Date</p>
                        <p className="text-white font-medium flex items-center">
                          <FiCalendar className="mr-2 text-indigo-400" />
                          {viewingCampaign.endDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {viewingCampaign.engagementRate && (
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Performance</h4>
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-900/30 p-3 rounded-lg">
                          <FiBarChart2 className="text-indigo-400" size={24} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Engagement Rate</p>
                          <p className="text-2xl font-bold text-white">{viewingCampaign.engagementRate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Content Types</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {viewingCampaign.content.map((item, index) => (
                        <div key={index} className="bg-slate-900/30 p-3 rounded-lg">
                          <p className="text-white font-medium">{item.type}</p>
                          <p className="text-xs text-slate-400">{item.count} posts</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Quick Stats</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-400">Total Budget</p>
                        <p className="text-white font-medium flex items-center">
                          <FiDollarSign className="mr-2 text-indigo-400" />
                          {viewingCampaign.budget}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Influencers</p>
                        <p className="text-white font-medium flex items-center">
                          <FiUsers className="mr-2 text-indigo-400" />
                          {viewingCampaign.influencers}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingCampaign.platforms.map((platform, index) => (
                        <span key={index} className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingCampaign.tags.map((tag, index) => (
                        <span key={index} className="bg-indigo-900/30 text-indigo-400 text-xs px-3 py-1 rounded-full flex items-center">
                          <FiTag className="mr-1" size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center">
                      <FiExternalLink className="mr-2" />
                      View Full Campaign Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}