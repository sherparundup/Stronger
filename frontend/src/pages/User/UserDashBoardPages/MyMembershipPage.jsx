import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const MyMembershipPage = () => {
  const [membershipData, setMembershipData] = useState(null);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);

  // Function to calculate remaining time for a membership.
  const calculateRemainingTime = (purchasedDate, membershipStatus, durationInMonths) => {
    const purchaseDate = new Date(purchasedDate);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + durationInMonths); // Adjusting by dynamic duration
    const currentTime = new Date();
    const timeDiff = expiryDate - currentTime;

    if (membershipStatus === "active" && timeDiff > 0) {
      const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24));
      const hoursRemaining = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
      const minutesRemaining = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
      const secondsRemaining = Math.floor((timeDiff % (1000 * 60)) / 1000);
      let message = `Expires in: ${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`;
      let color = "text-green-600";

      if (daysRemaining < 3) {
        message += " - Your membership is expiring very soon!";
        color = "text-red-600";
      } else if (daysRemaining < 10) {
        message += " - Hurry up! Your membership is expiring soon!";
        color = "text-yellow-600";
      }
      return { message, color };
    } else {
      return { message: 'Membership expired or inactive', color: "text-gray-600" };
    }
  };

  // Fetch membership data from the API.
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const userId = auth?.user?._id;
        const res = await axios.get(`http://localhost:8000/api/membership/userMembership/${userId}`);
        console.log("Full response:", res.data);

        if (res.data.success) {
          setMembershipData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching membership:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.user?._id) {
      fetchMembership();
    }
  }, [auth]);

  // Function to update the timer for each membership
  const startTimer = (membershipId, purchasedDate, membershipStatus, durationInMonths) => {
    const interval = setInterval(() => {
      const remainingTime = calculateRemainingTime(purchasedDate, membershipStatus, durationInMonths);

      setMembershipData((prevData) => {
        if (!prevData) return prevData; // Prevents errors when prevData is null
        const updatedMemberships = prevData.userMemberships.map((membership) => {
          if (membership._id === membershipId && membership.remainingTime !== remainingTime) {
            return {
              ...membership,
              remainingTime: remainingTime, // Update remaining time only if it's different
            };
          }
          return membership;
        });
        return { ...prevData, userMemberships: updatedMemberships };
      });
    }, 1000);

    // Clear interval when the component is unmounted or membership data is removed
    return interval;
  };

  // Start a timer for each membership
  useEffect(() => {
    if (membershipData) {
      const intervals = [];
      membershipData.userMemberships.forEach((membership) => {
        if (membership.membershipStatus === 'active') {
          const durationInMonths = membership.duration; // FIX: Use dynamic duration from API response
          const interval = startTimer(membership._id, membership.purchasedDate, membership.membershipStatus, durationInMonths);
          intervals.push(interval); // Track all intervals
        }
      });

      // Cleanup intervals when the component unmounts
      return () => {
        intervals.forEach(clearInterval);
      };
    }
  }, [membershipData]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">My Memberships</h1>
        <p className="text-center text-gray-500">Loading membership details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">My Memberships</h1>

      {membershipData && membershipData.userMemberships.length > 0 ? (
        membershipData.userMemberships.map((membership) => (
          <div key={membership._id} className="bg-white p-4 shadow-md rounded-lg mb-4">
            <div className="flex items-center">
              <img
                src={membership.userId.image?.url}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">{membership.userId.name}</h2>
                <p className="text-gray-500">{membership.membershipId.MembershipName}</p>
                <p className="text-gray-700">{membership.membershipId.description}</p>
                {membership.remainingTime && (
                  <p className={`${membership.remainingTime.color} font-semibold`}>
                    {membership.remainingTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No active memberships found.</p>
      )}
    </div>
  );
};

export default MyMembershipPage;
