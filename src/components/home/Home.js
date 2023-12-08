import React, { useEffect, useState } from 'react'
import NavBarHome from './NavBarHome'
import './Home.scss'
import ChatModal from './ChatModal'
import HomeStartOptions from './HomeStartOptions'
import ExecutiveBoardSection from './ExecutiveBoardSection'
import StoryBoard from './StoryBoard'
import chatBot_text from '../assets/Home/chatbotani1.gif'
import chatBot_image from '../assets/Home/chatBot_text.png'
function Home() {
    const [chatboxShow, setChatboxShow] = useState(false)
    const [menuHovered, setmenuHovered] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    function normalChatBot() {
        // var img = document.getElementsByClassName('chatBot-img')[0]
        // img.src = chatbot1;
    }
    function hoverChatBot() {
        // var img = document.getElementsByClassName('chatBot-img')[0]
        // img.src = chatbot2;
    }
    function chatbotClickHandle() {
        setChatboxShow(true)
    }

    useEffect(() => {
        let element = document.getElementsByClassName('chatBot')[0]
        
        if (chatboxShow) {
            element.style.display = 'none'

        }
        else element.style.display = 'block'

    }, [chatboxShow])


    function startOptMouseEnterHandle() {
        setmenuHovered(true)
    }
    function startOptMouseLeaveHandle() {
        setmenuHovered(false)
    }

    useEffect(() => {
        const screenWidth = window.innerWidth;
        let sideBarElement = document.getElementsByClassName('mainfrst')[0]
        if (menuHovered) {
         if (screenWidth >= 768) {
            sideBarElement.style.width = '18vw'
        } else {
            sideBarElement.style.width = '42vw'
          }
        }
        else {
            if (screenWidth >= 768) {
                sideBarElement.style.width = '6vw'
            } else {
                sideBarElement.style.width = '0vw'
              }
         
        }
    }, [menuHovered])

    return (
        <div className='homePage'>

            <div className='homePage-content'>
                <NavBarHome setmenuHovered={setmenuHovered} />

                <div className='homePage-maincontent pt-2'>
                {/* <div className='mainfrst bg-white rounded border' onMouseEnter={startOptMouseEnterHandle} onMouseLeave={startOptMouseLeaveHandle}><HomeStartOptions /></div> */}
                <div className='mainfrst bg-white rounded border'><HomeStartOptions /></div>

                    <div className='holdercup'>

                      
                       <div className='mainscnd bg-white border rounded' >
                            <ExecutiveBoardSection setIsLoading={setIsLoading} />
                        </div>
                        <div className='maintrd bg-white px-2 rounded border'>
                        <StoryBoard setIsLoading={setIsLoading}/>
                    </div>
                    </div >
                    
                     
                </div>


            </div>

            {/* chat bot icon  */}
            <div className='chatBot' >
            
                <img src={chatBot_text} className='chatBot_Img'onMouseEnter={hoverChatBot} onMouseLeave={normalChatBot} onClick={chatbotClickHandle} data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"></img>
                <img src={chatBot_image} className='chatBot_text' onClick={chatbotClickHandle} data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"></img>
             </div>

            <div className='chatmodalHold'><ChatModal setChatboxShow={setChatboxShow} /></div>

            {isLoading && <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>}


           </div>
    )
}

export default Home
