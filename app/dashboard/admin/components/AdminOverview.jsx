'use client'
import { FiUsers, FiBriefcase, FiDollarSign, FiTrendingUp } from 'react-icons/fi'

export default function AdminOverview() {
  const stats = [
    { title: 'Total Users', value: '2,543', change: '+12%', icon: FiUsers, trend: 'up' },
    { title: 'Active Campaigns', value: '147', change: '+5%', icon: FiBriefcase, trend: 'up' },
    { title: 'Revenue (30d)', value: '$24,892', change: '+18%', icon: FiDollarSign, trend: 'up' },
    { title: 'Avg. Engagement', value: '4.2%', change: '-0.3%', icon: FiTrendingUp, trend: 'down' }
  ]

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'created a new campaign', time: '2 mins ago' },
    { id: 2, user: 'Sarah Smith', action: 'applied to Nike campaign', time: '15 mins ago' },
    { id: 3, user: 'Mike Johnson', action: 'was approved for Adidas', time: '1 hour ago' },
    { id: 4, user: 'Emily Wilson', action: 'reported content', time: '3 hours ago' },
    { id: 5, user: 'Alex Brown', action: 'upgraded to Pro plan', time: '5 hours ago' }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                stat.trend === 'up' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className={`text-sm mt-3 ${
              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start pb-4 border-b border-slate-700 last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium mr-4">
                {activity.user.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-sm text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer">
          <h3 className="font-bold text-white mb-3">View All Users</h3>
          <p className="text-sm text-slate-400">Manage all platform users including brands and influencers</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer">
          <h3 className="font-bold text-white mb-3">Review Reports</h3>
          <p className="text-sm text-slate-400">Check reported content and take necessary actions</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer">
          <h3 className="font-bold text-white mb-3">System Settings</h3>
          <p className="text-sm text-slate-400">Configure platform-wide settings and preferences</p>
        </div>
      </div>
    </div>
  )
}