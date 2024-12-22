import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './Context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
      {/* Toaster component to display toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000, // Duration for the toast
          style: { background: '#333', color: '#fff' }, // Custom styles
        }}
      />
    </BrowserRouter>
  </AuthProvider>
);
