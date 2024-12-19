import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Spinner = () => {
  const [loading, setLoading] = useState(true); // Initial loading state
  const [timer, setTimer] = useState(5)
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 3 seconds
      navigate('/login'); // Redirect to /login
    }, 5000);
    const interval = setInterval(() => {
      setTimer((ok)=>ok-1)
    }, 1000)

    // Cleanup timeout to avoid memory leaks
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);
  return (
    <>
    <h1>not authorised</h1>
      <div className="flex items-center justify-center h-screen">
        {loading && (
          <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin">

          </div>
        )}

        <h1>redirecting to login in {timer} seconds</h1>
      </div>
    </>
  );
};

export default Spinner;
