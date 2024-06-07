import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { TableDataRecoil, TableViewRecoil } from '../utilites/TableRecoil'
import './ChartTableExtendedView.scss'
import DataFrameTable from './Tables/DataFrameTable'
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData'

function ChartTableExtendedView() {

  const [getTableViewRecoil, setTableViewRecoil] = useRecoilState(TableViewRecoil)
  const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)
  const getTableDataRecoil = useRecoilValue(TableDataRecoil)


  const [orgData,setorgData] = useState(getTableDataRecoil.modelOutput)
  const [formattedData,setFormattedData] = useState({})
 
  useEffect(()=>{
  
  if(getTableDataRecoil?.model_output_type=='Series'){
    
  function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

// Convert the object into an array of [key, value] pairs
let outputArray = Object.entries(orgData);

if (outputArray.every(([key, value]) => isNumeric(value))) {
    // If all values are numeric, sort by values in descending order
    outputArray.sort((a, b) => b[1] - a[1]);
} else {
    // Otherwise, sort by keys in ascending order
    outputArray.sort((a, b) => a[0].localeCompare(b[0]));
}

// Convert the sorted array back into an object
let sortedOutput = Object.fromEntries(outputArray);
setFormattedData(sortedOutput)
  }
  },[orgData])




  function closeChatTableExtebdedView() {
    setChatAnswerComponentData({ ...getChatAnswerComponentData, closeBtnClick: !getChatAnswerComponentData.closeBtnClick })
    setTableViewRecoil(false)
  }

  const headers = Object.keys(getTableDataRecoil.modelOutput);

  return (

    <div className='d-flex justify-content-center gap-2'>
      <div className="Expandedtable-container mt-0 ps-2 ">
        {getTableDataRecoil.model_output_type == 'Dataframe' ?
          <DataFrameTable modelOutput={getTableDataRecoil.modelOutput} />

          :
          <table>

          <tbody className='tableBody'>
            {Object.keys(formattedData)?.map((val, index) => (
              <tr>
                <td key={index} className='seriesarrayFrstCol fw-semibold text-white w-50'>{val}</td>
                <td key={index} style={typeof formattedData[val] == 'number' && formattedData[val]<0?{color:'red',textAlign:'center',fontWeight:'bold'}:{textAlign:'center',fontWeight:'bold'}} >{ formattedData[val]}</td></tr>
            ))}
          </tbody>
        </table>}
      </div>


      <i class="bi bi-x-circle h4  mt-1" onClick={closeChatTableExtebdedView} ></i>

    </div>
  )
}

export default ChartTableExtendedView
