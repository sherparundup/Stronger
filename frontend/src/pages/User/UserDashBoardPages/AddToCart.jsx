import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddToCart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:8000/api/Product/getCart",
          {
            headers: { Authorization: auth?.token },
          }
        );
        setCart(res.data.data || []);
        // Initialize selected items state
        const initialSelectedState = {};
        (res.data.data || []).forEach((item) => {
          initialSelectedState[item._id] = false;
        });
        setSelectedItems(initialSelectedState);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load cart items");
      } finally {
        setIsLoading(false);
      }
    };
    if (auth?.token) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [auth]);

  const removeCart = async (_id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/Product/removeCart/${_id}`,
        {
          headers: { Authorization: auth?.token },
        }
      );
      setCart((prevCart) => prevCart.filter((item) => item._id !== _id));
      // Also update selected items state
      setSelectedItems((prev) => {
        const updated = { ...prev };
        delete updated[_id];
        return updated;
      });
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
        console.log(
          "Payment initialization successful. Redirecting to eSewa..."
        );
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
      toast.error("Payment process failed");
    }
  };

  const setQuantityForItem = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleToggleSelect = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedItems).every((status) => status);
    const newSelectedState = {};
    cart.forEach((item) => {
      newSelectedState[item._id] = !allSelected;
    });
    setSelectedItems(newSelectedState);
  };

  // Get only selected items
  const selectedCartItems = cart.filter((item) => selectedItems[item._id]);

  // Calculate total price for selected items
  const selectedItemsPrice = selectedCartItems.reduce(
    (acc, item) => acc + (item?.ProductId?.price || 0) * (item.quantity || 1),
    0
  );

  // Calculate total price for the entire cart
  const totalCartPrice = cart.reduce(
    (acc, item) => acc + (item?.ProductId?.price || 0) * (item.quantity || 1),
    0
  );

  // Calculate total items in cart
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Process checkout for selected items
  const checkoutSelected = async () => {
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;

    if (selectedCount === 0) {
      toast.error("Please select at least one item to checkout");
      return;
    }

    if (!auth?.token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    setProcessingCheckout(true);

    try {
      const UserId = auth?.user?._id;

      // Get selected items details
      const items = selectedCartItems.map((item) => ({
        ProductId: item.ProductId._id,
        quantity: item.quantity || 1,
        price: item.ProductId.price,
      }));

      // Create a bulk checkout request
      const res = await axios.post(
        "http://localhost:8000/api/Payment/initialize-bulk-esewa",
        {
          items,
          totalAmount: selectedItemsPrice,
          UserId,
        },
        {
          headers: { Authorization: auth?.token },
        }
      );

      console.log("Bulk checkout response:", res.data);

      if (res.data.success) {
        const signature = res.data.payment.signature;
        const signed_field_names = res.data.payment.signed_field_names;
        const transaction_uuid = res.data.purchasedProductData._id;
        console.log(
          "Payment initialization successful. Redirecting to eSewa..."
        );
        console.log(signature, signed_field_names, transaction_uuid);
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        const fields = [
          { name: "amount", value: selectedItemsPrice },
          { name: "tax_amount", value: "0" },
          { name: "total_amount", value: selectedItemsPrice },
          { name: "transaction_uuid", value: transaction_uuid },
          { name: "product_code", value: "EPAYTEST" },
          { name: "product_service_charge", value: "0" },
          { name: "product_delivery_charge", value: "0" },
          {
            name: "success_url",
            value: `http://localhost:8000/api/Payment/complete-bulk-payment/${transaction_uuid}`,
          },
          { name: "failure_url", value: "http://localhost:5173/cart" },
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
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout process failed");
    } finally {
      setProcessingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md py-4 px-6 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-700 hover:text-blue-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-800">My Shopping Cart</h1>
          <div className="w-24"></div> {/* Placeholder for balance */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Cart Summary */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* User Welcome */}
              <div className="bg-white p-6 rounded-lg shadow-md flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome, {auth?.user?.name || "Guest"}
                </h2>
                <p className="text-gray-600">
                  You have {totalItems} {totalItems === 1 ? "item" : "items"} in
                  your cart
                </p>
              </div>

              {/* Cart Total */}
              <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {Object.values(selectedItems).some(Boolean)
                        ? "Selected Items"
                        : "Cart Total"}
                    </h2>
                    <p className="text-blue-100">
                      {Object.values(selectedItems).filter(Boolean).length} of{" "}
                      {cart.length} items selected
                    </p>
                  </div>
                  <div className="text-3xl font-bold">
                    rs
                    {Object.values(selectedItems).some(Boolean)
                      ? selectedItemsPrice.toFixed(2)
                      : "0.00"}
                  </div>
                </div>
                {cart.length > 0 && (
                  <button
                    className={`mt-4 w-full py-2 px-4 rounded-md font-semibold transition ${
                      processingCheckout
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-white text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={checkoutSelected}
                    disabled={processingCheckout}
                  >
                    {processingCheckout ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : Object.values(selectedItems).some(Boolean) ? (
                      `Checkout Selected Items (${
                        Object.values(selectedItems).filter(Boolean).length
                      })`
                    ) : (
                      "Select Items to Checkout"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items */}
            {cart.length > 0 ? (
              <div className="space-y-4">
                {/* Select All Option */}
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="select-all"
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={
                        cart.length > 0 &&
                        Object.values(selectedItems).every(Boolean)
                      }
                      onChange={handleSelectAll}
                    />
                    <label
                      htmlFor="select-all"
                      className="ml-2 text-gray-700 font-medium"
                    >
                      Select All Items
                    </label>
                  </div>
                </div>

                {cart.map((item) => (
                  <div
                    key={item._id}
                    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden ${
                      selectedItems[item._id] ? "border-2 border-blue-500" : ""
                    }`}
                  >
                    <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                      {/* Checkbox for selection */}
                      <div className="flex items-center self-center md:self-start">
                        <input
                          type="checkbox"
                          id={`select-${item._id}`}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          checked={selectedItems[item._id] || false}
                          onChange={() => handleToggleSelect(item._id)}
                        />
                      </div>

                      {/* Product Image */}
                      <div className="w-full md:w-24 h-40 md:h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
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
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {item?.ProductId?.name || "Unknown Product"}
                        </h3>
                        <p className="text-gray-500 mb-3">
                          Product ID:{" "}
                          {item?.ProductId?._id?.substring(0, 8) || "N/A"}
                        </p>

                        <div className="flex flex-wrap justify-between items-center gap-4">
                          {/* Price */}
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <span className="ml-2 text-gray-800 font-medium">
                             rs{item?.ProductId?.price}
                            </span>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() =>
                                setQuantityForItem(
                                  item._id,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                              disabled={(item.quantity || 1) <= 1}
                            >
                              −
                            </button>
                            <span className="px-4 py-1 font-medium">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                setQuantityForItem(
                                  item._id,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="bg-gray-100 px-3 py-1 rounded-md">
                            <span className="text-gray-500">Subtotal:</span>
                            <span className="ml-2 text-gray-800 font-semibold">
                              rs
                              {(
                                (item?.ProductId?.price || 0) *
                                (item.quantity || 1)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <button
                          onClick={() =>
                            Buy(
                              item.ProductId,
                              item.quantity,
                              item.ProductId.price * item.quantity
                            )
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex-1"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => removeCart(item._id)}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition flex-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-8">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {/* Selected Items Floating Action Button - shows when items are selected */}
            {Object.values(selectedItems).some(Boolean) &&
              !processingCheckout && (
                <div className="fixed bottom-6 right-6 z-10">
                  <button
                    onClick={checkoutSelected}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Checkout Selected (
                    {Object.values(selectedItems).filter(Boolean).length})
                  </button>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
