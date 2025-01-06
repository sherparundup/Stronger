import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../../Context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAdminProductPageMode } from '../../../Context/AdminProductPageModeContext';
const UpdateProductPage = ({ productId ,refreshProducts}) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    countInStock: '',
    catagory: '',
    image: null,
  });
  const [auth] = useAuth();
  const [mode, setMode] = useAdminProductPageMode("viewProduct");
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch product data to pre-fill the form
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/Product/getSingleProduct/${productId}`, {
            headers: {
              Authorization: auth?.token,
            }
          }
        );

        setProduct(response.data.product);
      } catch (err) {
        setError('Error fetching product data');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId, auth?.token]);

  // Handle image file change
  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Log product data before submission
    console.log("Submitting product:", product);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('countInStock', product.countInStock);
    formData.append('catagory', product.catagory);
    if (product.image) {
      formData.append('image', product.image);
    }

    try {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);  // Log each form data entry
      }
      
      const response = await axios.put(
        `http://localhost:8000/api/Product/updateProduct/${productId}`,
        formData,
        {
          headers: { 'Authorization': auth?.token }
        }
      );
      
      console.log("Response from API:", response);
      
      if(response.data.success){
        // Toaster.success('Product updated successfully!');
        refreshProducts();

        setMode("viewProduct");

      } else {
        setError('Error updating product');
      }

    } catch (err) {
      console.error("Error during submission:", err);
      setError('Error updating product');
    } finally {
      setLoading(false);
    }
};


  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Update Product
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                variant="outlined"
                fullWidth
                name="name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                name="description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                type="number"
                name="price"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Count In Stock"
                variant="outlined"
                fullWidth
                type="number"
                name="countInStock"
                value={product.countInStock}
                onChange={(e) => setProduct({ ...product, countInStock: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Catagory"
                variant="outlined"
                fullWidth
                name="catagory"
                value={product.catagory}
                onChange={(e) => setProduct({ ...product, catagory: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'block' }}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Update Product
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
};

export default UpdateProductPage;
