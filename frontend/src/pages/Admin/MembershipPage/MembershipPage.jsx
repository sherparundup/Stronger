import React, { useEffect, useState } from 'react'
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import CreatedMembershipPage from './CreatedMembershipPage'
import axios from 'axios'
import { useAuth } from '../../../Context/AuthContext'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateMembershipPage from './UpdateMembershipPage'
import { useAdminMembershipState } from '../../../Context/AdminMembershipStateContext'
import toast from 'react-hot-toast'


const MembershipPage = () => {
  const [mode, setMode] = useAdminMembershipState('ViewMembership')
  const [selectedMembership, setSelectedMembership] = useState(null);


  const [memberships, setMemberships] = useState([])
  const [auth] = useAuth()
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await axios.get(" http://localhost:8000/api/membership/getAllMembership", {
          headers: {
            Authorization: auth?.token
          }
        })
        setMemberships(res.data.data)

      } catch (error) {
        console.log(error)

      }
    }
    fetchMemberships();

  }, [mode])
  const editProduct = (_id) => {
    setSelectedMembership(_id);  // Store selected membership ID
    setMode("UpdateMembership");
  };

  const deleteProduct=async(_id)=>{
    try {
      const res=await axios.delete(`http://localhost:8000/api/membership/deleteMembership/${_id}`,{
        headers:{
          Authorization:auth?.token
        }
      })
      if(res.data.success){
        setMode("viewMembership")
        toast.success("deleted successfully")

      }
    } catch (error) {
      console.log(error)
      toast.error("couldnt delete successfully")
      
    }

    
  }
  
  return (
    <>
      <div>MembershipPage</div>
      {mode === "ViewMembership" ? (
        <Button onClick={() => setMode("CreateMembership")}>Add memberships</Button>
      ) : (
        <Button onClick={() => setMode("ViewMembership")}>View memberships</Button>
      )}
      {
        mode==="CreateMembership" &&  <CreatedMembershipPage/>
      }
  
      {mode === "UpdateMembership" ? (
        <UpdateMembershipPage membershipId={selectedMembership} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Membership Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Membership Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memberships.length > 0 &&
                memberships.map((membership) => (
                  <TableRow key={membership._id}>
                    <TableCell>{membership.MembershipName}</TableCell>
                    <TableCell>{membership.price}</TableCell>
                    <TableCell>{membership.duration}</TableCell>
                    <TableCell>{membership.description}</TableCell>
                    <TableCell>{membership.membershipType}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => editProduct(membership._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => deleteProduct(membership._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
  
}
export default MembershipPage
