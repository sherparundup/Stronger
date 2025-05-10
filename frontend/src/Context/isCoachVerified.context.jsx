import { createContext, useContext, useEffect, useState } from "react";

const IsCoachVerifiedContext=createContext();


const IsCoachVerifiedProvider=({children})=>{
    
    const [isCoachVerified,setisCoachVerified]=useState(false);
    
    useEffect(() => {
        const data = localStorage.getItem("isCoachVerified");
        const parsed = JSON.parse(data);
        setisCoachVerified(parsed ?? false); // fallback to false if null
    }, []);
    
   return(
    <>
    <IsCoachVerifiedContext.Provider value={ [isCoachVerified,setisCoachVerified]}>

        {children}
    </IsCoachVerifiedContext.Provider>
    </>
   )
}

const UseIsCoachVerified=()=>useContext(IsCoachVerifiedContext);
export {UseIsCoachVerified,IsCoachVerifiedProvider}



