import React from 'react'
import jorg from '../assets/jorg.png'
import ram from '../assets/ram.png'
import patrick from '../assets/patrick.jpg'
import { loginMailId } from '../utilites/loginRecoil'
import { useRecoilValue } from 'recoil'
function NavBarHomeUser() {
    const userEmailId = useRecoilValue(loginMailId)

    return (
        <>
        {
            userEmailId==='poca@course5i.com'?
            <li className='navHome-optionUser d-flex align-items-center px-3'>
                        <img className='navHome-optionUser-img' src={jorg} alt='Image of Logged In user'></img>
                        <div className='navHome-optionUser-text ps-2'>
                            <span className='navHome-optionUsertext-name'><b>George Thomas</b></span>
                            <span className='d-flex'>
                                <div className='d-flex flex-column'>
                                <span className='navHome-optionUsertext-role'>Senior Director - Market Intelligence </span>
                                <span className='navHome-optionUsertext-role '>(Course5 Intelligence Limited)</span>
                                </div>
                                <i class="bi bi-chevron-down"></i>
                            </span>
                        </div>
                    </li>
                    :
                    userEmailId==='raiyer@microsoft.com'?
                    <li className='navHome-optionUser d-flex align-items-center px-3'>
                    <img className='navHome-optionUser-img' src={ram} alt='Image of Logged In user'></img>
                    <div className='navHome-optionUser-text ps-2'>
                        <span className='navHome-optionUsertext-name'><b>Ram Iyer</b></span>
                        <span className='d-flex'>
                            <p className='navHome-optionUsertext-role'>SR DIR PARTNER MARKETING RETAIL Consumer Channel Marketing(CSO) - eCommerce</p>
                            <i class="bi bi-chevron-down"></i>
                        </span>
                    </div>
                </li>
                :
                <li className='navHome-optionUser d-flex align-items-center px-3'>
                <img className='navHome-optionUser-img' src={patrick} alt='Image of Logged In user'></img>
                <div className='navHome-optionUser-text ps-2 d-flex flex-column justify-content-center'>
                    <span className='navHome-optionUsertext-name'><b>Patrick Kerin</b></span>
                    <span className='d-flex'>
                        <p className='navHome-optionUsertext-role'>SR PTNR - Consumer Channel Marketing - eCommerce</p>
                        <i class="bi bi-chevron-down"></i>
                    </span>
                </div>
            </li>

        }
        </>
    )
}

export default NavBarHomeUser
