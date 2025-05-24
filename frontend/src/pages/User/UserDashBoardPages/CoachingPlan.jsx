import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";

const CoachingPlan = () => {
  const [myUserPlans, setMyUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    const fetchBoughtPlan = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/getUserBoughtCourses/${auth?.user?._id}`
        );
        setMyUserPlans(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.user?._id) {
      fetchBoughtPlan();
    }
  }, [auth?.user?._id]);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to truncate ID strings
  const truncateId = (id) => {
    if (!id) return "N/A";
    return typeof id === "object"
      ? `${id._id.substring(0, 8)}...`
      : `${id.substring(0, 8)}...`;
  };

  // Function to calculate weeks remaining
  const calculateWeeksRemaining = (purchasedDate, durationInWeeks) => {
    if (!purchasedDate || !durationInWeeks) return "N/A";

    const purchaseTime = new Date(purchasedDate).getTime();
    const currentTime = new Date().getTime();

    // Calculate elapsed time in milliseconds
    const elapsedTime = currentTime - purchaseTime;

    // Convert to weeks
    const elapsedWeeks = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 7));

    // Calculate remaining weeks
    const remainingWeeks = Math.max(0, durationInWeeks - elapsedWeeks);

    // Format the output
    if (remainingWeeks <= 0) {
      return "Completed";
    } else if (remainingWeeks === 1) {
      return "1 week left";
    } else {
      return `${remainingWeeks} weeks left`;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">My Coaching Plans</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-medium">Loading your coaching plans...</p>
        </div>
      ) : myUserPlans && myUserPlans.length > 0 ? (
        <div className="flex flex-col w-full">
          <div className="overflow-x-auto">
            <div className="py-2 align-middle inline-block min-w-full">
              <div className="overflow-hidden border-2 border-gray-800 rounded-lg shadow-md">
                <table className="min-w-full divide-y-2 divide-gray-800">
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Coach
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Plan Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Price (NPR)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Payment Method
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Progress
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Purchased Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myUserPlans.map((plan) =>
                      plan.status == "completed" ? (
                        <tr key={plan._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {plan.coach?.user && (
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={plan.coachPlan?.image?.url}
                                  alt="Coach" 
                                />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {plan.coach?.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {plan.coach?.category || ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {plan.coachPlan?.title || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {truncateId(plan.coachPlan)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {plan.coachPlan?.type && <span className="capitalize">{plan.coachPlan.type}</span>}
                            {plan.coachPlan?.targetAudience && <span className="ml-1 capitalize">• {plan.coachPlan.targetAudience}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.coach?.category || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {plan.totalPrice?.toLocaleString() || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {plan.paymentMethod || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            plan.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            plan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          } capitalize`}>
                            {plan.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {plan.purchasedDate && plan.coachPlan?.durationInWeeks && (
                            <div className="flex flex-col">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                {(() => {
                                  const purchaseTime = new Date(plan.purchasedDate).getTime();
                                  const currentTime = new Date().getTime();
                                  const elapsedTime = currentTime - purchaseTime;
                                  const elapsedWeeks = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 7));
                                  const durationInWeeks = plan.coachPlan.durationInWeeks;
                                  const progressPercent = Math.min(100, Math.max(0, (elapsedWeeks / durationInWeeks) * 100));
                                  
                                  return (
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${progressPercent}%` }}
                                    ></div>
                                  );
                                })()}
                              </div>
                              <div className="text-xs font-medium text-gray-900 mt-1">
                                {calculateWeeksRemaining(plan.purchasedDate, plan.coachPlan?.durationInWeeks)}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.purchasedDate ? formatDate(plan.purchasedDate) : "N/A"}
                        </td>
                      </tr>
                      ) : null
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600">
            You haven't purchased any coaching plans yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachingPlan;
