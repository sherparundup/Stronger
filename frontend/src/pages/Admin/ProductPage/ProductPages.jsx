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
    <div className=" min-h-screen p-6 text-white">
      <Typography
        variant="h4"
        gutterBottom
        className="cursor-pointer text-green-500 hover:text-green-400 transition"
        onClick={() => setMode('viewProduct')}
      >
        Products Page
      </Typography>

      {mode === 'viewProduct' ? (
        <Button
          variant="contained"
          onClick={() => setMode('addProduct')}
          style={{
            backgroundColor: '#1f2937',
            color: 'white',
            marginBottom: '20px',
            fontWeight: 'bold',
          }}
        >
          Add Product
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => setMode('viewProduct')}
          style={{
            backgroundColor: '#1f2937',
            color: 'white',
            marginBottom: '20px',
            fontWeight: 'bold',
          }}
        >
          View Products
        </Button>
      )}

      {mode === 'viewProduct' ? (
        <TableContainer component={Paper} style={{ backgroundColor: '#111827', color: 'white' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Product Name', 'Description', 'Price', 'Count In Stock', 'Category', 'Created At', 'Image', 'Actions'].map((head) => (
                  <TableCell key={head} style={{ color: '#9CA3AF', fontWeight: 'bold' }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {allProducts.length > 0 ? (
                allProducts.map((product) => (
                  <TableRow key={product._id} style={{ color: 'white' }}>
                    <TableCell style={{ color: 'white' }}>{product.name}</TableCell>
                    <TableCell style={{ color: 'white' }}>{product.description}</TableCell>
                    <TableCell style={{ color: 'white' }}>nrs{product.price}</TableCell>
                    <TableCell style={{ color: 'white' }}>{product.countInStock}</TableCell>
                    <TableCell style={{ color: 'white' }}>{product.catagory}</TableCell>
                    <TableCell style={{ color: 'white' }}>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {product.image?.url ? (
                        <img
                          src={product.image.url}
                          alt={product.name}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                      ) : (
                        'No image available'
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => editProduct(product._id)}>
                        <EditIcon style={{ color: '#10B981' }} />
                      </IconButton>
                      <IconButton onClick={() => deleteProduct(product._id)}>
                        <DeleteIcon style={{ color: '#EF4444' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" style={{ color: 'white' }}>
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
    </div>
  );
};

export default ProductPages;
