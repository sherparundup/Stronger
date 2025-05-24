import React, { useEffect, useState } from 'react'
import axios from "axios";
import DonutPieChart from "../../../components/admin.component/donutPieChart"
import RevenueChart from '../../../components/admin.component/revenuechart'
import BarChartComponent from '../../../components/admin.component/barchart'
import StarRating from "../../../components/RatingStar";

const dashboardPages = () => {
  const [topCoaches, setTopCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCoaches = async () => {
      try {
        setLoading(true);
        
        // Fetch coaches
        const coachesRes = await axios.get("http://localhost:8000/api/coach/viewCoaches");
        const coaches = coachesRes.data.data;
        
        // Fetch ratings
        const ratingsRes = await axios.get("http://localhost:8000/api/coach/coachRating");
        const ratings = ratingsRes.data.data;
        
        // Calculate average ratings for each coach
        const coachRatings = {};
        ratings.forEach(rating => {
          if (!coachRatings[rating.coach]) {
            coachRatings[rating.coach] = {
              totalRating: 0,
              count: 0
            };
          }
          coachRatings[rating.coach].totalRating += rating.rating;
          coachRatings[rating.coach].count += 1;
        });
        
        // Calculate averages and attach to coaches
        const coachesWithRatings = coaches.map(coach => {
          const ratingData = coachRatings[coach._id];
          const averageRating = ratingData 
            ? parseFloat((ratingData.totalRating / ratingData.count).toFixed(1))
            : 0;
          
          return {
            ...coach,
            averageRating,
            reviewCount: ratingData ? ratingData.count : 0
          };
        });
        
        // Sort by rating (highest first) and get top 3
        const sortedCoaches = coachesWithRatings
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 3);
        
        setTopCoaches(sortedCoaches);
      } catch (error) {
        console.error("Error fetching top coaches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCoaches();
  }, []);

  return (
    <div className="p-4">
      <div className="min-h-screen flex-col">
        {/* Dashboard Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Analytics and key metrics</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - 2/3 width */}
          <div className="flex-col w-full md:w-2/3 space-y-6">
            {/* Donut Chart Card */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <h2 className="text-lg font-semibold mb-3">Distribution Analysis</h2>
              <div className="flex-col justify-center h-64">
                <DonutPieChart />  
              </div>
            </div>
            
            {/* Bar Chart Card */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <h2 className="text-lg font-semibold mb-3">Performance Metrics</h2>
              <div className="flex-col justify-center h-64">
                <BarChartComponent />  
              </div>
            </div>
          </div>
          
          {/* Right side - 1/3 width */}
          <div className="flex w-full md:w-1/3">
            <div className="flex-col justify-center w-full space-y-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <h2 className="text-lg font-semibold mb-3">Revenue Overview</h2>
                <RevenueChart />
              </div>
              
              {/* Top 3 Coaches */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Top Rated Coaches</h2>
                
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                ) : topCoaches.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No coaches available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topCoaches.map((coach, index) => (
                      <div 
                        key={coach._id} 
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Rank Badge */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3
                          ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}`}>
                          {index + 1}
                        </div>
                        
                        {/* Coach Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            {/* Profile Image */}
                            <img
                              src={coach?.user?.image?.url || "https://via.placeholder.com/40"}
                              alt={coach.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                            />
                            
                            {/* Name and Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {coach.name}
                              </h3>
                              <p className="text-xs text-gray-500 truncate">
                                {coach.category}
                              </p>
                              
                              {/* Rating */}
                              <div className="flex items-center gap-1 mt-1">
                                <StarRating 
                                  rating={coach.averageRating} 
                                  readOnly={true}
                                  size="small"
                                />
                                <span className="text-xs text-gray-600">
                                  {coach.averageRating > 0 ? coach.averageRating : 'No ratings'}
                                  {coach.reviewCount > 0 && (
                                    <span className="ml-1">({coach.reviewCount})</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* View All Button */}
                {!loading && topCoaches.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      View All Coaches
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dashboardPages