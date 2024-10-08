import React, { useEffect, useRef, useState } from 'react'
import './ChatAnswerCrad.scss'
import ChatTableView from './ChatTableView'
import ChartView from './ChartView';
import { useRecoilState } from 'recoil';
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData';
import lodingGif from '../assets/loading.gif'
import { ReadAloud } from './ChatModal/ReadAloud';
import { LikeDislikeComponent } from './ChatModal/LikeDislikeComponent';
import botImage from '../assets/chatpage/botImage.png'
import ErrorBoundary from '../utilites/ErrorBoundary';
import partyIcon from '../assets/chatpage/celebrate.gif'
import ErrorBoundaryTable from '../utilites/ErrorBoundaryTable';
function ChatAnswerCrad(prop) {

  const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)

  const [showDesign, setshowDesign] = useState(false)
  const suggestiveHolderRef = useRef(null);

  const [wsTimeDiff, setWsTimeDiff] = useState(null)
  const [showPartyIcon,setShowPartyIcon] = useState(false)


  let propChartView = {//prop
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
    const handleClick = (event) => {
      prop.setValues({ ...prop.fieldvalues, question: event.target.textContent });
    };

    const suggestiveHolder = suggestiveHolderRef.current;

    // Clean up existing event listeners
    const cleanup = () => {
      const suggestions = suggestiveHolder?.getElementsByTagName('p');
      if (suggestions) {
        for (let i = 0; i < suggestions.length; i++) {
          suggestions[i].removeEventListener('click', handleClick);
        }
      }
    };

    // Add new event listeners
    if (suggestiveHolder) {
      const suggestions = suggestiveHolder.getElementsByTagName('p');
      for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].addEventListener('click', handleClick);
      }
    }

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [prop?.answer?.suggestive]);

  useEffect(() => {
    calculateTimeTaken()

  }, [prop?.timeStore])

  function calculateTimeTaken(){
    
    let successTime = prop?.timeStore?.filter(itm=>itm.id == prop?.answer?.id)
    
    const timeDifferenceInSeconds = ((new Date(successTime[0]?.time)) - (new Date(prop.answer.time_stamp))) / 1000;

    let timeDisplay;
    if (timeDifferenceInSeconds < 60) {
      timeDisplay = timeDifferenceInSeconds.toFixed(3) + " sec";
    } else {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      const remainingSeconds = (timeDifferenceInSeconds % 60).toFixed(0);
      timeDisplay = minutes + "." + remainingSeconds + " min";
    }

    setWsTimeDiff(timeDisplay);
  
  }
  function showFeedbackHandler() {
    prop.getfeedbackEmailContainerHandler(prop?.answer?.id, true)

  }

  

  function regenerateHandle(){
    if(prop?.answer?.chatCompleted){
      let questionId = prop?.answer?.id+'question'
      
      prop?.sendQuestion(true,questionId)
      
    }
    
  }

  useEffect(() => {
    const targetChat = prop.qaChats.filter((itm)=>itm.id == prop?.answer?.id)[0]
    const latestChat = prop.qaChats[prop.qaChats.length -1]
    if(latestChat.id == targetChat.id){
      setShowPartyIcon(true)
        const timer = setTimeout(() => {
        setShowPartyIcon(false);
        prop.setqaChats((prevChats) => {
      
              // Update chat_text if id exists
              return prevChats.map(chat => {
               
                     
                      return {
                          ...chat,
                          answer_closed:false
                      };
                  
                  
              });
          
      });
      }, 5000);

      // Cleanup the timeout if the component unmounts or prop changes
      return () => clearTimeout(timer);
    }
    else setShowPartyIcon(false)
    
  }, [prop?.answer?.answer_closed]);



  return (
    <div className='d-flex flex-column align-items-end'>
      <div className=' d-flex gap-2'>
        <div>
          <div className="chatAnswer ps-3 p-2 d-flex align-items-center">

            <div className='answerHolder' dangerouslySetInnerHTML={{ __html: prop?.answer?.chat_text }}></div>

          </div>
          <div className='answer-feature-iconhold d-flex justify-content-end   align-items-center'>
            {/* regenerate icon*/}
           { prop.answer?.chat_type == 'Answer' &&  <svg onClick={regenerateHandle} style={prop?.answer?.chatCompleted?{cursor:'pointer'}:{cursor:'not-allowed'}} width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
            </svg> }
            
            {prop.answer?.chat_type == 'Answer' && 
            <svg  width="16"  onClick={showFeedbackHandler} height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
          </svg>
            }

            <ReadAloud answer={prop?.answer} />

            {prop.answer?.chat_type == 'Answer' && <LikeDislikeComponent answerID={prop?.answer?.id} />}

            <span className='timeview text-muted'>{new Date(prop.answer.time_stamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className='text-muted'>{prop.answer.chat_type == 'Answer' ? wsTimeDiff : ''}</span>
          </div>
        </div>

       {showPartyIcon && prop?.answer?.answer_closed ?
       <img src={partyIcon} className='userBotChatImg border-0' />
       : <img src={botImage} className='userBotChatImg' />}
     
      </div>

      {/* table view/clipboard icon if there is either table or chart to show  */}
      {prop.answer.model_output_type != '' || prop.answer.graph_type != '' ?
        <div className=' d-flex'>
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="white" stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="m1.75 9.75 2.5 2.5m3.5-4 2.5-2.5m-4.5 4 2.5 2.5 6-6.5" />
          </svg>
          <i class="bi bi-clipboard2-data" onClick={showChartAndTableViewHandle}></i>
        </div> : prop.answer?.chat_type == 'msg' ? '' : !prop?.answer?.chart_completed ? <div>
          <span className='text-secondary fw-bold'>Generating visuals</span>
          <img src={lodingGif} className='chartLoader'></img>
        </div> : ''
      }
      {/* show table and chart section  */}
      {showDesign && <div className='ChartAndTableView justify-content-between'>
        <div></div>
        <ErrorBoundary>
        <div className='ChartViewCnt  rounded'><ChartView propChartView={propChartView} answer={prop?.answer} /></div>
        </ErrorBoundary>
        {prop.answer.model_output != '' ? 
        <ErrorBoundaryTable>
        <div className='ChatTableViewCnt rounded'>
          <div className='chartHolder'><ChatTableView modelOutput={prop.answer.model_output} model_output_type={prop.answer.model_output_type} ids={prop.answer.id} />
          </div>
        </div>
        </ErrorBoundaryTable> 
        : null}

      </div>}

      {/* suggestive questions  */}
      {prop?.answer?.suggestive != '' ?

        <div>
          <div className='suggestivesCnt justify-content-between px-3 mt-3 rounded py-3'>
            <div> <i class="bi bi-lightbulb sugesttxt"></i><span className='text-muted px-3 sugesttryaskTxt'>Try Asking</span>
            </div>
            <div
              className="suggestiveHolder"
              ref={suggestiveHolderRef}
              dangerouslySetInnerHTML={{ __html: prop?.answer?.suggestive.replaceAll('"', '').replaceAll('className', 'class') }}
            />


          </div>
          <div className=' d-flex justify-content-end'>
            {
              prop?.answer?.suggestive_completed ?
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="white" stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                  <path d="m1.75 9.75 2.5 2.5m3.5-4 2.5-2.5m-4.5 4 2.5 2.5 6-6.5" />
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
       prop?.answer?.chat_type=='Answer'? 
       prop?.answer?.suggestive_completed ?null:
      <div>
        <span className='text-secondary fw-bold'>Generating follow-up questions</span>
        <img src={lodingGif} className='chartLoader'></img>
      </div>
      :null
      }

    </div>
  )
}

export default ChatAnswerCrad
