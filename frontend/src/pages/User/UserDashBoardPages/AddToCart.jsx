import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";

const AddToCart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/Product/getCart",
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );
        setCart(res.data.data || []); // Ensure cart is always an array
      } catch (error) {
        console.log(error);
      }
    };
    if (auth?.token) {
      fetchData();
    }
  }, [auth]); // Added auth dependency
  const removeCart=async(_id)=>{
    try {
        console.log(_id)
        const res=await axios.delete(  `http://localhost:8000/api/Product/removeCart/${_id}`,{
            headers:{
                Authorization:auth?.token
            }
        })
        console.log(res.data)
        setCart((prevCart) => prevCart.filter((item) => item._id !== _id));

    // Show success message
      toast.success("Item removed from cart");
    
} catch (error) {
    console.log(error)
    toast.error("SOmething went wrong")
        
    }

  }
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-black font-extrabold text-5xl mb-8">
        {auth?.user?.name}'s Cart
      </h1>

      {cart.length > 0 ? (
        <div className="w-full max-w-3xl space-y-6">
          {cart.map((item, key) => (
            <div
              key={key}
              className="flex items-center bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border">
                <img
                  src={
                    item?.ProductId?.image?.url ||
                    "https://via.placeholder.com/100"
                  }
                  alt={item?.ProductId?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex w-full">
                <div className="ml-6 flex flex-col">
                  <h2 className="text-black font-semibold text-xl">
                    {item?.ProductId?.name || "Unknown Product"}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Price:{" "}
                    <span className="font-semibold">
                      ${item?.ProductId?.price}
                    </span>
                  </p>
                  <p className="text-gray-600 text-lg">
                    Quantity:{" "}
                    <span className="font-semibold">{item?.quantity}</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="px-10 py-3  text-black font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                  Buy Now
                </button>
                <button onClick={()=>removeCart(item._id)}>remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-3xl text-gray-500 mt-10">
          Your cart is empty. Add some products!
        </p>
      )}
    </div>
  );
};

export default AddToCart;
