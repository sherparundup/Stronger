import React, { useEffect, useState } from "react";
import { UseIsCoachVerified } from "../../../Context/isCoachVerified.context";
import axios from "axios";
import { useCoachContext } from "../../../Context/coachContext";
import { useAuth } from "../../../Context/AuthContext";

const Clients = () => {
  const [isVerified] = UseIsCoachVerified();
  const [clients, setClients] = useState([]);
  const [coach] = useCoachContext();
  const [auth] = useAuth();
  const [mode, setMode] = useState(true); // true = approved (confirmed), false = pending
  const [clicked, setClicked] = useState(true); // true = approved (confirmed), false = pending
  const [verificationCheck, setVerificationCheck] = useState(0); // pending count

  useEffect(() => {
    if (!coach?._id || !auth?.token) return; // Wait until both are available

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/getAllClients/${coach?._id}`,
          {
            headers: { Authorization: auth?.token },
          }
        );
        setClients(res.data.clients);

        // Count pending clients (clients that are not confirmed)
        const pendingCount = res.data.clients.filter(
          (client) => client.status === "pending"
        ).length;
        setVerificationCheck(pendingCount);
      } catch (error) {
        console.log("Error fetching clients:", error.message);
      }
    };

    fetchUsers();
  }, [coach, auth, clicked]);

  const filteredClients = clients.filter((client) =>
    mode ? client.status === "approved" : client.status === "pending"
  );

  const acceptClient = async (clientId, selectedDate, decision, name, email) => {
    try {
      // Optimistically update the UI by updating the local state.
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.userId._id === clientId ? { ...client, status: decision } : client
        )
      );
      setClicked(!clicked);

      // Send the decision to the server.
      const res = await axios.put(
        `http://localhost:8000/api/coach/acceptClients/${auth.user._id}`,
        {
          clientId,
          coachId: coach._id,
          status: decision,
          selectedDate,
          name,
          email,
        },
        {
          headers: { Authorization: auth.token },
        }
      );
      console.log("Response:", res.data);
    } catch (error) {
      console.log("Error accepting/rejecting client:", error.message);
      // Optionally, handle reverting the state if the update fails.
    }
  };

  return (
    <div className="p-4 bg-black text-white">
      {/* Header with Title and Bell Icon Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📋 My Clients</h2>
        {/* Bell Icon toggles view between approved and pending clients */}
        <div className="relative cursor-pointer" onClick={() => setMode(!mode)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.25 17.25H9.75M17.25 9.75a5.25 5.25 0 00-10.5 0v3.375c0 .414-.168.81-.44 1.102L4.5 15.75h15l-1.81-1.523a1.5 1.5 0 01-.44-1.102V9.75z"
            />
          </svg>
          {verificationCheck > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {verificationCheck}
            </span>
          )}
        </div>
      </div>

      {/* Conditional Rendering based on verification status and filtered clients */}
      {isVerified ? (
        filteredClients.length > 0 ? (
          filteredClients.map((client, index) => (
            <div
              key={index}
              className="bg-black p-4 rounded-lg shadow-md mb-3 text-white"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={client.userId?.image?.url}
                  alt="client"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p><strong>Name:</strong> {client.userId?.name}</p>
                  <p><strong>Email:</strong> {client.userId?.email}</p>
                  <p><strong>Phone:</strong> {client.userId?.contactNumber}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(client.selectedDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status: {client.status}</strong>
                  </p>
                  {/* Show Accept/Reject buttons only in Pending view */}
                  {!mode && (
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() =>
                          acceptClient(
                            client.userId._id,
                            client.selectedDate,
                            "approved",
                            client.userId.name,
                            client.userId.email
                          )
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() =>
                          acceptClient(
                            client.userId._id,
                            client.selectedDate,
                            "rejected",
                            client.userId.name,
                            client.userId.email
                          )
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No {mode ? "confirmed" : "pending"} clients.</p>
        )
      ) : (
        <p className="text-red-500">🚫 You are not verified!</p>
      )}
    </div>
  );
};

export default Clients;
