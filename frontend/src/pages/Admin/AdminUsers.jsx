import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import AdminMenu from '../../components/layout/AdminMenu';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';

const AdminUsers = () => {
  const [auth] = useAuth();
  const [users, setUsers] = useState([]); // All users from the API
  const [userCount, setUserCount] = useState(0); // State to store user count
  const [coachCount, setCoachCount] = useState(0); // State to store coach count
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [view, setView] = useState("user"); // State to toggle between users and coaches
  const [search, setSearch] = useState(""); // State to handle the search query
  const [allUsers, setAllUsers] = useState([]); // State to store all users fetched

  // Fetch all users data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/User/AllUser", {
          headers: {
            Authorization: auth.token,
          },
        });
        const allUsers = response.data.allUser;

        setAllUsers(allUsers); // Save all users in state for reference
        setUsers(allUsers); // Set users for display
        setUserCount(allUsers.filter((user) => user.role === "user").length); // Count users
        setCoachCount(allUsers.filter((user) => user.role === "coach").length); // Count coaches
        setLoading(false);
      } catch (error) {
        setError(error.message);
        console.error(error.message);
      }
    };

    fetchUsers();
  }, [auth.token]);

  // Filter users based on the search query
  const handleSearch = () => {
    const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
    );
    setUsers(filteredUsers); // Update users state to filtered list
  };

  // Function to show all users again when clicked on "Total Users"
  const showAllUsers = () => {
    setUsers(allUsers); // Reset to the original list of all users
  };

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
        <p className="text-lg font-semibold " >
          Total Users: {userCount}
        </p>
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
          <div className="flex justify-between items-center mb-6">
            <button className="text-2xl font-bold mb-4" onClick={showAllUsers}>Users</button>
            <Box display="flex" alignItems="center" gap={2}>
              <label htmlFor="search" className="text-gray-600 font-medium">Find User</label>
              <TextField
                id="search"
                label="Search"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Username"
                value={search}
                onChange={(e) => setSearch(e.target.value)} // Update search query
              />
              {/* Search button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch} // Trigger search
              >
                Search
              </Button>
            </Box>
          </div>

          {users.filter((user) => user.role === "user").length > 0 ? (
            users
              .filter((user) => user.role === "user") // Filter only users with role "user"
              .map((user) => (
                <div key={user._id} className="p-6 mb-4 bg-gray-100 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-2">User Details</h2>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
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
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
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
