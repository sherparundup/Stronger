import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/AuthContext'
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import Spinner from './Spinner';
import env from "dotenv"
env.config()
const ProtectedAdminRoutes = () => {
    const [ok, setOk] = useState(false)
    const [auth, setAuth] = useAuth();

    useEffect(() => {
        const checkIfAdmin = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/auth/admin-auth", {
                    headers: {
                        Authorization: auth?.token
                    }
                })


            } catch (error) {
                console.log(error)

            } if (res.data.ok) {

                setOk(true)
            }
            if (auth?.token) {
                checkIfAdmin();
            }
        }


    }, [auth?.token])
    return (
        <>
            {ok ? <Outlet /> : <Spinner />}
        </>
    )
}

export default ProtectedAdminRoutes