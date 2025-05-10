import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const About = () => {
  const [verifiedCoaches, setVerifiedCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate =useNavigate();
  useEffect(() => {
    const fetchVerifiedCoaches = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/coach/viewCoaches");
        setVerifiedCoaches(res.data.data);
      } catch (error) {
        console.error("Error fetching coaches:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedCoaches();
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight">About Us</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Mission Statement */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 pb-2 border-b-2 border-black inline-block">Our Mission</h2>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl">
            We believe in providing high-quality products that enhance your everyday life. Our commitment to excellence drives us to source only the finest materials and partner with the most skilled craftspeople.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-100 p-8">
            <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
            <p className="text-base leading-relaxed mb-4">
              Founded in 2018, our company began with a simple vision: to create products that combine functionality with beautiful design. What started as a small operation in a garage has grown into a thriving business with customers worldwide.
            </p>
            <p className="text-base leading-relaxed">
              Through dedication to our craft and an unwavering commitment to customer satisfaction, we've built a reputation for excellence in our industry.
            </p>
          </div>
          <div className="flex items-center justify-center bg-black">
            <p className="text-white text-3xl md:text-4xl font-light italic px-8 py-12 text-center">
              "Quality is not an act, it is a habit."
            </p>
          </div>
        </div>

        {/* Team Section */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 pb-2 border-b-2 border-black inline-block">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {loading ? (
            <p>Loading coaches...</p>
          ) : (
            verifiedCoaches.map((coach, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:bg-gray-50">
                <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 overflow-hidden">
                  <img
                    src={coach.user.image.url}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{coach.name}</h3>
                <p className="text-gray-600 italic mb-4">{coach.category}</p>
                <p className="text-sm">{coach.bio}</p>
                <a
                  href={coach.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 mt-4"
                >
                  Instagram
                </a>
              </div>
            ))
          )}
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 pb-2 border-b-2 border-black inline-block">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Values */}
            {[{ title: 'Quality', description: 'We never compromise on the quality of our products.' },
              { title: 'Innovation', description: 'We constantly seek new ways to improve.' },
              { title: 'Sustainability', description: 'We are committed to reducing our environmental impact.' }]
              .map((value, index) => (
                <div key={index} className="p-6 border border-gray-200 hover:border-black transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-black text-white p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Become a member</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            We're excited to share our home with you and become a part of your everyday life.
          </p>
          <button className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors duration-300 font-medium text-lg"
          onClick={()=>navigate("/Membership")}>
           just do it
          </button>
        </div>
      </div>

      {/* Contact Banner */}
      {/* <div className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">Questions? We're here to help.</h3>
          <p className="mb-6">Reach out to our customer support team.</p>
          <div className="flex justify-center gap-6">
            <a href="mailto:info@company.com" className="inline-block px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors duration-300">
              Email Us
            </a>
            <a href="tel:+1234567890" className="inline-block px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors duration-300">
              Call Us
            </a>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default About;
