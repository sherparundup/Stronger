import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';


const AdminMenu = () => {
  const [selectedOption, setSelectedOption] = useState('catagory'); // Default option
  const [auth] = useAuth();
  

  const options = [
    { name: 'clients', label: 'Clients' },
    { name: 'coachingPlans', label: 'CoachingPlans' },
    { name: 'schedule', label: 'Schedule' }
    
  ];

  // Dynamic rendering based on selectedOption
  const renderContent = () => {
    switch (selectedOption) {
      case 'clients':
        return <CatagoryPages />;
     
      default:
        return <p>Select an option to see content</p>;
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar: Navigation Menu */}
        <div
          className="flex flex-col lg:w-1/6 space-y-4 overflow-y-auto"
          style={{ maxHeight: '80vh' }} // Makes the sidebar scrollable
        >
          {options.map((option) => (
            <button
              key={option.name}
              onClick={() => setSelectedOption(option.name)} // Update the selected option
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
        <div
          className="bg-white min-h-screen rounded-lg shadow-md p-6 flex-grow lg:w-3/4 overflow-y-auto"
          // style={{ maxHeight: '80vh' }} // Makes the content area scrollable
        >
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <div>{renderContent()}</div> {/* Dynamic content displayed here */}
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
