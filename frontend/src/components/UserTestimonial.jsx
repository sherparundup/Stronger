import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment"; // To format timestamps

const UserTestimonial = ({product}) => {
  const [userTestimonial, setUserTestimonial] = useState([]);


  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/UserTestimonial/getTestomonialById/${product._id}`
        );
        console.log(res.data.data);
        setUserTestimonial(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTestimonial();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Customer Testimonials</h2>
      
      {userTestimonial.length > 0 ? (
        <div className="flex flex-col space-y-6">
          {userTestimonial.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-wrap items-start space-x-4"
            >
              {/* Profile Picture */}
              <img
                src={testimonial.user?.image?.url || `https://via.placeholder.com/50`}
                alt={testimonial.user?.name || "User"}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Testimonial Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{testimonial.user?.name || "Anonymous"}</h3>
                  <span className="text-gray-400 text-sm">
                    {moment(testimonial.createdAt).fromNow()}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="flex text-yellow-400 text-sm mt-1">
                  {"⭐".repeat(testimonial.rating || 5)}
                </div>

                <p className="text-gray-600 mt-2 break-words">{testimonial.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No testimonials yet.</p>
      )}
    </div>
  );
};

export default UserTestimonial;
