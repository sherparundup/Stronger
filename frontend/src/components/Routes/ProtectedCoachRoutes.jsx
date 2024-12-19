import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { data, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedCoachRoutes = () => {
    const [ok,setOk]=useState(false);
    const [auth,setAuth]=useAuth();
    useEffect(()=>{
        const CheckingIfCoach=async()=>{
            const res= axios.get("http://localhost:8000/api/auth/coach-auth",{
                headers:{
                    Authorization:auth?.token
                }
            })
            if(res.data.ok){
                setOk(true);
            }
            if(auth?.token){
                CheckingIfCoach();
            }
        }

    },[auth?.token])

  return (
    <>
    {ok?<Outlet/>:<Spinner/>}
    </>
  )
}

export default ProtectedCoachRoutes