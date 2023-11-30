import React from 'react'

function DataFrameTable(prop) { //specific to 'dataframe' type of table other is series
  const columns = Object.keys(prop.modelOutput);
  const rows = Object.keys(prop.modelOutput[columns[0]]);
  return (
    <div className=''>
      <table >
        <thead className=''>
          <tr>
            <th></th>
            {columns.map(column => (
              <th key={column} className='text-center'>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className=''>
          {rows.map(row => (
            <tr key={row} >

              <td className='text-center'>


                {isNaN(Number(row)) ? row : ''}
              </td>


              {columns.map(column => (
                <td key={column} className='text-center' style={typeof prop.modelOutput[column][row] == 'number' ? prop.modelOutput[column][row] >= 0 ? {} : { color: 'red' } : {}} >{typeof prop.modelOutput[column][row] == 'number' ? <b>{prop.modelOutput[column][row]}%</b> : prop.modelOutput[column][row]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataFrameTable
