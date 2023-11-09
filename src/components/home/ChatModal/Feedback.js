import React from 'react'
import './ChatModalGroup.scss'
function Feedback(prop) {
    function feedbackSubmitHandle(){
        prop.setfeedbackEmailContainer(false)
    }
    return (
        <div className='feedBackCnt'>
            <div class="card feedBackCard">
                <div class="card-body">
                <h5 class="card-title">FeedBack</h5>
                <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Email address</label>
  <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
</div>
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Feedback</label>
  <textarea class="form-control" id="exampleFormControlTextarea1"></textarea>
</div>
<div className='d-flex justify-content-end'>
<button className='btn btn-secondary' onClick={()=>{prop.setfeedbackEmailContainer(false)}}>Cancel</button>

    <button className='btn btn-success ms-3' onClick={feedbackSubmitHandle}>Submit</button>
</div>
                </div>
            </div>
        </div>
    )
}

export default Feedback
