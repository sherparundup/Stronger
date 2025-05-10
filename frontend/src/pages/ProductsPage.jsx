import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const [productData, setProductData] = useState([]);
  const [category, setCategory] = useState("Supplements"); // default category
  const [searchQuery, setSearchQuery] = useState(""); // state for search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/Product/getAllProduct");
        setProductData(data.products);
        console.log(data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const purchase = async (_id) => {
    try {
      const product = await axios.get(`http://localhost:8000/api/Product/getSingleProduct/${_id}`);
      navigate(`/product/${_id}`);
      console.log(product);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Filtered products based on category and search query
  const filteredProducts = productData
    .filter((product) => product.catagory === category)
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <div className="text-5xl font-bold text-center p-10">Our Products</div>
        
        {/* Search bar */}
        <div className="flex justify-end mr-[100px] mb-8">
          <input
            type="text"
            placeholder="Search Products..."
            className="px-4 py-2 rounded-lg  text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setCategory("Supplements")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              category === "Supplements" ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            Supplements
          </button>
          <button
            onClick={() => setCategory("GymGears")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              category === "GymGears" ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            GymGears
          </button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => purchase(product._id)}
              className="bg-gray-800 flex-col p-5 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center bg-white p-2 rounded-lg">
                <img
                  src={product?.image?.url}
                  alt={product.name}
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-semibold text-white">{product.name}</h2>
                <p className="text-gray-400">
                  Price:{" "}
                  <span className="font-bold text-green-400">
                    Rs {product.price}
                  </span>
                </p>
                <p className="text-gray-400">
                  Stock: <span className="font-bold">{product.countInStock}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
