import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCoachContext } from "../../../Context/coachContext";
import { useAuth } from "../../../Context/AuthContext";

const PlansRevenue = () => {
  const [coachesBoughtPlans, setCoachesBoughtPlans] = useState([]);
  const [auth] = useCoachContext();
  const [authToVerify] = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalEarning, setTotalEarning] = useState();

  useEffect(() => {
    const fetchingBoughtPlan = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/coach/plansRevenue/${auth._id}`,
          {
            headers: {
              Authorization: authToVerify?.user._id,
            },
          }
        );
        setCoachesBoughtPlans(res.data.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchingBoughtPlan();
  }, [auth._id, authToVerify?.user._id]);

  useEffect(() => {
    const revenue = () => {
      try {
        let total = 0;
        coachesBoughtPlans.forEach((plan) => {
          total += plan.totalPrice;
        });
        setTotalEarning(total);
      } catch (error) {
        console.log(error);
      }
    };

    if (coachesBoughtPlans.length > 0) {
      revenue();
    }
  }, [coachesBoughtPlans]);

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
    return `${id.substring(0, 8)}...`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">Coaching Plans Revenue</h2>

        <div className="text-right space-y-2">
          <div>
            <h2 className="text-xl font-semibold">
              Total Earnings: {totalEarning}
            </h2>
          </div>
          <div>Number of Plans Bought: {coachesBoughtPlans.length}</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-medium">Loading sales data...</p>
        </div>
      ) : coachesBoughtPlans && coachesBoughtPlans.length > 0 ? (
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
                        Plan ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Client Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Coach ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                      >
                        Total Price (NPR)
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
                        Purchased Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coachesBoughtPlans.map((sale) => (
                      <tr key={sale._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {truncateId(sale.coachPlan)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {truncateId(sale.UserId?.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {truncateId(sale.coach?.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {sale.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sale.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : sale.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            } capitalize`}
                          >
                            {sale.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(sale.purchasedDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600">
            No coaching plans have been purchased yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlansRevenue;
