import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import Spinner from './Spinner'


const ProtectedRoutes = () => {
    const [ok,setOK]=useState(false)
    const[auth,setAuth]=useAuth();
    useEffect(()=>{
        
        const fetchData=async()=>{
            try {
                const res=await axios.get("http://localhost:8000/api/auth/user-auth",{
                    headers:{
                        Authorization:auth?.token
                    }
                })
                console.log(res.data.ok)
                if (res.data.ok===true){
                    setOK(true)

                }


                
            } catch (error) {
                console.log(error);
                
            }
        }
        if(auth?.token){

            fetchData();
        }
        





    },[auth?.token])
  return (
<>
{ok===true?<Outlet/>:<Spinner/>}
</>  )
}

export default ProtectedRoutes