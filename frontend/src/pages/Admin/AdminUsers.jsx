import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import AdminMenu from '../../components/layout/AdminMenu';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';

const AdminUsers = () => {
  const [auth] = useAuth();
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0); // State to store user count
  const [coachCount, setCoachCount] = useState(0); // State to store coach count
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [view, setView] = useState("user"); // State to toggle between users and coaches

  // Fetch all users data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/User/AllUser");
        const allUsers = response.data.allUser;

        setUsers(allUsers);
        setUserCount(allUsers.filter((user) => user.role === "user").length); // Count users
        setCoachCount(allUsers.filter((user) => user.role === "coach").length); // Count coaches
        setLoading(false);
      } catch (error) {
        setError(error.message);
        console.error(error.message);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Display loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there's an issue with fetching the data
  }

  return (
    <div className="p-6">
      {/* Display counts */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-lg font-semibold">Total Users: {userCount}</p>
        <p className="text-lg font-semibold">Total Coaches: {coachCount}</p>
        {/* Toggle Button */}
        <button
          onClick={() => setView(view === "user" ? "coach" : "user")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          View {view === "user" ? "Coaches" : "Users"}
        </button>
      </div>

      {/* Toggle Display */}
      {view === "user" ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          {users.filter((user) => user.role === "user").length > 0 ? (
            users
              .filter((user) => user.role === "user") // Filter only users with role "user"
              .map((user) => (
                <div key={user._id} className="p-6 mb-4 bg-gray-100 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-2">User Details</h2>
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                </div>
              ))
          ) : (
            <p>No users found.</p>
          )}
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Coaches</h1>
          {users.filter((user) => user.role === "coach").length > 0 ? (
            users
              .filter((user) => user.role === "coach") // Filter only users with role "coach"
              .map((user) => (
                <div key={user._id} className="p-6 mb-4 bg-gray-100 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-2">Coach Details</h2>
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                </div>
              ))
          ) : (
            <p>No coaches found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
