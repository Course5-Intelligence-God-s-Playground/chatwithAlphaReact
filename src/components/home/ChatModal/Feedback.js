import React, { useState } from 'react'
import './ChatModalGroup.scss'
import { ChatAnswerComponentData } from '../../utilites/ChatAnswerCradRecoilData'
import { useRecoilState } from 'recoil'
import { Server } from '../../utilites/ServerUrl'
function Feedback(prop) {
    const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)
    const [errorState,setErrorState] = useState(false)
    const [errorMsg,setErrorMsg] = useState('')
    const [emailId,setEmailId]  = useState('')
    const [feedBackTxt,setFeedBackTxt] = useState('')
    const [isLoading,setIsLoading] = useState(false)
  async  function feedbackSubmitHandle(e) {
    setErrorState(false)
        e.preventDefault()
        setIsLoading(true)
        try {
            const req = await fetch(Server.feedBack,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id:prop?.feedBackId,
                    feedback:feedBackTxt,
                    feedback_email:emailId
                    })
            })
           const res = await req.json()
           if(req.ok){
            setErrorState(false)
            setChatAnswerComponentData({ ...getChatAnswerComponentData, ShowAnimation: false })
            prop.setfeedbackEmailContainer(false)
           }
           else{
            setErrorState(true)
            setErrorMsg(res?.message)
           }
        } catch (error) {
            setErrorState(true)
            setErrorMsg('Something went wrong, Try later!')
        }
        finally{
        setIsLoading(false)
        }
        
    }

    function feedbackCancelHandle(){
        setChatAnswerComponentData({ ...getChatAnswerComponentData, ShowAnimation: false })
        prop.setfeedbackEmailContainer(false)

    }

    function inputChangerHandler(e){
        let targetElementId = e.target.id
        let userValue = e.target.value
        switch (targetElementId) {
            case 'exampleFormControlInput1':
                setEmailId(userValue)
                break;
            case 'exampleFormControlTextarea1':
                setFeedBackTxt(userValue)
                break;
            
            default:
                break;
        }
    }
    return (
        <div className='feedBackCnt'>
            <div class="card feedBackCard">
                <form class="card-body" onSubmit={feedbackSubmitHandle}>
                    <h5 class="card-title">FeedBack</h5>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleFormControlInput1" required placeholder="name@example.com" onChange={inputChangerHandler} value={emailId}/>
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Feedback</label>
                        <textarea class="form-control" required id="exampleFormControlTextarea1" onChange={inputChangerHandler} value={feedBackTxt}></textarea>
                    </div>
                   {errorState&& <span className=' text-danger'>{errorMsg}</span>}
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-secondary' onClick={feedbackCancelHandle}>Cancel</button>

                        <button className='btn btn-success ms-3' type='submit' disabled={isLoading}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Feedback
