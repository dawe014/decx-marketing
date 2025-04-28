import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const InfluencersComponent = () => {
  const influencers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Verified' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
    { id: 3, name: 'Emily Johnson', email: 'emily@example.com', status: 'Verified' },
    // Add more influencers as needed
  ];

  const handleEdit = (id) => {
    // Handle editing influencer details
    console.log(`Edit influencer with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Handle deleting influencer
    console.log(`Delete influencer with ID: ${id}`);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg ">
      <h2 className="text-2xl font-bold text-white mb-4">Influencers List</h2>
      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-600 text-gray-300">
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {influencers.map((influencer) => (
            <tr key={influencer.id} className="border-b border-gray-500">
              <td className="py-3 px-4 text-gray-200">{influencer.name}</td>
              <td className="py-3 px-4 text-gray-200">{influencer.email}</td>
              <td className="py-3 px-4 text-gray-200">{influencer.status}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleEdit(influencer.id)}
                  className="text-indigo-400 hover:text-indigo-300 mr-2"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(influencer.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfluencersComponent;