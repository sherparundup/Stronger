import React, { useState } from 'react';
import UserProfile from '../ProfilePage';
import UserOrders from './UserDashBoardPages/UserOrders';
import UserCart from '../../pages/User/UserCart';
import MembershipPage from '../../pages/User/MembershipPage';

const UserMenu = () => {
  const [selectedOption, setSelectedOption] = useState('profile'); // Default option

  const options = [
    { name: 'profile', label: 'Profile' },
    { name: 'orders', label: 'Orders' },
    { name: 'cart', label: 'Cart' },
    { name: 'membership', label: 'Membership' }
  ];

  // Dynamic rendering based on selectedOption
  const renderContent = () => {
    switch (selectedOption) {
      case 'profile':
        return <UserProfile />;
      case 'orders':
        return <UserOrders />;
      case 'cart':
        return <UserCart />;
      case 'membership':
        return <MembershipPage />;
      default:
        return <p>Select an option to see content</p>;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar: Navigation Menu */}
      <div className="flex flex-col lg:w-1/6 space-y-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
        {options.map((option) => (
          <button
            key={option.name}
            onClick={() => setSelectedOption(option.name)}
            className={`w-full text-left py-3 px-4 rounded-lg text-lg font-medium ${
              selectedOption === option.name
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Right Column: Dynamic Content */}
      <div className="bg-white rounded-lg shadow-md p-6 flex-grow lg:w-3/4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
        <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserMenu;
