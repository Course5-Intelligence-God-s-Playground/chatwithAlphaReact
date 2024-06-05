import React from 'react'
import './HomeNewStyle.scss'
import instructionIcon from '../assets/Home/instructionIcon.svg'
function Executive() {
    const sampleQuestions=['Who has the best POCA scores in FY24 in EMEA?','Which partners in Japan had the largest YoY differences in POCA scores?','Which capabilities are strongest and weakest in Norway in FY24?']
    return (
        <div className='HomeMidCnt h-100  w-100'>

            <div class="HomeMidCnt-frst w-100 h-100 " >
                <ul class="list-group list-group-flush ">
                    <li class="list-group-item d-flex bg-transparent ">
                        <span className='HomeMidCnt-frsthdng  HomeMidCnt-frsthdngSel text-white'>Chat with Pi</span>
                      
                    </li>
                    <li class="list-group-item bg-transparent ">
                        <div className='executiveInfo d-flex flex-column'>
                            <ol className='executiveInfo-instrction text-white fw-bold '><img src={instructionIcon} width={15}></img> &nbsp;Instructions:<li className='executiveInfo-instrctionSm fw-normal ps-1 '>Ensure clarity and specificity when framing your questions to receive swift and effective answers.</li>
                            <li className='executiveInfo-instrctionSm fw-normal ps-1'>Please choose the 'POCA Scoring System' option in the chat window's toggle feature, Note that 'DLBE' is the default selection.</li></ol>
                            <span className='executiveInfoScndLine text-white'><span className=' fw-bold'>Welcome to Chat with Pi!</span> <br/>I'm your AI assistant and you can ask me anything about POCA</span>
                      
                       <span className='executiveInfoThirdLine text-white'>For starters, you can ask me questions such as :</span>
                            <ol className='executiveInfonumber rounded ps-3 py-2'>
                            {
                                sampleQuestions?.map((value,key)=>(
                                        <li key={key}>{value}</li>
                                ))
                            }
                            </ol>
                      
                            <div className='question-container-wrap-cover'>
                            <div className='question-text text-white p-2  '>Who has the best POCA scores in FY24 in EMEA?</div>
                            <div className='question-text text-white p-2 '>Which partners in Japan had the largest YoY differences in POCA scores?</div>
                            <div className='question-text text-white p-2 '>Which capabilities are strongest and weakest in Norway in FY24?</div>

                           
                            </div>
                        </div>
                    </li>
                   
                </ul>
            </div>



         
        </div>
    )
}

export default Executive
