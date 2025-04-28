'use client'
import { useState } from 'react'
import { FiBarChart2, FiDollarSign, FiUsers, FiBriefcase, FiCalendar } from 'react-icons/fi'

export default function ReportsComponent() {
  const [activeReport, setActiveReport] = useState('platform')
  
  const platformStats = [
    { name: 'Total Users', value: '2,543', change: '+12%', icon: FiUsers },
    { name: 'Active Campaigns', value: '147', change: '+5%', icon: FiBriefcase },
    { name: 'Revenue (30d)', value: '$24,892', change: '+18%', icon: FiDollarSign },
    { name: 'Avg. Engagement', value: '4.2%', change: '-0.3%', icon: FiBarChart2 }
  ]

  const growthData = [
    { month: 'Jan', users: 1200, campaigns: 45 },
    { month: 'Feb', users: 1350, campaigns: 52 },
    { month: 'Mar', users: 1480, campaigns: 60 },
    { month: 'Apr', users: 1620, campaigns: 68 },
    { month: 'May', users: 1750, campaigns: 74 },
    { month: 'Jun', users: 1900, campaigns: 82 },
    { month: 'Jul', users: 2100, campaigns: 91 },
    { month: 'Aug', users: 2300, campaigns: 105 },
    { month: 'Sep', users: 2450, campaigns: 120 },
    { month: 'Oct', users: 2543, campaigns: 147 }
  ]

  return (
    <div className="space-y-8">
      {/* Report Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {['platform', 'growth', 'financial', 'engagement'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveReport(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeReport === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Platform Report */}
      {activeReport === 'platform' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {platformStats.map((stat, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    stat.change.includes('+') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{stat.name}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
                <p className={`text-sm ${
                  stat.change.includes('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
            ))}
          </div>
          {/* Additional platform report content can go here */}
        </div>
      )}

      {/* Growth Report */}
      {activeReport === 'growth' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Growth Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-4">User Growth</h4>
              <div className="space-y-3">
                {growthData.map((data, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 text-sm text-slate-400">{data.month}</div>
                    <div className="flex-1 bg-slate-700 rounded-full h-4">
                      <div 
                        className="bg-green-500 h-4 rounded-full" 
                        style={{ width: `${(data.users / 3000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-right text-sm text-white">{data.users}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-4">Campaign Growth</h4>
              <div className="space-y-3">
                {growthData.map((data, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 text-sm text-slate-400">{data.month}</div>
                    <div className="flex-1 bg-slate-700 rounded-full h-4">
                      <div 
                        className="bg-indigo-500 h-4 rounded-full" 
                        style={{ width: `${(data.campaigns / 150) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-right text-sm text-white">{data.campaigns}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Report */}
      {activeReport === 'financial' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="text-sm text-slate-400 mb-2">Total Revenue</h4>
              <p className="text-2xl font-bold text-white">$124,892</p>
              <p className="text-sm text-green-400 mt-1">+24% from last quarter</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="text-sm text-slate-400 mb-2">Expenses</h4>
              <p className="text-2xl font-bold text-white">$42,350</p>
              <p className="text-sm text-red-400 mt-1">+8% from last quarter</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="text-sm text-slate-400 mb-2">Net Profit</h4>
              <p className="text-2xl font-bold text-white">$82,542</p>
              <p className="text-sm text-green-400 mt-1">+32% from last quarter</p>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Report */}
      {activeReport === 'engagement' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Engagement Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-4">Time Spent</h4>
              <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">Engagement chart would go here</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-4">Activity by Platform</h4>
              <div className="space-y-4">
                {[
                  { platform: 'Web', percentage: 45, color: 'bg-indigo-500' },
                  { platform: 'Mobile', percentage: 35, color: 'bg-purple-500' },
                  { platform: 'Tablet', percentage: 15, color: 'bg-pink-500' },
                  { platform: 'Other', percentage: 5, color: 'bg-slate-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-slate-400">{item.platform}</div>
                    <div className="flex-1 bg-slate-700 rounded-full h-3">
                      <div 
                        className={`${item.color} h-3 rounded-full`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-sm text-white">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}