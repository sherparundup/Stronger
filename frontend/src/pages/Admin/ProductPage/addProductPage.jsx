import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Box,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import { useAuth } from '../../../Context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useAdminProductPageMode } from '../../../Context/AdminProductPageModeContext';

const ProductForm = ({refreshProducts}) => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        countInStock: 0,
        image: null,
        catagory: '',
    });
    const [auth] = useAuth();
    const [mode, setMode] = useAdminProductPageMode();
    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    // Handle image upload
    const handleImageChange = (e) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            image: e.target.files[0], // Set the first file from the file input
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            const response = await axios.post('http://localhost:8000/api/Product/addProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": auth?.token
                },

            });

            if (response.data.success) {
                alert('Product added successfully!');
                setProduct({
                    name: '',
                    description: '',
                    price: 0,
                    countInStock: 0,
                    image: null,
                    catagory: '',
                });
                setMode("viewProduct")// Reset form after successful submission
                refreshProducts(); // Trigger refresh

            } else {
                alert('Failed to add product');
            }

        } catch (error) {
            console.log(error);
            alert('Error adding product');
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Add Product
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            variant="outlined"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            variant="outlined"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Count In Stock"
                            type="number"
                            variant="outlined"
                            name="countInStock"
                            value={product.countInStock}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category-select"
                                value={product.catagory}
                                name="catagory"
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="Supplements">Supplements</MenuItem>
                                <MenuItem value="GymGears">GymGears</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="image-upload"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="image-upload">
                            <Button variant="contained" component="span" fullWidth>
                                Upload Product Image
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Add Product
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default ProductForm;
