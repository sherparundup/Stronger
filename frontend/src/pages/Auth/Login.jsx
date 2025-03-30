import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../Context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8000/api/auth/login`, {
        email,
        password,
      
        
        });
      if (res.status === 200 ) {
        toast.success('Successfully logged in!');
        if (res.data.success === true) {
          console.log("onichan")
        }
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token
        })
        localStorage.setItem("auth", (JSON.stringify(res.data)))
        if(res.data?.user?.role=="user"){
          navigate('/'); 
          
        }
        else if(res.data?.user?.role=="admin"){
          navigate('/admindashboard'); 


        }
        else if(res.data?.user?.role=="coach"){
          navigate('/'); 


        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid username or password.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Toaster />
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label

                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                email
              </label>
              <input
                type="text"

                placeholder="Enter your email"
                className="mt-1 w-full p-2.5 border rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="mt-1 w-full p-2.5 border rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Log In
            </button>

            {/* Redirect to Sign Up */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign Up
              </Link>
              <br/>
              <Link
                to="/forgetPassword"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                forgetPassword?
              </Link>

            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
