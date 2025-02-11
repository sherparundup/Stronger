import React, { createContext, useContext, useState } from 'react'

const AdminMembershipContext=createContext();
const AdminMembershipStateProvider = ({children}) => {
  const [mode, setMode] = useState("ViewMembership");
  return (
    <AdminMembershipContext.Provider value={[mode,setMode]}>
      {children}
    </AdminMembershipContext.Provider>
  )
}
const useAdminMembershipState=()=>useContext(AdminMembershipContext);

export {AdminMembershipStateProvider,useAdminMembershipState}