import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import axios from "axios";

const MyProductPage = () => {
  const [auth, setAuth] = useAuth();
  const UserId = auth?.user?._id;
  const [UsersProduct, setUsersProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!UserId) return; // Prevent API call if UserId is undefined
        const res = await axios.get(
          `http://localhost:8000/api/Product/getUserProduct/${UserId}`,
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );
        setUsersProduct(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [UserId]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
          {auth.user.name}'s Products
        </h2>

        {UsersProduct.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {UsersProduct.map((product, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <img
                  src={product.product?.image?.url}
                  alt={product.product?.name}
                  className="w-40 h-40 object-cover rounded-lg"
                />
                {/* Product Info */}
                <h3 className="text-lg font-semibold text-gray-800 mt-4">
                  {product.product?.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Price: <span className="font-bold">${product?.totalPrice}</span>
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Purchased on: {new Date(product?.purchasedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-xl mt-6">
            Please buy products.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProductPage;
