import React, { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart, Tooltip } from "recharts";

const RevenueChart = () => {
  const [membershipRevenue, setMembershipRevenue] = useState(0);
  const [productRevenue, setProductRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Fetch membership revenue data
        const resMembers = await axios.get("http://localhost:8000/api/membership/getActiveUserMembers");
        const totalMembershipRevenue = resMembers.data.data.reduce(
          (acc, curr) => acc + curr.price,
          0
        );
        setMembershipRevenue(totalMembershipRevenue);

        // Fetch product revenue data
        const resProducts = await axios.get("http://localhost:8000/api/product/getAllBoughtProduct");
        const totalProductRevenue = resProducts.data.data.reduce(
          (acc, curr) => acc + curr.totalPrice,
          0
        );
        setProductRevenue(totalProductRevenue);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRevenueData();
  }, []);

  const totalRevenue = membershipRevenue + productRevenue;

  const chartData = [
    { name: "Membership Revenue", value: membershipRevenue, fill: "#3498db" },
    { name: "Product Revenue", value: productRevenue, fill: "#e74c3c" },
  ];

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-md" style={{ maxWidth: "400px", margin: "auto" }}>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Revenue Chart</h2>
        <p className="text-gray-500">Membership & Product Sales</p>
      </div>
      <div className="flex justify-center items-center my-4">
        <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={130} width={300} height={200}>
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && viewBox.cx && viewBox.cy) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 16}
                        style={{ fontSize: "1.5rem", fontWeight: "700" }}
                      >
                    rs{totalRevenue.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        style={{ fill: "#6b7280" }}
                      >
                        Total Revenue
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </PolarRadiusAxis>
          <Tooltip cursor={false} formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
          <RadialBar dataKey="value" cornerRadius={5} className="stroke-transparent stroke-2" />
        </RadialBarChart>
      </div>
      <div className="flex flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <p className="text-gray-500">Revenue from memberships & product sales</p>
      </div>
    </div>
  );
};

export default RevenueChart;
