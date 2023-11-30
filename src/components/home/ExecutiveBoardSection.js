import React from 'react'
import './ExecutiveBoardSection.scss'

function ExecutiveBoardSection() {

    return (
        <div className='HomeMidCnt h-100 w-100'>

            <div class="HomeMidCnt-frst w-100 h-100" >
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex">
                        <span className='HomeMidCnt-frsthdng  HomeMidCnt-frsthdngSel text-muted'>Chat with POCA</span>
                      
                    </li>
                    <li class="list-group-item">
                        <div className='executiveInfo d-flex flex-column gap-4 pt-3'>
                            <ol className='executiveInfo-instrction text-danger fw-bold'>Instructions:<li className='executiveInfo-instrctionSm fw-normal ps-1 ' style={{fontSize:'small'}}>Ensure clarity and specificity when framing your questions to receive swift and effective answers.</li>
                            <li className='executiveInfo-instrctionSm fw-normal ps-1' style={{fontSize:'small'}}>Please choose the POCA Scoring System from the dropdown menu in the chat window; DLBE is selected by default.</li></ol>
                            <span className='executiveInfoScndLine '>Welcome to Chat with POCA! <br/>POCA is updated with FY24 data now. I'm your AI assistant and ask me anything about POCA.</span>
                      
                       <span className='executiveInfoThirdLine'>For starters, you can ask me questions such as :</span>
                      
                            <ol className='executiveInfonumber border rounded py-2'>
                             <li> Who has the best POCA scores in FY24 in EMEA?</li>
                            <li>Which partners in Japan had the largest YoY differences in POCA scores?</li>
                            <li>Which capabilities are strongest and weakest in Norway in FY24?</li>
                            </ol>
                          
                        </div>
                    </li>
                   
                </ul>
            </div>



         
        </div>
    )
}

export default ExecutiveBoardSection
