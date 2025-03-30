import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Steps = () => {
  const [dailySteps, setDailySteps] = useState([]);
  const [isGoogleFitAuthorized, setIsGoogleFitAuthorized] = useState(
    !!localStorage.getItem("googleFitToken")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Received token:", token);
      localStorage.setItem("googleFitToken", token);
      setIsGoogleFitAuthorized(true);
      navigate("/dashboard");
    }
    getDailySteps()
  }, [navigate]);

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    // Format the date like "March 4"
    const options = { month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getDailySteps = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('googleFitToken');
  
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
  
      const res = await axios.get("http://localhost:8000/api/googleFit/steps", {
        headers: {
          Authorization: `Bearer ${token}`, // Correct way to send token in Authorization header
        },
      });
  
      // Assuming the bucket data is inside res.data.data.bucket
      const buckets = res.data.data.bucket || [];
      let stepsByDay = [];
  
      // Calculate fallback start date: assume the first bucket corresponds to (buckets.length days ago)
      const fallbackStart = new Date(Date.now() - buckets.length * 24 * 60 * 60 * 1000);
  
      buckets.forEach((bucket, index) => {
        let totalSteps = 0;
        let date = "";
        // If bucket.startTimeMillis exists, use it
        if (bucket.startTimeMillis) {
          date = formatDate(bucket.startTimeMillis);
        } else {
          // Otherwise, calculate a fallback date from fallbackStart plus the bucket index
          const fallbackTimestamp = fallbackStart.getTime() + index * 24 * 60 * 60 * 1000;
          date = formatDate(fallbackTimestamp);
        }
  
        if (bucket.dataset && bucket.dataset.length > 0) {
          bucket.dataset.forEach((dataset) => {
            if (dataset.point && dataset.point.length > 0) {
              dataset.point.forEach((point) => {
                if (point.value && point.value.length > 0) {
                  totalSteps += point.value[0].intVal || 0;
                }
              });
            }
          });
        }
        stepsByDay.push({ date, steps: totalSteps });
      });
  
      console.log("Daily Steps:", stepsByDay);
      setDailySteps(stepsByDay);
    } catch (error) {
      console.error("Error fetching steps:", error);
    }
  };
  

  const getGoogleFit = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/googleFit");
      const googleFitUrl = res.data.data;
      window.location.href = googleFitUrl;
    } catch (error) {
      console.log("Error fetching Google Fit URL:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("googleFitToken");
    setIsGoogleFitAuthorized(false);
    setDailySteps([]);
  };

  return (
    <div className="p-4">
      {isGoogleFitAuthorized ? (
        <div>
          <h2 className="text-xl font-bold">Authorized</h2>
          <button onClick={getDailySteps} className="border border-black p-2 m-2">
            Fetch Daily Steps
          </button>
          <ul className="mt-2">
            {dailySteps.length > 0 ? (
              dailySteps.map((entry, index) => (
                <li key={index} className="p-1">
                  <strong>{entry.date}</strong>: <strong>{entry.steps}</strong> steps
                </li>
              ))
            ) : (
              <p>No step data available</p>
            )}
          </ul>
          <button onClick={handleLogout} className="border border-red-500 p-2 mt-4">
            Logout
          </button>
        </div>
      ) : (
        <button className="border border-black p-2" onClick={getGoogleFit}>
          Connect Google Fit
        </button>
      )}
    </div>
  );
};

export default Steps;
