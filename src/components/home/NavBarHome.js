import React, { useState } from 'react'
import './NavBarHome.scss'
import HomeTitleImg from '../assets/title.png'

import pocaAImg from '../assets/nexus.png'
import { useRecoilValue } from 'recoil'
import { loginMailId } from '../utilites/loginRecoil'
import NavBarHomeUser from './NavBarHomeUser'
function NavBarHome(prop) {
    const [inputvalue, setInputvalue] = useState(null)
    function inputChangeHandler(e) {
        setInputvalue(e.target.value)
        e.target.value == '' ? setInputvalue(null) : setInputvalue(e.target.value)

    }
    function logoMenuMouseEnterHandle(){
prop.setmenuHovered(true)
    }
    function logoMenuMouseLeaveHandle(){
        prop.setmenuHovered(false)

    }
    return (
        <div className='navHome-container'>
            <ul className='navHome-options bg-white  d-flex align-items-center justify-content-between ps-0'>
                <li className='navHome-optionlogo d-flex align-items-center justify-content-between'>
                    <span className='navHome-optionlogoMenu' onMouseEnter={logoMenuMouseEnterHandle} onMouseLeave={logoMenuMouseLeaveHandle}><svg width="56" height="45" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-ojjv62-MuiSvgIcon-root" fill="#A1A1A1" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SortIcon"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></svg></span>
                    <img className='navHomeOptionTitle-img' src={HomeTitleImg} alt='Image of company Logo'></img>
                </li>
                <li className='navHome-optionSearch  align-items-center justify-content-between ps-4'>
                    <i class="bi bi-search text-muted"></i>
                    <input type='text' className='navHomeoptionSearch-input' placeholder='Search in Discovery...' onChange={inputChangeHandler} value={inputvalue}></input>
                    {inputvalue != null && <i class="bi bi-x text-center" onClick={() => { setInputvalue('') }}></i>}
                    <button className='navHomeoptionSearch-btn text-white'>Search</button>
                </li>
               
                <li className='navHome-option-nexus flex items-center mx-3'>
                    <img src={pocaAImg} className='nexusImg'></img>
                </li>
                <li className='navHome-optionIcons align-items-center gap-2'>
                    <span ><svg width="35" height="35" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '60%' }}><circle cx="3.69048" cy="3.69048" r="3.69048" fill="#A1A1A1"></circle><circle cx="15.4991" cy="3.69048" r="3.69048" fill="#A1A1A1"></circle><circle cx="27.3096" cy="3.69048" r="3.69048" fill="#A1A1A1"></circle><circle cx="3.69048" cy="15.5" r="3.69048" fill="#A1A1A1"></circle><circle cx="15.4991" cy="15.5" r="3.69048" fill="#A1A1A1"></circle><circle cx="27.3096" cy="15.5" r="3.69048" fill="#A1A1A1"></circle><circle cx="3.69048" cy="27.3096" r="3.69048" fill="#A1A1A1"></circle><circle cx="15.4991" cy="27.3096" r="3.69048" fill="#A1A1A1"></circle><circle cx="27.3096" cy="27.3096" r="3.69048" fill="#A1A1A1"></circle></svg></span>
                    <span className='navHome-optionIconsHolder'><svg viewBox="0 0 22 22" fill='none' xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3101_16189)"><path d="M12.8333 2.75V6.41667C12.8333 6.65978 12.9299 6.89294 13.1018 7.06485C13.2737 7.23676 13.5069 7.33333 13.75 7.33333H17.4167" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.5417 19.25H6.41667C5.93044 19.25 5.46412 19.0568 5.12031 18.713C4.77649 18.3692 4.58334 17.9029 4.58334 17.4167V4.58333C4.58334 4.0971 4.77649 3.63079 5.12031 3.28697C5.46412 2.94315 5.93044 2.75 6.41667 2.75H12.8333L17.4167 7.33333V11.9167M12.8333 17.4167H19.25M19.25 17.4167L16.5 14.6667M19.25 17.4167L16.5 20.1667" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_3101_16189"><rect width="22" height="22" fill="white"></rect></clipPath></defs></svg></span>
                    <span className='navHome-optionIconsHolder'><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13.586V10C19 6.783 16.815 4.073 13.855 3.258C13.562 2.52 12.846 2 12 2C11.154 2 10.438 2.52 10.145 3.258C7.185 4.074 5 6.783 5 10V13.586L3.293 15.293C3.19996 15.3857 3.12617 15.4959 3.07589 15.6172C3.0256 15.7386 2.99981 15.8687 3 16V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V16C21.0002 15.8687 20.9744 15.7386 20.9241 15.6172C20.8738 15.4959 20.8 15.3857 20.707 15.293L19 13.586ZM19 17H5V16.414L6.707 14.707C6.80004 14.6143 6.87383 14.5041 6.92412 14.3828C6.9744 14.2614 7.00019 14.1313 7 14V10C7 7.243 9.243 5 12 5C14.757 5 17 7.243 17 10V14C17 14.266 17.105 14.52 17.293 14.707L19 16.414V17ZM12 22C12.6193 22.0008 13.2235 21.8086 13.7285 21.4502C14.2335 21.0917 14.6143 20.5849 14.818 20H9.182C9.38566 20.5849 9.76648 21.0917 10.2715 21.4502C10.7765 21.8086 11.3807 22.0008 12 22Z" fill="black"></path></svg></span>
                    <span className='navHome-optionIconsHolder' style={{ width: '0.75vw' }}><svg viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg" sx="[object Object]"><path d="M3.42614 10.0753V9.85795C3.4304 9.11222 3.49645 8.51776 3.62429 8.07457C3.75639 7.63139 3.94815 7.27344 4.19957 7.00071C4.45099 6.72798 4.75355 6.48082 5.10724 6.25923C5.37145 6.08878 5.60795 5.91193 5.81676 5.72869C6.02557 5.54545 6.19176 5.34304 6.31534 5.12145C6.43892 4.8956 6.50071 4.64418 6.50071 4.36719C6.50071 4.07315 6.4304 3.81534 6.28977 3.59375C6.14915 3.37216 5.95952 3.2017 5.72088 3.08239C5.48651 2.96307 5.22656 2.90341 4.94105 2.90341C4.66406 2.90341 4.40199 2.9652 4.15483 3.08878C3.90767 3.2081 3.70526 3.38707 3.54759 3.62571C3.38991 3.86009 3.30469 4.15199 3.2919 4.50142H0.683949C0.705256 3.64915 0.909801 2.94602 1.29759 2.39205C1.68537 1.83381 2.19886 1.41832 2.83807 1.1456C3.47727 0.868607 4.18253 0.730113 4.95384 0.730113C5.80185 0.730113 6.55185 0.870738 7.20384 1.15199C7.85582 1.42898 8.36719 1.83168 8.73793 2.36009C9.10867 2.88849 9.29403 3.52557 9.29403 4.27131C9.29403 4.76989 9.21094 5.21307 9.04474 5.60085C8.88281 5.98437 8.65483 6.32528 8.3608 6.62358C8.06676 6.91761 7.71946 7.18395 7.31889 7.42259C6.98224 7.62287 6.70526 7.83168 6.48793 8.04901C6.27486 8.26634 6.11506 8.51776 6.00852 8.80327C5.90625 9.08878 5.85298 9.44034 5.84872 9.85795V10.0753H3.42614ZM4.69176 14.1662C4.26562 14.1662 3.90128 14.017 3.59872 13.7188C3.30043 13.4162 3.15341 13.054 3.15767 12.6321C3.15341 12.2145 3.30043 11.8565 3.59872 11.5582C3.90128 11.2599 4.26562 11.1108 4.69176 11.1108C5.09659 11.1108 5.45242 11.2599 5.75923 11.5582C6.06605 11.8565 6.22159 12.2145 6.22585 12.6321C6.22159 12.9134 6.14702 13.1712 6.00213 13.4055C5.86151 13.6357 5.67614 13.821 5.44602 13.9616C5.21591 14.098 4.96449 14.1662 4.69176 14.1662Z" fill="black"></path></svg></span>
                </li>

                <NavBarHomeUser/>

            </ul>
        </div>
    )
}

export default NavBarHome
