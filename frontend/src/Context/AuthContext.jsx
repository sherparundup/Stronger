import { createContext, useContext, useEffect, useState } from "react";

const AuthContext=createContext();


const AuthProvider=({children})=>{
    
    const [auth,setAuth]=useState({
        user:null,
        token:""
    });
    
    useEffect(()=>{
        const data=localStorage.getItem("auth");
        const InJsonFormatData=JSON.parse(data);
        setAuth(InJsonFormatData);


    },[])
   return(
    <>
    <AuthContext.Provider value={ [auth,setAuth]}>

        {children}
    </AuthContext.Provider>
    </>
   )
}

const useAuth=()=>useContext(AuthContext);
export {useAuth,AuthProvider}



