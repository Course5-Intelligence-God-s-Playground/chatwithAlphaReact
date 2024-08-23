import React, { useEffect,useState } from 'react'
import './HomeNewStyle.scss'

import { Server } from '../utilites/ServerUrl'
import StoryBoardCardImg from '../assets/Home/storyCard.png'
import StoryBoardCardImg2 from '../assets/Home/storyCard2.png'

import stdpocaImg0 from '../assets/Home/stdpoca0.png'
import stdpocaImg1 from '../assets/Home/stdpoca1.png'
import stdpocaImg2 from '../assets/Home/stdpoca2.png'
import stdpocaImg3 from '../assets/Home/stdpoca3.png'

import custPocaImg0 from '../assets/Home/custpoca0.png'
import custPocaImg1 from '../assets/Home/custpoca1.png'
import custPocaImg2 from '../assets/Home/custpoca2.png'
import custPocaImg3 from '../assets/Home/custpoca3.png'
function StoryNew(prop) {
    const stdPocaImgArray = [stdpocaImg0,stdpocaImg1,stdpocaImg2,stdpocaImg3]
    const custPocaImgArray = [custPocaImg0,custPocaImg1,custPocaImg2,custPocaImg3]
    let date = new Date()
    const [boardData, setBoardData] = useState()
    const [getRegion, setRegion] = useState('Americas')
  

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
                let formattedData = resp.story_board.filter((val)=>Object.keys(val) =='Customer Journey POCA Scores')[0]
              //removing standard poca scores data
                setBoardData([formattedData])
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
        <div className='storybrdCnt ps-2'>
            <div className='storybrdHdng d-flex justify-content-between'>
                <div className='storybrdHdng-Start pt-2' style={{color:'#33b0ea'}}>
                    <div><b className=' storybrdHdng-StartText HomeMidCnt-frsthdng  HomeMidCnt-frsthdngSel'style={{color:'#33b0ea'}}>Story Board</b></div>
                    <span className=' storybrdHdng-StartTime'>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}`}</span>
                </div>
                <div className='storybrdHdng-end d-flex align-items-center gap-2 me-3'>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '30%' }}><path d="M5.66667 5.66699H1V10.3337H5.66667V5.66699Z" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.3335 1V5.66667" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.3335 10.334V19.6673" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.6667 12.667H8V17.3337H12.6667V12.667Z" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.3335 1V12.6667" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.3335 17.334V19.6673" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.6667 2.16699H15V6.83366H19.6667V2.16699Z" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.3335 1V2.16667" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.3335 6.83398V19.6673" stroke="#A3A3A3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <div className='radioItms  d-flex align-items-center justify-content-center rounded-pill mt-2'>
                        <input type='radio' value='all' name='region' onClick={regionChangeHandler} /><span className='text-muted  fw-bold me-2'>All</span>
                        <input type='radio' value='Asia' name='region' onClick={regionChangeHandler} /><span className='text-muted  fw-bold'>Asia</span>
                        <input type='radio' value='Americas' name='region' defaultChecked onClick={regionChangeHandler} /><span className='text-muted  fw-bold'>Americas</span>
                        <input type='radio' value='EMEA' name='region' onClick={regionChangeHandler} /><span className='text-muted  fw-bold'>EMEA</span>
                    </div>

                </div>


            </div>
            <div className='storyCardSectionContainer '>
                {boardData != null ?
                    boardData?.map((val) => (
                        <div>
                            {
                                <div> {/* section*/}
                                    <div className='my-4 fw-bold  cardSectionTitle text-center' > FY25 Customer Journey POCA Scores</div>
                                    <div className='storyboardCnt d-flex '> {/*  card holder */}
                                        {
                                            val['Customer Journey POCA Scores'].map((itm) => (
                                               
                                                <div className='storyboardCards d-flex flex-column justify-content-evenly'style={Object.keys(val)[0]=='Standard POCA Scores'?{backgroundImage:`url(${StoryBoardCardImg})`}:{backgroundImage:`url(${StoryBoardCardImg2})`}}>
                                                    <div className='fw-medium text-center storyboardCardTitle ps-2 text-white'>
                                                        {itm.title}
                                                    </div>
                                                    <div className='storyboardCardEnd d-flex align-items-center justify-content-evenly'>
                                                        <div className='d-flex flex-column align-items-center'>
                                                            <div className='storybrdNum text-white fs-6' >{(itm.value1==0||itm.value1==null)?'-':itm.value1+'%'}</div>
                                                            <div className='storybrdNumScnd px-1 fw-medium' style={itm.value2 >= 0 ? { color: 'green' } : { color: 'red' }}>
                                                                {
                                                                    itm.value2 > 0 ? <>+{itm.value2}%</> :itm.value2==0?'-': <>{itm.value2}%</>
                                                                }
                                                            </div>
                                                        </div>
                                                        
                                                        <img className='storyBoardImage' src={Object.keys(val)[0]=='Standard POCA Scores'?stdPocaImgArray[val[Object.keys(val)].indexOf(itm)]:custPocaImgArray[val[Object.keys(val)].indexOf(itm)]}></img>
                                                    </div>
                                                </div>
                                             
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    ))
                    : <div className='text-muted mt-3 text-center fw-bold'>Fetching ...</div>

                }
            </div>

        </div>
    )
}

export default StoryNew
