import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";

const MembershipPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [mode, setMode] = useState("Standard");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [auth] = useAuth();

  const buyMembership = async (membership) => {
    if (!auth?.user?._id) {
      toast.error("Please login to buy a membership");
      return;
    }
    navigate(`/Membership/${membership._id}`);
  };

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8000/api/membership/getAllMembership"
        );
        if (res.data && res.data.data) {
          setMemberships(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching memberships:", error.message);
        toast.error("Failed to load membership plans");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const filteredMemberships = memberships.filter(
    (membershipItem) => membershipItem.membershipType === mode
  );

  const getMembershipColor = (type) => {
    return type === "Standard"
      ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      : "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200";
  };

  const getBadgeColor = (type) => {
    return type === "Standard"
      ? "bg-blue-100 text-blue-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getButtonColor = (type) => {
    return type === "Standard"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-yellow-600 hover:bg-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Membership Plans
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Choose the perfect plan to enhance your shopping experience and
            unlock exclusive benefits.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Toggle Switch */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 md:mb-0">
            Select Your Plan
          </h2>

          <div className="relative inline-block bg-gray-100 p-1 rounded-full">
            <div className="flex items-center">
              <button
                onClick={() => setMode("Standard")}
                className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  mode === "Standard"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Standard
              </button>

              <button
                onClick={() => setMode("Premium")}
                className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  mode === "Premium"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Premium
              </button>

              {/* Moving background */}
              <div
                className={`absolute top-1 left-1 h-8 rounded-full transition-all duration-300 ${
                  mode === "Standard"
                    ? "translate-x-0 w-24 bg-blue-600"
                    : "translate-x-24 w-20 bg-yellow-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Membership Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredMemberships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMemberships.map((membership) => (
              <div
                key={membership._id}
                className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border ${getMembershipColor(
                  membership.membershipType
                )}`}
              >
                {/* Card Header */}
                <div className="flex flex-col h-full">
                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {membership.name}
                      </h3>
                      <span
                        className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getBadgeColor(
                          membership.membershipType
                        )}`}
                      >
                        {membership.membershipType}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">
                        ${membership.price}
                      </span>
                      <span className="text-gray-500 ml-1">
                        /{membership.duration} months
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 flex-1">
                      {membership.description}
                    </p>
                    {/* Push button to bottom */}
                    <div className="mt-auto">
                      <button
                        onClick={() => buyMembership(membership)}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white ${getButtonColor(
                          membership.membershipType
                        )} transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center`}
                      >
                        Choose {membership.name}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => buyMembership(membership)}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white ${getButtonColor(
                      membership.membershipType
                    )} transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center`}
                  >
                    Choose {membership.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No memberships available
            </h3>
            <p className="text-gray-500">
              Please check back later or contact support.
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: "How do I manage my membership?",
                answer:
                  "You can manage your membership details from your account dashboard. This includes updating payment information, changing plans, or canceling your subscription.",
              },
              {
                question: "Can I upgrade my plan anytime?",
                answer:
                  "Yes, you can upgrade your membership plan at any time. The price difference will be prorated for the remaining period of your current membership.",
              },
              {
                question: "What happens when my membership expires?",
                answer:
                  "Your membership benefits will end when your membership expires. You can renew manually or set up auto-renewal from your account settings.",
              },
              {
                question: "Is there a refund policy?",
                answer:
                  "We offer a 14-day money-back guarantee if you're not satisfied with your membership. Please contact our customer support for assistance.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-900 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Our team is ready to help you choose the right membership plan for
            your needs.
          </p>
          <button className="bg-white text-gray-900 hover:bg-gray-100 py-3 px-8 rounded-lg font-bold transition-colors duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
