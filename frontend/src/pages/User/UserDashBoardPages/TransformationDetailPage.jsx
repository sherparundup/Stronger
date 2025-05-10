import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BeforeAfterSlider from './BeforeAfterSlider'; // Your slider component
import { Loader } from 'lucide-react'; // For loading state

const   TransformationDetailPage = () => {
  const { id } = useParams(); // Get transformation ID from URL params
  const [transformation, setTransformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransformation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/transformations/${id}`);
        setTransformation(response.data.data); // Assuming data is wrapped in 'data' property
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transformation:', err);
        setError(err.response?.data?.message || 'Failed to load transformation');
        setLoading(false);
      }
    };

    fetchTransformation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <Loader className="animate-spin h-10 w-10 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-700">Loading transformation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!transformation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Pass the transformation data to your slider component */}
      <BeforeAfterSlider transformationData={transformation} />
      
      {/* Additional information can be added below the slider */}
      <div className="max-w-4xl mx-auto p-6">
        {/* User information */}
        <div className="flex items-center space-x-3 mb-6">
          {transformation.user?.avatar && (
            <img 
              src={transformation.user.avatar} 
              alt={transformation.user.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium">{transformation.user?.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">
              {new Date(transformation.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Coach information if available */}
        {transformation.coach && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Coach</h3>
            <div className="flex items-center space-x-3">
              {transformation.coach.avatar && (
                <img 
                  src={transformation.coach.avatar} 
                  alt={transformation.coach.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{transformation.coach.name}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Comments section could be added here */}
        {/* Like button and other interactions could be added here */}
      </div>
    </div>
  );
};

export default TransformationDetailPage;