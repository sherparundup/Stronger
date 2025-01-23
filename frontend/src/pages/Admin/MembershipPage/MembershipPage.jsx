import React, { useEffect, useState } from 'react'
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import CreatedMembershipPage from './CreatedMembershipPage'
import axios from 'axios'
import { useAuth } from '../../../Context/AuthContext'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const MembershipPage = () => {
  const [mode, setMode] = useState('ViewMembership')
  const [memberships, setMemberships] = useState([])
  const [auth]  = useAuth()
  useEffect(()=>{
    const fetchMemberships= async()=>{
      try {
        const res= await axios.get(" http://localhost:8000/api/membership/getAllMembership",{
          headers:{
            Authorization:auth?.token
          }
        })
        setMemberships(res.data.data)
        
      } catch (error) {
        console.log(error)
        
      }
    }
    fetchMemberships();

  },[])
  const editProduct =async () => {

  }
  const deleteProduct = async () => {

  }
  return (
    <>
      <div>MembershipPage</div>
      <Button onClick={() => setMode("CreateMembership")} >Add memberships</Button>
      {mode === "CreateMembership" ? <CreatedMembershipPage /> :
       <>
       <TableContainer component={Paper}>
        <Table>
        <TableHead>
          <TableRow>
            
          <TableCell>Membership Name</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Duration</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Membership Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {memberships.length>0 && memberships.map((membership)=>{
            return(
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
            )
          })}
        </TableBody>
        

          
        </Table>

       </TableContainer>
       </>
      }
     
    </>



  )
}

export default MembershipPage