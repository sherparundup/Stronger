import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddToCart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/Product/getCart", {
          headers: { Authorization: auth?.token },
        });
        setCart(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    if (auth?.token) {
      fetchData();
    }
  }, [auth]);

  const removeCart = async (_id) => {
    try {
      await axios.delete(`http://localhost:8000/api/Product/removeCart/${_id}`, {
        headers: { Authorization: auth?.token },
      });
      setCart((prevCart) => prevCart.filter((item) => item._id !== _id));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const Buy = async (Product, quantity, totalPrice) => {
    try {
      const ProductId = Product._id;
      const UserId = auth?.user?._id;
      console.log("User Id:", UserId);
      const res = await axios.post(
        "http://localhost:8000/api/Payment/initialize-esewa",
        { ProductId, quantity, totalPrice, UserId },
        {
          headers: { Authorization: auth?.token },
        }
      );
      console.log("Initialize Response:", res.data);
      
      const signature = res.data.payment.signature;
      const signed_field_names = res.data.payment.signed_field_names;
      const transaction_uuid = res.data.purchasedProductData._id;
      
      if (res.data.success) {
        console.log("Payment initialization successful. Redirecting to eSewa...");
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

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
            value: `http://localhost:8000/api/Payment/complete-payment/${ProductId}`,
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
      console.log("Payment process initiated.");
    } catch (error) {
      console.log("Error during payment process:", error);
    }
  };

  const setQuantityForItem = (itemId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate total price for the entire cart (optional global total)
  const totalCartPrice = cart.reduce(
    (acc, item) => acc + (item?.ProductId?.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <div className="w-full flex">
        <button className="bg-white" onClick={() => navigate("/")}>
          back
        </button>
      </div>
      <h1 className="text-black font-extrabold text-5xl mb-8">
        {auth?.user?.name}'s Cart
      </h1>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">
          Total Price: ${totalCartPrice.toFixed(2)}
        </h2>
      </div>
      
      {cart.length > 0 ? (
        <div className="w-full max-w-3xl space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
            >
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border">
                <img
                  src={item?.ProductId?.image?.url || "https://via.placeholder.com/100"}
                  alt={item?.ProductId?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex w-full">
                <div className="ml-6 flex flex-col">
                  <h2 className="text-black font-semibold text-xl">
                    {item?.ProductId?.name || "Unknown Product"}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Price: <span className="font-semibold">${item?.ProductId?.price}</span>
                  </p>
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantityForItem(item._id, item.quantity - 1)}
                      className="px-2 py-1 text-white bg-red-500 rounded"
                    >
                      -
                    </button>
                    <p className="text-gray-600 text-lg mx-4">
                      Quantity: <span className="font-semibold">{item.quantity || 1}</span>
                    </p>
                    <button
                      onClick={() => setQuantityForItem(item._id, item.quantity + 1)}
                      className="px-2 py-1 text-white bg-green-500 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Display total price for each cart item instead of "hello" */}
                <div className="bg-black text-white flex justify-normal p-2">
                  ${ (item?.ProductId?.price * (item.quantity || 1)).toFixed(2) }
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() =>
                    Buy(item.ProductId, item.quantity, item.ProductId.price * item.quantity)
                  }
                  className="px-10 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => removeCart(item._id)}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
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
