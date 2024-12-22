import { useState } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import toast, { Toaster } from 'react-hot-toast';

import Typography from "@mui/material/Typography";
import "react-toastify/dist/ReactToastify.css";

import Container from "@mui/material/Container";
import { Card, CardContent } from "@mui/material";

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [email, setEmail] = useState(""); // Email input state
    const [error, setError] = useState(""); // Error state

    // Validate the email format (basic check)
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            setIsLoading(true); // Set loading to true
            setError(""); // Reset previous error message
        


            const url = "http://localhost:8000/api/auth/forget-password"; // Make sure the URL is correct
            const res = await axios.post(url, { email });

            // Handle response
            if (res.data.success === false) {
                toast.error(res.data.message, {
                    autoClose: 5000,
                    position: "top-right",
                });
            } else {
                toast.success(res.data.message, {
                    autoClose: 5000,
                    position: "top-right",
                });
            }
        } catch (error) {
            setError("Failed to send reset email. Please try again later.");
            toast.error("An error occurred. Please try again later.", {
                autoClose: 5000,
                position: "top-right",
            });
        } finally {
            setIsLoading(false); // Set loading to false after the request
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Card sx={{ boxShadow: 4 }}>
                    <CardContent sx={{ m: 3 }}>
                        <Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
                            Forgot Password
                        </Typography>

                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Bind email to state
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isLoading} // Disable button while loading
                            >
                                {isLoading ? "Sending..." : "Reset Password"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default ForgotPassword;
