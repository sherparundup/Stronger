import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

function RevenueBarChart() {
  // State to hold the aggregated revenue amounts
  const [membershipRevenue, setMembershipRevenue] = useState(0);
  const [productRevenue, setProductRevenue] = useState(0);
  // State to toggle active chart view
  const [activeChart, setActiveChart] = useState("membership");

  // Fetch revenue data from the API endpoints
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Fetch membership revenue data
        const resMembers = await axios.get("http://localhost:8000/api/membership/getActiveUserMembers");
        // Example membership JSON includes fields like "price" and "purchasedDate"
        const totalMembership = resMembers.data.data.reduce((acc, curr) => acc + curr.price, 0);
        setMembershipRevenue(totalMembership);

        // Fetch product revenue data
        const resProducts = await axios.get("http://localhost:8000/api/product/getAllBoughtProduct");
        // Example product JSON includes "totalPrice" and "purchasedDate"
        const totalProduct = resProducts.data.data.reduce((acc, curr) => acc + curr.totalPrice, 0);
        setProductRevenue(totalProduct);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  const totalRevenue = membershipRevenue + productRevenue;

  // Build the chart data array for Recharts
  const chartData = [
    { name: "Membership Revenue", value: membershipRevenue },
    { name: "Product Revenue", value: productRevenue },
  ];

  // Configuration for each revenue type
  const chartConfig = {
    membership: {
      label: "Membership Revenue",
      color: "#3498db",
    },
    product: {
      label: "Product Revenue",
      color: "#e74c3c",
    },
  };

  return (
    <div className="border p-6 rounded-lg shadow-md">
      {/* Header with title, description, and toggle buttons */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Revenue Bar Chart - Interactive</h3>
          <p className="text-sm text-gray-500">Comparing membership and product revenue</p>
        </div>
        <div className="flex">
          {["membership", "product"].map((key) => (
            <button
              key={key}
              onClick={() => setActiveChart(key)}
              className={`flex-1 p-4 text-left border-t sm:border-l sm:border-t-0 ${activeChart === key ? "bg-gray-200" : ""}`}
            >
              <span className="text-xs text-gray-500">{chartConfig[key].label}</span>
              <span className="text-lg font-semibold">
                {key === "membership"
                  ? membershipRevenue.toLocaleString()
                  : productRevenue.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="pt-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="value" fill={chartConfig[activeChart].color} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total Revenue display */}
      <div className="pt-4 text-center">
        <p className="text-sm text-gray-500">Total Revenue: {totalRevenue.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default RevenueBarChart;
