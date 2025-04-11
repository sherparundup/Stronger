import React from 'react'
import { UseIsCoachVerified } from '../../../Context/isCoachVerified.context'

const clients = () => {
  const [isVerified,setIsVerified]=UseIsCoachVerified();
  return (
    <div>
      {
        isVerified ?<>hiiiii</>:<>nooo</>
      }
    </div>
  )
}

export default clients