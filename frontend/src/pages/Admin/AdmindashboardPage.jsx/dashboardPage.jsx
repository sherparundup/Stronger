import React from 'react'
import DonutPieChart from "../../../components/admin.component/donutPieChart"
import RevenueChart from '../../../components/admin.component/revenuechart'
import BarChartComponent from '../../../components/admin.component/barchart'
const dashboardPages = () => {
  return (
    <div>
      <div className=" min-h-screen flex-col">
        <div className="flex">
          <div className="flex-col w-2/3">
          <div className="flex-col justify-center">
            <DonutPieChart/>  
            
          </div>
          <div className="flex-col justify-center">
            <BarChartComponent/>  
            
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