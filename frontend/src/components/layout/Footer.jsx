import React from 'react'
import Map from '../Footer.components/Maps'
import Contact from '../Footer.components/ContactUs'
import FAQ from '../Footer.components/FAQ'

const Footer = () => {
  return (
    <>
    <div className='flex-col'>
      <Contact/>
      <FAQ/>

    </div>
    
    </>
  )
}

export default Footer