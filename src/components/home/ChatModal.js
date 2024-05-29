import React, { useEffect, useRef, useState } from 'react'
import './ChatModal.scss'
import Chats from './Chats'
import { Server } from '../utilites/ServerUrl';
import pocaAImg from '../assets/nexus.png'
import AnswerLoader from './AnswerLoader'
import { useRecoilState, useRecoilValue } from 'recoil';
import {  TableViewRecoil } from '../utilites/TableRecoil';
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
   const [feedBackId,setFeedBackId] = useState(null) //user selected answerID to send feedback for

    
    // websocket 
    const [timeStore,setTimeStore] = useState([])
    const [regenerateQueId,setRegenerateQueId] = useState(null)
    const [isRegnerate,setIsRegenerate] = useState(false)
    const [isGeneralQue,setIsGeneralQue] = useState(false)
    const [wsnTimeTaken,setWsTimeTaken] = useState({
        startTime:null,
        endTime:null
    })
    let retryCount = 0;
    const maxRetries = 5;
    const retryInterval = 5000; // 5 seconds
    
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
    // Scroll to bottom to show new chat when the component updates or the new chat is created changes

    function updateErrorMessage(){
        setIsloading(false)
        const currentDate = new Date()

        let errorIdval = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        let errorText = 'We apologize for any inconvenience. We were unable to determine exactly what you are seeking. Please rephrase your question and ask again.'
        let array = [

            {
                chat_text: errorText,
                chat_type: "msg",
                time_stamp: currentDate,
                new: true,
                suggestive: [],
                model_output: '',
                model_output_type: '',
                graph_data: '',
                graph_type: '',
                id: errorIdval,
                scoretype: fieldvalues.scoring_type,
                general_question: true,
                time_taken: '',
                suggestive_completed:false,
                chart_completed:false

            }
        ]
        setChatAnswerComponentData({ ...getChatAnswerComponentData, scrollType: errorIdval })

        setqaChats((prevChats) => [...prevChats, ...array]);
      
    }
    async function sendQuestion(isRegenerate,oldQuestionId) {  //sends query to backnd which is to be sent to live server/ai
       
        if (fieldvalues.question != '' || isRegenerate==true) {
            if(isRegenerate){
                setIsRegenerate(true)
                if(qaChats[qaChats.length - 1]?.id == oldQuestionId.replace('question','')){ // to check if regenerating answer is last answer or not
                setRegenerateQueId(oldQuestionId.replace('question',''))

                }
                setChatAnswerComponentData( {
                    scrollType:oldQuestionId.replace('question',''),//stores user current scroll position in chatbot page so to retun to same spot after user returns from expanded table view
                    ShowAnimation:true, //chatbot answer text animation state, animation will appear only once and not after user enters from expanded table view page
                    closeBtnClick:!getChatAnswerComponentData.closeBtnClick //when user clicks close expanded table view button 
                })
            }
            else{
                setIsRegenerate(false)
            }
            
            //storing question
            const currentDate = new Date()
            setWsTimeTaken({...wsnTimeTaken,startTime:currentDate})
            setIsloading(true)
            let recentChatBody
            if(isRegenerate==true){
                let oldQuestionArr = qaChats.filter(itm=>itm.id == oldQuestionId)
                recentChatBody = {
                    question: oldQuestionArr[0]?.chat_text,
                    scoring_type: fieldvalues.scoring_type,
                    regenerate:"True"
                }
            }
            else recentChatBody = fieldvalues
            //sending answer to backend
            try {
                const req = await fetch(Server.recentChat, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(recentChatBody)
                });
                

                const resp = await req.json()
                if (req.ok) {
                    //store question into array if new question
                    
                    if(!isRegenerate){
                        let qarray =
                    {
                        chat_text: fieldvalues.question,
                        chat_type: "Question",
                        time_stamp: currentDate,
                        id:resp.id+'question'
                    }
                        setqaChats([...qaChats, qarray]);
                        setValues({ ...fieldvalues, question: '' })
                    }
                  
                    //on success i have to sent response to live server/ws/ai
                     webso(resp,currentDate,isRegenerate)
                }
                

            } catch (error) { //if there is any error encountered , should be shown as 'normal' sorry chat reponse
               
                updateErrorMessage()
                console.error(error);
            }

        }
    }

    function webso(resp,currentDate,isRegenerate) {

        // const ws = new WebSocket("ws://0.tcp.in.ngrok.io:14182/ws/chat/");
        const ws = new WebSocket("wss://pocai-botbrainiacs.azurewebsites.net/ws/chat/");
        
        ws.onopen = function () {
            console.log("Ws");
            ws.send(JSON.stringify({
                "question":resp.question,
                "scoring_type": resp.scoring_type,
                "recent_chat": resp.data
            }));
            if(isRegenerate){
                setqaChats((prevChats) => {
                    // Check if an object with the same id exists
                    const index = prevChats.findIndex(chat => chat.id === resp.id);
                    let  newRegenerativeArray = {
                        chat_text:'',
                        chat_type: "Answer",
                        time_stamp: currentDate,
                        new: false,
                        id: resp.id,
                        suggestive: '',
                        model_output: '',
                        model_output_type: '',
                        graph_data: '',
                        graph_type: '',
                        scoretype: fieldvalues.scoring_type,
                        general_question: false,
                        time_taken: '',
                        suggestive_completed:false,
                        chart_completed:false
                    };
                    if (index !== -1) {
                        // Update chat_text if id exists
                        return prevChats.map(chat => {
                            if (chat.id == resp.id) {
                                return newRegenerativeArray;
                               
                            }
                            return chat
                            
                        });
                    }
                });
            }
          
        };
        
        ws.onmessage = function (e) {
           try {
            const data = JSON.parse(e.data);
            const pulsingCursor = `<svg  width="16" height="16" fill="#0988e2" class="bi bi-circle-fill" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8"/>
          </svg>`;
            
            if (data.chunk && data.chunk != undefined && data.type == 'Answer') {
                setIsloading(false);
                
                let newArray = {
                    chat_text: data.chunk,
                    chat_type: "Answer",
                    time_stamp: currentDate,
                    new: false,
                    id: resp.id,
                    suggestive: '',
                    model_output: '',
                    model_output_type: '',
                    graph_data: '',
                    graph_type: '',
                    scoretype: fieldvalues.scoring_type,
                    general_question: isGeneralQue,
                    time_taken: '',
                    suggestive_completed:false,
                    chart_completed:false
                };
                
                setqaChats((prevChats) => {
                    // Remove cursor from all chats
                    const updatedChats = prevChats.map(chat => {
                        return {
                            ...chat,
                            chat_text: chat.chat_text.replace(new RegExp(pulsingCursor + '$'), '') // Remove cursor if it exists
                        };
                    });
        
                    // Sanitize incoming chunk to remove any existing cursor
                    const sanitizedChunk = newArray.chat_text.replace(new RegExp(pulsingCursor, 'g'), '');
        
                    // Check if an object with the same id exists
                    const index = updatedChats.findIndex(chat => chat.id === newArray.id);
                    
                    if (index !== -1) {
                        // Update chat_text if id exists
                        const updatedChat = {
                            ...updatedChats[index],
                            chat_text: updatedChats[index].chat_text + sanitizedChunk + pulsingCursor // Add sanitized chunk and cursor
                        };
                        return updatedChats.map((chat, idx) => idx === index ? updatedChat : chat);
                    } else {
                        // Add new object if id doesn't exist
                        newArray.chat_text = sanitizedChunk + pulsingCursor; // Add sanitized chunk and cursor to new entry
                        return [...updatedChats, newArray];
                    }
                });
            }
        else if(data.type == 'answer_closed'){
            const correctIcon = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="white" stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="m1.75 9.75 2.5 2.5m3.5-4 2.5-2.5m-4.5 4 2.5 2.5 6-6.5"/>
            </svg>`
            setqaChats((prevChats) => {
                // Remove cursor from all chats
                const updatedChats = prevChats.map(chat => {
                    return {
                        ...chat,
                        chat_text: chat.chat_text.replace(new RegExp(pulsingCursor + '$'), correctIcon) // Remove cursor if it exists
                    };
                });
                return updatedChats
                
            });
        }
            else if(data.chunk && data.chunk != undefined && data.type == 'Suggestive_Questions'){
              
                setqaChats((prevChats) => {
                    // Check if an object with the same id exists
                    const index = prevChats.findIndex(chat => chat.id === resp.id);
                
                    if (index !== -1) {
                        // Update chat_text if id exists
                        return prevChats.map(chat => {
                            if (chat.id === resp.id) {
                                return {
                                    ...chat,
                                    suggestive: chat.suggestive + data.chunk
                                };
                               
                            }
                            return chat;
                        });
                    }
                });
            }
            else if(data.type == 'Data_output'){ //excel and chart data
                let isSingleEntry

                if(Object.keys(data?.model_output).length >1){  
                    isSingleEntry = false
                }
                else isSingleEntry = true

                setqaChats((prevChats) => {
                            // Check if an object with the same id exists
                            const index = prevChats.findIndex(chat => chat.id === resp.id);
                        
                            if (index !== -1) {
                                // Update chat_text if id exists
                                return prevChats.map(chat => {
                                    if (chat.id === resp.id) {
                                       
                                        return {
                                            ...chat,
                                            model_output: isSingleEntry?'':data?.model_output,
                                            model_output_type:  isSingleEntry?'':data?.model_output_type,
                                            graph_data:   isSingleEntry?'':data?.graph_data,
                                            graph_type:  isSingleEntry?'':data?.graph_type,
                                        };
                                    }
                                    else{
                                        return chat;
                                    }
                                    
                                });
                            }
                        });  
            
            }
            else if(data.type == 'chart_data_closed'){
                setqaChats((prevChats) => {
                    // Check if an object with the same id exists
                    const index = prevChats.findIndex(chat => chat.id === resp.id);
                
                    if (index !== -1) {
                        // Update chat_text if id exists
                        return prevChats.map(chat => {
                            if (chat.id === resp.id) {
                               
                                return {
                                    ...chat,
                                    chart_completed:true
                                };
                            }
                            else{
                                return chat;
                            }
                            
                        });
                    }
                });
            // setIsRegenerate(false)
            
            }
            else if(data.type == 'suggestive_questions_closed'){
                setRegenerateQueId(null)
                setqaChats((prevChats) => {
                    // Check if an object with the same id exists
                    const index = prevChats.findIndex(chat => chat.id === resp.id);
                
                    if (index !== -1) {
                        // Update chat_text if id exists
                        return prevChats.map(chat => {
                            if (chat.id === resp.id) {
                               
                                return {
                                    ...chat,
                                    suggestive_completed:true
                                };
                            }
                            else{
                                return chat;
                            }
                            
                        });
                    }
                });
            }
            else if(data.type == 'question_specificity'){ //i sgeneral question or not data
                setIsGeneralQue(data.is_general_answer)
              
                setTimeStore((prevChats) => {
                    // Check if an object with the same id exists
                    const index = prevChats.findIndex(chat => chat.id === resp.id);
                
                    if (index !== -1) {
                        // Update chat_text if id exists
                        return prevChats.map(chat => {
                            if (chat.id === resp.id) {
                               
                                return {
                                    ...chat,
                                    time:new Date()
                                };
                            }
                            else{
                                return chat;
                            }
                            
                        });
                    }else{
                        return [...prevChats, {id:resp.id,time:new Date()}];
                    }
                });
            }
            else if(data.type =='error'){
            setIsloading(false)
            updateErrorMessage()
               
            
            }
            
           } catch (error) {
            setIsloading(false)
            // updateErrorMessage()
           }
            
        };
        ws.onerror = function(e){
            setIsloading(false)
            console.log('failed')
            retryConnection(resp,currentDate)
        };
        // console.log(answerws)
    }
    function retryConnection(resp,currentDate) {
        if (retryCount < maxRetries) {
            setIsloading(true)

            retryCount++;
            console.log(`Retrying WebSocket connection, attempt ${retryCount}`);
            setTimeout(() => {
                webso(resp,currentDate);
            }, retryInterval);
        } else {
            setIsloading(false)
            updateErrorMessage()
            console.log("Max retry attempts reached. Unable to establish WebSocket connection.");
            setIsloading(false);
        }
    }
    useEffect(() => {

        try {
            let lastReq = qaChats[qaChats.length - 1]
            const scrollableDiv = document.getElementsByClassName('chatbodyqa')[0]
            // console.log(isRegnerate)
           if(!isRegnerate || regenerateQueId!=null){
           
            if (lastReq.chat_type == 'Question') {

                // Scroll to the end of the scrollable div
                scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
            }
            else {
            
                scrollableDiv.scrollTop = scrollableDiv.scrollHeight - 200;
            }
            for (let I = 0; I < qaChats.length; I++) {
                if(qaChats[I].id){
    
                }
                
            }
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

    function feedbackEmailContainerHandler() {
        setfeedbackEmailContainer(true)
    }

    function switchChangehandle() {
        setIsRegenerate(false)
        let errorIdval = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        setChatAnswerComponentData( {
            scrollType:errorIdval,//stores user current scroll position in chatbot page so to retun to same spot after user returns from expanded table view
            ShowAnimation:true, //chatbot answer text animation state, animation will appear only once and not after user enters from expanded table view page
            closeBtnClick:!getChatAnswerComponentData.closeBtnClick //when user clicks close expanded table view button 
        })
        let chatText;
        if (fieldvalues.scoring_type === 'Customer Journey POCA scoring (Discover, Learn, Buy & Engage)') {
            setValues({ ...fieldvalues, scoring_type: 'Standard POCA scoring (Marketing, Omnichannel, Ecommerce & Subscription)' })
            chatText = '<b className=`fw-bold`>You have Selected: </b>Standard POCA scoring system (Marketing, Omnichannel, Ecommerce & Subscription)'
        }
        else {
            setValues({ ...fieldvalues, scoring_type: 'Customer Journey POCA scoring (Discover, Learn, Buy & Engage)' })
            chatText = '<b className=`fw-bold`>You have Selected: </b>Customer Journey POCA scoring system (Discover, Learn, Buy & Engage)'
        }
        const currentDate = new Date()
     
        let array = [

            {
                chat_text: chatText,
                chat_type: "msg",
                time_stamp: currentDate,
                new: true,
                suggestive: '',
                model_output: '',
                model_output_type: '',
                graph_data: '',
                graph_type: '',
                id: errorIdval,
                scoretype: chatText,
                general_question: true,
                time_taken: '',
                suggestive_completed:false

            }
        ]

        console.log(qaChats[qaChats.length -1].chat_type)
        if(qaChats[qaChats.length -1].chat_type == 'msg'){
            // if previous response is message then replace existing repsonse itself
            setqaChats((prevChats) => {
                const updatedChats = [...prevChats];
                updatedChats[updatedChats.length - 1] = array[0];
                return updatedChats;
            });
        }
        else{
            setqaChats((prevChats) => {
                const updatedChats = [...prevChats, ...array];
             
                return updatedChats;
            });
        }
        
    }

    function getfeedbackEmailContainerHandler(respId,feedBackState){
        setFeedBackId(respId)
        setfeedbackEmailContainer(feedBackState)
     
    }
   
    return (
        <div class="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">


            {
                !getTableViewRecoil ?
                    <>  
                 
                        <div class="offcanvas-header border-bottom">
                          
                          <img src={pocaAImg} className='nexusImgChat'></img>
                          <div className='offcanvas-right justify-content-end'>
                
                          <div className='toggleBtn d-flex align-items-center gap-1 ms-4'>
                                <span className='fw-semibold' style={{ color: '#612fa3' }}>Standard POCA</span>
                                <Switch offColor='#612FA3' className='switchBtn' uncheckedIcon={false} checkedIcon={false} onChange={switchChangehandle} checked={fieldvalues.scoring_type == 'Customer Journey POCA scoring (Discover, Learn, Buy & Engage)' ? true : false} />
                                <span className='fw-semibold text-success'>Customer Journey POCA</span>
                            </div>
                          <div className='d-flex align-items-center gap-2 justify-content-end  w-25 offcanvas-header-buttons'>
                                <button className='btn btn-outline-secondary btn-sm clearchatbtn d-flex align-items-center' onClick={clearAllChatsHandler}>Clear</button>
                                <i class="bi bi-x-circle h4 modalClose mt-1" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { prop.setChatboxShow(false) }}></i>
                            </div>
                        
                          </div>
                         

                        </div>
                        <div class="offcanvas-body">
                            <div className='chatbody d-flex flex-column'>

                                <div className='chatbodyqa rounded pt-1' ref={containerRef}>
                                    {
                                        !getfeedbackEmailContainer ?
                                            <Chats 
                                            timeStore={timeStore}
                                             sendQuestion={sendQuestion}
                                            getfeedbackEmailContainerHandler={getfeedbackEmailContainerHandler} qaChats={qaChats} setValues={setValues} fieldvalues={fieldvalues} setqaChats={setqaChats} />
                                            :
                                            <div className=' d-flex justify-content-center'>
                                                <div className='feedbackEmailContainer'>
                                                    <Feedback setfeedbackEmailContainer={setfeedbackEmailContainer} feedBackId={feedBackId}/>
                                                </div>
                                            </div>
                                    }
                                </div>

                                <div>

                                    <li class="list-group-item exceIcons d-flex justify-content-between">
                                        <div className='list-group-itemIcons frstlist-group-item d-flex gap-2 '>
                                            <svg onClick={feedbackEmailContainerHandler} className='opacity-0' width="30" height="30" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%' }}><path d="M16.0417 21.4158C17.0192 21.8025 17.9117 22.3168 18.7149 22.9564C19.5182 23.5939 20.2045 24.3376 20.7762 25.1791C21.942 26.8771 22.5699 28.8867 22.5782 30.9464V31.875H20.7188V30.9443C20.7228 29.8452 20.5078 28.7565 20.0864 27.7414C19.665 26.7264 19.0456 25.8055 18.2644 25.0325C17.4976 24.2766 16.5959 23.6711 15.606 23.2475C14.5772 22.8067 13.4698 22.579 12.3505 22.5781C11.2515 22.5741 10.1627 22.7891 9.14773 23.2105C8.13271 23.6319 7.21181 24.2513 6.43879 25.0325C5.68312 25.7995 5.07769 26.7011 4.65379 27.6909C4.21604 28.6981 3.99503 29.784 3.98441 30.9443V31.875H2.12503V30.9443C2.1196 28.8831 2.74875 26.8703 3.92703 25.1791C5.10066 23.4859 6.74857 22.1773 8.66366 21.4179C8.2286 21.1189 7.83243 20.767 7.48428 20.3703C7.14027 19.9797 6.84289 19.5504 6.59816 19.091C6.35439 18.6321 6.16879 18.1445 6.04566 17.6396C5.9201 17.1253 5.85239 16.5986 5.84378 16.0693C5.84378 15.1704 6.01378 14.3267 6.35379 13.5426C7.01861 11.9891 8.2559 10.751 9.80904 10.0852C10.6103 9.74415 11.4718 9.5671 12.3427 9.56454C13.2135 9.56199 14.076 9.73399 14.8793 10.0704C16.4332 10.7357 17.6713 11.9738 18.3367 13.5278C18.8869 14.8217 19.0039 16.2588 18.6703 17.6247C18.5428 18.1284 18.3558 18.6129 18.105 19.0782C17.8559 19.5389 17.5589 19.9719 17.2189 20.3703C16.8789 20.7676 16.4858 21.114 16.0417 21.4158ZM12.3505 20.7188C12.9902 20.7188 13.5915 20.5976 14.1525 20.3575C15.2648 19.8849 16.1501 18.9988 16.6218 17.8861C16.8747 17.3145 17 16.7089 17 16.0714C17.0028 15.4629 16.8832 14.86 16.6485 14.2986C16.4138 13.7372 16.0687 13.2286 15.6337 12.8031C15.2034 12.3835 14.7018 12.0439 14.1525 11.8001C13.5857 11.547 12.9713 11.418 12.3505 11.4219C11.713 11.4219 11.1117 11.543 10.5507 11.7831C9.43224 12.2602 8.54144 13.151 8.06441 14.2694C7.82429 14.8304 7.70316 15.4318 7.70316 16.0714C7.70316 16.7089 7.82429 17.3102 8.06441 17.8712C8.30878 18.4322 8.63816 18.9274 9.05466 19.3524C9.48584 19.7881 9.99963 20.1334 10.5659 20.368C11.1322 20.6026 11.7397 20.7219 12.3527 20.7188H12.3505ZM31.875 2.125V17H28.1563L22.5782 22.5781V17H20.7188V15.1406H24.4375V18.0901L27.387 15.1406H30.0157V3.98438H11.4219V7.32488C11.1102 7.36426 10.7998 7.41315 10.4912 7.4715C10.1746 7.53159 9.86393 7.61905 9.56254 7.73287V2.125H31.875Z" fill="#111111"></path></svg>
                                            {/* <svg width="30" onClick={sendMailHandle} className='sendmailIcon' height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%' }}><path d="M7.3125 5.625C5.96984 5.625 4.68217 6.15837 3.73277 7.10777C2.78337 8.05717 2.25 9.34484 2.25 10.6875V25.3125C2.25 26.6552 2.78337 27.9428 3.73277 28.8922C4.68217 29.8416 5.96984 30.375 7.3125 30.375H28.6875C30.0302 30.375 31.3178 29.8416 32.2672 28.8922C33.2166 27.9428 33.75 26.6552 33.75 25.3125V10.6875C33.75 9.34484 33.2166 8.05717 32.2672 7.10777C31.3178 6.15837 30.0302 5.625 28.6875 5.625H7.3125ZM31.5 11.7034L18 18.972L4.5 11.7034V10.6875C4.5 9.94158 4.79632 9.22621 5.32376 8.69876C5.85121 8.17132 6.56658 7.875 7.3125 7.875H28.6875C29.4334 7.875 30.1488 8.17132 30.6762 8.69876C31.2037 9.22621 31.5 9.94158 31.5 10.6875V11.7034ZM4.5 14.2582L17.4668 21.2411C17.6306 21.3294 17.8139 21.3755 18 21.3755C18.1861 21.3755 18.3694 21.3294 18.5333 21.2411L31.5 14.2582V25.3125C31.5 26.0584 31.2037 26.7738 30.6762 27.3012C30.1488 27.8287 29.4334 28.125 28.6875 28.125H7.3125C6.56658 28.125 5.85121 27.8287 5.32376 27.3012C4.79632 26.7738 4.5 26.0584 4.5 25.3125V14.2582Z" fill="#111111"></path></svg> */}
                                           
                                        </div>

                                    </li>
                                    {/* type question here  */}
                                    <div className='chatbodyinput w-100 d-flex align-items-center justify-content-center gap-4'>
                                        <textarea className='chatbodyinput-txtarea p-2 border rounded' placeholder='Ask me anything...' value={fieldvalues.question} onChange={textAreaChangeHandle} onKeyDown={!isloading ? sendHandleonEnterKey : null} autoFocus={true} disabled={getfeedbackEmailContainer}></textarea>
                                        <i class="bi bi-send fs-4 text-primary chatbodyinputSendIcon" onClick={!isloading ? () => { sendQuestion(false,null) } : null}></i>
                                    </div>
                                </div>
                            </div>

                            {isloading && <AnswerLoader value={fieldvalues.scoring_type} />

                            }
                        </div></>

                    :

                    <div className='ExpandedTableViewCnt p-2 overflow-hidden'>
                        <ChartTableExtendedView />
                    </div>
            }

        </div>
    )
}

export default ChatModal
