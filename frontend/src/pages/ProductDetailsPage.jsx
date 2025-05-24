import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [auth] = useAuth();
  const [bought_product_or_no, setBought_product_or_no] = useState(false);
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [review, setReview] = useState("");
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/Product/getSingleProduct/${id}`
        );
        setProduct(data.product);
        setStock(data.product.countInStock); 
        
        // Check if the user has bought the product
        if (auth?.token) {
          await checkIfUserBoughtTheProduct(data.product?._id);
        }
       
      } catch (error) {
        console.error("Errors fetching product:", error);
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
      } catch (error) {
        console.error("Error checking purchase:", error);
      }
    };

    fetchProduct();
  }, [id, auth?.token]);

  useEffect(() => {
    if (product?._id) {
      fetchAvgRating();
    }
  }, [product]);

  const fetchAvgRating = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/UserTestimonial/AvgTestimonial/${product._id}`
      );
      setAvgRating(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const AddingToCart = async () => {
    try {
      if(!auth?.user?._id){
        toast.error("Please login to add products in the cart");
        return;
      }
       if (stock < quantity) {
        toast.error("No stock available at the moment");
        return;
      }
      
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

  const incrimentQuantity = () => {
    if (quantity < stock) { // Only increment if quantity is less than stock
        setQuantity(quantity + 1);
    } else {
        toast.error("Please order less than the stock available.");
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
        toast.success("Review added");
        setReview("");
        setRating(0);
        fetchAvgRating();
      } else {
        toast.error("Review not added");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const Buy = async (Product, quantity, totalPrice) => {
    try {
      if(!auth?.user?._id){
        toast.error("Please login to buy products");
        return;
      }
      
      if (stock < quantity) {
        toast.error("No stock available at the moment");
        return;
      }
      
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
    <div className="min-h-screen max-w-full text-gray-800 px-4 sm:px-6 py-6 sm:py-12">
      {/* Back button */}
      <div className="w-full max-w-7xl mx-auto">
        <button 
          onClick={() => navigate("/ProductsPage")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 sm:mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Products
        </button>
        
        {/* Product details section */}
        <div className="w-full flex flex-col md:flex-row mt-6">
          {/* Product image */}
          <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center mb-6 md:mb-0">
            <img
              src={product?.image?.url}
              alt={product.name}
              className="w-full max-w-sm rounded-lg shadow-lg object-cover"
            />
          </div>
          
          {/* Product info */}
          <div className="w-full md:w-1/2 lg:w-2/3 md:pl-6 lg:pl-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mt-3 font-semibold">
              Rs {product.price}
            </p>
            
            {/* Rating */}
            <div className="mt-4">
              <StarRating rating={avgRating} readOnly={true} />
            </div>
            
            {/* Stock info */}
            <div className="text-sm mt-2 text-gray-600">
              In stock: {stock}
            </div>
            
            {/* Quantity selector */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <p className="text-base sm:text-lg font-medium">Quantity:</p>
              <div className="flex items-center space-x-3 bg-gray-200 p-2 rounded-lg">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-lg text-gray-800 text-lg font-bold"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-lg font-semibold min-w-8 text-center">{quantity}</span>
                <button
                  onClick={incrimentQuantity}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-lg text-gray-800 text-lg font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => Buy(product, quantity, product.price * quantity)}
                className="w-full sm:w-auto px-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-base sm:text-lg font-semibold transition-shadow shadow-md hover:shadow-lg"
              >
                Buy Now
              </button>
              <button
                onClick={AddingToCart}
                className="w-full sm:w-auto px-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-base sm:text-lg font-semibold transition-shadow shadow-md hover:shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Product description */}
        <div className="mt-10 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Description</h2>
          <div className="text-base sm:text-lg text-gray-700">{product.description}</div>
        </div>
        
        {/* Review section - only shown if user has bought the product */}
        {bought_product_or_no && (
          <div className="mt-10 sm:mt-12 bg-gray-50 p-4 sm:p-6 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Add a Review</h2>
            
            <div className="flex items-center mb-4">
              <StarRating onRate={handleRatingChange} />
            </div>
            
            <div className="mt-4">
              <label htmlFor="review" className="text-lg font-medium block mb-2">Your Review</label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this product..."
                className="mt-1 p-3 w-full h-24 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button 
                onClick={reviewSubmit}
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-shadow shadow-md hover:shadow-lg"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}
        
        {/* Product reviews section */}
        <div className="mt-10 sm:mt-16 mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Product Reviews</h2>
          
          <div className="w-full border border-gray-300 rounded-lg p-4">
            <UserTestimonial product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;