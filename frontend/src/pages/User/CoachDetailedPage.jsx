import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react"; // Added missing import
import CalenderToHireCoach from "../../components/coach.component/CalenderToHireCoach";
import StarRating from "../../components/RatingStar";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import ProgressDisplay from "./ProgressDisplay";

const CoachDetailedPage = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState();
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [coachPlans, setCoachPlans] = useState([]);
  const [rating, setRating] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState("");
  const [sessionYesOrNo, setsessionYesOrNo] = useState(false);
  const [auth] = useAuth();

  // Added missing formatPrice function
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const buy = async (coachingPlanId, totalPrice, coachId) => {
    try {
      if (!auth.user._id) {
        toast.error("please log in first");
      }
      const UserId = auth.user._id;
      console.log(coachingPlanId, totalPrice, coachId, UserId);
      console.log("hiiiiiisssssssss");
      const res = await axios.post(
        "http://localhost:8000/api/Payment/InitializeEsewaForCoachPlan",
        { coachingPlanId, coachId, totalPrice, UserId },
        {
          headers: { Authorization: auth?.token },
        }
      );
      const signature = res.data.payment.signature;
      const signed_field_names = res.data.payment.signed_field_names;
      const transaction_uuid = res.data.purchasedCoachingPlanData._id;
      if (res.data.success) {
        // Dynamically create a form element
        console.log("hiiiiiiiiiiiiiiiiii")
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        // Create hidden inputs for all required fields
        const fields = [
          { name: "amount", value: totalPrice },
          { name: "tax_amount", value: "0" },
          { name: "total_amount", value: totalPrice },
          { name: "transaction_uuid", value: transaction_uuid },
          { name: "product_code", value: "EPAYTEST" },
          { name: "product_service_charge", value: "0" },
          { name: "product_delivery_charge", value: "0" },
          {
            name: "success_url",
            value: `http://localhost:8000/api/Payment/completePaymentForCoachPlan/${coachingPlanId}`,
          },
          { name: "failure_url", value: "http://localhost:5173/" },
          { name: "signed_field_names", value: signed_field_names },
          { name: "signature", value: signature },
        ];

        fields.forEach((field) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = field.name;
          input.value = field.value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      }      

    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    const fetchingCoachesPlan = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/getCoachingPlans/${id}`
        );
        setCoachPlans(res.data.data);
        console.log(res.data.data, "hiiiiiiii");
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchingCoach = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/SpecifiedCoach/${id}`
        );
        setCoach(res.data.data);
        // Fetch testimonials for this coach
        const testimonialsRes = await axios.get(
          `http://localhost:8000/api/coach/testimonials/${id}`
        );
        setTestimonials(testimonialsRes.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    const checkUserSessionWithCoach = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/coach/checkIfSession",
          {
            coachId: id,
            userId: auth?.user?._id,
          }
        );
        if (response?.data?.hasSession) {
          setsessionYesOrNo(true);
        }
        console.log(response);
      } catch (error) {
        console.error("Error checking session with coach:", error);
        return {
          success: false,
          message: "Error checking session with coach",
          error: error.response?.data?.message || error.message,
        };
      }
    };

    fetchingCoach();
    checkUserSessionWithCoach();
    fetchingCoachesPlan();
  }, [id, auth?.user?._id]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    console.log("Received rating from StarRating component:", newRating);
  };

  const submitTestimonial = async (coachId, userId, rating, message) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/coach/coachTestimonial",
        {
          coachId,
          userId,
          rating,
          message,
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        // Fetch updated testimonials
        const testimonialsRes = await axios.get(
          `http://localhost:8000/api/coach/testimonials/${id}`
        );
        setTestimonials(testimonialsRes.data.data);
        setNewTestimonial(""); // Clear the input
        return response.data;
      } else {
        console.log("Failed to submit testimonial:", response.data);
        toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error.message);
      toast.error("Failed to submit testimonial");
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Nav with animated border */}
      <nav className="bg-black z-50 shadow-[0_2px_10px_rgba(255,0,0,0.4)] border-b border-b-white/10 transition-all duration-500 ease-in-out">
        <div className="px-10 py-4 text-white text-xl font-bold tracking-widest">
          COACH PROFILE
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row w-full">
        {/* Left Info */}
        <motion.div
          className="flex-col w-full lg:w-1/2 px-6 lg:pl-[100px] pt-[50px] lg:pt-[100px]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
            About Me
          </h1>

          <motion.p
            className="text-white mt-5 text-xl lg:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {coach?.bio}
          </motion.p>

          <p className="text-white mt-5 text-xl lg:text-2xl">
            I specialize in{" "}
            <span className="text-red-400 font-semibold">
              {coach?.category}
            </span>
          </p>

          <p className="text-white mt-5 text-xl lg:text-2xl">
            - <span className="text-pink-400 font-bold">{coach?.name}</span>
          </p>
        </motion.div>

        {/* Image Side */}
        <motion.div
          className="flex justify-center w-full lg:w-1/2 px-6 lg:pl-[100px] pt-[30px] lg:pt-[100px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            src={coach?.user?.image?.url || "/api/placeholder/400/400"}
            alt="coach"
            whileHover={{ scale: 1.05 }}
          />
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row w-full mt-12 lg:mt-0">
        <div className="w-full lg:w-1/3 px-6 lg:ml-[100px] mt-[50px] lg:mt-[100px]">
          <CalenderToHireCoach coach={coach} />
        </div>
        <div className="text-center flex flex-col justify-center items-center w-full p-10 bg-black text-white font-extrabold rounded-3xl shadow-2xl leading-tight space-y-4">
          <div className="text-4xl md:text-6xl lg:text-9xl animate-pulse">
            You're one
          </div>
          <div className="flex space-x-4 text-4xl md:text-6xl lg:text-9xl animate-pulse">
            <span>step</span>
            <span className="text-yellow-400">away</span>
          </div>
          <div className="text-4xl md:text-6xl lg:text-9xl animate-pulse">
            from your
          </div>
          <div className="text-5xl md:text-6xl lg:text-8xl text-red-500 tracking-wider animate-pulse">
            GOALS
          </div>
        </div>
      </div>

      {/* Coaching Plans Section */}
      <motion.div
        className="w-full px-6 lg:px-16 py-16 bg-black"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-white text-center">
            Coaching Plans
          </h1>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-12"></div>

          {coachPlans && coachPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coachPlans.map((plan) => (
                <motion.div
                  key={plan._id}
                  className="flex flex-col border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  onMouseEnter={() => setHoveredPlan(plan._id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <img
                      src={plan.image?.url || "/api/placeholder/400/320"}
                      alt={plan.title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white text-black text-xs font-medium px-2 py-1 rounded">
                      {plan.durationInWeeks} WEEKS
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow p-5 bg-black text-white">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-white">
                        {plan.title}
                      </h2>
                      <span className="text-lg font-bold text-red-400">
                        rs{formatPrice(plan.price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                      {plan.type} • {plan.targetAudience}
                    </p>
                    <p className="text-sm text-gray-300 mb-4 flex-grow">
                      {plan.description?.substring(0, 120)}
                      {plan.description?.length > 120 ? "..." : ""}
                    </p>
                    <button
                      className={`w-full py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-300 ${
                        hoveredPlan === plan._id
                          ? "bg-white text-black"
                          : "bg-black text-white border border-white"
                      }`}
                    >
                      <ShoppingCart size={18} />
                      <span
                        className="font-medium "
                        onClick={() => buy(plan._id, plan.price, plan.coach)}
                      >
                        Buy Now
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg">
              No coaching plans available at the moment.
            </p>
          )}
        </div>
      </motion.div>

      {/* Testimonial Input Section */}
      <div className="max-w-screen-lg mx-auto px-6 mt-12 space-y-6">
        {sessionYesOrNo ? (
          <motion.div
            className="bg-gray-900 p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">
              Leave a Testimonial
            </h3>
            <div>
              <p className="text-lg mb-2 text-white">Your Rating</p>
              <StarRating onRate={handleRatingChange} />
            </div>

            <div className="mt-6">
              <p className="mb-2 text-lg text-white">Your Message</p>
              <textarea
                className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                rows="4"
                placeholder="Share your experience with this coach..."
                value={newTestimonial}
                onChange={(e) => setNewTestimonial(e.target.value)}
              ></textarea>
              <button
                onClick={() =>
                  submitTestimonial(id, auth?.user?._id, rating, newTestimonial)
                }
                className="mt-4 py-3 px-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                disabled={!rating || !newTestimonial}
              >
                Submit Testimonial
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8 text-white text-lg">
            Login as a user to add a testimonial
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <div className="max-w-screen-lg mx-auto px-6 mt-16 pb-20">
        <h2 className="text-3xl font-bold mb-2 text-white">What Clients Say</h2>
        <div className="w-24 h-1 bg-red-500 mb-8"></div>

        <div className="space-y-6">
          {testimonials.length === 0 ? (
            <p className="text-xl text-gray-400">
              No testimonials yet. Be the first to leave a review!
            </p>
          ) : (
            testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                className="bg-gray-800 p-6 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center gap-4 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                {/* User Image */}
                <img
                  src={
                    testimonial.user?.image?.url || "/api/placeholder/100/100"
                  }
                  alt={testimonial.user?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                />

                {/* Testimonial Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                    <h3 className="text-lg font-semibold text-white">
                      {testimonial.user?.name}
                    </h3>

                    {/* Date */}
                    <p className="text-sm text-gray-400">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < testimonial.rating
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-400 ml-2">
                      {testimonial.rating} out of 5
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-white mt-2">{testimonial.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachDetailedPage;
