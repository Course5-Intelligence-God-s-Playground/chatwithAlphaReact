
import React, { useEffect, useState } from 'react'
import './Login.scss'
import loginBackGrndImg from '../assets/Login/aibk1.jpg'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { loginMailId, loginState } from '../utilites/loginRecoil'
import {Toast} from 'bootstrap'
function Login() {
    const [loader, setLoader] = useState(false)
    const nav= useNavigate()
    const [getlogState,setLogState] = useRecoilState(loginState)
    const [userMailId,setUserMailId] = useRecoilState(loginMailId)
    const [credValues, setCredValues] = useState({
        email: '',
        pass: ''
    })



    useEffect(() => {  //logout user after 1hr of inactivity
    const timeoutId = setTimeout(() => {
        setLogState(false)
        nav('/',{replace:true})
    }, 15 * 60 * 1000 ); 

    return () => {
        clearTimeout(timeoutId); 
      
    };
  }, []); 

  
   function loginHandle(){  //logs in if creds match else shows a toast with message
    if ((credValues.email === 'poca@course5i.com' || credValues.email === 'raiyer@microsoft.com' || credValues.email === 'patrickkerin@microsoft.com') && credValues.pass === 'NextGenPoca@23') {
        setLogState(true);
        setUserMailId(credValues.email);
        nav('/home');
    }
    
    else {
      let  myToast= new Toast(document.getElementById('liveToast'));
        myToast.show()
    }
    
}

    return (
        <div>
        <div className='lg-cnt d-flex align-items-center justify-content-end'>

            <div className='app-title d-flex'>
                <span className='app-titleMain h5'>QA-Connected</span>
                <i className='app-titleSub pt-2 ps-2' style={{ color: 'orange' }}>Insights</i>
            </div>


            <div className='mid-cnt-Hold w-100 d-flex justify-content-center align-items-center gap-3'>
                <img className="loginBackgImage h-75" src={loginBackGrndImg} />
                <div className="lg-cardHold h-75">
                    <div className="login-card d-flex  flex-column justify-content-center">
                        {/* <h6 className='text-center position-relative logintxt text-secondary'>Login</h6> */}
                        <div className="lg-loginCard  d-flex flex-column gap-5 justify-content-center align-items-center">

                            <div class="form-floating border rounded w-75 bg-white">
                                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" value={credValues.email} onChange={(e) => { setCredValues({ ...credValues, email: e.target.value }) }} />
                                <label for="floatingInput">Email address</label>
                            </div>
                            <div class="form-floating w-75 bg-white">
                                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" value={credValues.pass} onChange={(e) => { setCredValues({ ...credValues, pass: e.target.value }) }} />
                                <label for="floatingPassword">Password</label>
                            </div>

                         
                            <button disabled={loader ? true : false} className='lg-btn btn  text-white' id='lg-btn'onClick={loginHandle} >{loader ? 'Please wait...' : 'Login'}</button>
                        </div>
                    </div>
                </div>
            </div>

       
        </div>

        {/* toast for wrong creds  */}
        <div className="toast-container position-fixed  p-3">
  <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  
    <div class="toast-body d-flex justify-content-evenly align-items-center">
      <div>Thank you for using our service. The tool is currently in the development environment.<br/> We'll be back up and running soon.</div>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>

    </div>
  </div>
</div>


</div>
    )
}

export default React.memo(Login)
