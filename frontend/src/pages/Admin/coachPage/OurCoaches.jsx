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
  const [showFullBio, setShowFullBio] = useState(false);
  const [coachRatings, setCoachRatings] = useState({}); // State for storing coach ratings

  // Function to calculate average rating for a coach
  const calculateAverageRating = (coachId, ratingsData) => {
    const coachRatingsList = ratingsData.filter(rating => rating.coach === coachId);
    if (coachRatingsList.length === 0) return 0;
    
    const totalRating = coachRatingsList.reduce((sum, rating) => sum + rating.rating, 0);
    return (totalRating / coachRatingsList.length).toFixed(1);
  };

  useEffect(() => {
    const ratings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/coach/coachRating"
        );
        console.log("Coach ratings response:", res.data.data);
        
        // Create a mapping of coach ratings
        const ratingsMap = {};
        res.data.data.forEach(rating => {
          if (!ratingsMap[rating.coach]) {
            ratingsMap[rating.coach] = [];
          }
          ratingsMap[rating.coach].push(rating.rating);
        });
        
        // Calculate average ratings for each coach
        const averageRatings = {};
        Object.keys(ratingsMap).forEach(coachId => {
          const ratings = ratingsMap[coachId];
          const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
          averageRatings[coachId] = parseFloat(average.toFixed(1));
        });
        
        setCoachRatings(averageRatings);
      } catch (error) {
        console.log("Error fetching ratings:", error);
      }
    };

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
    ratings();
  }, [auth?.token, selectedCoach?.status]); // Dependency array to run on token change

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
    <div className="flex-col min-h-screen bg-gray-50">
      {mode ? (
        <>
          <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md rounded-lg">
            <div className="text-xl font-semibold text-indigo-700">
              Our Coaches
            </div>

            {/* Notification Bell */}
            <div
              className="relative cursor-pointer"
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

          <div className="flex flex-wrap justify-center gap-8 p-6">
            {verifiedCoaches.length === 0 ? (
              <div className="text-lg text-gray-600">
                No verified coaches available.
              </div>
            ) : (
              verifiedCoaches.map((coach) => (
                <div
                  key={coach._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-200 p-6 w-full max-w-[320px] flex flex-col justify-between text-center h-[500px]" // set fixed height
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={coach?.user?.image?.url}
                      alt={coach.name}
                      className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-indigo-500 shadow"
                    />
                    <h2 className="text-xl font-bold text-indigo-700">
                      {coach.name}
                    </h2>
                    <p className="text-sm text-gray-500">{coach.email}</p>
                    <p
                      className={`text-sm text-gray-700 mt-3 ${
                        showFullBio ? "" : "line-clamp-3"
                      }`}
                    >
                      {coach.bio}
                    </p>
                    <p className="text-sm text-gray-700 mt-3">
                      {coach.category}
                    </p>
                    <div className="mt-2">
                      <StarRating 
                        rating={coachRatings[coach._id] || 0} 
                        readOnly={true} 
                      />
                      {coachRatings[coach._id] && (
                        <p className="text-sm text-gray-600 mt-1">
                          {coachRatings[coach._id]} out of 5
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="flex flex-col items-center mt-4">
                    <a
                      href={coach.document?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                    <a
                      href={coach?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:underline mt-1"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="p-6">
          <div
            onClick={() => setMode(!mode)}
            className="cursor-pointer text-indigo-600 font-semibold mb-4"
          >
            Back to Verified Coaches
          </div>

          <div className="text-xl font-semibold mb-4 text-indigo-700">
            Coaches For Verification
          </div>

          {coachesForVerification.length === 0 ? (
            <div className="text-lg text-gray-600">
              No coaches available for verification.
            </div>
          ) : (
            <ul className="space-y-4">
              {coachesForVerification.map((coach) => (
                <li
                  key={coach._id}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-300 hover:bg-indigo-50 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          coach.user?.image?.url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={coach.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-indigo-700">
                          {coach.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {coach.category}
                        </span>
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
      )}

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
                <div className="text-2xl font-semibold text-indigo-700">
                  {selectedCoach.name}
                </div>
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
                onClick={() =>
                  handleVerification(selectedCoach._id, "approved")
                }
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Yes (Verify)
              </button>
              <button
                onClick={() =>
                  handleVerification(selectedCoach._id, "rejected")
                }
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
              >
                No (Reject)
              </button>
              <button
                onClick={handleCloseModal}
                className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurCoaches;