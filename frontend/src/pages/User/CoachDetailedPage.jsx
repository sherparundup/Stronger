import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CalenderToHireCoach from '../../components/coach.component/CalenderToHireCoach';

const CoachDetailedPage = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState();

  useEffect(() => {
    const fetchingCoach = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/coach/SpecifiedCoach/${id}`);
        setCoach(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchingCoach();
  }, [id]);

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Nav with animated border */}
      <nav className="bg-black z-50 shadow-[0_2px_10px_rgba(255,0,0,0.4)] border-b border-b-white/10 transition-all duration-500 ease-in-out">
        <div className="px-10 py-4 text-white text-xl font-bold tracking-widest">COACH PROFILE</div>
      </nav>

      <div className="flex w-full">
        {/* Left Info */}
        <motion.div 
          className="flex-col w-1/2 pl-[100px] pt-[100px]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
            About Me
          </h1>

          <motion.p 
            className="text-white mt-5 text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {coach?.bio}
          </motion.p>

          <p className="text-white mt-5 text-2xl">
            I specialize in <span className="text-red-400 font-semibold">{coach?.category}</span>
          </p>

          <p className="text-white mt-5 text-2xl">
            - <span className="text-pink-400 font-bold">{coach?.name}</span>
          </p>
        </motion.div>

        {/* Image Side */}
        <motion.div 
          className="flex justify-center w-1/2 pl-[100px] pt-[100px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.img 
            className="w-[400px] h-[400px] object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            src={coach?.user?.image?.url}
            alt="coach image"
            whileHover={{ scale: 1.05 }}
          />
        </motion.div>
      </div>
      <div className="flex w-full ml-[400px]">
        <CalenderToHireCoach coach={coach}  />
      </div>
    </div>
  );
};

export default CoachDetailedPage;
