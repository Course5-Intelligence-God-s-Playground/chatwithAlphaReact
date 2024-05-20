import React, { useEffect, useRef, useState } from 'react'
import './ChatAnswerCrad.scss'
import ChatTableView from './ChatTableView'
import ChartView from './ChartView';
import { useRecoilState } from 'recoil';
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData';
import TextAnimator from './Tables/TextAnimator';
import lodingGif from '../assets/loading.gif'
import FeedbackIcon from '../assets/chatpage/feedback.png'
import { ReadAloud } from './ChatModal/ReadAloud';
import { LikeDislikeComponent } from './ChatModal/LikeDislikeComponent';

import botImage from '../assets/chatpage/botImage.png'
import { saveResponseReceived } from './ChatModal/SaveOverallResponse';
function ChatAnswerCrad(prop) {

  const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnswerFinished, setIsAnswerFinished] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showDesign, setshowDesign] = useState(false)
  const [readVoice, setReadVoice] = useState(true)
 
  const [wsTimeDiff, setWsTimeDiff] = useState(null)
  useEffect(() => {

    let errorRespText = 'We apologize for any inconvenience. We were unable to determine exactly what you are seeking. Please rephrase your question and ask again.'
    const content = prop.answer.chat_text == errorRespText ?
      prop.answer.chat_text
      :
      prop.answer.general_question ?
        prop.answer.chat_text
        :
        prop.answer.scoretype == 'Customer Journey POCA scoring (Discover, Learn, Buy & Engage)' ?
          `Customer Journey POCA score consists of four key metrics aligned to a customer's purchase journey: Discover, Learn, Buy and Engage. \n\n ${prop.answer.chat_text}`
          :
          `Standard POCA score consists of four key metrics: Marketing, Omnichannel, E-Commerce and Subscription. \n\n${prop.answer.chat_text}`

    setCurrentAnswer(prop.answer.chat_text)
    if (getChatAnswerComponentData.ShowAnimation) {  //wether to show text animation or not 
      let currentIndex = 0;
      const streamingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedText(content.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(streamingInterval);
          setIsAnswerFinished(true);
        }
      }, 15);

    }
    else if (getChatAnswerComponentData.ShowAnimation == false) {
      setCurrentAnswer(content)
      setDisplayedText(content)
      setIsAnswerFinished(true);
      setChatAnswerComponentData({ ...getChatAnswerComponentData, ShowAnimation: true })
    }

  }, [currentAnswer, isAnswerFinished, prop.answer]);
  const showCursor = currentAnswer?.length < prop?.answer?.length;

  let propChartView = {//props
    graph_type: prop.answer.graph_type,
    graph_data: prop.answer.graph_data

  }
  function showChartAndTableViewHandle() {
    setshowDesign(!showDesign)
  }

  useEffect(() => {
    setChatAnswerComponentData({ ...getChatAnswerComponentData, closeBtnClick: !getChatAnswerComponentData.closeBtnClick })
  }, [])

 

  useEffect(() => {
    // Function to handle click event
    const handleClick = (event) => {

      prop.setValues({ ...prop.fieldvalues, question: event.target.textContent })
    };

    // Select the div element with the class 'suggestiveHolder'
    const suggestiveHolder = document.getElementsByClassName('suggestiveHolder')[0];

    // Select all the p tags inside the 'suggestiveHolder' div
    const suggestions = suggestiveHolder?.getElementsByTagName('p');

    // Add event listeners to each p tag
    for (let i = 0; i < suggestions?.length; i++) {
      suggestions[i].addEventListener('click', handleClick);
    }


  }, [prop?.answer?.suggestive]);

  useEffect(() => {
    const successTime = localStorage.getItem(`${prop?.answer?.id}SuccessTime`)

    const timeDifferenceInSeconds = ((new Date(successTime)) - (new Date(prop.answer.time_stamp))) / 1000;

    let timeDisplay;
    if (timeDifferenceInSeconds < 60) {
      timeDisplay = timeDifferenceInSeconds.toFixed(3) + " sec";
    } else {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      const remainingSeconds = (timeDifferenceInSeconds % 60).toFixed(0);
      timeDisplay = minutes + "." + remainingSeconds + " min";
    }

    setWsTimeDiff(timeDisplay);


  }, [])

  function showFeedbackHandler(){
    prop.getfeedbackEmailContainerHandler(prop?.answer?.id,true)
   
  }

  useEffect(()=>{ //save data to backend 
 
    let isSaved = localStorage.getItem(`${prop?.answer?.id}detailsSaved`)
   if(prop.answer.graph_data!='' && prop.answer.graph_type!=''){
         
        let dataFormated = {
          response: {
          chat_answer: prop?.answer?.chat_text,
          id: prop?.answer?.id,
          suggestive:prop?.answer?.suggestive,
          model_output: prop?.answer?.model_output,
          model_output_type:prop?.answer?.model_output_type,
          graph_data:prop?.answer?.graph_data,
          graph_type: prop?.answer?.graph_type ,
          scoretype:prop?.answer?.scoretype,
          general_question: prop?.answer?.general_question,
          
          }
          }
          if(!isSaved){
            saveResponseReceived(dataFormated)
          }
          
    }
  },[prop?.answer?.chart_completed])
  return (
    <div className='d-flex flex-column align-items-end'>
      <div className=' d-flex gap-2'>
      <div>
      <div className="chatAnswer px-3 py-2 d-flex align-items-center">
        {/* <span className='newElement'> </span> */}

        {/* <TextAnimator dynamicText ={prop.new ? currentAnswer : prop.answer.chat_text}/> */}
        <div className='answerHolder' dangerouslySetInnerHTML={{ __html: prop?.answer?.chat_text }}></div>
       
      </div>
      <div className='d-flex justify-content-end w-100'>

        <div className=' d-flex gap-3 pt-1 align-items-center'>
       
         { prop.answer?.chat_type == 'Answer' && <img src={FeedbackIcon} onClick={showFeedbackHandler} className='answerIcons feedBackIcon'></img>}
         
          <ReadAloud answer={prop?.answer} />

        </div>

       { prop.answer?.chat_type == 'Answer' && <LikeDislikeComponent answerID={prop?.answer?.id}/>}

        <span className='timeview text-muted ps-3'>{new Date(prop.answer.time_stamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className=' ps-2 text-muted'>{prop.answer.chat_type == 'Answer' ? wsTimeDiff : ''}</span>
      </div>
      </div>
      
      <img src={botImage} className='userBotChatImg' />
      </div>
      
      {/* table view/clipboard icon if there is either table or chart to show  */}
      {prop.answer.model_output_type != '' || prop.answer.graph_type != '' ?
       <div className=' d-flex'>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="white" stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="m1.75 9.75 2.5 2.5m3.5-4 2.5-2.5m-4.5 4 2.5 2.5 6-6.5"/>
            </svg>
         <i class="bi bi-clipboard2-data" onClick={showChartAndTableViewHandle}></i>
       </div> : prop.answer?.chat_type == 'msg' ? '' : !prop?.answer?.chart_completed?<div>
       <span className='text-secondary fw-bold'>Generating visuals</span>
       <img src={lodingGif} className='chartLoader'></img>
       </div>:''
      }
      {/* show table and chart section  */}
      {showDesign && <div className='ChartAndTableView justify-content-between'>
        <div></div>
        <div className='ChartViewCnt  rounded'><ChartView propChartView={propChartView} answer={prop?.answer}/></div>
        {prop.answer.model_output != '' ? <div className='ChatTableViewCnt rounded'>
          <div className='chartHolder'><ChatTableView modelOutput={prop.answer.model_output} model_output_type={prop.answer.model_output_type} ids={prop.answer.id} />
          </div>
        </div> : null}

      </div>}

      {/* suggestive questions  */}
      {prop?.answer?.suggestive != '' ?

        <div>
          <div className='suggestivesCnt justify-content-between px-3 mt-3 rounded py-3'>
          <div> <i class="bi bi-lightbulb sugesttxt"></i><span className='text-muted px-3 sugesttryaskTxt'>Try Asking</span>
          </div>
          <div className='suggestiveHolder' dangerouslySetInnerHTML={{ __html: prop?.answer?.suggestive.replaceAll('"', '').replaceAll('className', 'class') }}>

          </div>
        </div>
        <div className=' d-flex justify-content-end'>
                {
                  prop?.answer?.suggestive_completed?
                  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="white" stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="m1.75 9.75 2.5 2.5m3.5-4 2.5-2.5m-4.5 4 2.5 2.5 6-6.5"/>
            </svg>
                  :
                 <div>
                   <span className='text-secondary fw-bold'>Generating follow-up questions</span>
                  <img src={lodingGif} className='chartLoader'></img>
                 </div>
                }
        </div>
        </div>
        :
        null
      }

    </div>
  )
}

export default ChatAnswerCrad
