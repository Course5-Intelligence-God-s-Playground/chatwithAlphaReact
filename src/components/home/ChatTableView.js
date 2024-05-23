import React, { useEffect } from 'react'
import './ChatTableView.scss'
import { useRecoilState } from 'recoil';
import { TableDataRecoil, TableViewRecoil } from '../utilites/TableRecoil';
import DataFrameTable from './Tables/DataFrameTable';
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData';

function ChatTableView(prop) {
  const headers = Object.keys(prop.modelOutput);
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
          prop.model_output_type == 'Series' ?
            Array.isArray(prop.modelOutput[headers[0]]) ?
              <table>
                <tbody className='tableBody'>
                  {
                    headers.map((oph) => (
                      <tr>
                        {
                          prop.modelOutput[oph].map((items) => (
                            <td style={typeof items == 'number' ? items >=0?{textAlign:'center'}:{textAlign:'center',color:'red'} : {}}>{typeof items == 'number' ? 
                            oph.toLowerCase().includes('rank')?<b>{items}</b>:<b>{items + '%'}</b> 
                            : items}</td>
                          ))
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              :

              <table>

                <tbody className='tableBody'>
                  {headers.map((val, index) => (
                    <tr>
                      <td key={index} className='seriesarrayFrstCol fw-semibold text-white w-50'>{val}</td>
                      <td key={index} style={typeof prop.modelOutput[val] == 'number' ? prop.modelOutput[val] >=0?{textAlign:'center'}:{textAlign:'center',color:'red'} : {}}>{typeof prop.modelOutput[val] == 'number' ? 
                     val.toLowerCase().includes('rank')? <b>{getTableDataRecoil.modelOutput[val] }</b> : <b>{getTableDataRecoil.modelOutput[val]+ '%' }</b> 
                      : prop.modelOutput[val]}</td></tr>
                  ))}
                </tbody>
              </table>
            : null}
      </div>


    </div>
  )
}

export default ChatTableView