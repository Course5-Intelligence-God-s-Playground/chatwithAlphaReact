import React, { useEffect, useRef, useState } from 'react'
import './ChatModal.scss'
import Chats from './Chats'
import { Server } from '../utilites/ServerUrl';
import pocaAImg from '../assets/nexus.png'
import AnswerLoader from './AnswerLoader'
import { useRecoilState, useRecoilValue } from 'recoil';
import { ChartImageURL, TableViewRecoil } from '../utilites/TableRecoil';
import ChartTableExtendedView from './ChartTableExtendedView';
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData';
import Feedback from './ChatModal/Feedback';
import Switch from "react-switch";

function ChatModal(prop) {
    const containerRef = useRef(null);
    const getTableViewRecoil = useRecoilValue(TableViewRecoil)
    const [qaChats, setqaChats] = useState([])
    const [isloading, setIsloading] = useState(false)
    const [getfeedbackEmailContainer, setfeedbackEmailContainer] = useState(false)
    const [fieldvalues, setValues] = useState({
        question: '',
        scoring_type: 'Customer Journey POCA scoring (Discover, Learn, Buy & Engage)'
    })
    const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)
    const getChartImageURL = useRecoilValue(ChartImageURL)
    const [lastResponse, setLastResponse] = useState('I am Course5 Discovery, How can I assist you?') //latest answer recived is stored to read out loud option


    function textAreaChangeHandle(e) {//stores user entered query
        setValues({ ...fieldvalues, question: e.target.value })
    }


    function sendHandleonEnterKey(e) { //when user clicks enter inside question field , query is sent 
        //shift+enter acts as new line
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion()
        }
    }

    async function sendQuestion() {  //sends query to backnd and fetches answer response including table , chart

        if (fieldvalues.question != '') {
            const currentDate = new Date()
            let qarray =
            {
                chat_text: fieldvalues.question,
                chat_type: "Question",
                time_stamp: currentDate
            }

            setqaChats([...qaChats, qarray]);
            setValues({ ...fieldvalues, question: '' })
            setIsloading(true)


            try {
                const req = await fetch(Server.setChat, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fieldvalues)
                });
                setIsloading(false)

                const resp = await req.json()
                if (req.ok) {
                    let idval = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
                    let array = [

                        {
                            chat_text: resp.answer,
                            chat_type: "Answer",
                            time_stamp: currentDate,
                            new: true,
                            suggestive: resp.suggestive_questions,
                            model_output: resp.model_output,
                            model_output_type: resp.model_output_type,
                            graph_data: resp.graph_data,
                            graph_type: resp.graph_type,
                            id: idval,
                            scoretype: fieldvalues.scoring_type,
                            general_question: resp.general_question
                        }
                    ]
                    setChatAnswerComponentData({ ...getChatAnswerComponentData, scrollType: idval })
                    setqaChats((prevChats) => [...prevChats, ...array]);
                    setLastResponse(resp.answer)

                }

            } catch (error) { //if there is any error encountered , should be shown as 'normal' sorry chat reponse
                setIsloading(false)
                let errorIdval = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
                let errorText = 'We apologize for any inconvenience. We were unable to determine exactly what you are seeking. Please rephrase your question and ask again.'
                let array = [

                    {
                        chat_text: errorText,
                        chat_type: "Answer",
                        time_stamp: currentDate,
                        new: true,
                        suggestive: [],
                        model_output: '',
                        model_output_type: '',
                        graph_data: '',
                        graph_type: '',
                        id: errorIdval,
                        scoretype: fieldvalues.scoring_type,
                        general_question: true

                    }
                ]
                setChatAnswerComponentData({ ...getChatAnswerComponentData, scrollType: errorIdval })

                setqaChats((prevChats) => [...prevChats, ...array]);
                setLastResponse(errorText)
                // console.error("An error occurred:", error);
            }
        }
    }



    // Scroll to bottom to show new chat when the component updates or the new chat is created changes
    useEffect(() => {
       
        try {
            let lastReq = qaChats[qaChats.length - 1]
            const scrollableDiv = document.getElementsByClassName('chatbodyqa')[0]
            if (lastReq.chat_type == 'Question') {


                // Scroll to the end of the scrollable div
                scrollableDiv.scrollTop = scrollableDiv.scrollHeight;

            }
            else {
                scrollableDiv.scrollTop = scrollableDiv.scrollHeight - 200;

            }
        } catch (error) {

        }

    }, [qaChats]);


    async function clearAllChatsHandler() {  //delete all chats 
        setIsloading(true)
        try {
            let req = await fetch(Server.clearAllChats, {
                method: 'DELETE'
            })

            if (req.ok) {
                setqaChats([])
                setLastResponse('I am Course5 Discovery, How can I assist you?')
            }
            setIsloading(false)
        } catch (error) {
            setIsloading(false)
            console.log(error)
        }
    }

    useEffect(() => { //user clicks close extended table view button , then chat bot page is scrolled to where user had left it

        try {
            let scrolmainEle = document.getElementsByClassName('chatbodyqa')[0]
            let targetEle = document.getElementById(getChatAnswerComponentData.scrollType)
            if (scrolmainEle && targetEle) {
                scrolmainEle.scrollTop = targetEle.offsetTop - scrolmainEle.offsetTop;
            }
        } catch (error) {
            // console.log(error)
        }
    }, [getChatAnswerComponentData.closeBtnClick])


    const readLoudHandler = () => {  //when user clicks on speaker icon above question input field
        //last response is read using browser default text to speech service
        const speechSynthesis = window.speechSynthesis;
        let strippedText = lastResponse.replace(/<[^>]*>/g, '');
        const utterance = new SpeechSynthesisUtterance(strippedText);
        utterance.rate = 1.75; // Increase the rate to 1.5 for faster speech
        speechSynthesis.speak(utterance);

    };

    function feedbackEmailContainerHandler() {
        setfeedbackEmailContainer(true)
    }

    function sendMailHandle() {
//         const email = 'recipient@example.com'; // Replace with the recipient's email address
//         const subject = 'Subject of the email'; // Replace with your desired email subject


//         // Open the email client with the mailto link
       
      
//         if(qaChats.length!=0){
//             let Stexts = ''
//             qaChats[qaChats.length-1].suggestive.map((item)=>{Stexts=Stexts+'\n'+item})
//             let strippedText = qaChats[qaChats.length-1].chat_text.replace(/<[^>]*>/g, '');
           
//             const body = `
//     Question: ${qaChats[qaChats.length - 2].chat_text}
//     Answer: ${strippedText}
//     Suggested Questions:${Stexts}
//   `;
//   const recipientEmail = 'recipient@example.com';
//   const subject = 'Check out this image';
  

//   const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&attachment=${encodeURIComponent(attachmentUrl)}`;

//   window.location.href = mailtoLink;
        // }
    }

    function switchChangehandle(){
        let chatText;
        if(fieldvalues.scoring_type==='Customer Journey POCA scoring (Discover, Learn, Buy & Engage)'){
            setValues({ ...fieldvalues, scoring_type: 'Standard POCA scoring (Marketing, Omnichannel, Ecommerce & Subscription)' })
            chatText='<b className=`fw-bold`>You have Selected: </b>Standard POCA scoring system (Marketing, Omnichannel, Ecommerce & Subscription)'
        }
        else {
            setValues({ ...fieldvalues, scoring_type: 'Customer Journey POCA scoring (Discover, Learn, Buy & Engage)' })
            chatText='<b className=`fw-bold`>You have Selected: </b>Customer Journey POCA scoring system (Discover, Learn, Buy & Engage)'
        }
        const currentDate = new Date()
        let errorIdval = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        let array = [

            {
                chat_text: chatText,
                chat_type: "Answer",
                time_stamp: currentDate,
                new: true,
                suggestive: [],
                model_output: '',
                model_output_type: '',
                graph_data: '',
                graph_type: '',
                id: errorIdval,
                scoretype: chatText,
                general_question: true

            }
        ]

        setqaChats((prevChats) => [...prevChats, ...array]);
    }

   
    return (
        <div class="offcanvas border offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">


            {
                !getTableViewRecoil ?
                    <>
                        <div class="offcanvas-header border-bottom">
                            <div className='offcanvas-headerSection1 d-flex  align-items-center'>
                                {/* <div class="offcanvas-title  w-25 d-flex align-items-center justify-content-between" id="offcanvasScrollingLabel"> */}
                                <img src={pocaAImg} className='nexusImgChat'></img>
                                {/* <div className='text-muted ps-2 offcanvas-titleTxt'>AI Assistant</div> */}


                                {/* <div className='offcanvas-headerSection2'> */}
                                    {/* <div className='text-muted offcanvas-selectLabel chatmodalNavSelectHdng fw-bold'>POCA scoring system:</div> */}
                                    {/* here  */}
                             
                                {/* </div> */}

                            </div>

                            <div className='toggleBtn d-flex align-items-center gap-1 ms-4'>
                               <span className='fw-semibold'style={{color:'#612fa3'}}>Standard POCA</span>
                               <Switch offColor='#612FA3' className='switchBtn' uncheckedIcon={false} checkedIcon={false} onChange={switchChangehandle} checked={fieldvalues.scoring_type=='Customer Journey POCA scoring (Discover, Learn, Buy & Engage)'?true:false} />
                               <span className='fw-semibold text-success'>Customer Journey POCA</span>
                               </div>

                            <div className='d-flex align-items-center justify-content-end  w-25'>
                                <button className='btn btn-outline-secondary btn-sm clearchatbtn d-flex align-items-center' onClick={clearAllChatsHandler}>Clear</button>
                                <i class="bi bi-x-circle h4 modalClose mt-1" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { prop.setChatboxShow(false) }}></i>
                            </div>
                        </div>
                        <div class="offcanvas-body">
                            <div className='chatbody d-flex flex-column'>

                                <div className='chatbodyqa rounded pt-1' ref={containerRef}>
                                    {
                                        !getfeedbackEmailContainer ?
                                            <Chats qaChats={qaChats} setValues={setValues} fieldvalues={fieldvalues} setqaChats={setqaChats}/>
                                            :
                                            <div className=' d-flex justify-content-center'>
                                                <div className='feedbackEmailContainer'>
                                                    <Feedback setfeedbackEmailContainer={setfeedbackEmailContainer} />
                                                </div>
                                            </div>
                                    }
                                </div>

                                <div>

                                    <li class="list-group-item exceIcons d-flex justify-content-between">
                                        <div className='list-group-itemIcons frstlist-group-item d-flex gap-4 '>
                                            <svg onClick={feedbackEmailContainerHandler} className='feedbkIcon' width="30" height="30" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%' }}><path d="M16.0417 21.4158C17.0192 21.8025 17.9117 22.3168 18.7149 22.9564C19.5182 23.5939 20.2045 24.3376 20.7762 25.1791C21.942 26.8771 22.5699 28.8867 22.5782 30.9464V31.875H20.7188V30.9443C20.7228 29.8452 20.5078 28.7565 20.0864 27.7414C19.665 26.7264 19.0456 25.8055 18.2644 25.0325C17.4976 24.2766 16.5959 23.6711 15.606 23.2475C14.5772 22.8067 13.4698 22.579 12.3505 22.5781C11.2515 22.5741 10.1627 22.7891 9.14773 23.2105C8.13271 23.6319 7.21181 24.2513 6.43879 25.0325C5.68312 25.7995 5.07769 26.7011 4.65379 27.6909C4.21604 28.6981 3.99503 29.784 3.98441 30.9443V31.875H2.12503V30.9443C2.1196 28.8831 2.74875 26.8703 3.92703 25.1791C5.10066 23.4859 6.74857 22.1773 8.66366 21.4179C8.2286 21.1189 7.83243 20.767 7.48428 20.3703C7.14027 19.9797 6.84289 19.5504 6.59816 19.091C6.35439 18.6321 6.16879 18.1445 6.04566 17.6396C5.9201 17.1253 5.85239 16.5986 5.84378 16.0693C5.84378 15.1704 6.01378 14.3267 6.35379 13.5426C7.01861 11.9891 8.2559 10.751 9.80904 10.0852C10.6103 9.74415 11.4718 9.5671 12.3427 9.56454C13.2135 9.56199 14.076 9.73399 14.8793 10.0704C16.4332 10.7357 17.6713 11.9738 18.3367 13.5278C18.8869 14.8217 19.0039 16.2588 18.6703 17.6247C18.5428 18.1284 18.3558 18.6129 18.105 19.0782C17.8559 19.5389 17.5589 19.9719 17.2189 20.3703C16.8789 20.7676 16.4858 21.114 16.0417 21.4158ZM12.3505 20.7188C12.9902 20.7188 13.5915 20.5976 14.1525 20.3575C15.2648 19.8849 16.1501 18.9988 16.6218 17.8861C16.8747 17.3145 17 16.7089 17 16.0714C17.0028 15.4629 16.8832 14.86 16.6485 14.2986C16.4138 13.7372 16.0687 13.2286 15.6337 12.8031C15.2034 12.3835 14.7018 12.0439 14.1525 11.8001C13.5857 11.547 12.9713 11.418 12.3505 11.4219C11.713 11.4219 11.1117 11.543 10.5507 11.7831C9.43224 12.2602 8.54144 13.151 8.06441 14.2694C7.82429 14.8304 7.70316 15.4318 7.70316 16.0714C7.70316 16.7089 7.82429 17.3102 8.06441 17.8712C8.30878 18.4322 8.63816 18.9274 9.05466 19.3524C9.48584 19.7881 9.99963 20.1334 10.5659 20.368C11.1322 20.6026 11.7397 20.7219 12.3527 20.7188H12.3505ZM31.875 2.125V17H28.1563L22.5782 22.5781V17H20.7188V15.1406H24.4375V18.0901L27.387 15.1406H30.0157V3.98438H11.4219V7.32488C11.1102 7.36426 10.7998 7.41315 10.4912 7.4715C10.1746 7.53159 9.86393 7.61905 9.56254 7.73287V2.125H31.875Z" fill="#111111"></path></svg>
                                            <svg width="30" onClick={sendMailHandle} className='sendmailIcon' height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%' }}><path d="M7.3125 5.625C5.96984 5.625 4.68217 6.15837 3.73277 7.10777C2.78337 8.05717 2.25 9.34484 2.25 10.6875V25.3125C2.25 26.6552 2.78337 27.9428 3.73277 28.8922C4.68217 29.8416 5.96984 30.375 7.3125 30.375H28.6875C30.0302 30.375 31.3178 29.8416 32.2672 28.8922C33.2166 27.9428 33.75 26.6552 33.75 25.3125V10.6875C33.75 9.34484 33.2166 8.05717 32.2672 7.10777C31.3178 6.15837 30.0302 5.625 28.6875 5.625H7.3125ZM31.5 11.7034L18 18.972L4.5 11.7034V10.6875C4.5 9.94158 4.79632 9.22621 5.32376 8.69876C5.85121 8.17132 6.56658 7.875 7.3125 7.875H28.6875C29.4334 7.875 30.1488 8.17132 30.6762 8.69876C31.2037 9.22621 31.5 9.94158 31.5 10.6875V11.7034ZM4.5 14.2582L17.4668 21.2411C17.6306 21.3294 17.8139 21.3755 18 21.3755C18.1861 21.3755 18.3694 21.3294 18.5333 21.2411L31.5 14.2582V25.3125C31.5 26.0584 31.2037 26.7738 30.6762 27.3012C30.1488 27.8287 29.4334 28.125 28.6875 28.125H7.3125C6.56658 28.125 5.85121 27.8287 5.32376 27.3012C4.79632 26.7738 4.5 26.0584 4.5 25.3125V14.2582Z" fill="#111111"></path></svg>
                                            <svg width="10" className='readLoudIcon'  onClick={readLoudHandler} height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '47%' }}><path d="M21 2C21 2 25 6 25 16C25 26 21 30 21 30M27 4C27 4 30 8 30 16C30 24 27 28 27 28M20 16C20 8 15 2 15 2L8 10H2V22H8L15 30C15 30 20 24 20 16Z" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        </div>

                                    </li>
                                    {/* type question here  */}
                                    <div className='chatbodyinput w-100 d-flex align-items-center gap-4'>
                                        <textarea className='chatbodyinput-txtarea ps-2' placeholder='Ask me anything...' value={fieldvalues.question} onChange={textAreaChangeHandle} onKeyDown={!isloading ? sendHandleonEnterKey : null} autoFocus={true} disabled={getfeedbackEmailContainer}></textarea>
                                        <i class="bi bi-send fs-4 text-primary chatbodyinputSendIcon" onClick={!isloading ? () => { sendQuestion() } : null}></i>
                                    </div>
                                </div>
                            </div>

                            {isloading && <AnswerLoader value={fieldvalues.scoring_type}/>
                                
                            }
                        </div></>

                    :

                    <div className='ExpandedTableViewCnt'>
                        <ChartTableExtendedView />
                    </div>
            }

        </div>
    )
}

export default ChatModal
