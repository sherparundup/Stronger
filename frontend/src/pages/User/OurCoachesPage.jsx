import React, { useEffect, useState } from "react";
import axios from "axios";

const OurCoachesPage = () => {
  const [verifiedCoaches, setVerifiedCoaches] = useState([]);

  const fetchVerifiedCoaches = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/coach/viewCoaches");
      setVerifiedCoaches(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchVerifiedCoaches();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Meet Our Coaches</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {verifiedCoaches.map((coach) => (
          <div
            key={coach._id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300"
          >
            <img
              src={coach.image || "https://via.placeholder.com/400x300"}
              alt={coach.name}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{coach.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{coach.specialty || "Fitness Coach"}</p>
              <p className="text-gray-500 text-sm">{coach.bio || "Passionate about helping you reach your goals."}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCoachesPage;