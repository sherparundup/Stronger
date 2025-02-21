import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";

const MembershipPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [mode, setMode] = useState("Standard");

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/membership/getAllMembership");

        if (res.data && res.data.data) {
          setMemberships(res.data.data);
          console.log(res.data)
        }
      } catch (error) {
        console.error("Error fetching memberships:", error.message);
      }
    };

    fetchMemberships();
  }, []);

  return (
    <Layout>
      <div className=" flex-col  items-center">
        <div className=" flex justify-center">
        <h1 className="text-4xl font-bold mb-6">We Offer</h1>

        </div>
        
       
        <div className="flex h-auto items-center px-[40px] space-x-4">
  
  <div className="flex w-1/2 text-3xl font-semibold text-gray-800">Our Plans</div>

  {/* Button Container */}
  <div className="flex w-1/2 justify-end">
    <div className="border border-gray-300 shadow-lg  rounded-[10px] flex gap-x-4 py-[10px] px-[30px] bg-white">
      
      <button
        onClick={() => setMode("Standard")}
        className="px-6 py-2 font-bold text-gray-800 rounded-md shadow-md bg-gray-100 transition-all duration-300 hover:bg-gray-300 hover:shadow-lg"
      >
        Standard
      </button>

      <button
        onClick={() => setMode("Premium")}
        className="px-6 py-2 bg-black font-bold text-white rounded-md shadow-md transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg"
      >
        Premium
      </button>

    </div>
  </div>
</div>

        {/* Membership List */}
        <div className="flex justify-center">
          {memberships.length > 0 ? (
            <ul className="flex  gap-4">

              {
                
              
              memberships.filter((Mode)=>Mode.membershipType===mode).map((membership) => (
                <li key={membership._id} className="p-4 border rounded-lg shadow-md">
                  
                  <div className="flex-col">
                  <div className="">

                  <h2 className="text-xl font-semibold">{membership.name}</h2>
                  </div>
                  <div className="">

                  <p className="text-gray-700">Duration: {membership.duration} months</p>
                  </div>
                  <div className="">

                  <p className="text-gray-900 font-bold">Price: ${membership.price}</p>
                  </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mt-4">No memberships available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MembershipPage;
