import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import StarRating from "../../../components/RatingStar";

const OurCoaches = () => {
  const [auth] = useAuth();
  const [verificationCheck, setVerificationCheck] = useState(0); // State for pending verifications
  const [coachesForVerification, setCoachesForVerification] = useState([]); // State for pending verifications
  const [mode, setMode] = useState(true); // State for mode (viewing coaches or notifications)
  const [verifiedCoaches, setVerifiedCoaches] = useState([]); // State for storing verified coaches
  const [showModal, setShowModal] = useState(false); // State for showing modal
  const [selectedCoach, setSelectedCoach] = useState(null); // State for selected coach details

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

    const coachForVerification = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/coach/verifyCoach",
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );
        const pendingCount = res.data.data.length; // Get the number of pending coaches
        setVerificationCheck(pendingCount); // Set the count of pending coaches
        setCoachesForVerification(res.data.data);
        console.log("Pending verification coach:", coachesForVerification);
        console.log("Pending verification count:", pendingCount);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchVerifiedCoaches();
    coachForVerification();
  }, [auth?.token,selectedCoach?.status]); // Dependency array to run on token change

  const handleViewCoach = (coach) => {
    setSelectedCoach(coach); // Set the selected coach to display in the modal
    setShowModal(true); // Show the modal
  };

  const handleVerification = async (id, verified) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/coach/verifyCoach/${id}`,
        { verified },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      toast.success(res.data.message);
  
    } catch (error) {
      console.log(error);
    }
    setShowModal(false); // Close the modal after verification/rejection
  };
  

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal without making changes
  };

  return (
    <div className="flex-col min-h-screen">
      {mode ? (
        <>
        <div className="flex justify-between items-center px-[20px]">
          <div className="text-xl font-semibold">Our Coaches</div>

          {/* Notification Bell */}
          <div
            className="relative"
            onClick={() => {
              setMode(!mode);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.25 17.25H9.75M17.25 9.75a5.25 5.25 0 00-10.5 0v3.375c0 .414-.168.81-.44 1.102L4.5 15.75h15l-1.81-1.523a1.5 1.5 0 01-.44-1.102V9.75z"
              />
            </svg>

            {/* Notification Badge */}
            {verificationCheck > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {verificationCheck}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 p-4">
  {verifiedCoaches.length === 0 ? (
    <div>No verified coaches available.</div>
  ) : (
    verifiedCoaches.map((coach) => (
      <div
        key={coach._id}
        className="bg-white rounded-xl shadow-md p-4 w-full sm:w-[300px] border"
      >
        <h2 className="text-lg font-semibold">{coach.name}</h2>
        <p className="text-sm text-gray-600">{coach.email}</p>
        <p className="text-sm text-gray-700">{coach.message}</p>
        <StarRating rating={2} readOnly={true} />
        <a
          href={coach.document?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mt-2 inline-block"
        >
          View Document
        </a>
      </div>
    ))
  )}
</div>

       
        </>

      ) : (
        <div className="p-4">
          <div onClick={()=>setMode(!mode)}>back</div>
          {/* Display Coaches For Verification */}
          <div className="text-xl font-semibold mb-4">
            Coaches For Verification
          </div>
          {coachesForVerification.length === 0 ? (
            <div>No coaches available for verification.</div>
          ) : (
            <ul className="space-y-4">
            {coachesForVerification.map((coach) => (
              <li key={coach._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-300 hover:bg-indigo-50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={coach.user?.image?.url || "https://via.placeholder.com/150"}
                      alt={coach.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-indigo-700">{coach.name}</span>
                      <span className="text-sm text-gray-500">{coach.category}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{coach.message}</div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleViewCoach(coach)}
                    className="text-blue-600 font-semibold underline hover:text-indigo-800"
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          )}
        </div>
      )
      }

      {/* Modal for Coach Details */}
      {showModal && selectedCoach && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative max-w-lg">
      {/* Coach Profile Picture */}
      <div className="flex items-center mb-4">
        <img 
          src={selectedCoach.user.image.url} 
          alt="Coach Profile" 
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div>
          <div className="text-2xl font-semibold text-indigo-700">{selectedCoach.name}</div>
          <div className="text-gray-500">{selectedCoach.email}</div>
        </div>
      </div>

      {/* Coach Bio */}
      <div className="mb-4">
        <strong className="text-gray-700">Bio:</strong> 
        <p>{selectedCoach.bio}</p>
      </div>

      {/* Document Section */}
      <div className="mb-4">
        <strong className="text-gray-700">Document:</strong>
        <div className="flex justify-between items-center mt-2">
          <a
            href={selectedCoach.document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            View Document
          </a>
          <a
            href={selectedCoach.document.url}
            download
            className="text-green-600 ml-4 hover:text-green-800"
          >
            Download
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handleVerification(selectedCoach._id, "approved")}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
        >
          Yes (Verify)
        </button>
        <button
          onClick={() => handleVerification(selectedCoach._id, "rejected")}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
        >
          No (Reject)
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={handleCloseModal}
        className="absolute top-2 right-2 text-gray-500 text-2xl font-bold hover:text-gray-700"
      >
        X
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default OurCoaches;
