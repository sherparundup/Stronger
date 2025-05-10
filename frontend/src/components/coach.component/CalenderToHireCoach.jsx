import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const CalenderToHireCoach = ({ coach }) => {
  const [date, setDate] = useState(new Date());
  const [auth] = useAuth();

  const HireCoach = async () => {

    try {
      console.log("Hiring coach:", coach); // example log
      console.log("Selected Date:", date.toDateString());
      console.log("Hired by:", auth?.user?.name);
      const res = await axios.post(
        "http://localhost:8000/api/coach/hireCoach",
        {
          coachId: coach._id,
          userId: auth?.user?._id,
          selectedDate: date,
        },
        {
          headers: {
            Authorization: auth?.token
          },
        }
      );
      if (res.data.success === true) {
        toast.success("Coach hired successfully!");
      } else {
        toast.error(res.data.message );
      }
      
      console.log(res)
    } catch (error) {
      const message =
      error.response?.data?.message || "Something went wrong. Try again.";
  
    toast.error(message);
      
    }
  };

  return (
    <div className="p-4 flex flex-col items-center ">
      <h2 className="text-xl text-red-50 font-bold mb-4">Select a Date</h2>
      <Calendar onChange={setDate} value={date}         className="w-full max-w-xl h-[500px] text-2xl"  // Increase size of the calendar
 />
      <p className="mt-4 bg-white">📅 Selected Date: {date.toDateString()}</p>
      <button className="mt-4 bg-white px-4 py-2 rounded shadow" onClick={HireCoach}>
        Hire
      </button>
    </div>
  );
};

export default CalenderToHireCoach;
