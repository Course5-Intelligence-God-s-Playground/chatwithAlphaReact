import React, { useEffect, useRef, useState } from 'react'
import Chart from "react-apexcharts";
import html2canvas from 'html2canvas';
import { useRecoilState } from 'recoil';
import { ChartImageURL } from '../utilites/TableRecoil';

function ChartView(prop) {
 
  const chartRef = useRef(null);
  const [chartState, setChartState] = useState(prop.propChartView.graph_data);
  const [chartSize,setChartSize] = useState(400)
  const [getChartImageURL,setChartImageURL] = useRecoilState(ChartImageURL)

  useEffect(()=>{
    const screenWidth = window.innerWidth;
    if(screenWidth>=768){
      setChartSize(400)
    }
    else setChartSize(300)
  },[])

  const captureChartAsImage = async () => {
    if (chartRef.current) {
      try {
        // const canvas = await html2canvas(chartRef.current);
        // const dataURL = canvas.toDataURL('image/png');
        // setChartImageURL(dataURL)
        // You can now use the dataURL as an image source or save it as needed.
        // const a = document.createElement('a');
        // a.href = dataURL;
        // a.download = 'chart.png'; // Set the desired file name here
        // a.style.display = 'none';
        // document.body.appendChild(a);
        
        // // Trigger the click event on the "a" element
        // a.click();
        // console.log(dataURL);
      } catch (error) {
        console.error('Error capturing chart as image:', error);
      }
    }
  };

  // useEffect(()=>{
  //   captureChartAsImage()
  // },[prop.propChartView.graph_data])
  return (
    <div className='chartCnt'>
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            {prop.propChartView.graph_data!='' && prop.propChartView.graph_type!='' ? (
             <div ref={chartRef}> <Chart
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
