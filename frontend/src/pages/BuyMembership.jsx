import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useParams } from "react-router-dom";

const BuyMembership = () => {
  const [auth] = useAuth();  // No need to use setAuth unless updating auth
  const { id } = useParams();
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/membership/singleMembership/${id}`, {
          headers: {
            Authorization: auth?.token
          },
        });
        setMembership(res.data.data);
        console.log(membership)
        console.log("okkkkkkkkkkkkkkkkkkk",res.data.data);
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };
    

    if (id && auth?.token) {
      fetchMembership();
    }
  }, [id, auth?.token,auth?.user?.id]);

  const Buy = async (Membership, totalPrice) => {
    try {
    
      const UserId = auth?.user?._id;
      console.log(`useriiiiiiiiiiiiiii`,UserId)
      const res = await axios.post(
        "http://localhost:8000/api/membership/joinMembership/Payment/initialize-esewa",
        { Membership, totalPrice, UserId },  
        {
          headers: { Authorization: auth?.token },
        }
      );
      console.log(res)
      console.log("helli")
      const signature = res.data.payment.signature;
      const signed_field_names = res.data.payment.signed_field_names;
      const transaction_uuid = res.data.UserMembershipModelData._id;
      console.log("hi")
      if (res.data.success) {
        // Dynamically create a form element
        const form = document.createElement("form");
        console.log("hiiii")
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
        console.log(id,"iss idddd")
        // Create hidden inputs for all required fields
        const fields = [
          { name: "amount", value: totalPrice },
          { name: "tax_amount", value: "0" },
          { name: "total_amount", value: totalPrice },
          { name: "transaction_uuid", value: transaction_uuid },
          { name: "product_code", value: "EPAYTEST" },
          { name: "product_service_charge", value: "0" },
          { name: "product_delivery_charge", value: "0" },
          {
            name: "success_url",
            value: `http://localhost:8000/api/membership/joinMembership/Payment/complete-payment/${id}`,
          },
          { name: "failure_url", value: "http://localhost:5173/" },
          { name: "signed_field_names", value: signed_field_names },
          { name: "signature", value: signature },
        ];

        fields.forEach((field) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = field.name;
          input.value = field.value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Buy Membership</h1>

        {membership ? (
          <div className="p-6 border rounded-lg shadow-lg bg-white max-w-lg">
            <h2 className="text-2xl font-semibold">{membership.name}</h2>
            <p className="text-gray-700 mt-2">Duration: {membership.duration} months</p>
            <p className="text-gray-900 font-bold text-xl mt-2">Price: ${membership.price}</p>
            <p className="text-gray-800 mt-4">{membership.description}</p>

            <button
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition-transform duration-300 transform hover:scale-105"
              onClick={() => Buy(membership._id,membership.price)}
            >
              Proceed to Payment
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">Loading membership details...</p>
        )}
      </div>
    </Layout>
  );
};

export default BuyMembership;
