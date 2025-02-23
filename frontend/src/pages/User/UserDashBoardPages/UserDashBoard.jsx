import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddToCart from "./AddToCart";

const UserDashBoard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    console.log(auth);
    console.log(auth.user.name);
  }, [auth]);

  const renderContent = () => {
    switch (selectedOption) {
      case "Profile":
        return <UserProfile />;
      case "orders":
        return <UserOrders />;
      case "MyCart":
        return <AddToCart />;
      // case "membership":
      //   return <MembershipPage />;
      // case "membership":
      //   return <MembershipPage />;
      // case "membership":
      //   return <MembershipPage />;
    }
  };
  return (
    <Layout>
      <div className="flex h-screen w-full bg-gray-100">
        {/* Sidebar */}
        <aside className="w-1/5 text-black p-6 flex flex-col items-center shadow-lg">
          <img
            className="w-24 h-24 rounded-full mt-4 border-4 border-white object-cover"
            src={auth.user.image.url}
            alt="Profile"
          />
          <h2 className="text-lg font-semibold mt-3">{auth.user.name}</h2>

          <nav className="w-full mt-6">
            {[
              "Profile",
              "Settings",
              "MyCart",
              "Products",
              "memberships",
              "coachingPlans",
              "Logout",
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => {setSelectedOption(item)
                  renderContent()
                }}
                className="py-3 text-center font-bold text-xl border-b border-white cursor-pointer transition duration-300 hover:bg-purple-800 hover:scale-105"
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="w-4/5 bg-white p-10 shadow-lg overflow-y-auto">
          {selectedOption.length === 0 ? (
            <>
              {" "}
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {auth.user.name}!
              </h1>
              <p className="mt-4 text-gray-600">
                Here is your personalized dashboard.
              </p>
            </>
          ) : (
            <>
            {renderContent()}</>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default UserDashBoard;
