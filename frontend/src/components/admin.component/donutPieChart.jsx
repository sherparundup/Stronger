import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Label, Tooltip, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFA", "#FF6384", "#36A2EB"];

const PieChartComponent = () => {
  const [chartDataMember, setChartDataMember] = useState([]);
  const [chartDataProduct, setChartDataProduct] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/membership/getActiveUserMembers");
        const transformedData = res.data.data.reduce((acc, curr) => {
          const existing = acc.find(item => item.duration === curr.duration);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({ duration: curr.duration, count: 1 });
          }
          return acc;
        }, []);
        setChartDataMember(transformedData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/product/getAllBoughtProduct");
        const transformedData = res.data.data.reduce((acc, curr) => {
          const existing = acc.find(item => item.productName === curr.productName);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({ productName: curr.productName, count: 1 });
          }
          return acc;
        }, []);
        setChartDataProduct(transformedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMembers();
    fetchProducts();
  }, []);

  const totalMembers = useMemo(() => chartDataMember.reduce((acc, curr) => acc + curr.count, 0), [chartDataMember]);
  const totalProducts = useMemo(() => chartDataProduct.reduce((acc, curr) => acc + curr.count, 0), [chartDataProduct]);

  return (
    <div className="flex flex-wrap justify-center gap-10 bg-white p-8 rounded-lg shadow-lg">
      {[{
        title: "Membership Duration Distribution",
        data: chartDataMember,
        nameKey: "duration",
        total: totalMembers,
        label: "Members"
      }, {
        title: "Product Purchase Distribution",
        data: chartDataProduct,
        nameKey: "productName",
        total: totalProducts,
        label: "Products"
      }].map(({ title, data, nameKey, total, label }, index) => (
        <div key={index} className="flex flex-col items-center w-80 p-4 bg-gray-100 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="w-60 h-60 flex justify-center items-center">
            <PieChart width={250} height={250}>
              <Tooltip />
              <Pie data={data} dataKey="count" nameKey={nameKey} innerRadius={60} outerRadius={80} strokeWidth={2}>
                {data.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
                <Label content={({ viewBox }) => (
                  viewBox?.cx && viewBox?.cy ? (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan className="text-2xl font-bold">{total}</tspan>
                      <tspan x={viewBox.cx} y={viewBox.cy + 20} className="text-gray-500">{label}</tspan>
                    </text>
                  ) : null
                )} />
              </Pie>
            </PieChart>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PieChartComponent;
