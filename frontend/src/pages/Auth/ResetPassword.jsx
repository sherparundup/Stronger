import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Extract reset token from URL
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);
      const url = `http://localhost:8000/api/auth/reset-password/${token}`; // Updated URL
      const response = await axios.post(url, {
        password: newPassword, // Send new password only
      });

      if (response.data.success) {
        toast.success("Password reset successfully!", { autoClose: 3000 });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(response.data.message || "Reset failed.", { autoClose: 3000 });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again.",
        { autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
                <LockResetIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ textAlign: "center", mt: 2 }}>
                Reset Your Password
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="newpassword"
                  name="newpassword"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmpassword"
                  name="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default ResetPassword;
