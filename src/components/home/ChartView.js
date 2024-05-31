import React, { useEffect, useRef, useState } from 'react'
import Chart from "react-apexcharts";

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


useEffect(()=>{
  //to make chart data show numbers in % 
  let graph_type = prop?.propChartView?.graph_type
  if(graph_type == 'pie'){
    setChartState({
      ...prop.propChartView.graph_data,
      options: {
        ...prop.propChartView.graph_data.options,
        tooltip: {
          y: {
            formatter: (val) => `${val}%`
          }
        }
      }
    })
  }
  else if(graph_type == 'line'){
    setChartState({
      ...prop.propChartView.graph_data,
      options: {
        ...prop.propChartView.graph_data.options,
        yaxis: {
          labels: {
            formatter: (val) => `${val}%`
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val}%`
        },
        tooltip: {
          y: {
            formatter: (val) => `${val}%`
          }
        }
      }
    })
  }
  else if(graph_type == 'bar'){
    setChartState({
      ...prop.propChartView.graph_data,
      options: {
        ...prop.propChartView.graph_data.options,
        yaxis: {
          labels: {
            formatter: (val) => `${val}%`
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val}%`
        },
        tooltip: {
          y: {
            formatter: (val) => `${val}%`
          }
        }
      }
    })
  }
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
