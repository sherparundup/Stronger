import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/layout/Layout";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("user"); // Default to 'user'
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("contactNumber", contactNumber);
      if (image) {
        formData.append("image", image); // Append the image file
      }
  
      const res = await axios.post("http://localhost:8000/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success("Successfully signed up!");
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again!");
    }
  };
  

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
            Sign Up as {role === "user" ? "User" : "Coach"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input type="text" id="name" placeholder="Enter your name" className="mt-1 w-full p-2.5 border rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input type="email" id="email" placeholder="Enter your email" className="mt-1 w-full p-2.5 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input type="password" id="password" placeholder="Enter your password" className="mt-1 w-full p-2.5 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* Contact Number Input */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number
              </label>
              <input type="text" id="contactNumber" placeholder="Enter your contact number" className="mt-1 w-full p-2.5 border rounded-lg" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Profile Image
              </label>
              <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="mt-1 w-full p-2.5 border rounded-lg" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 rounded-full object-cover" />}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg">
              Sign Up
            </button>

            {/* Role Switch */}
            <div className="flex justify-center space-x-4 mt-4">
              <button type="button" onClick={() => setRole("user")} className={`py-2 px-4 rounded-lg ${role === "user" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}>
                Sign up as User
              </button>
              <button type="button" onClick={() => setRole("coach")} className={`py-2 px-4 rounded-lg ${role === "coach" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}>
                Sign up as Coach
              </button>
            </div>

            {/* Redirect to Sign In */}
            <p className="text-sm text-gray-500 text-center">
              Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;