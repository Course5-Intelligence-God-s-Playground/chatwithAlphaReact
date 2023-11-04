import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { TableDataRecoil, TableViewRecoil } from '../utilites/TableRecoil'
import './ChartTableExtendedView.scss'
import DataFrameTable from './Tables/DataFrameTable'
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData'

function ChartTableExtendedView() {

  const [getTableViewRecoil, setTableViewRecoil] = useRecoilState(TableViewRecoil)
  const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)
  const getTableDataRecoil = useRecoilValue(TableDataRecoil)

  function closeChatTableExtebdedView() {
    setChatAnswerComponentData({ ...getChatAnswerComponentData, closeBtnClick: !getChatAnswerComponentData.closeBtnClick })
    setTableViewRecoil(false)
  }

  const headers = Object.keys(getTableDataRecoil.modelOutput);

  return (
    
    <div className='d-flex justify-content-center gap-2'>
      <div className="Expandedtable-container pt-2 ps-2 ">
        {getTableDataRecoil.model_output_type == 'Dataframe' ?
          <DataFrameTable modelOutput={getTableDataRecoil.modelOutput} />

          :
          getTableDataRecoil.model_output_type == 'Series' ?
            Array.isArray(getTableDataRecoil.modelOutput[headers[0]]) ?
              <table >
                <tbody className='tableBody'>
                  {
                    headers.map((oph) => (
                      <tr>
                        {
                          getTableDataRecoil.modelOutput[oph].map((items) => (
                            <td className='text-center' style={typeof items == 'number' ? items >= 0 ? {} : { color: 'red' } : {}}>{typeof items == 'number' ? <b>{items + '%'}</b> : items}</td>
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
                      <td key={index} className='text-center' style={typeof getTableDataRecoil.modelOutput[val] == 'number' ? getTableDataRecoil.modelOutput[val] >= 0 ? {} : { color: 'red' } : {}}>{typeof getTableDataRecoil.modelOutput[val] == 'number' ? <b>{getTableDataRecoil.modelOutput[val] + '%'}</b> : getTableDataRecoil.modelOutput[val]}</td></tr>
                  ))}
                </tbody>
              </table>
            : null}
      </div>


      <i class="bi bi-x-circle h4  mt-1" onClick={closeChatTableExtebdedView} ></i>

    </div>
  )
}

export default ChartTableExtendedView
