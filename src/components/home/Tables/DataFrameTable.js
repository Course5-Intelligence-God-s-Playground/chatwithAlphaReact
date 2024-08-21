import React, { useEffect, useState } from 'react'

function DataFrameTable(prop) { //specific to 'dataframe' type of table other is series
  const [getTableOutput,setTableOutput] = useState(prop?.modelOutput)
const[formatedData,setFormatedData] = useState([])

  useEffect(()=>{
    let tableKeys = Object.keys(getTableOutput);
    let innerKeys = Object.keys(getTableOutput[tableKeys[0]]);
    
    if (tableKeys.length == 2) {
        let isNumeric = typeof getTableOutput[tableKeys[0]][innerKeys[0]] == 'number' || typeof getTableOutput[tableKeys[1]][innerKeys[0]] == 'number';
        let sortKey = isNumeric ? tableKeys[1] : tableKeys[0];
        let sortedEntries = Object.entries(getTableOutput[sortKey]).sort((a, b) => isNumeric ? b[1] - a[1] : (a[0] > b[0] ? 1 : -1));
    
        let sortedKeys = sortedEntries.map(entry => entry[0]);
        let finalArr = tableKeys.map(key => sortedKeys.map(sortedKey => getTableOutput[key][sortedKey]));
        const transposedData = finalArr[0].map((_, colIndex) => finalArr.map(row => row[colIndex]));
        setFormatedData(transposedData)
    } else {
        
        let sortedEntries = Object.entries(getTableOutput[ tableKeys[0]]).sort((a, b) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
    });
        
        let sortedKeys = sortedEntries.map(entry => entry[0]);
        let finalArr = tableKeys.map(key => sortedKeys.map(sortedKey => getTableOutput[key][sortedKey]));
        const transposedData = finalArr[0].map((_, colIndex) => finalArr.map(row => row[colIndex]));
        setFormatedData(transposedData)
    }
  },[getTableOutput])
  return (
    <div className=''>
          <table >
        <thead className='thg'>
          <tr>
            {/* <th></th> */}
            {Object.keys(getTableOutput)?.map(column => (
              <th key={column} className='text-center'>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className=''>
        {formatedData?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <td className='text-center 'id={cellIndex} style={typeof cell === 'number' && cell < 0 ? { color: 'red' } : {}} key={cellIndex}>{typeof cell == 'number' ?
                        <b>
                          {/* {!Object.keys(getTableOutput)[cellIndex]?.toLowerCase().includes('rank')?`${cell}%`:cell} */}
                          {cell}
                          </b>
                        :cell}</td>
                    ))}
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataFrameTable
