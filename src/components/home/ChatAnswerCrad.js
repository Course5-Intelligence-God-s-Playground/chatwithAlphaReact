import React, { useEffect, useState } from 'react'
import './ChatAnswerCrad.scss'
import ChatTableView from './ChatTableView'
import ChartView from './ChartView';
import { useRecoilState } from 'recoil';
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData';
import TextAnimator from './Tables/TextAnimator';
import lodingGif from '../assets/loading.gif'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import FeedbackIcon from '../assets/chatpage/feedback.png'
import { ReadAloud } from './ChatModal/ReadAloud';
function ChatAnswerCrad(prop) {

  const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnswerFinished, setIsAnswerFinished] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showDesign, setshowDesign] = useState(false)
  const [readVoice, setReadVoice] = useState(true)
  const [likeColor, setLikeColor] = useState('rgb(215, 213, 213)'); // Initial color for like icon
  const [dislikeColor, setDislikeColor] = useState('rgb(215, 213, 213)'); // Initial color for dislike icon

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

  const likeIconClickHandle = () => {
    setLikeColor('green');
    setDislikeColor('rgb(215, 213, 213)');
    // Add any other logic you want to perform when like is clicked
  };

  const dislikeIconClickHandle = () => {
    setLikeColor('rgb(215, 213, 213)');
    setDislikeColor('red');
    // Add any other logic you want to perform when dislike is clicked
  };


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
  return (
    <div className='d-flex flex-column align-items-end'>
      <div className="chatAnswer px-3 py-2 d-flex align-items-center">
        <span className='newElement'> </span>

        {/* <TextAnimator dynamicText ={prop.new ? currentAnswer : prop.answer.chat_text}/> */}
        <div className='answerHolder' dangerouslySetInnerHTML={{ __html: prop?.answer?.chat_text }}></div>

      </div>

      <div className='d-flex justify-content-end w-100'>

        <div className=' d-flex gap-3 align-items-center'>
       
          <img src={FeedbackIcon} onClick={showFeedbackHandler} className='answerIcons feedBackIcon'></img>
          <ReadAloud answer={prop?.answer} />

        </div>
        <div className='d-flex gap-1 chatAnswerLike'>
          <ThumbUpIcon className='chatAnswerLikeIcon'
            id='like'
            onClick={likeIconClickHandle}
            style={{ color: likeColor }} />
          <ThumbDownAltIcon className='chatAnswerLikeIcon'
            id='dislike'
            onClick={dislikeIconClickHandle}
            style={{ color: dislikeColor }} />
        </div>
        <span className='timeview text-muted ps-3'>{new Date(prop.answer.time_stamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className=' ps-2 text-muted'>{prop.answer.chat_type == 'Answer' ? wsTimeDiff : ''}</span>
      </div>
      {/* table view/clipboard icon if there is either table or chart to show  */}
      {prop.answer.model_output_type != '' || prop.answer.graph_type != '' ?
        <i class="bi bi-clipboard2-data" onClick={showChartAndTableViewHandle}></i> : prop.answer?.chat_type == 'msg' ? '' : <img src={lodingGif} className='chartLoader'></img>
      }
      {/* show table and chart section  */}
      {showDesign && <div className='ChartAndTableView justify-content-between'>
        <div></div>
        <div className='ChartViewCnt  rounded'><ChartView propChartView={propChartView} /></div>
        {prop.answer.model_output != '' ? <div className='ChatTableViewCnt rounded'>
          <div className='chartHolder'><ChatTableView modelOutput={prop.answer.model_output} model_output_type={prop.answer.model_output_type} ids={prop.answer.id} />
          </div>
        </div> : null}

      </div>}

      {/* suggestive questions  */}
      {prop?.answer?.suggestive != '' ?

        <div className='suggestivesCnt justify-content-between px-3 mt-3 rounded py-3'>
          <div> <i class="bi bi-lightbulb sugesttxt"></i><span className='text-muted px-3 sugesttryaskTxt'>Try Asking</span>
          </div>
          <div className='suggestiveHolder' dangerouslySetInnerHTML={{ __html: prop?.answer?.suggestive.replaceAll('"', '').replaceAll('className', 'class') }}>

          </div>
        </div>
        :
        null
      }

    </div>
  )
}

export default ChatAnswerCrad
