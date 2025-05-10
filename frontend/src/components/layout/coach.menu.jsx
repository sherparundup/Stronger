import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import Clients from "../../pages/Coach/coachPages/clients";
import CoachingPlans from "../../pages/Coach/coachPages/coachingPlans";
import Schedule from "../../pages/Coach/coachPages/schedule";
import VerifyYourSelf from "../../pages/Coach/coachPages/VerifyYourSelf";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UseIsCoachVerified } from "../../Context/isCoachVerified.context";
import { useCoachContext } from "../../Context/coachContext";
import { Users, BookOpen, Calendar, ShieldCheck, LogOut } from "lucide-react";
import PlansRevenue from "../../pages/Coach/coachPages/PlansRevenue";

const CoachMenu = () => {
  const [selectedOption, setSelectedOption] = useState("coachingPlans");
  const [auth, setAuth] = useAuth();
  const [coach, setCoach] = useCoachContext();
  const navigate = useNavigate();
  const [isCoachVerified, setIsCoachVerified] = UseIsCoachVerified();

  useEffect(() => {
    if (!auth?.user?._id) return; // Don't run unless user ID exists
  
    const fetchCoach = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/coachForContext/${auth.user._id}`
        );
        const response = res.data.data;
        localStorage.setItem("Coach", JSON.stringify(response));
        setCoach(response); // optional, if you're using coachContext
      } catch (error) {
        console.log(error.message);
      }
    };
  
    const isVerified = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/isVerified/${auth.user._id}`
        );
        const coach = res.data.data;
        const response = coach.verified;
        localStorage.setItem("isCoachVerified", response);
        setIsCoachVerified(response);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchCoach();
    isVerified();
  }, [auth?.user?._id]); // Dependency added here
  
  const handleLogout = () => {
    localStorage.setItem("isCoachVerified", false);
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    localStorage.removeItem("Coach");

    toast.success("Logged out successfully");
    navigate("/");
  };

  const options = [
    { name: "clients", label: "Clients", icon: <Users size={18} /> },
    { name: "coachingPlans", label: "Coaching Plans", icon: <BookOpen size={18} /> },
    { name: "schedule", label: "Schedule", icon: <Calendar size={18} /> },
    { name: "PlansRevenue", label: "PlansRevenue", icon: <ShieldCheck size={18} /> },
    { name: "verifyYourSelf", label: "Verify Yourself", icon: <ShieldCheck size={18} /> },
    { name: "LogOut", label: "Log Out", icon: <LogOut size={18} /> },
  ];

  const renderContent = () => {
    if (!isCoachVerified) return <VerifyYourSelf />;

    switch (selectedOption) {
      case "clients":
        return <Clients />;
      case "coachingPlans":
        return <CoachingPlans />;
      case "schedule":
        return <Schedule />;
      case "PlansRevenue":
        return <PlansRevenue />;
      case "verifyYourSelf":
        return <VerifyYourSelf />;
      default:
        return <p className="text-gray-300">Select an option to see content</p>;
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen flex flex-col lg:flex-row gap-6 text-white">
      {/* Sidebar */}
      <div
        className="flex flex-col lg:w-1/5 space-y-4 overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Coach Portal</h1>
          <p className="text-white">Manage your coaching business</p>
        </div>
        
        {options.map((option) => {
          const isDisabled =
            !isCoachVerified &&
            option.name !== "verifyYourSelf" &&
            option.name !== "LogOut";

          return (
            <button
              key={option.name}
              onClick={() => {
                if (option.name === "LogOut") {
                  handleLogout();
                } else if (!isDisabled) {
                  setSelectedOption(option.name);
                }
              }}
              disabled={isDisabled}
              className={`w-full text-left py-3 px-4 rounded-lg text-lg font-medium transition-all duration-200 flex items-center ${
                selectedOption === option.name
                
              } ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-800 cursor-pointer"
              }`}
            >
              <span className="mr-3">{option.icon}</span>
              {option.label}
            </button>
          );
        })}
        
        {coach && (
          <div className="mt-auto pt-6 border-t border-gray-800">
            <div className="flex items-center p-2">
              {coach.profilePicture ? (
                <img 
                  src={coach.profilePicture} 
                  alt="Coach" 
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3">
                  <span className="text-lg text-white">{coach.name?.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="font-medium">{coach.name}</p>
                <p className="text-sm text-white">
                  {isCoachVerified ? "Verified Coach" : "Pending Verification"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-black  border border-r border-white min-h-screen rounded-lg shadow-lg p-6 flex-grow lg:w-4/5 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {options.find(opt => opt.name === selectedOption)?.label || "Dashboard"}
          </h2>
          
          {isCoachVerified ? (
            <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full flex items-center">
              <ShieldCheck size={14} className="mr-1" />
              Verified
            </span>
          ) : (
            <span className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-full flex items-center">
              <ShieldCheck size={14} className="mr-1" />
              Verification Required
            </span>
          )}
        </div>
        
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default CoachMenu;