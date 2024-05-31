import React from 'react'
import './HomeNewStyle.scss'

function HomeStartOptions() {

    function homeClickHandle(){
        let modalele = document.getElementsByClassName('modalClose')[0]
        if(modalele){
        modalele.click()
        }
    }
    
    return (
        <div onClick={homeClickHandle} className='home-side-option py-3 d-flex align-items-center justify-content-center ' >
        <svg  viewBox="0 0 27 26" fill="none" className='home-side-option-icon'>
                        <path d="M3.19274 7.96243L11.0838 1.83046C11.7763 1.29223 12.6286 1 13.506 1C14.3833 1 15.2357 1.29223 15.9282 1.83046L23.8207 7.96243C24.295 8.33095 24.6788 8.80289 24.9426 9.3422C25.2065 9.88152 25.3435 10.4739 25.3433 11.0742V21.718C25.3433 22.5021 25.0315 23.2541 24.4765 23.8086C23.9215 24.3631 23.1688 24.6746 22.3839 24.6746H4.62801C3.84315 24.6746 3.09043 24.3631 2.53545 23.8086C1.98047 23.2541 1.66869 22.5021 1.66869 21.718V11.0742C1.66869 9.85761 2.23096 8.70897 3.19274 7.96243Z" stroke="#929292" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.63171 17.2607C10.9018 19.2313 16.2019 19.2313 19.469 17.2607" stroke="#929292" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
        </div>
    )
}

export default HomeStartOptions

// for css Home.scss is used 