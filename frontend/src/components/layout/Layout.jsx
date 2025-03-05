import React from 'react';
import Header from './Header';
import Footer from './Footer';
import toast, { Toaster } from 'react-hot-toast';

const Layout = (props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
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
