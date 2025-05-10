import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCoachContext } from "../../../Context/coachContext";
import toast from "react-hot-toast";

const CoachingPlans = () => {
  const [coachingPlans, setCoachingPlans] = useState([]);
  const [coach] = useCoachContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationInWeeks: "",
    price: "",
    type: "general",
    targetAudience: "beginner",
    image: null,
    pdf: null,
  });

  useEffect(() => {
    const fetchCoachingPlans = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/coach/getCoachingPlans/${coach._id}`
        );
        if (Array.isArray(response.data.data)) {
          setCoachingPlans(response.data.data);
        } else {
          throw new Error("Data is not in the expected format");
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchCoachingPlans();
  }, [coach._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Store the first selected file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/coach/createCoachingPlan/${coach._id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      if (response.data.success) {
        setCoachingPlans((prevPlans) => [...prevPlans, response.data.data]);
        setShowForm(false); // Hide form after submission
        setFormData({
          title: "",
          description: "",
          durationInWeeks: "",
          price: "",
          type: "general",
          targetAudience: "beginner",
          image: null,
          pdf: null,
        });
        toast.success(response.data.message || "Uploaded successfully");
      }
    } catch (err) {
      console.error("Error creating coaching plan:", err);
      toast.error("Unable to create coaching plan.");
    }
  };

  if (loading) {
    return <div className="text-center text-2xl text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-4xl font-semibold text-center mb-6">Coaching Plans</h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-white text-black rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          {showForm ? "Cancel" : "Create Coaching Plan"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="max-w-xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl space-y-6"
        >
          <div>
            <label className="block text-lg font-medium text-white">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-white">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-white">
              Duration (in weeks)
            </label>
            <input
              type="number"
              name="durationInWeeks"
              value={formData.durationInWeeks}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-white">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-white">Coaching Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="bulking">Bulking</option>
              <option value="cutting">Cutting</option>
              <option value="strength">Strength</option>
              <option value="general">General</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-white">
              Target Audience
            </label>
            <select
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleInputChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-white">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-2 w-full text-sm text-white file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-indigo-100"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-white">Upload PDF</label>
            <input
              type="file"
              name="pdf"
              onChange={handleFileChange}
              className="mt-2 w-full text-sm text-white file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-indigo-100"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-white text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            Create Plan
          </button>
        </form>
      )}

      <div className="coaching-plans-list mt-8">
        {coachingPlans && coachingPlans.length > 0 ? (
          coachingPlans.map((plan) => (
            <div
              key={plan._id}
              className="coaching-plan bg-black p-6 rounded-lg shadow-md mb-6"
            >
              <h2 className="text-2xl font-semibold text-white">
                {plan.title}
              </h2>
              <p className="mt-2 text-white">{plan.description}</p>
              <p className="mt-2 text-white">
                Duration: {plan.durationInWeeks} weeks
              </p>
              <p className="mt-2 text-white">Price: rs {plan.price}</p>
              <p className="mt-2 text-white">
                Target Audience: {plan.targetAudience}
              </p>
              <p className="mt-2 text-white">Type: {plan.type}</p>
              {plan.image?.url && (
                <img
                  src={plan.image?.url}
                  alt={plan.title}
                  className="mt-4 w-40 h-40 object-cover rounded-lg"
                />
              )}
              {plan.pdf?.url && (
                <a
                  href={plan.pdf?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-white hover:underline"
                >
                  Download PDF
                </a>
              )}
            </div>
          ))
        ) : (
          <p>No coaching plans available.</p>
        )}
      </div>
    </div>
  );
};

export default CoachingPlans;
