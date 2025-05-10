import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserMembership() {
  const [members, setMembers] = useState([]);
  const [membershipType, setMembershipType] = useState('active'); // 'active' or 'expired'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch members based on type
  const fetchMembers = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        type === 'active'
          ? '/api/membership/getActiveUserMembers'
          : '/api/membership/getExpiredUserMembers';
      const res = await axios.get(`http://localhost:8000${endpoint}`);
      setMembers(res.data.data);
    } catch (err) {
      console.error(`Error fetching ${type} members:`, err);
      setError(`Failed to load ${type} memberships`);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMembers(membershipType);
  }, [membershipType]);

  // Refresh handler
  const handleRefresh = () => {
    fetchMembers(membershipType);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            🏋️‍♂️ {membershipType === 'active' ? 'Active' : 'Expired'} Memberships
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setMembershipType('active')}
              className={`px-4 py-2 rounded-lg font-medium border 
                ${membershipType === 'active'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'}
              `}
            >
              Active
            </button>
            <button
              onClick={() => setMembershipType('expired')}
              className={`px-4 py-2 rounded-lg font-medium border 
                ${membershipType === 'expired'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'}
              `}
            >
              Expired
            </button>
           
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading members...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : members.length === 0 ? (
          <p className="text-center text-gray-500">No memberships found.</p>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">User Name</th>
                  <th className="py-3 px-4 text-left">Membership</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Payment</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Purchased</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {members.map((member, index) => {
                  const purchasedDate = new Date(member.purchasedDate);
                  const endDate = new Date(purchasedDate);
                  endDate.setMonth(endDate.getMonth() + member.duration);
                  const today = new Date();
                  const diffTime = endDate - today;
                  const daysLeft = Math.max(
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
                    0
                  );

                  return (
                    <tr
                      key={member._id}
                      className="hover:bg-gray-100 transition-all duration-200"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 flex items-center space-x-4">
                        <span className="font-medium">{member.userId?.name}</span>
                        {member?.userId?.image?.url && (
                          <img
                            src={member.userId.image.url}
                            alt="User Profile"
                            className="w-10 h-10 object-cover rounded-full border-2 border-gray-300"
                          />
                        )}
                      </td>
                      <td className="py-3 px-4">{member.membershipId?.MembershipName}</td>
                      <td className="py-3 px-4">{member.duration} mo</td>
                      <td className="py-3 px-4">Rs. {member.price}</td>
                      <td className="py-3 px-4">{member.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold \
                            ${member.membershipStatus === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'}
                          `}
                        >
                          {member.membershipStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>{purchasedDate.toLocaleDateString()}</div>
                        <div
                          className={`text-xs font-medium mt-1 inline-block px-2 py-1 rounded-full \
                            ${daysLeft <= 7
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'}
                          `}
                        >
                          {membershipType === 'active'
                            ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
                            : 'Expired'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
