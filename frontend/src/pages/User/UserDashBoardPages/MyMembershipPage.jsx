import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const MyMembershipPage = () => {
  const [userMembership, setUserMembership] = useState([]);
  const [auth, setAuth] = useAuth();
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const userId = auth?.user?._id;
        const res = await axios.get(`http://localhost:8000/api/membership/userMembership/${userId}`);
        console.log(res.data);
        if (res.data.success) {
          setUserMembership(res.data.data);
          calculateRemainingTime(res.data.data[0].purchasedDate, res.data.data[0].membershipStatus);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (auth?.user?._id) {
      fetchMembership();
    }
  }, [auth]);

  // Function to calculate remaining time until the membership expires
  const calculateRemainingTime = (purchasedDate, membershipStatus) => {
    const purchaseDate = new Date(purchasedDate);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1); // Assuming a 1-month membership duration

    const currentTime = new Date();
    const timeDiff = expiryDate - currentTime;

    if (membershipStatus === "active" && timeDiff > 0) {
      const interval = setInterval(() => {
        const currentTime = new Date();
        const remaining = expiryDate - currentTime;

        if (remaining <= 0) {
          clearInterval(interval); // Stop the countdown when it reaches 0
          setRemainingTime('Membership expired');
        } else {
          const daysRemaining = Math.floor(remaining / (1000 * 3600 * 24));
          const hoursRemaining = Math.floor((remaining % (1000 * 3600 * 24)) / (1000 * 3600));
          const minutesRemaining = Math.floor((remaining % (1000 * 3600)) / (1000 * 60));
          const secondsRemaining = Math.floor((remaining % (1000 * 60)) / 1000);
          setRemainingTime(`Expires in: ${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`);
        }
      }, 1000); // Update every second

      return () => clearInterval(interval); // Cleanup interval on component unmount
    } else {
      setRemainingTime('Membership expired or inactive');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">My Membership</h1>

      {userMembership.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-bold text-gray-700">Membership ID: {userMembership[0].userId?.name}</h3>
          <h3 className="text-xl font-bold text-gray-700">Membership name: {userMembership[0]?.membershipId?.MembershipName}</h3>
          <p className="text-gray-600">Status: <span className="font-semibold">{userMembership[0].membershipStatus}</span></p>
          <p className="text-gray-600">Status: <span className="font-semibold">{userMembership[0].membershipStatus}</span></p>
          <p className="text-gray-600">Price: <span className="font-semibold">${userMembership[0].price}</span></p>
          <p className="text-gray-600">Purchased Date: <span className="font-semibold">{new Date(userMembership[0].purchasedDate).toLocaleDateString()}</span></p>
          <p className="text-gray-600">Payment Method: <span className="font-semibold">{userMembership[0].paymentMethod}</span></p>
          <p className="text-lg font-semibold text-blue-600">{remainingTime}</p>
        </div>
      ) : (
        <p className="text-center text-red-500">No membership found.</p>
      )}
    </div>
  );
};

export default MyMembershipPage;
