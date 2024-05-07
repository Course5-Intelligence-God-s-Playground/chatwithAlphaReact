import React, { useEffect, useRef, useState } from 'react'
import './StoryBoard.scss'
import { Server } from '../utilites/ServerUrl'
import StoryImage from '../assets/Home/cardImg.png'

function StoryBoard(prop) {

    let date = new Date()
    const [boardData, setBoardData] = useState(null)
    const [getRegion, setRegion] = useState('Americas')
    const divRef = useRef(null);

    function regionChangeHandler(e) {
        setRegion(e.target.value)
    }

    async function fetchBoardDetails() {
        setBoardData(null)

        prop.setIsLoading(true)
        try {
            let req = await fetch(Server.getStoryBoardsInfo, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',

                    // You can add other headers as needed, e.g., authentication tokens
                },
                body: JSON.stringify({ "region": getRegion })
            })
            let resp = await req.json()
            prop.setIsLoading(false)

            if (req.ok) {
                setBoardData(resp.story_board)
            }
        } catch (error) {
            prop.setIsLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        if (getRegion == 'region') {
            setBoardData(null)
        }
        else {
            fetchBoardDetails()
        }

    }, [getRegion])


    return (
        <div className='storybrdCnt'>
            <div className='storybrdHdng d-flex justify-content-between'>
                <div className='storybrdHdng-Start pt-2'>
                    <div><b className='text-muted storybrdHdng-StartText HomeMidCnt-frsthdng  HomeMidCnt-frsthdngSel text-muted'>Story Board</b></div>
                    <span className='text-muted storybrdHdng-StartTime'>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}`}</span>
                </div>
                <div className='storybrdHdng-end d-flex align-items-center gap-2 me-3'>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '30%' }}><path d="M5.66667 5.66699H1V10.3337H5.66667V5.66699Z" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.3335 1V5.66667" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.3335 10.334V19.6673" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.6667 12.667H8V17.3337H12.6667V12.667Z" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.3335 1V12.6667" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.3335 17.334V19.6673" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.6667 2.16699H15V6.83366H19.6667V2.16699Z" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.3335 1V2.16667" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.3335 6.83398V19.6673" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <div className='radioItms d-flex align-items-center'>
                        <input type='radio' value='Asia' name='region' onClick={regionChangeHandler} /><span className='text-muted'>Asia</span>
                        <input type='radio' value='Americas' name='region' defaultChecked onClick={regionChangeHandler} /><span className='text-muted'>Americas</span>
                        <input type='radio' value='EMEA' name='region' onClick={regionChangeHandler} /><span className='text-muted'>EMEA</span>
                    </div>

                </div>


            </div>
            <div className='storyCardSectionContainer'>
                {boardData != null ?
                    boardData.map((val) => (
                        <div>
                            {
                                <div> {/* section*/}
                                    <div className='my-2 fw-bold cardSectionTitle' >{Object.keys(val)[0]}</div>
                                    <div className='storyboardCnt gap-2 justify-content-evenly'> {/*  card holder */}
                                        {
                                            val[Object.keys(val)].map((itm) => (
                                                <div className='storyboardCard border rounded d-flex flex-column ' ref={divRef}>
                                                    <div className='fw-medium storyboardCardTitle text-center'>
                                                        {itm.title}
                                                    </div>
                                                    <div className='storyboardCardEnd d-flex align-items-center justify-content-evenly'>
                                                        <div className='d-flex flex-column align-items-center'>
                                                            <div className='storybrdNum fs-6' >{itm.value1}%</div>
                                                            <div className='storybrdNum' style={itm.value2 >= 0 ? { color: 'green' } : { color: 'red' }}>
                                                                {
                                                                    itm.value2 >= 0 ? <>+{itm.value2}%</> : <>-{itm.value2}%</>
                                                                }
                                                            </div>
                                                        </div>
                                                        <img className='storyBoardImage' src={StoryImage}></img>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    ))
                    : <div className='text-muted mt-3 text-center'>Data Not Available</div>

                }
            </div>

        </div>
    )
}

export default StoryBoard
