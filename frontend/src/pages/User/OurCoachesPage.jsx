import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Clock, ChevronRight, Award } from "lucide-react";

const OurCoachesPage = () => {
  const [verifiedCoaches, setVerifiedCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerifiedCoaches = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/coach/viewCoaches");
        setVerifiedCoaches(res.data.data);
      } catch (error) {
        console.error("Error fetching coaches:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedCoaches();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Elite Coaches</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find the perfect coach to help you reach your fitness goals and transform your life with personalized training
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-400">Loading coaches...</div>
          </div>
        ) : verifiedCoaches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No coaches available at the moment.</p>
            <p className="text-gray-500">Please check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {verifiedCoaches.map((coach) => (
              <div
                key={coach._id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition duration-300"
              >
                {/* Coach Image */}
                <div className="relative">
                  <img
                    src={coach.user?.image?.url || "https://via.placeholder.com/400x300"}
                    alt={coach.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded">
                      {coach.category || "Fitness Coach"}
                    </span>
                  </div>
                </div>

                {/* Coach Info */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">{coach.name}</h2>
                  
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <Clock size={16} className="mr-2" />
                    <span>5+ years experience</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-6">
                    {coach.bio
                      ? coach.bio.length > 120 
                        ? coach.bio.substring(0, 120) + "..."
                        : coach.bio
                      : "Helping you achieve your fitness goals through personalized training and expert guidance."}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(coach.specialties || ["Strength Training", "Nutrition"]).map((specialty, index) => (
                      <span 
                        key={index}
                        className="bg-gray-800 text-gray-300 text-xs py-1 px-2 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(`/Coach/${coach._id}`)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded flex items-center justify-center transition duration-300"
                  >
                    View Profile
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurCoachesPage;