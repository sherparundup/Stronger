import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../Context/AuthContext.jsx';
import { useAdminMembershipState } from '../../../Context/AdminMembershipStateContext.jsx';

const UpdateMembershipPage = ({ membershipId }) => {
  const [MembershipName, setMembershipName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [membershipType, setMembershipType] = useState('');
  const [auth] = useAuth();
  const [mode, setMode] = useAdminMembershipState('')


  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/membership/singleMembership/${membershipId}`,
          { headers: { Authorization: auth?.token } }
        );
    
        if (res.data.success) {
          const membership = res.data.data;  
          setMembershipName(membership.MembershipName);
          setPrice(membership.price);
          setDuration(membership.duration);
          setDescription(membership.description);
          setMembershipType(membership.membershipType);
        }
      } catch (error) {
        toast.error('Failed to fetch membership details');
        console.log(error);
      }
    };
    

    if (membershipId) {
      fetchMembership();
    }
  }, [membershipId, auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!MembershipName || !price || !duration || !description || !membershipType) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/api/membership/updateMembership/${membershipId}`,
        { MembershipName, price, duration, description, membershipType },
        { headers: { Authorization: auth?.token } }
      );

      if (res.data.success) {
        toast.success('Membership Updated Successfully');
        setMode("ViewMembership")
      }
      
    } catch (error) {
      toast.error('Failed to update Membership');
      console.log("erooorrr",error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, margin: 'auto', padding: 2, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>Edit Membership</Typography>
      <TextField label="Membership Name" variant="outlined" fullWidth margin="normal" value={MembershipName} onChange={(e) => setMembershipName(e.target.value)} />
      <TextField label="Price" variant="outlined" type="number" fullWidth margin="normal" value={price} onChange={(e) => setPrice(e.target.value)} />
      <FormControl fullWidth margin="normal">
        <InputLabel>Duration</InputLabel>
        <Select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
          <MenuItem value={1}>1 Month</MenuItem>
          <MenuItem value={3}>3 Months</MenuItem>
          <MenuItem value={6}>6 Months</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Description" variant="outlined" multiline rows={4} fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
      <FormControl fullWidth margin="normal">
        <InputLabel>Membership Type</InputLabel>
        <Select value={membershipType} onChange={(e) => setMembershipType(e.target.value)}>
          <MenuItem value="Standard">Standard</MenuItem>
          <MenuItem value="Premium">Premium</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>Update Membership</Button>
    </Box>
  );
};

export default UpdateMembershipPage;
