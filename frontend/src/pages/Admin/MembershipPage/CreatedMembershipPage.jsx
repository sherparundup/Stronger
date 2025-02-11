import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../Context/AuthContext';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import MembershipPage from './MembershipPage';
import { useAdminMembershipState } from '../../../Context/AdminMembershipStateContext';

const CreatedMembershipPage = () => {
  const [MembershipName, setMembershipName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [membershipType, setMembershipType] = useState('');
  const [mode,setMode] = useAdminMembershipState('');
  const [auth] = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!MembershipName || !price || !duration || !description || !membershipType) {
      toast.error('Please fill in all fields.');
      console.log('Form validation failed');
      return;
    }
    
    try {
      const res = await axios.post(
        'http://localhost:8000/api/membership/CreateMembership',
        {
          MembershipName,
          price,
          duration,
          description,
          membershipType,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (res.data.success) {
        
        toast.success('Membership Created Successfully');
        setMode("ViewMembership");
      }

    } catch (error) {
      toast.error('Failed to create Membership');
      console.log(error);
    }
  };
  {
    mode==="ViewMembership" && <MembershipPage/>
  }

  return (
    <>
    
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, margin: 'auto', padding: 2, boxShadow: 3, borderRadius: 2 }}
      >
      <Typography variant="h4" align="center" gutterBottom>
        Create Membership
      </Typography>

      <TextField
        label="Membership Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={MembershipName}
        onChange={(e) => setMembershipName(e.target.value)}
        />

      <TextField
        label="Price"
        variant="outlined"
        type="number"
        fullWidth
        margin="normal"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

     <FormControl fullWidth margin="normal">
      <InputLabel id="Duration">Duration</InputLabel>
      <Select labelId="Duration"
      value={duration}
      onChange={(e) => setDuration  (Number(e.target.value))}>
      <MenuItem value="1">1 Month</MenuItem>
      <MenuItem value="3">3 Months</MenuItem>
      <MenuItem value="6">6 Months</MenuItem>
      </Select>
     </FormControl>

      <TextField
        label="Description"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />

      <FormControl fullWidth margin="normal">
        <InputLabel id="membershipType-label
        ">Membership Type</InputLabel>
        <Select
          labelId="membershipType-label"
          value={membershipType}
          onChange={(e) => setMembershipType(e.target.value)}
          >
          <MenuItem value="">Select Membership Type</MenuItem>
          <MenuItem value="Standard">Standard</MenuItem>
          <MenuItem value="Premium">Premium</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
        >
        Create Membership
      </Button>
    </Box>
        </>
  );
};

export default CreatedMembershipPage;
