  import React from 'react'
  import DonutPieChart from "../../../components/admin.component/donutPieChart"
  import RevenueChart from '../../../components/admin.component/revenuechart'
  import BarChartComponent from '../../../components/admin.component/barchart'

  const dashboardPages = () => {
    return (
      <div className="p-4">
        <div className="min-h-screen flex-col">
          {/* Dashboard Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm">Analytics and key metrics</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side - 2/3 width */}
            <div className="flex-col w-full md:w-2/3 space-y-6">
              {/* Donut Chart Card */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <h2 className="text-lg font-semibold mb-3">Distribution Analysis</h2>
                <div className="flex-col justify-center h-64">
                  <DonutPieChart />  
                </div>
              </div>
              
              {/* Bar Chart Card */}
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <h2 className="text-lg font-semibold mb-3">Performance Metrics</h2>
                <div className="flex-col justify-center h-64">
                  <BarChartComponent />  
                </div>
              </div>
            </div>
            
            {/* Right side - 1/3 width */}
            <div className="flex w-full md:w-1/3">
              <div className="flex-col justify-center w-full">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100 h-full">
                  <h2 className="text-lg font-semibold mb-3">Revenue Overview</h2>
                  <RevenueChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default dashboardPages