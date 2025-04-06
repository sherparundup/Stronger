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
      const token = localStorage.getItem('googleFitToken');
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
  
      const res = await axios.get("http://localhost:8000/api/googleFit/steps", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const buckets = res.data.data.bucket || [];
      const fallbackStart = new Date(Date.now() - buckets.length * 24 * 60 * 60 * 1000);
      const monthlySteps = {};
  
      buckets.forEach((bucket, index) => {
        let totalSteps = 0;
        let date = "";
        let timestamp = bucket.startTimeMillis
          ? parseInt(bucket.startTimeMillis)
          : fallbackStart.getTime() + index * 24 * 60 * 60 * 1000;
  
        const day = new Date(timestamp);
        const monthYearKey = `${day.toLocaleString("default", { month: "long" })} ${day.getFullYear()}`;
        const formattedDay = `${day.getDate()}`;
  
        // Count steps
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
  
        // Initialize month group if not present
        if (!monthlySteps[monthYearKey]) {
          monthlySteps[monthYearKey] = [];
        }
  
        monthlySteps[monthYearKey].push({
          day: formattedDay,
          steps: totalSteps,
        });
      });
  
      console.log("Steps by Month:", monthlySteps);
      setDailySteps(monthlySteps); // Now this is an object with month as keys
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
  {Object.keys(dailySteps).length > 0 ? (
    Object.entries(dailySteps).map(([month, entries]) => (
      <li key={month} className="mb-4">
        <h3 className="font-bold text-lg">{month}</h3>
        <ul className="ml-4">
          {entries.map((entry, index) => (
            <li key={index}>
              {entry.day}: <strong>{entry.steps}</strong> steps
            </li>
          ))}
        </ul>
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
