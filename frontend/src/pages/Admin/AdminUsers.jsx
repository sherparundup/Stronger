import React, { useEffect, useState } from 'react';
import Layout from '../../components/LayOut/layout';
import AdminMenu from '../../components/layout/AdminMenu';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';

const AdminUsers = () => {
  const [auth] = useAuth();
  const [users, setUsers] = useState([]);   // state to store all users
  const [loading, setLoading] = useState(true);  // state for loading state
  const [error, setError] = useState(null);  // state for error handling

  // Fetch all users data on component mount
  useEffect(() => {
    axios.get("http://localhost:8000/Users/getAllUser")
      .then((response) => {
        setUsers(response.data); // Store the fetched users data
        setLoading(false);        // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users"); // Set error message
        setLoading(false);               // Set loading to false in case of error
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;  // Display loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>;  // Display error message if there's an issue with fetching the data
  }

  return (
   
      <div className="p-6">
        <h1>fuck me</h1>
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        {users.length > 0 ? (
          // Display User Info if users array is not empty
          users.map((user) => (
            <div key={user._id} className="mb-4">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ))
        ) : (
          <p>No users found.</p>  // Display if no users are found
        )}
      </div>
  );
}

export default AdminUsers;
