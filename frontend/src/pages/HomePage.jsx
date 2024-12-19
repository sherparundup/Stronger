import React from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../Context/AuthContext'

const HomePage = () => {
  const [auth,setAuth]=useAuth(  );
  return (
    <Layout>

    <div>HomePage</div>
    <pre>{JSON.stringify(auth)}</pre>
    </Layout>
  )
}

export default HomePage