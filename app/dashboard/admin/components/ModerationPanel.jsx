'use client'
import { useState } from 'react'
import { FiFlag, FiX, FiCheck, FiTrash2, FiAlertTriangle, FiMessageSquare } from 'react-icons/fi'

const ModerationPanel = () => {
  const [activeFilter, setActiveFilter] = useState('pending')
  const [selectedItems, setSelectedItems] = useState([])

  const reports = [
    {
      id: 1,
      type: 'Post',
      content: 'This post contains inappropriate content',
      reporter: 'user123',
      reportedUser: 'influencer456',
      status: 'pending',
      date: '2023-05-15'
    },
    {
      id: 2,
      type: 'Comment',
      content: 'This comment is harassing other users',
      reporter: 'brandowner789',
      reportedUser: 'user123',
      status: 'pending',
      date: '2023-05-14'
    },
    {
      id: 3,
      type: 'Profile',
      content: 'This profile is impersonating someone else',
      reporter: 'agencyRep1',
      reportedUser: 'fakeProfile',
      status: 'resolved',
      date: '2023-05-10'
    },
    {
      id: 4,
      type: 'Message',
      content: 'Spam messages in DM',
      reporter: 'user456',
      reportedUser: 'spammer123',
      status: 'pending',
      date: '2023-05-12'
    },
    {
      id: 5,
      type: 'Campaign',
      content: 'Misleading campaign information',
      reporter: 'consumer123',
      reportedUser: 'brandX',
      status: 'rejected',
      date: '2023-05-08'
    }
  ]

  const filteredReports = reports.filter(report => 
    activeFilter === 'all' ? true : report.status === activeFilter
  )

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    )
  }

  const bulkAction = (action) => {
    // In a real app, you would make API calls here
    console.log(`${action} items:`, selectedItems)
    setSelectedItems([])
  }

  const updateReportStatus = (id, status) => {
    // In a real app, you would make an API call here
    console.log(`Updating report ${id} to ${status}`)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2">
          {['all', 'pending', 'resolved', 'rejected'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => bulkAction('approve')}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <FiCheck size={16} />
              <span>Approve ({selectedItems.length})</span>
            </button>
            <button
              onClick={() => bulkAction('reject')}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <FiX size={16} />
              <span>Reject ({selectedItems.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Reports List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700 text-sm text-slate-400 font-medium">
          <div className="col-span-1"></div>
          <div className="col-span-2">Type</div>
          <div className="col-span-3">Content</div>
          <div className="col-span-2">Reported By</div>
          <div className="col-span-2">Target</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Actions</div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No {activeFilter === 'all' ? '' : activeFilter} reports found
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700 hover:bg-slate-700/30">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(report.id)}
                  onChange={() => toggleSelectItem(report.id)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2 flex items-center text-sm text-white">
                {report.type === 'Message' ? <FiMessageSquare className="mr-2" /> : <FiFlag className="mr-2" />}
                {report.type}
              </div>
              <div className="col-span-3 text-sm text-slate-300 truncate">{report.content}</div>
              <div className="col-span-2 text-sm text-slate-300">{report.reporter}</div>
              <div className="col-span-2 text-sm text-slate-300">{report.reportedUser}</div>
              <div className="col-span-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                  report.status === 'resolved' ? 'bg-green-900/50 text-green-400' :
                  'bg-red-900/50 text-red-400'
                }`}>
                  {report.status}
                </span>
              </div>
              <div className="col-span-1 flex space-x-2">
                <button
                  onClick={() => updateReportStatus(report.id, 'resolved')}
                  className="text-green-400 hover:text-green-300"
                  title="Approve"
                >
                  <FiCheck size={18} />
                </button>
                <button
                  onClick={() => updateReportStatus(report.id, 'rejected')}
                  className="text-red-400 hover:text-red-300"
                  title="Reject"
                >
                  <FiX size={18} />
                </button>
                <button
                  onClick={() => console.log('Delete report', report.id)}
                  className="text-slate-400 hover:text-slate-300"
                  title="Delete"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ModerationPanel