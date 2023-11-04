import React, { useEffect, useRef, useState } from 'react'
import './ChatModal.scss'
import Chats from './Chats'
import { Server } from '../utilites/ServerUrl';
import pocaAImg from '../assets/nexus.png'
import spinnersImg from '../assets/spinners.gif'
import loadingImg from '../assets/loading.gif'
import { useRecoilState, useRecoilValue } from 'recoil';
import { TableViewRecoil } from '../utilites/TableRecoil';
import ChartTableExtendedView from './ChartTableExtendedView';
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData';
function ChatModal(prop) {
    const containerRef = useRef(null);
    const getTableViewRecoil = useRecoilValue(TableViewRecoil)
    const [qaChats, setqaChats] = useState([])
    const [isloading, setIsloading] = useState(false)
    const [fieldvalues, setValues] = useState({
        question: '',
        scoring_type: 'Customer Journey POCA scoring (Discover, Learn, Buy & Engage)'
    })
    const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)




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

                }

            } catch (error) { //if there is any error encountered , should be shown as 'normal' sorry chat reponse
                setIsloading(false)
                let errorIdval = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
                let array = [

                    {
                        chat_text: 'We apologize for any inconvenience. We were unable to determine exactly what you are seeking. Please rephrase your question and ask again.',
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

                // console.error("An error occurred:", error);
            }
        }
    }


    function selectOnchangeHandle(e) {
        setValues({ ...fieldvalues, scoring_type: e.target.value })

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

    return (
        <div class="offcanvas border offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">


            {
                !getTableViewRecoil ?
                    <>
                        <div class="offcanvas-header border-bottom">
                            <div className='offcanvas-headerSection1 d-flex w-75 align-items-center'>
                                {/* <div class="offcanvas-title  w-25 d-flex align-items-center justify-content-between" id="offcanvasScrollingLabel"> */}
                                <img src={pocaAImg} className='nexusImgChat'></img>
                                {/* <div className='text-muted ps-2 offcanvas-titleTxt'>AI Assistant</div> */}


                                <div className='offcanvas-headerSection2'>
                                    <div className='text-muted offcanvas-selectLabel chatmodalNavSelectHdng fw-bold'>POCA scoring system:</div>
                                    <select class="form-select form-select-sm ms-2" name='select' aria-label="Small select example" value={fieldvalues.scoring_type} onChange={selectOnchangeHandle}>
                                        {/* <option value="POCA Scores" selected>POCA Scores</option> */}
                                        <option value="Standard POCA scoring (Marketing, Omnichannel, Ecommerce & Subscription)">Standard POCA scoring (Marketing, Omnichannel, Ecommerce & Subscription)</option>

                                        <option selected value="Customer Journey POCA scoring (Discover, Learn, Buy & Engage)">Customer Journey POCA scoring (Discover, Learn, Buy & Engage)</option>

                                    </select>
                                </div>

                            </div>
                            <div className='d-flex align-items-center justify-content-end  w-25'>
                                <button className='btn btn-outline-secondary btn-sm clearchatbtn d-flex align-items-center' onClick={clearAllChatsHandler}>Clear</button>
                                <i class="bi bi-x-circle h4 modalClose mt-1" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { prop.setChatboxShow(false) }}></i>
                            </div>
                        </div>
                        <div class="offcanvas-body">
                            <div className='chatbody d-flex flex-column'>

                                <div className='chatbodyqa' ref={containerRef}>
                                    <Chats qaChats={qaChats} setValues={setValues} fieldvalues={fieldvalues} />
                                </div>


                                <div>

                                    <li class="list-group-item exceIcons d-flex justify-content-between">
                                        <div className='list-group-itemIcons frstlist-group-item d-flex gap-4 '>
                                            <svg width="30" height="30" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%' }}><path d="M16.0417 21.4158C17.0192 21.8025 17.9117 22.3168 18.7149 22.9564C19.5182 23.5939 20.2045 24.3376 20.7762 25.1791C21.942 26.8771 22.5699 28.8867 22.5782 30.9464V31.875H20.7188V30.9443C20.7228 29.8452 20.5078 28.7565 20.0864 27.7414C19.665 26.7264 19.0456 25.8055 18.2644 25.0325C17.4976 24.2766 16.5959 23.6711 15.606 23.2475C14.5772 22.8067 13.4698 22.579 12.3505 22.5781C11.2515 22.5741 10.1627 22.7891 9.14773 23.2105C8.13271 23.6319 7.21181 24.2513 6.43879 25.0325C5.68312 25.7995 5.07769 26.7011 4.65379 27.6909C4.21604 28.6981 3.99503 29.784 3.98441 30.9443V31.875H2.12503V30.9443C2.1196 28.8831 2.74875 26.8703 3.92703 25.1791C5.10066 23.4859 6.74857 22.1773 8.66366 21.4179C8.2286 21.1189 7.83243 20.767 7.48428 20.3703C7.14027 19.9797 6.84289 19.5504 6.59816 19.091C6.35439 18.6321 6.16879 18.1445 6.04566 17.6396C5.9201 17.1253 5.85239 16.5986 5.84378 16.0693C5.84378 15.1704 6.01378 14.3267 6.35379 13.5426C7.01861 11.9891 8.2559 10.751 9.80904 10.0852C10.6103 9.74415 11.4718 9.5671 12.3427 9.56454C13.2135 9.56199 14.076 9.73399 14.8793 10.0704C16.4332 10.7357 17.6713 11.9738 18.3367 13.5278C18.8869 14.8217 19.0039 16.2588 18.6703 17.6247C18.5428 18.1284 18.3558 18.6129 18.105 19.0782C17.8559 19.5389 17.5589 19.9719 17.2189 20.3703C16.8789 20.7676 16.4858 21.114 16.0417 21.4158ZM12.3505 20.7188C12.9902 20.7188 13.5915 20.5976 14.1525 20.3575C15.2648 19.8849 16.1501 18.9988 16.6218 17.8861C16.8747 17.3145 17 16.7089 17 16.0714C17.0028 15.4629 16.8832 14.86 16.6485 14.2986C16.4138 13.7372 16.0687 13.2286 15.6337 12.8031C15.2034 12.3835 14.7018 12.0439 14.1525 11.8001C13.5857 11.547 12.9713 11.418 12.3505 11.4219C11.713 11.4219 11.1117 11.543 10.5507 11.7831C9.43224 12.2602 8.54144 13.151 8.06441 14.2694C7.82429 14.8304 7.70316 15.4318 7.70316 16.0714C7.70316 16.7089 7.82429 17.3102 8.06441 17.8712C8.30878 18.4322 8.63816 18.9274 9.05466 19.3524C9.48584 19.7881 9.99963 20.1334 10.5659 20.368C11.1322 20.6026 11.7397 20.7219 12.3527 20.7188H12.3505ZM31.875 2.125V17H28.1563L22.5782 22.5781V17H20.7188V15.1406H24.4375V18.0901L27.387 15.1406H30.0157V3.98438H11.4219V7.32488C11.1102 7.36426 10.7998 7.41315 10.4912 7.4715C10.1746 7.53159 9.86393 7.61905 9.56254 7.73287V2.125H31.875Z" fill="#111111"></path></svg>
                                            <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%' }}><path d="M7.3125 5.625C5.96984 5.625 4.68217 6.15837 3.73277 7.10777C2.78337 8.05717 2.25 9.34484 2.25 10.6875V25.3125C2.25 26.6552 2.78337 27.9428 3.73277 28.8922C4.68217 29.8416 5.96984 30.375 7.3125 30.375H28.6875C30.0302 30.375 31.3178 29.8416 32.2672 28.8922C33.2166 27.9428 33.75 26.6552 33.75 25.3125V10.6875C33.75 9.34484 33.2166 8.05717 32.2672 7.10777C31.3178 6.15837 30.0302 5.625 28.6875 5.625H7.3125ZM31.5 11.7034L18 18.972L4.5 11.7034V10.6875C4.5 9.94158 4.79632 9.22621 5.32376 8.69876C5.85121 8.17132 6.56658 7.875 7.3125 7.875H28.6875C29.4334 7.875 30.1488 8.17132 30.6762 8.69876C31.2037 9.22621 31.5 9.94158 31.5 10.6875V11.7034ZM4.5 14.2582L17.4668 21.2411C17.6306 21.3294 17.8139 21.3755 18 21.3755C18.1861 21.3755 18.3694 21.3294 18.5333 21.2411L31.5 14.2582V25.3125C31.5 26.0584 31.2037 26.7738 30.6762 27.3012C30.1488 27.8287 29.4334 28.125 28.6875 28.125H7.3125C6.56658 28.125 5.85121 27.8287 5.32376 27.3012C4.79632 26.7738 4.5 26.0584 4.5 25.3125V14.2582Z" fill="#111111"></path></svg>
                                            <svg width="10" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%' }}><path d="M12.8125 17.1875H11.25C11.0014 17.1875 10.7629 17.0887 10.5871 16.9129C10.4113 16.7371 10.3125 16.4986 10.3125 16.25C10.3125 16.0014 10.4113 15.7629 10.5871 15.5871C10.7629 15.4113 11.0014 15.3125 11.25 15.3125H16.25C16.4986 15.3125 16.7371 15.4113 16.9129 15.5871C17.0887 15.7629 17.1875 16.0014 17.1875 16.25C17.1875 16.4986 17.0887 16.7371 16.9129 16.9129C16.7371 17.0887 16.4986 17.1875 16.25 17.1875H14.6875V23.75C14.6875 23.9986 14.5887 24.2371 14.4129 24.4129C14.2371 24.5887 13.9986 24.6875 13.75 24.6875C13.5014 24.6875 13.2629 24.5887 13.0871 24.4129C12.9113 24.2371 12.8125 23.9986 12.8125 23.75V17.1875ZM35.9375 14.4906V23.75C35.9377 25.2715 35.3546 26.7351 34.3082 27.8397C33.2618 28.9442 31.8318 29.6055 30.3125 29.6875C29.617 31.5286 28.3773 33.1142 26.7584 34.2332C25.1394 35.3523 23.2181 35.9517 21.25 35.9517C19.2819 35.9517 17.3606 35.3523 15.7416 34.2332C14.1227 33.1142 12.883 31.5286 12.1875 29.6875H6.25C5.66984 29.6875 5.11344 29.457 4.7032 29.0468C4.29297 28.6365 4.0625 28.0802 4.0625 27.5V12.5C4.0625 11.9198 4.29297 11.3634 4.7032 10.9532C5.11344 10.543 5.66984 10.3125 6.25 10.3125H15.5219C15.1429 8.91007 15.2913 7.41738 15.9388 6.11697C16.5864 4.81657 17.6882 3.79869 19.0358 3.25601C20.3833 2.71333 21.8831 2.68352 23.2512 3.1722C24.6192 3.66089 25.7606 4.63417 26.4594 5.9078C27.3974 5.38146 28.4879 5.19371 29.5479 5.37605C30.6079 5.55839 31.573 6.09973 32.2812 6.90925C32.9894 7.71876 33.3977 8.74721 33.4375 9.82206C33.4773 10.8969 33.1463 11.9528 32.5 12.8125H34.2625C34.7069 12.8137 35.1327 12.991 35.4466 13.3056C35.7606 13.6201 35.9371 14.0462 35.9375 14.4906ZM27.0969 7.72655C27.1572 8.06436 27.1875 8.40684 27.1875 8.74999C27.1878 10.2591 26.6135 11.7117 25.5812 12.8125H28.75C29.1941 12.8129 29.632 12.7082 30.0278 12.5068C30.4236 12.3055 30.7661 12.0133 31.0273 11.6541C31.2885 11.2949 31.4609 10.879 31.5305 10.4404C31.6 10.0018 31.5647 9.55294 31.4274 9.13059C31.2901 8.70825 31.0548 8.32442 30.7407 8.01052C30.4265 7.69661 30.0425 7.46156 29.6201 7.32459C29.1976 7.18763 28.7488 7.15265 28.3102 7.22251C27.8716 7.29238 27.4558 7.46511 27.0969 7.72655ZM17.5 10.3125H21.25C21.7756 10.3131 22.2834 10.5029 22.6805 10.8472C23.0776 11.1915 23.3374 11.6673 23.4125 12.1875C24.0683 11.775 24.5924 11.1836 24.9232 10.483C25.2539 9.7824 25.3774 9.00185 25.2792 8.23338C25.1809 7.46491 24.8649 6.74056 24.3685 6.14575C23.8721 5.55093 23.216 5.11046 22.4775 4.87627C21.739 4.64208 20.949 4.62393 20.2005 4.82397C19.4521 5.02401 18.7764 5.43389 18.2532 6.00528C17.73 6.57668 17.3812 7.28576 17.2477 8.04891C17.1142 8.81206 17.2018 9.59746 17.5 10.3125ZM6.25 27.8125H21.25C21.3329 27.8125 21.4124 27.7796 21.471 27.721C21.5296 27.6624 21.5625 27.5829 21.5625 27.5V12.5C21.5625 12.4171 21.5296 12.3376 21.471 12.279C21.4124 12.2204 21.3329 12.1875 21.25 12.1875H6.25C6.16712 12.1875 6.08763 12.2204 6.02903 12.279C5.97042 12.3376 5.9375 12.4171 5.9375 12.5V27.5C5.9375 27.5829 5.97042 27.6624 6.02903 27.721C6.08763 27.7796 6.16712 27.8125 6.25 27.8125ZM29.0625 26.25V15C29.0625 14.9171 29.0296 14.8376 28.971 14.779C28.9124 14.7204 28.8329 14.6875 28.75 14.6875H23.4375V27.5C23.4375 28.0802 23.207 28.6365 22.7968 29.0468C22.3866 29.457 21.8302 29.6875 21.25 29.6875H14.2344C15.0111 31.2727 16.3018 32.5482 17.8962 33.306C19.4906 34.0639 21.2946 34.2594 23.0143 33.8607C24.734 33.462 26.268 32.4927 27.3663 31.1106C28.4646 29.7286 29.0625 28.0153 29.0625 26.25ZM34.0625 14.6875H30.9125C30.9279 14.791 30.9363 14.8954 30.9375 15V26.25C30.9374 26.7448 30.8998 27.239 30.825 27.7281C31.7398 27.5384 32.5612 27.0392 33.1509 26.3146C33.7406 25.59 34.0626 24.6842 34.0625 23.75V14.6875Z" fill="black"></path></svg>
                                            <svg width="10" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%' }}><path d="M18.292 11.708C18.4798 11.8958 18.7344 12.0013 19 12.0013C19.2656 12.0013 19.5202 11.8958 19.708 11.708C19.8958 11.5203 20.0013 11.2656 20.0013 11C20.0013 10.7345 19.8958 10.4798 19.708 10.292L17.414 8.00004H21C21.7956 8.00004 22.5587 8.31611 23.1213 8.87872C23.6839 9.44133 24 10.2044 24 11V20.1C22.786 20.3479 21.7072 21.0376 20.9728 22.0356C20.2384 23.0336 19.9008 24.2688 20.0253 25.5016C20.1499 26.7344 20.7277 27.877 21.6468 28.708C22.566 29.5389 23.7609 29.999 25 29.999C26.2391 29.999 27.434 29.5389 28.3532 28.708C29.2723 27.877 29.8501 26.7344 29.9747 25.5016C30.0992 24.2688 29.7616 23.0336 29.0272 22.0356C28.2928 21.0376 27.214 20.3479 26 20.1V11C26 9.67396 25.4732 8.40219 24.5355 7.46451C23.5979 6.52683 22.3261 6.00004 21 6.00004H17.414L19.708 3.70804C19.8958 3.52027 20.0013 3.26559 20.0013 3.00004C20.0013 2.73449 19.8958 2.47982 19.708 2.29204C19.5202 2.10427 19.2656 1.99878 19 1.99878C18.7344 1.99878 18.4798 2.10427 18.292 2.29204L14.292 6.29204C14.1989 6.38493 14.125 6.49528 14.0746 6.61678C14.0242 6.73827 13.9982 6.86851 13.9982 7.00004C13.9982 7.13158 14.0242 7.26182 14.0746 7.38331C14.125 7.5048 14.1989 7.61515 14.292 7.70804L18.292 11.708ZM28 25C28 25.394 27.9224 25.7841 27.7716 26.1481C27.6209 26.5121 27.3999 26.8428 27.1213 27.1214C26.8427 27.3999 26.512 27.6209 26.1481 27.7717C25.7841 27.9224 25.394 28 25 28C24.606 28 24.2159 27.9224 23.8519 27.7717C23.488 27.6209 23.1573 27.3999 22.8787 27.1214C22.6001 26.8428 22.3791 26.5121 22.2284 26.1481C22.0776 25.7841 22 25.394 22 25C22 24.2044 22.3161 23.4413 22.8787 22.8787C23.4413 22.3161 24.2044 22 25 22C25.7956 22 26.5587 22.3161 27.1213 22.8787C27.6839 23.4413 28 24.2044 28 25ZM12 7.00004C12.0002 8.1527 11.6022 9.27003 10.8733 10.1629C10.1444 11.0559 9.12936 11.6695 8 11.9V21C8 21.7957 8.31607 22.5588 8.87868 23.1214C9.44129 23.684 10.2044 24 11 24H14.586L12.292 21.708C12.1042 21.5203 11.9987 21.2656 11.9987 21C11.9987 20.7345 12.1042 20.4798 12.292 20.292C12.4798 20.1043 12.7344 19.9988 13 19.9988C13.2656 19.9988 13.5202 20.1043 13.708 20.292L17.708 24.292C17.8011 24.3849 17.875 24.4953 17.9254 24.6168C17.9758 24.7383 18.0018 24.8685 18.0018 25C18.0018 25.1316 17.9758 25.2618 17.9254 25.3833C17.875 25.5048 17.8011 25.6152 17.708 25.708L13.708 29.708C13.5202 29.8958 13.2656 30.0013 13 30.0013C12.7344 30.0013 12.4798 29.8958 12.292 29.708C12.1042 29.5203 11.9987 29.2656 11.9987 29C11.9987 28.7345 12.1042 28.4798 12.292 28.292L14.586 26H11C9.67392 26 8.40215 25.4733 7.46447 24.5356C6.52678 23.5979 6 22.3261 6 21V11.9C5.07308 11.7108 4.21886 11.2625 3.53655 10.6072C2.85424 9.95194 2.37184 9.11651 2.14538 8.19798C1.91891 7.27946 1.95768 6.31554 2.25717 5.41816C2.55667 4.52079 3.1046 3.7268 3.83733 3.1284C4.57006 2.53001 5.45752 2.15176 6.39664 2.0376C7.33575 1.92344 8.28799 2.07805 9.14274 2.48347C9.9975 2.88889 10.7197 3.52848 11.2255 4.32797C11.7312 5.12745 11.9998 6.05401 12 7.00004ZM10 7.00004C10 6.60608 9.9224 6.21597 9.77164 5.85199C9.62088 5.48802 9.3999 5.1573 9.12132 4.87872C8.84275 4.60015 8.51203 4.37917 8.14805 4.2284C7.78407 4.07764 7.39397 4.00004 7 4.00004C6.60603 4.00004 6.21593 4.07764 5.85195 4.2284C5.48797 4.37917 5.15726 4.60015 4.87868 4.87872C4.6001 5.1573 4.37913 5.48802 4.22836 5.85199C4.0776 6.21597 4 6.60608 4 7.00004C4 7.79569 4.31607 8.55875 4.87868 9.12136C5.44129 9.68397 6.20435 10 7 10C7.79565 10 8.55871 9.68397 9.12132 9.12136C9.68393 8.55875 10 7.79569 10 7.00004Z" fill="#111111"></path></svg>
                                            <svg width="10" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '44%' }}><path d="M16.6429 17.1429V19.5H14.7857V17.1429C14.7857 16.6314 14.5825 16.1408 14.2208 15.7792C13.8592 15.4175 13.3686 15.2143 12.8571 15.2143H4.28571C3.77423 15.2143 3.28369 15.4175 2.92201 15.7792L3.19699 16.0541L2.92201 15.7792C2.56033 16.1408 2.35714 16.6314 2.35714 17.1429V19.5H0.5V17.1429C0.5 16.1388 0.898851 15.1759 1.60881 14.466C2.31877 13.756 3.28168 13.3571 4.28571 13.3571H12.8571C13.8612 13.3571 14.8241 13.756 15.534 14.466C16.244 15.1759 16.6429 16.1388 16.6429 17.1429ZM3.35714 26.2143H5.21429V27.1429C5.21429 29.1699 6.01951 31.1139 7.45283 32.5472C8.88614 33.9805 10.8301 34.7857 12.8571 34.7857H16.6429V36.6429H12.8571C10.3376 36.6429 7.92122 35.642 6.13963 33.8604C4.35803 32.0788 3.35714 29.6624 3.35714 27.1429V26.2143ZM31.9286 13.7857V12.8571C31.9286 11.8535 31.7309 10.8596 31.3468 9.93235C30.9627 9.00508 30.3997 8.16253 29.69 7.45283C28.9803 6.74312 28.1378 6.18016 27.2105 5.79607C26.2832 5.41198 25.2894 5.21429 24.2857 5.21429H20.5V3.35715H24.2857C26.8053 3.35715 29.2216 4.35804 31.0032 6.13963C32.7848 7.92123 33.7857 10.3376 33.7857 12.8571V13.7857H31.9286ZM37.078 35.7792L36.7244 36.1327L37.078 35.7791C36.7163 35.4175 36.2258 35.2143 35.7143 35.2143H27.1429C26.6314 35.2143 26.1408 35.4175 25.7792 35.7791C25.4175 36.1408 25.2143 36.6314 25.2143 37.1429V39.5H23.3571V37.1429C23.3571 36.1388 23.756 35.1759 24.466 34.466C25.1759 33.756 26.1388 33.3571 27.1429 33.3571H35.7143C36.7183 33.3571 37.6812 33.756 38.3912 34.466C39.1012 35.1759 39.5 36.1388 39.5 37.1429V39.5H37.6429V37.1429C37.6429 36.6314 37.4397 36.1408 37.078 35.7792ZM11.4683 10.0498C10.6108 10.6228 9.60272 10.9286 8.57143 10.9286C7.18851 10.9286 5.86224 10.3792 4.88437 9.40134C3.9065 8.42348 3.35714 7.0972 3.35714 5.71429C3.35714 4.683 3.66296 3.67487 4.23591 2.81739C4.80886 1.9599 5.62322 1.29157 6.57601 0.896916C7.52879 0.502259 8.57721 0.398999 9.58868 0.600194C10.6002 0.801388 11.5293 1.298 12.2585 2.02723C12.9877 2.75646 13.4843 3.68556 13.6855 4.69703C13.8867 5.7085 13.7835 6.75692 13.3888 7.70971C12.9941 8.66249 12.3258 9.47685 11.4683 10.0498ZM10.4366 2.92293C9.88448 2.55404 9.23541 2.35715 8.57143 2.35715C7.68106 2.35715 6.82716 2.71084 6.19757 3.34043C5.56798 3.97002 5.21429 4.82392 5.21429 5.71429C5.21429 6.37827 5.41118 7.02734 5.78007 7.57942C6.14895 8.13149 6.67327 8.56179 7.28671 8.81588C7.90014 9.06998 8.57515 9.13646 9.22637 9.00692C9.8776 8.87739 10.4758 8.55765 10.9453 8.08815C11.4148 7.61864 11.7345 7.02046 11.8641 6.36923C11.9936 5.71801 11.9271 5.043 11.673 4.42956C11.4189 3.81613 10.9886 3.29181 10.4366 2.92293ZM27.0931 28.6112C26.5201 27.7537 26.2143 26.7456 26.2143 25.7143C26.2143 24.3314 26.7636 23.0051 27.7415 22.0272C28.7194 21.0494 30.0457 20.5 31.4286 20.5C32.4599 20.5 33.468 20.8058 34.3255 21.3788C35.183 21.9517 35.8513 22.7661 36.2459 23.7189C36.6406 24.6717 36.7439 25.7201 36.5427 26.7315C36.3415 27.743 35.8449 28.6721 35.1156 29.4013C34.3864 30.1306 33.4573 30.6272 32.4458 30.8284C31.4344 31.0296 30.3859 30.9263 29.4332 30.5317C28.4804 30.137 27.666 29.4687 27.0931 28.6112ZM34.2199 27.5794C34.5888 27.0273 34.7857 26.3783 34.7857 25.7143C34.7857 24.8239 34.432 23.97 33.8024 23.3404C33.1728 22.7108 32.3189 22.3571 31.4286 22.3571C30.7646 22.3571 30.1155 22.554 29.5634 22.9229C29.0114 23.2918 28.5811 23.8161 28.327 24.4296C28.0729 25.043 28.0064 25.718 28.1359 26.3692C28.2655 27.0205 28.5852 27.6186 29.0547 28.0881C29.5242 28.5576 30.1224 28.8774 30.7736 29.0069C31.4248 29.1365 32.0999 29.07 32.7133 28.8159C33.3267 28.5618 33.851 28.1315 34.2199 27.5794Z" fill="#111111" stroke="black"></path></svg>
                                            <svg width="10" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '47%' }}><path d="M21 2C21 2 25 6 25 16C25 26 21 30 21 30M27 4C27 4 30 8 30 16C30 24 27 28 27 28M20 16C20 8 15 2 15 2L8 10H2V22H8L15 30C15 30 20 24 20 16Z" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        </div>

                                    </li>
                                    {/* type question here  */}
                                    <div className='chatbodyinput w-100 d-flex align-items-center gap-4'>
                                        <textarea className='chatbodyinput-txtarea ps-2' placeholder='Ask me anything...' value={fieldvalues.question} onChange={textAreaChangeHandle} onKeyDown={!isloading ? sendHandleonEnterKey : null} autoFocus={true}></textarea>
                                        <i class="bi bi-send fs-4 text-primary chatbodyinputSendIcon" onClick={!isloading ? () => { sendQuestion() } : null}></i>
                                    </div>
                                </div>
                            </div>
                            {isloading &&
                                <div className='d-flex flex-column chtbotSpinner justify-content-center'>
                                    <img className='chtbotSpinnerfox' src={spinnersImg}></img>
                                    <img className='chtbotSpinner2' src={loadingImg}></img>
                                </div>
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
