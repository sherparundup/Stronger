import React from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../Context/AuthContext";
import CoverImage from "../assets/CoverPage/Home.svg";
import { motion } from "framer-motion"; // Import Framer Motion

const HomePage = () => {
  const [auth, setAuth] = useAuth();

  return (
    <Layout>
      <div className="flex-col ">

      <div className="relative min-h-screen bg-black w-full">
        {/* Background Image */}
        <img
          src={CoverImage}
          alt="Home Cover"
          className="w-full h-auto object-cover"
        />

        {/* Overlay Text with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} // Starts hidden & lower
          animate={{ opacity: 1, y: 0 }} // Fades in & moves up
          transition={{ duration: 1, ease: "easeOut" }} // Smooth effect
          className="absolute inset-0 flex items-center justify-start ml-[70px] mb-[400px]"
        >
          <div className="flex-col">
            {/* First Line */}
            <motion.h1
              initial={{ opacity: 0, x: -50 }} // Slide-in from left
              animate={{ opacity: 1, x: 0 }} // Moves to position
              transition={{ delay: 0.2, duration: 1 }} // Delayed start
              className="text-white text-5xl md:text-6xl font-bold drop-shadow-lg"
            >
              Elevate Your Workout with
            </motion.h1>

            {/* Second Line (STRONGER) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} // Starts small
              animate={{ opacity: 1, scale: 1 }} // Grows in size
              transition={{ delay: 0.4, duration: 1 }} // Delayed start
              className="text-white text-5xl md:text-7xl font-bold drop-shadow-lg"
            >
              STRONGER
            </motion.div>
          </div>
        </motion.div>
      </div>
      <div className="bg-black flex-col">
        <div className="flex bg-black text-white">Why choose Us? </div>
      </div>
      </div>

    </Layout>
  );
};

export default HomePage;
