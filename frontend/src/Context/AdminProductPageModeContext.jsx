import React, { createContext, useContext, useState } from 'react';

// Create the context for managing the page mode
const AdminProductPageModeContext = createContext();

// Provider to wrap components that need access to this context
const AdminProductPageModeProvider = ({ children }) => {
  const [mode, setMode] = useState("viewProduct"); // Initial mode set to 'viewProduct'

  return (
    <AdminProductPageModeContext.Provider value={[mode, setMode]}>
      {children}
    </AdminProductPageModeContext.Provider>
  );
};

// Custom hook to use the context
const useAdminProductPageMode = () => {
  const context = useContext(AdminProductPageModeContext);
  if (!context) {
    throw new Error("useAdminProductPageMode must be used within AdminProductPageModeProvider");
  }
  return context; // Returns an array [mode, setMode]
}

export { useAdminProductPageMode, AdminProductPageModeProvider };
