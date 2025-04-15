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

const CoachMenu = () => {
  const [selectedOption, setSelectedOption] = useState("clients");
  const [auth, setAuth] = useAuth();
  const [coach,setcoach]=useCoachContext();
  const navigate = useNavigate();
  const [isCoachVerified, setIsCoachVerified] = UseIsCoachVerified();

  useEffect(() => {

    const fetchCoach=async()=>{
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/coachForContext/${auth.user._id}`
        );
        
        const response = res.data.data;
        localStorage.setItem("Coach", JSON.stringify(response));
        
      } catch (error) {
        
        console.log(error.message)
        
      }
      
    }
    fetchCoach()
    const isVerified = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/isVerified/${auth.user._id}`
        );
        const coach=res.data.data;

        const response = res.data.data.verified;
        localStorage.setItem("isCoachVerified", response);
        setIsCoachVerified(response);
      } catch (error) {
        console.log(error);
      }
    };
    isVerified();
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isCoachVerified", false);
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const options = [
    { name: "clients", label: "Clients" },
    { name: "coachingPlans", label: "Coaching Plans" },
    { name: "schedule", label: "Schedule" },
    { name: "verifyYourSelf", label: "Verify Yourself" },
    { name: "LogOut", label: "Log Out" },
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
      case "verifyYourSelf":
        return <VerifyYourSelf />;
      default:
        return <p>Select an option to see content</p>;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div
        className="flex flex-col lg:w-1/6 space-y-4 overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
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
              className={`w-full text-left py-3 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                selectedOption === option.name
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border border-gray-300"
              } ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="bg-white min-h-screen rounded-lg shadow-md p-6 flex-grow lg:w-3/4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Coach Dashboard</h2>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default CoachMenu;
