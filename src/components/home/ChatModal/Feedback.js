import React from 'react'
import './ChatModalGroup.scss'
import { ChatAnswerComponentData } from '../../utilites/ChatAnswerCradRecoilData'
import { useRecoilState } from 'recoil'
function Feedback(prop) {
    const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)

    function feedbackSubmitHandle(e) {
       
        e.preventDefault()
        setChatAnswerComponentData({ ...getChatAnswerComponentData, ShowAnimation: false })
        prop.setfeedbackEmailContainer(false)
        
    }

    function feedbackCancelHandle(){
        setChatAnswerComponentData({ ...getChatAnswerComponentData, ShowAnimation: false })
        prop.setfeedbackEmailContainer(false)

    }
    
    return (
        <div className='feedBackCnt'>
            <div class="card feedBackCard">
                <form class="card-body" onSubmit={feedbackSubmitHandle}>
                    <h5 class="card-title">FeedBack</h5>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Feedback</label>
                        <textarea class="form-control" required id="exampleFormControlTextarea1"></textarea>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-secondary' onClick={feedbackCancelHandle}>Cancel</button>

                        <button className='btn btn-success ms-3' type='submit' >Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Feedback
