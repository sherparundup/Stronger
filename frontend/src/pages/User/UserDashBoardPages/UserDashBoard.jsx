import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddToCart from "./AddToCart";
import MyProductPage from "./MyProductPage";
import MyMembershipPage from "./MyMembershipPage";
import ProfilePage from "./ProfilePage";
import Steps from "../../../components/Steps";
import ProgressDisplay from "../../../pages/User/ProgressDisplay"
import ProgressPicturesPage from "../../../pages/User/ProgressDisplay";
import AddProgress from "./AddProgress";
import BMRCalculator from "./BMR";
import HealthLogForm from "./HealthLogForm";
import CoachingPlan from "./CoachingPlan";

const UserDashBoard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [showSubMenu, setShowSubMenu] = useState(null);

  useEffect(() => {
    console.log(auth);
    console.log(auth.user.name);
  }, [auth]);

  const renderContent = () => {
    switch (selectedOption) {
      case "Profile":
        return <ProfilePage />;
      case "orders":
        return <UserOrders />;
      case "MyCart":
        return <AddToCart />;
      case "MyProduct":
        return <MyProductPage />;
      case "membership":
        return <MyMembershipPage />;
      case "steps":
        return <Steps />;
      case "upload your progress":
        return <AddProgress />;
      case "CoachingPlans":
        return <CoachingPlan />;
      case "BMR":
        return <BMRCalculator />;
      case "HealthLogForm":
        return <HealthLogForm />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gradient-to-b from-gray-800 to-black text-white p-6 flex flex-col items-center shadow-lg space-y-6 md:w-1/5 lg:w-1/6 rounded-r-xl">
        <img
          className="w-24 h-24 rounded-full mt-4 border-4 border-white object-cover"
          src={auth.user.image.url}
          alt="Profile"
        />
        <h2 className="text-xl font-semibold mt-3">{auth.user.name}</h2>

        <nav className="w-full space-y-4">
          {[
            { name: "Profile", icon: "👤", subMenu: ["steps", "upload your progress"] },
            // { name: "Settings", icon: "⚙️", subMenu: ["Account Settings", "Privacy"] },
            { name: "MyCart", icon: "🛒" },
            { name: "MyProduct", icon: "📦" },
            { name: "membership", icon: "💳" },
            { name: "CoachingPlans", icon: "🏋️‍♂️" },
            { name: "BMR", icon: "🏋️‍♂️" },
            { name: "HealthLogForm", icon: "🏋️‍♂️" },
            { name: "Logout", icon: "🚪" },
          ].map((item, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  if (item.name === "Logout") {
                    localStorage.removeItem("auth")
                    localStorage.removeItem("googleFitToken")
                    localStorage.removeItem("isCoachVerified")
                    navigate("/login");
                  } else {
                    setSelectedOption(item.name);
                    setShowSubMenu(showSubMenu === item.name ? null : item.name);
                  }
                }}
                className={`py-3 text-center font-semibold text-lg flex items-center cursor-pointer space-x-2 transition duration-300 transform hover:bg-gray-700 rounded-md hover:scale-105 ${
                  selectedOption === item.name ? "bg-gray-700" : ""
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {item.subMenu && (
                  <span className="ml-2">
                    {showSubMenu === item.name ? "▼" : "▲"}
                  </span>
                )}
              </div>

              {item.subMenu && showSubMenu === item.name && (
                <div className="space-y-2 pl-6 mt-2">
                  {item.subMenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => {
                        setSelectedOption(subItem);
                        setShowSubMenu(null);
                      }}
                      className="py-2 text-left font-semibold text-lg text-white cursor-pointer transition duration-300 transform hover:bg-gray-600 rounded-md hover:scale-105"
                    >
                      {subItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-black p-10 shadow-xl rounded-l-xl overflow-y-auto text-white">
        {selectedOption.length === 0 ? (
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Welcome, {auth.user.name}!
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Here is your personalized dashboard.
            </p>
          </div>
        ) : (
          <div className="w-full h-full transition-all ease-in-out">
            {renderContent()}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashBoard;
