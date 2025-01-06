import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import AddProductPage from './addProductPage';
import UpdateProductPage from './updateProductPage';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminProductPageMode } from '../../../Context/AdminProductPageModeContext';

const ProductPages = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [mode, setMode] = useAdminProductPageMode();
  const [productId, setProductId] = useState(null);
  const [auth] = useAuth();

  // Handler for Edit

  const editProduct = (productId) => {
    setMode('updateProduct');
    setProductId(productId);
  };
  const refreshProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/Product/getAllProduct', {
        headers: { Authorization: auth?.token },
      });
      setAllProducts(res.data.products);
    } catch (error) {
      console.error('Error refreshing products:', error);
      alert('Failed to refresh products. Please try again.');
    }
  };


  // Handler for Delete
  const deleteProduct = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/Product/deleteProduct/${productId}`,
        {
          headers: { Authorization: auth?.token },
        }
      );
      if (res.data.success) {
        alert('Product deleted successfully!');
        setAllProducts((prev) => prev.filter((product) => product._id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  // Fetch Products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/Product/getAllProduct', {
          headers: { Authorization: auth?.token },
        });
        setAllProducts(res.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products. Please try again later.');
      }
    };
    fetchData();
  }, [auth?.token]);

  return (
    <>
      {/* Clickable Title to Reset Mode */}
      <Typography
        variant="h4"
        gutterBottom
        style={{ cursor: 'pointer', color: 'green' }}
        onClick={() => setMode('viewProduct')}
      >
        Products Page
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setMode('addProduct')}
        style={{ marginBottom: '20px' }}
      >
        Add Product
      </Button>

      {mode === 'viewProduct' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Count In Stock</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProducts.length > 0 ? (
                allProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>nrs{product.price}</TableCell>
                    <TableCell>{product.countInStock}</TableCell>
                    <TableCell>{product.catagory}</TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {product.image?.data ? (
                        <img
                          src={`data:${product.image.contentType};base64,${btoa(
                            new Uint8Array(product.image.data.data).reduce(
                              (data, byte) => data + String.fromCharCode(byte),
                              ''
                            )
                          )}`}
                          alt={product.name}
                          style={{ width: '100px', height: '100px' }}
                        />
                      ) : (
                        'No image available'
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => editProduct(product._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => deleteProduct(product._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : mode === 'updateProduct' ? (
        <UpdateProductPage productId={productId} refreshProducts={refreshProducts} />
      ) : (
        <AddProductPage refreshProducts={refreshProducts} />
      )}
    </>
  );
};

export default ProductPages;
