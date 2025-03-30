import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MembershipDisplay = () => {
  const [memberships, setMemberships] = useState([]);
  const [mode, setMode] = useState("Standard");
  const navigate = useNavigate();

  // Empty function to be implemented later
  const buyMembership = async (membership) => {
    console.log("Buy membership clicked:", membership);
    navigate(`/Membership/${membership._id}`);
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
    <div className="flex flex-col items-center bg-black text-white py-10">
    
      <div className="flex items-center w-full px-[80px] justify-between mb-8">
        {/* Button Container */}
        <div className="flex justify-end gap-4">
            <div className="text-3xl flex justify-center items-center">We offer </div>
          <div className="border border-gray-700 shadow-lg rounded-lg flex gap-x-4 py-2 px-8 bg-gray-800">
            <button
              onClick={() => setMode("Standard")}
              className={`px-6 py-2 font-bold text-gray-300 rounded-md shadow-md transition-all duration-300 ${
                mode === "Standard"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "hover:bg-gray-600"
              }`}
            >
              Standard
            </button>

            <button
              onClick={() => setMode("Premium")}
              className={`px-6 py-2 bg-black font-bold text-white rounded-md shadow-md transition-all duration-300 ${
                mode === "Premium"
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "hover:bg-yellow-300"
              }`}
            >
              Premium
            </button>
          </div>
        </div>
      </div>

      {/* Membership List */}
      <div className="w-full px-10">
        {memberships.length > 0 ? (
          <ul className="flex flex-wrap gap-8 justify-center">
            {memberships
              .filter((membershipItem) => membershipItem.membershipType === mode)
              .map((membership) => (
                <li
                  key={membership._id}
                  className="p-6 border rounded-lg shadow-md bg-gray-800 hover:shadow-xl transition-shadow duration-300 w-64 h-96 flex flex-col space-y-4"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{membership.name}</h2>
                    <p className="text-gray-400 mt-1">
                      Duration: {membership.duration} months
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-bold text-xl">
                      Price: ${membership.price}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400">Description: {membership.description}</p>
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
          <p className="text-gray-400 mt-4">No memberships available.</p>
        )}
      </div>
    </div>
  );
};

export default MembershipDisplay;
