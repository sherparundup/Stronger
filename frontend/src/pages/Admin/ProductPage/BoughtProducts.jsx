import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BoughtProducts = () => {
  const [products, setProducts] = useState([]);

  // Fetch data only once when the component mounts
  useEffect(() => {
    const fetchBoughtProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/Product/getAllBoughtProduct');
        setProducts(res.data.data);  // Set the response data
        console.log('Products fetched, length:', res.data.data.length);  // Log fetched length
      } catch (error) {
        console.error('Error fetching products:', error.message);  // Handle error
      }
    };

    fetchBoughtProducts();
  }, []);  // Empty dependency array to run only once when the component mounts

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Bought Products</h2>
      {products.length === 0 ? (
        <p className="text-xl text-gray-500">No products found</p>
      ) : (
        <div>
          {products.map((product) => (
            product?.product ? (
              <div key={product?._id} className="mb-6 border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <img src={product?.product?.image?.url} alt={product?.product?.name} className="w-32 h-32 object-cover rounded-lg mr-6" />
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold">{product?.product?.name}</h3>
                    <p className="text-sm text-gray-600">{product?.product?.description}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="text-lg font-semibold">Price: <span className="text-green-600">{product?.product?.price} (per unit)</span></p>
                  <p className="text-lg font-semibold">Quantity: {product?.quantity}</p>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-semibold">Total Price: <span className="text-green-600">{product?.totalPrice}</span></p>
                </div>
                <div className="flex justify-between mt-4">
                  <p className="text-md text-gray-500">Status: {product?.status}</p>
                  <p className="text-md text-gray-500">Purchased on: {new Date(product?.purchasedDate).toLocaleDateString()}</p>
                </div>
                <p className="text-md text-gray-500 mt-2">Payment Method: {product?.paymentMethod}</p>
                <p className="text-md text-gray-500">User: {product?.UserId?.name}</p>
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
};

export default BoughtProducts;
