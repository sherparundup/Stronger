import React from 'react';
import Header from './Header';
import Footer from './Footer';
import toast, { Toaster } from 'react-hot-toast';


const Layout = (props) => {
  return (
    <div>
      <Header />
      <main className="h-svh">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#333', color: '#fff' },
          }}
        />
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
