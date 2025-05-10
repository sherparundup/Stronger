import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../../../Context/AuthContext"; // assuming you have authentication context

const AddProgress = () => {
  const [auth] = useAuth();
  const [verifiedCoaches, setVerifiedCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    caption: '',
    date: '',
    weightBefore: '',
    weightAfter: '',
    timePeriod: '',
    user: auth?.user?._id,
    coach: '' // Added coach field to store the selected coach ID
  });
  
  const [images, setImages] = useState({
    before: null,
    after: null
  });
  
  const [previews, setPreviews] = useState({
    before: null,
    after: null
  });

  useEffect(() => {
    const fetchVerifiedCoaches = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/coach/viewCoaches"
        );
        setVerifiedCoaches(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    
    fetchVerifiedCoaches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages(prev => ({ ...prev, [type]: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [type]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images.before || !images.after) {
      return alert('Both Before and After images are required.');
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append('beforeImage', images.before);
    formData.append('afterImage', images.after);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/User/createTransformation",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      alert('Transformation added successfully!');
    } catch (err) {
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Share Your Progress</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            className="text-black w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Caption */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Caption</label>
          <textarea
            name="caption"
            value={form.caption}
            onChange={handleInputChange}
            rows="3"
            className="w-full border text-black border-gray-300 rounded-md px-3 py-2"
            required
          ></textarea>
        </div>
        
        {/* Coach Dropdown */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Select Coach (Optional)</label>
          <select
            name="coach"
            value={form.coach}
            onChange={handleInputChange}
            className="text-black w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">No Coach Selected</option>
            {verifiedCoaches && verifiedCoaches.map((coach) => (
              <option key={coach._id} value={coach._id}>
                {coach.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            className="text-black w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Image Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Before Image */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Before Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'before')}
              required
              className="text-black w-full"
            />
            {previews.before && (
              <img
                src={previews.before}
                alt="Before preview"
                className="mt-2 h-40 w-full object-cover rounded-md"
              />
            )}
          </div>

          {/* After Image */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">After Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'after')}
              required
              className="text-black w-full"
            />
            {previews.after && (
              <img
                src={previews.after}
                alt="After preview"
                className="mt-2 h-40 w-full object-cover rounded-md"
              />
            )}
          </div>
        </div>

        {/* Weight Before & After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Weight Before</label>
            <input
              type="number"
              name="weightBefore"
              value={form.weightBefore}
              onChange={handleInputChange}
              step="0.1"
              className="text-black w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Weight After</label>
            <input
              type="number"
              name="weightAfter"
              value={form.weightAfter}
              onChange={handleInputChange}
              step="0.1"
              className="text-black w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Time Period */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Time Period (days/weeks/months)</label>
          <input
            type="text"
            name="timePeriod"
            value={form.timePeriod}
            onChange={handleInputChange}
            className="text-black w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., 3 months"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {loading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProgress;