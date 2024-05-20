import React, { useEffect, useRef, useState } from 'react'
import Chart from "react-apexcharts";
import { saveResponseReceived } from './ChatModal/SaveOverallResponse';

function ChartView(prop) {
 
  const chartRef = useRef(null);
  const [chartState, setChartState] = useState(prop.propChartView.graph_data);
  const [chartSize,setChartSize] = useState(400)

  useEffect(()=>{
    const screenWidth = window.innerWidth;
    if(screenWidth>=768){
      setChartSize(400)
    }
    else setChartSize(300)
  },[])




  
  return (
    <div className='chartCnt'>
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            {prop.propChartView.graph_data!='' && prop.propChartView.graph_type!='' ? (
             <div ref={chartRef}>
               <Chart
                options={chartState.options}
                series={chartState.series}
                type={prop.propChartView.graph_type}
                width={chartSize}
              />


              </div>
            ) : (
              <div style={{display:'none'}}>No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>

  
    )
}

export default ChartView
