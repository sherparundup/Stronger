import React, { useState } from "react";

const BMRCalculator = () => {
  const [formData, setFormData] = useState({
    gender: "male",
    weight: "",
    height: "",
    age: ""
  });

  const [bmr, setBmr] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBMR = (e) => {
    e.preventDefault();
    const { gender, weight, height, age } = formData;

    if (!weight || !height || !age) {
      alert("Please fill in all fields");
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    let result = 0;
    if (gender === "male") {
      result = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      result = 10 * w + 6.25 * h - 5 * a - 161;
    }

    setBmr(Math.round(result));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          🎯 BMR Calculator
        </h2>

        <form onSubmit={calculateBMR} className="space-y-5">
          {/* Gender */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Gender:
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Weight (kg):
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              step="0.1"
              required
            />
          </div>

          {/* Height */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Height (cm):
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-black font-semibold py-2 rounded-lg"
          >
            Calculate BMR
          </button>
        </form>

        {/* Result */}
        {bmr !== null && (
          <div className="mt-6 text-center text-xl font-bold text-green-700">
            🔥 Your BMR is <span className="text-black">{bmr}</span> calories/day
          </div>
        )}
      </div>
    </div>
  );
};

export default BMRCalculator;
