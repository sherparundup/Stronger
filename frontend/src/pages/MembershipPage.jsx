import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MembershipPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [mode, setMode] = useState("Standard");
  const navigate=useNavigate();


  // Empty function to be implemented later
  const buyMembership =async(membership) => {
    
    console.log("Buy membership clicked:", membership);
    navigate(`/Membership/${membership._id}`)
  };

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/membership/getAllMembership");
        if (res.data && res.data.data) {
          setMemberships(res.data.data);
          console.log(res.data);
        }
      } catch (error) {
        console.error("Error fetching memberships:", error.message);
      }
    };

    fetchMemberships();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen items-center">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold mb-6">We Offer</h1>
        </div>

        <div className="flex h-auto items-center px-10 space-x-4">
          <div className="flex w-1/2 text-3xl font-semibold text-gray-800">
            Our Plans
          </div>

          {/* Button Container */}
          <div className="flex w-1/2 justify-end">
            <div className="border border-gray-300 shadow-lg rounded-lg flex gap-x-4 py-2 px-8 bg-white">
              <button
                onClick={() => setMode("Standard")}
                className="px-6 py-2 font-bold text-gray-800 rounded-md shadow-md bg-gray-100 transition-all duration-300 hover:bg-gray-300 hover:shadow-lg"
              >
                Standard
              </button>

              <button
                onClick={() => setMode("Premium")}
                className="px-6 py-2 bg-black font-bold text-white rounded-md shadow-md transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg"
              >
                Premium
              </button>
            </div>
          </div>
        </div>

        {/* Membership List */}
        <div className="flex justify-center w-full px-10 mt-8">
          {memberships.length > 0 ? (
            <ul className="flex flex-wrap gap-8 justify-center">
              {memberships
                .filter((membershipItem) => membershipItem.membershipType === mode)
                .map((membership) => (
                  <li
                    key={membership._id}
                    className="p-6 border rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 w-64 h-96 flex flex-col space-y-4"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold">{membership.name}</h2>
                      <p className="text-gray-700 mt-1">
                        Duration: {membership.duration} months
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-xl">
                        Price: ${membership.price}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">
                        Description: {membership.description}
                      </p>
                    </div>
                    {/* Buy Button */}
                    <button
                      onClick={() => buyMembership(membership)}
                      className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Buy
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-600 mt-4">No memberships available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MembershipPage;
