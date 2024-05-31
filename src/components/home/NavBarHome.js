import React from 'react'
import './NavBarHome.scss'
import HomeTitleImg from '../assets/newLogo.png'
import pocaAImg from '../assets/nexus.png'

function NavBarHome() {

   
 
    return (
        <div className='navHome-container bg-white'>
            <ul className='navHome-options   d-flex align-items-center justify-content-between gap-5 ps-0'>
                <li className='navHome-optionlogo d-flex align-items-center justify-content-between'>
                    <span className='navHome-optionlogoMenu' 
                    >
                        </span>
                    <div className=' d-flex align-items-center'>
                    <img className='navHomeOptionTitle-img ps-3' src={HomeTitleImg} alt='Image of company Logo'></img>
                    <span className=' pt-2 fs-5 navHomeOptionTitle-text'>Discovery</span>
                    </div>
                </li>
              
               
                <li className='navHome-option-nexus flex me-5'>
                    <img src={pocaAImg} className='nexusImg pt-1'></img>
                </li>
            

            </ul>
        </div>
    )
}

export default NavBarHome
