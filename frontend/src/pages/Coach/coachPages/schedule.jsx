import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCoachContext } from "../../../Context/coachContext";
import { useAuth } from "../../../Context/AuthContext";

const Schedule = () => {
  const [coach] = useCoachContext();
  const [auth] = useAuth();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/getAllClients/${coach?._id}`,
          {
            headers: { Authorization: auth?.token },
          }
        );
  
        const now = new Date();
        const upcomingClients = res.data.clients.filter((client) => {
          const clientDate = new Date(client.selectedDate);
          return (
            client.status === "approved" &&
            clientDate.setHours(0, 0, 0, 0) >= now.setHours(0, 0, 0, 0)
          );
        });
  
        setClients(upcomingClients);
      } catch (error) {
        console.log("Error fetching schedule:", error.message);
      }
    };
  
    if (coach?._id && auth?.token) {
      fetchClients();
    }
  }, [coach, auth]);
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">🗓️ Upcoming Schedule</h2>

      {clients.length > 0 ? (
        clients.map((client, index) => (
          <div
            key={index}
            className="bg-white text-black p-4 rounded-lg shadow-md mb-3"
          >
            <p><strong>Name:</strong> {client.userId?.name}</p>
            <p><strong>Email:</strong> {client.userId?.email}</p>
            <p>
              <strong>Session Date:</strong>{" "}
              {new Date(client.selectedDate).toLocaleDateString()}
            </p>
            <p><strong>Status:</strong> {client.status}</p>
          </div>
        ))
      ) : (
        <p className="text-white">📭 No upcoming sessions.</p>
      )}
    </div>
  );
};

export default Schedule;
