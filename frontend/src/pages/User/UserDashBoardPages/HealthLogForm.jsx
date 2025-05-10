import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HealthLogForm = () => {
  const [formData, setFormData] = useState({
    waterIntake: "",
    weight: "",
  });
  const [showInputModal, setShowInputModal] = useState(false);
  const [healthData, setHealthData] = useState([]);
  const [auth] = useAuth();
  const [UserId, setUserId] = useState();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(true);

  useEffect(() => {
    setUserId(auth?.user?._id);
    fetchHealthData();
  }, [auth]);

  const fetchHealthData = async () => {
    if (!auth?.token) return;
    
    try {
      setDataLoading(true);
      const response = await axios.get(`http://localhost:8000/api/healthLog/log`, {
        headers: {
          Authorization: auth?.token
        }
      });
      
      if (response.data.success) {
        // Process data for the chart
        const formattedData = response.data.data.logs.map(log => ({
          date: new Date(log.createdAt).toLocaleDateString(),
          waterIntake: log.waterIntake,
          weight: log.weight
        }));
        
        setHealthData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
      toast.error("Failed to load health data");
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Basic validation
      if (!formData.waterIntake && !formData.weight) {
        toast.error("Please fill in at least one field");
        return;
      }
      
      // Convert to numbers
      const payload = {};
      if (formData.waterIntake) payload.waterIntake = Number(formData.waterIntake);
      if (formData.weight) payload.weight = Number(formData.weight);
      
      const response = await axios.post(`http://localhost:8000/api/healthLog/log`, payload, {
        headers: {
          Authorization: auth?.token
        }
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          waterIntake: "",
          weight: "",
        });
        setShowInputModal(false);
        fetchHealthData(); // Refresh data after successful log
      }
    } catch (error) {
      console.error("Error submitting health data:", error);
      toast.error(error.response?.data?.message || "Failed to log health data");
    } finally {
      setLoading(false);
    }
  };

  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };

  // Combined modal for both water intake and weight
  const InputModal = () => {
    if (!showInputModal) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-medium mb-4">Enter Health Data</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="waterIntake">
                Water Intake (Litre)
              </label>
              <input
                type="number"
                id="waterIntake"
                name="waterIntake"
                value={formData.waterIntake}
                onChange={handleChange}
                placeholder="Enter water intake in Litre"
                className="w-full text-black p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter weight in kg"
                className="w-full text-black p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => setShowInputModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Health Tracking Dashboard</h2>
      
      <div className="mb-8 flex flex-wrap justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">Health Data Logger</h3>
          <button
            onClick={() => setShowInputModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Log Health Data
          </button>
        </div>
        
        <div>
          <button
            onClick={toggleGraph}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition"
          >
            {showGraph ? "Hide Graph" : "Show Graph"}
          </button>
        </div>
      </div>
      
      {showGraph && (
        <div className="bg-black p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Health Trends</h3>
          {dataLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p>Loading data...</p>
            </div>
          ) : healthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={healthData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="waterIntake"
                  name="Water Intake (Litre)"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p>No health data available. Start logging to see your trends!</p>
            </div>
          )}
        </div>
      )}
      
      {/* Modal Component */}
      <InputModal />
    </div>
  );
};

export default HealthLogForm;