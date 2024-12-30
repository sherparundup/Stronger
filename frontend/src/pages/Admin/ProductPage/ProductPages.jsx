import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import AddProductPage from './addProductPage';

const ProductPages = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [mode, setMode] = useState("viewProduct"); // Corrected naming for readability
  const [auth] = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const AllProductData = await axios.get('http://localhost:8000/api/Product/getAllProduct', {
          headers: {
            Authorization: auth?.token
          }
        });

        // Assuming the API response contains the 'products' data
        setAllProducts(AllProductData.data.products); // Ensure correct response structure
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth?.token]); // Effect will run when auth?.token changes

  return (
    <>
      <h1>Product Pages</h1>
      {/* Button to toggle between views */}
      <button onClick={() => setMode(mode === "viewProduct" ? "updateProduct" : "viewProduct")}>
        Toggle View
      </button>

      {/* Conditional Rendering based on mode */}
      {mode === "viewProduct" ? (
        <table className="table table-bordered table-dark">
          <thead>
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Product Description</th>
              <th scope="col">Product Price</th>
              <th scope="col">Product Count In Stock</th>
              <th scope="col">Product Category</th>
              <th scope="col">Product Created At</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.countInStock}</td>
                  <td>{product.category}</td>
                  <td>{product.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <>
        <h1>Update Product</h1>
        <AddProductPage/>
        
        </>
      )}
    </>
  );
};

export default ProductPages;
