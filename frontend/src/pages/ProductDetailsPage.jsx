import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import axios from "axios";
import StarRating from "../components/RatingStar";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";
import UserTestimonial from "../components/UserTestimonial";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(1);

  const [auth, setAuth] = useAuth();
  const [bought_product_or_no, setBought_product_or_no] = useState(false);
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [review, setReview] = useState();
  
  useEffect(() => {

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/Product/getSingleProduct/${id}`
        );
        setProduct(data.product);
        setStock(product.countInStock)
        
        
        // Check if the user has bought the product x
        if (auth?.token) {
          await checkIfUserBoughtTheProduct(data.product?._id);
        }
       
      } catch (error) {
        console.error("Errors fetching prodsuct:", error);
      }
    };
   
  

    const checkIfUserBoughtTheProduct = async (productId) => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/Product/checkIfUserBoughtTheProduct/${productId}`,
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );
        if (res.data.success) {
          setBought_product_or_no(true);
        }

        console.log("User has bought this product:", res.data);
      } catch (error) {
        console.error("Error checking purchase:", error);
      }
    };

    fetchProduct();
  }, [id, auth?.token,]);
  const fetchAvgRating = async () => {
    try {

      const res = await axios.get(
        `http://localhost:8000/api/UserTestimonial/AvgTestimonial/${product._id}`
      );
      console.log("Avg Rating Response:", res);
      setAvgRating(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
   fetchAvgRating()
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
    } catch (error) {
      console.log(error.message);
    }
  };
 const incrimentQuantity=()=>{
  if(stock>quantity){

    setQuantity(quantity + 1)
  }
  else{
    toast.error("please order less than the stock")
  }
 }
  const reviewSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/UserTestimonial/addTestomonial",
        {
          user: auth?.user,
          productId: id,
          rating,
          message: review,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (res.data.success) {
        console.log("Sssssssss");
        toast.success("review added");
      } else {
        toast.error("review not added");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    console.log("Received rating from StarRating component:", newRating);
  };
  const Buy = async (Product, quantity, totalPrice) => {
    try {
      const ProductId = Product._id;
      const UserId = auth?.user?._id;
      const res = await axios.post(
        "http://localhost:8000/api/Payment/initialize-esewa",
        { ProductId, quantity, totalPrice, UserId },
        {
          headers: { Authorization: auth?.token },
        }
      );
      const signature = res.data.payment.signature;
      const signed_field_names = res.data.payment.signed_field_names;
      const transaction_uuid = res.data.purchasedProductData._id;
      if (res.data.success) {
        // Dynamically create a form element
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
            value: `http://localhost:8000/api/Payment/complete-payment/${product._id}`,
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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <Layout>
      {bought_product_or_no === true ? (
        <>
          <div className="min-h-screen  max-w-full text-gray-800  flex-col lg:flex-row items-center lg:items-start px-6 py-12">
            <div className="w-[40px]">
              <button onClick={() => navigate("/ProductsPage")}>back</button>
            </div>
            <div className="w-full  flex-col mt-[100px]">
              <div className="w-full flex">
                <div className="w-full lg:w-1/3 flex justify-center">
                  <img
                    src={product?.image?.url}
                    alt={product.name}
                    className="w-full max-w-sm rounded-lg shadow-lg object-cover"
                  />
                </div>
                <div className="w-full lg:w-2/3 px-6 lg:px-12 py-6">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <p className="text-2xl text-gray-700 mt-3 font-semibold">
                    Rs {product.price}
                  </p>
                  <div className="mt-[20px] ">
                  <StarRating rating={avgRating} readOnly={true} />
                  </div>
                  <div className="mt-6 flex items-center space-x-6">
                    <p className="text-lg font-medium">Quantity:</p>
                    <div className="flex items-center space-x-3 bg-gray-200 p-2 rounded-lg">
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-lg text-gray-800 text-xl font-bold"
                      >
                        −
                      </button>
                      <span className="text-xl font-semibold">{quantity}</span>
                      <button
                        onClick={() => incrimentQuantity()}
                        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-lg text-gray-800 text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex">In stock: {stock}</div>
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
                <div className="text-2xl">{product.description}</div>
              </div>
              <div className="flex-col mt-8">
                <div className="text-xl font-semibold">Add a Review</div>

                <div className="flex-col mt-6">
                  <div className="flex items-center">
                    <StarRating onRate={handleRatingChange} />
                  </div>

                  <div className="flex-col mt-4">
                    <div className="text-lg font-medium">Leave a Review</div>
                    <div className="flex">
                      <input
                        onChange={(e) => {
                          setReview(e.target.value);
                        }}
                        type="text"
                        placeholder="Leave a review"
                        className="mt-2 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="" onClick={reviewSubmit}>
                      Submit review
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-5xl pb-24 font-bold mt-12 mb-20">
  <div>Product review of {product.name}</div>
  
  {/* Testimonial container without forced scrolling */}
  <div className="w-full border border-gray-300 rounded-lg p-4">
    <UserTestimonial product={product} />
  </div>
</div>

            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-screen  max-w-full text-gray-800  flex-col lg:flex-row items-center lg:items-start px-6 py-12">
            <div className="w-[40px]">
              <button onClick={() => navigate("/ProductsPage")}>back</button>
            </div>
            <div className="w-full  flex-col mt-[100px]">
              <div className="w-full flex">
                <div className="w-full lg:w-1/3 flex justify-center">
                  <img
                    src={product?.image?.url}
                    alt={product.name}
                    className="w-full max-w-sm rounded-lg shadow-lg object-cover"
                  />
                </div>
                <div className="w-full lg:w-2/3 px-6 lg:px-12 py-6">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <p className="text-2xl text-gray-700 mt-3 font-semibold">
                    Rs {product.price}
                  </p>
                  <div className="mt-[20px] ">
                  <StarRating rating={avgRating} readOnly={true} />
                  </div>
                  <div className="mt-6 flex items-center space-x-6">
                    <p className="text-lg font-medium">Quantity:</p>
                    <div className="flex items-center space-x-3 bg-gray-200 p-2 rounded-lg">
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
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
                <div className="text-2xl">{product.description}</div>
              </div>
            

              <div className="flex flex-col text-5xl pb-24 font-bold mt-12 mb-20">
  <div>Product review of {product.name}</div>
  
  {/* Testimonial container without forced scrolling */}
  <div className="w-full border border-gray-300 rounded-lg p-4">
  <UserTestimonial product={product} />
  </div>
</div>

            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ProductDetailsPage;
