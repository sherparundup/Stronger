import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import AdminUsers from '../../pages/Admin/AdminUsers';
import CatagoryPages from '../../pages/Admin/AdmindashboardPage.jsx/dashboardPage';
import ProductPage from '../../pages/Admin/ProductPage/ProductPages';
import MembershipPage from '../../pages/Admin/MembershipPage/MembershipPage';
import UserMembership from '../../pages/Admin/MembershipPage/UserMembership';
import CoachPages from '../../pages/Admin/coachPage/OurCoaches';
import { useNavigate } from 'react-router-dom'; // Import navigate hook
import { toast } from 'react-toastify'; // Make sure toast is correctly imported
import BoughtProducts from '../../pages/Admin/ProductPage/BoughtProducts';


const AdminMenu = () => {
  const [selectedOption, setSelectedOption] = useState('dashboard'); // Default option
  const [auth,setAuth] = useAuth();
  const navigate= useNavigate()
  

  const options = [
    { name: 'dashboard', label: 'Dashboard' },
    { name: 'Products', label: 'Products' },
    { name: 'Users', label: 'Users' },
    {name:'membership',label:"Membership"},
    {name:'userMebership',label:"UserMebership"},
    {name:'ourcoach',label:"Ourcoach"},
    {name:'boughtProduct',label:"boughtProduct"},
    {name:'LogOut',label:"LogOut"},
  ];

  // Dynamic rendering based on selectedOption
  const renderContent = () => {
    switch (selectedOption) {
      case 'dashboard':
        return <CatagoryPages />;
      case 'Products':
        return <ProductPage />;
      // case 'Users':
      //   return <AdminUsers />;
      case 'membership':
        return <MembershipPage/>;
      case 'userMebership':
        return <UserMembership/>;
      case 'ourcoach':
        return <CoachPages/>;
      case 'boughtProduct':
        return <BoughtProducts/>;
      case 'LogOut':
          handleLogout(); 
          return null; 
       
      default:
        return <p>Select an option to see content</p>;
    }
  };
  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    navigate("/"); 
    toast.success("Logged out successfully"); // Show toast notification
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
          style={{ maxHeight: '80vh' }} // Makes the content area scrollable
        >
          <div>{renderContent()}</div> {/* Dynamic content displayed here */}
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
