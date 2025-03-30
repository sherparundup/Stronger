import React from 'react'
import DonutPieChart from "../../../components/admin.component/donutPieChart"
import RevenueChart from '../../../components/admin.component/revenuechart'
const dashboardPages = () => {
  return (
    <div>
      <div className=" min-h-screen flex-col">
        <div className="flex">
          <div className="flex w-2/3">
          <div className="flex-col justify-center">
            <DonutPieChart/>
            
          </div>
          
          
          </div>
          <div className="flex  w-1/3">
          <div className="flex-col justify-center">
          <RevenueChart/>
          </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default dashboardPages