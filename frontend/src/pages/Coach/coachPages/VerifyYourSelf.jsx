import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../../../Context/AuthContext";
import axios from "axios";

const CoachVerificationForm = () => {
  const [auth] = useAuth();
  const [user, setUser] = useState("");

  const [formData, setFormData] = useState({
    user: "",
    name: "",
    email: "",
    phone: "",
    bio: "",
    pricePerSession: "",
    instagram: "",
    category: "",
    document: null,
  });

  useEffect(() => {
    if (auth?.user) {
      setFormData((prev) => ({
        ...prev,
        name: auth.user.name || "",
        email: auth.user.email || "",
      }));
      setUser(auth.user._id);
      console.log("hiii",auth.user._id);
    }
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, document: e.target.files[0] }));
  };

  const sendVerification = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user", user);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("pricePerSession", formData.pricePerSession);
      formDataToSend.append("instagram", formData.instagram);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("document", formData.document);

      const response = await axios.post(
        "http://localhost:8000/api/coach/verifyYourSelf",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth?.token,
          },
        }
      );

      console.log(response.data);
      toast.success("Verification Request Sent!");
    } catch (error) {
      console.log(error.message);
      toast.error("Verification Failed!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendVerification();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f4f8",
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={5} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Coach Verification Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <TextField
              label="Short Bio"
              name="bio"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={formData.bio}
              onChange={handleChange}
            />

            <TextField
              label="Instagram Link"
              name="instagram"
              fullWidth
              margin="normal"
              value={formData.instagram}
              onChange={handleChange}
            />

            <TextField
              label="Price Per Session (in Rs)"
              name="pricePerSession"
              type="number"
              fullWidth
              margin="normal"
              value={formData.pricePerSession}
              onChange={handleChange}
              required
            />
            <TextField
              select
              label="Category"
              name="category"
              fullWidth
              margin="normal"
              value={formData.category}
              onChange={handleChange}
              SelectProps={{ native: true }}
              required
            >
              <option value="">-- Select Category --</option>
              <option value="Strength Training">Strength Training</option>
              <option value="Dance">Dance</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Boxing">Boxing</option>
            </TextField>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={handleFileChange}
              style={{ marginTop: 20, display: "block" }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 3, padding: 1 }}
            >
              Submit Verification
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CoachVerificationForm;
