import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/RatingStar";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";
import EsewaPaymentForm from "./User/EsewaPaymentForm";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/Product/getSingleProduct/${id}`
        );
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);
  const completePayment = async () => {
    const res = await axios.get("http://localhost:8000/api/Product/addToCart");
    console.log("ok")
    console.log(res)
  };
  const AddingToCart = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/Product/addToCart",
        {
          product,
          quantity,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (res.data.success) {
        toast.success("Added to Cart");
      }

      console.log();
    } catch (error) {
      console.log(error.message);
    }
  };
  const Buy = async (Product, quantity, totalPrice) => {
    try {
      const ProductId = Product._id;
      const res = await axios.post(
        "http://localhost:8000/api/Payment/initialize-esewa",
        { ProductId, quantity, totalPrice },
        {
          headers: { Authorization: auth?.token },
        }
      );
      // transaction_uuid

      console.log(res);
      console.log(res.data.payment.signature);
      const signature = res.data.payment.signature;
      const signed_field_names = res.data.payment.signed_field_names;
      const transaction_uuid = res.data.purchasedProductData._id;
      if (res.data.success) {
        // Dynamically create a form element
        console.log("ok");
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

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
            value: "http://localhost:8000/api/Payment/complete-payment",
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

        // Append the form to the body and submit it
        document.body.appendChild(form);
        form.submit();
        // completePayment();
      }

      console.log("wooooo");
    } catch (error) {
      console.log(error);
    }
  };
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen  text-gray-800 flex flex-col lg:flex-row items-center lg:items-start px-6 py-12">
        <div className=" w-[40px]">
          <button
            onClick={() => {
              navigate("/ProductsPage");
            }}
          >
            back
          </button>
        </div>
        <div className="w-full  flex-col mt-[100px]">
          <div className="w-full  flex ">
            <div className="w-full lg:w-1/3 flex justify-center">
              <img
                src={product?.image?.url}
                alt={product.name}
                className="w-full max-w-sm rounded-lg shadow-lg object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-2/3 px-6 lg:px-12 py-6">
              <h1 className="text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-2xl text-gray-700 mt-3 font-semibold">
                Rs {product.price}
              </p>
              <div className="mt-[20px]">
                <StarRating />
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center space-x-6">
                <p className="text-lg font-medium">Quantity:</p>
                <div className="flex items-center space-x-3 bg-gray-200 p-2 rounded-lg">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-lg text-gray-800 text-xl font-bold"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-lg text-gray-800 text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="flex gap-x-[20px]">
                <button
                  onClick={() =>
                    Buy(product, quantity, product.price * quantity)
                  }
                  className="mt-8 w-[20px] lg:w-1/5 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold transition-shadow shadow-md hover:shadow-lg"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => AddingToCart()}
                  className="mt-8 w-[20px] lg:w-1/5 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold transition-shadow shadow-md hover:shadow-lg"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
          <div className="flex-col mt-[50px]">
            <div className="text-2xl">{product.description}</div>{" "}
          </div>
          {/* testimonial ko  */}
          <div className="flex-col text-5xl font-bold mt-[50px]">
            <div className=""> product review of {product.name}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;