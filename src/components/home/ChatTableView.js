import React, { useEffect, useState } from 'react'
import './ChatTableView.scss'
import { useRecoilState } from 'recoil';
import { TableDataRecoil, TableViewRecoil } from '../utilites/TableRecoil';
import DataFrameTable from './Tables/DataFrameTable';
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData';

function ChatTableView(prop) {
  const [orgData,setorgData] = useState(prop?.modelOutput)
  const [formattedData,setFormattedData] = useState({})
 
  useEffect(()=>{
  
  if(prop?.model_output_type=='Series'){
    
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


  const [getTableViewRecoil,setTableViewRecoil] = useRecoilState(TableViewRecoil)
const [getTableDataRecoil,setTableDataRecoil] = useRecoilState(TableDataRecoil)
const [getChatAnswerComponentData,setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)
  function tableExpandHandle(){
    setChatAnswerComponentData({...getChatAnswerComponentData,ShowAnimation:false})
    setTableViewRecoil(true)
    setTableDataRecoil(prop)
  }
useEffect(()=>{
  setChatAnswerComponentData({...getChatAnswerComponentData,scrollType:prop.ids})
 
},[])

  return (
    <div className=''>
      <i class="bi bi-arrows-angle-expand rounded ps-2" onClick={tableExpandHandle}></i>
      <div className="table-container">
        {prop.model_output_type == 'Dataframe' ?
         <DataFrameTable modelOutput={prop.modelOutput}/>
          :
      
         <table>

         <tbody className='tableBody'>
           {Object.keys(formattedData)?.map((val, index) => (
             <tr>
               <td key={index} className='seriesarrayFrstCol fw-semibold text-white w-50'>{val}</td>
               <td key={index} style={typeof formattedData[val] == 'number' && formattedData[val]<0?{color:'red',textAlign:'center',fontWeight:'bold'}:{textAlign:'center',fontWeight:'bold'}} >
               {/* {(typeof formattedData[val] == 'number' && !val?.toLowerCase().includes('rank'))? `${formattedData[val]}%`:`${formattedData[val]}`} */}
               {formattedData[val]}
               </td></tr>
           ))}
         </tbody>
       </table>
           
}
      </div>


    </div>
  )
}

export default ChatTableView