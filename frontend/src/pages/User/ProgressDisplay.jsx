import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';

export default function TransformationPage() {
  const [auth] = useAuth();
  const [transformations, setTransformations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAllTransformations = async () => {
      try {
        setLoading(true);
        // Fetch from backend
        const response = await axios.get(
          `http://localhost:8000/api/User/getAllTransformations`
        );
        
        // Check if data exists and is an array
        const { data } = response.data;
        console.log("Fetched transformations:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setTransformations(data);
        } else {
          setError("No transformations found");
        }
      } catch (error) {
        console.error('Error fetching transformations:', error.message);
        setError("Failed to load transformations");
      } finally {
        setLoading(false);
      }
    };

    
      getAllTransformations();
    
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate weight change safely
  const calculateWeightChange = (transformation) => {
    if (!transformation) return "0 kg";
    const change = transformation.weightAfter - transformation.weightBefore;
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change} kg`;
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : transformations.length - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex < transformations.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-white">Loading transformations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-300">{error}</p>
      </div>
    );
  }

  // Handle empty transformations array
  if (transformations.length === 0) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-white">No transformations available</p>
      </div>
    );
  }

  const currentTransformation = transformations[currentIndex];

  return (
    <div className="bg-black min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-md shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-black px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white capitalize">
              {currentTransformation.title}
            </h1>
            <div className="text-gray-300 font-mono">
              <span>{currentIndex + 1} / {transformations.length}</span>
            </div>
          </div>
          <p className="text-gray-400 mt-1">{currentTransformation.caption}</p>
        </div>

        {/* Before / After */}
        <div className="flex flex-col md:flex-row">
          {/* BEFORE */}
          <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-black text-center mb-2">BEFORE</h2>
            <p className="text-gray-600 text-center mb-6 font-mono">
              {currentTransformation.weightBefore} kg
            </p>
            <div className="rounded-md overflow-hidden bg-gray-100 aspect-w-3 aspect-h-4 border border-gray-200">
              <img
                src={currentTransformation.beforeImage}
                alt="Before"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* AFTER */}
          <div className="flex-1 p-8 bg-white">
            <h2 className="text-xl font-bold text-black text-center mb-2">AFTER</h2>
            <p className="text-gray-600 text-center mb-6 font-mono">
              {currentTransformation.weightAfter} kg
            </p>
            <div className="rounded-md overflow-hidden bg-gray-100 aspect-w-3 aspect-h-4 border border-gray-200">
              <img
                src={currentTransformation.afterImage}
                alt="After"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <span className="font-bold text-gray-800">Weight Change:</span>
              <span className={`font-mono ml-2 ${(currentTransformation.weightAfter - currentTransformation.weightBefore) >= 0 ? 'text-black' : 'text-black'}`}>
                {calculateWeightChange(currentTransformation)}
              </span>
            </div>
            <div>
              <span className="font-bold text-gray-800">Duration:</span>
              <span className="ml-2 font-mono">{currentTransformation.timePeriod}</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">Date:</span>
              <span className="ml-2 font-mono">{formatDate(currentTransformation.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="px-8 py-6 flex justify-between bg-white border-t border-gray-200">
          <button
            onClick={goToPrevious}
            className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-md flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          <button
            onClick={goToNext}
            className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-md flex items-center transition-colors"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}