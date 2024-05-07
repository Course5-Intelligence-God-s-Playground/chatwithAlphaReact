import React, { useEffect, useState } from 'react'
import './ChatAnswerCrad.scss'
import ChatTableView from './ChatTableView'
import ChartView from './ChartView';
import { useRecoilState } from 'recoil';
import { ChatAnswerComponentData } from '../utilites/ChatAnswerCradRecoilData';
import TextAnimator from './Tables/TextAnimator';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

function ChatAnswerCrad(prop) {

  const [getChatAnswerComponentData, setChatAnswerComponentData] = useRecoilState(ChatAnswerComponentData)
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnswerFinished, setIsAnswerFinished] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showDesign, setshowDesign] = useState(false)

  const [likeColor, setLikeColor] = useState('rgb(215, 213, 213)'); // Initial color for like icon
  const [dislikeColor, setDislikeColor] = useState('rgb(215, 213, 213)'); // Initial color for dislike icon

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
  const showCursor = currentAnswer.length < prop.answer.length;

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
  return (
    <div className='d-flex flex-column align-items-end'>
      <div className="chatAnswer px-3 py-2 d-flex align-items-center">
        <span className='newElement'> </span>

        <TextAnimator dynamicText ={prop.new ? currentAnswer : prop.answer.chat_text}/>

      </div>

      <div className='d-flex justify-content-end w-100'>
        {/* <div className='d-flex gap-2 chatAnswerLike flex-row-reverse'> */}
          {/* <svg width="10" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '80%' }}>
                  <path  d="M14.2503 22.1666L15.422 22.3613C15.4503 22.1912 15.4412 22.017 15.3953 21.8508C15.3494 21.6845 15.2679 21.5303 15.1564 21.3987C15.0449 21.2672 14.9061 21.1615 14.7496 21.089C14.5932 21.0166 14.4228 20.979 14.2503 20.9791V22.1666ZM31.667 22.1666V23.3541C31.9819 23.3541 32.284 23.229 32.5067 23.0063C32.7294 22.7836 32.8545 22.4815 32.8545 22.1666H31.667ZM28.5003 5.14575H10.5137V7.52075H28.5003V5.14575ZM8.61366 23.3541H14.2503V20.9791H8.61366V23.3541ZM13.0787 21.9718L11.8025 29.6273L14.1458 30.0183L15.422 22.3613L13.0787 21.9718ZM14.5353 32.8541H14.8742V30.4791H14.5369L14.5353 32.8541ZM19.8157 30.2099L23.7978 24.236L21.8218 22.9187L17.8397 28.8926L19.8157 30.2099ZM25.4445 23.3541H31.667V20.9791H25.4445V23.3541ZM32.8545 22.1666V9.49992H30.4795V22.1666H32.8545ZM6.24341 8.64492L4.34341 18.1449L6.67091 18.612L8.57091 9.112L6.24341 8.64492ZM23.7978 24.236C23.9785 23.9648 24.2233 23.744 24.5106 23.5901C24.7978 23.4363 25.1186 23.3557 25.4445 23.3557V20.9807C23.9878 20.9807 22.6293 21.7074 21.8218 22.9187L23.7978 24.236ZM11.8025 29.6273C11.7363 30.0242 11.7573 30.4324 11.8641 30.8204C11.971 31.2084 12.161 31.5685 12.4211 31.8756C12.6812 32.1827 13.0051 32.4294 13.3702 32.5987C13.7353 32.7679 14.1329 32.8541 14.5353 32.8541V30.4807C14.4779 30.4805 14.4213 30.4679 14.3692 30.4437C14.3172 30.4195 14.2711 30.3842 14.234 30.3404C14.197 30.2966 14.1699 30.2452 14.1547 30.1899C14.1394 30.1345 14.1364 30.0749 14.1458 30.0183L11.8025 29.6273ZM8.61366 20.9807C8.32082 20.9807 8.03162 20.9158 7.76691 20.7906C7.5022 20.6653 7.26858 20.4829 7.08289 20.2565C6.89721 20.0301 6.76408 19.7653 6.69311 19.4812C6.62214 19.1971 6.6151 18.9007 6.67249 18.6136L4.34341 18.1465C4.21714 18.7782 4.23263 19.4317 4.38874 20.0567C4.54486 20.6817 4.83771 21.2643 5.24619 21.7624C5.65468 22.2605 6.16861 22.6618 6.75093 22.9374C7.33325 23.2129 7.96945 23.3557 8.61366 23.3557V20.9807ZM10.5137 5.14575C9.50712 5.14555 8.5316 5.49566 7.75307 6.13362C6.97453 6.77158 6.44106 7.65798 6.24341 8.64492L8.57091 9.112C8.66034 8.66268 8.90287 8.25988 9.25716 7.96941C9.61144 7.67894 10.0555 7.52037 10.5137 7.52075V5.14575ZM14.8742 32.8541C15.8516 32.854 16.8139 32.6142 17.6757 32.153C18.5374 31.6917 19.272 31.0248 19.8142 30.2115L17.8397 28.8942C17.5143 29.3824 17.0733 29.7826 16.556 30.0594C16.0386 30.3362 15.4609 30.4793 14.8742 30.4791V32.8541ZM28.5003 7.52075C29.5928 7.52075 30.4795 8.40742 30.4795 9.49992H32.8545C32.8545 8.34512 32.3958 7.23762 31.5792 6.42106C30.7626 5.60449 29.6551 5.14575 28.5003 5.14575V7.52075Z" fill="#111111"></path><path d="M25.334 22.1666V6.33325" stroke="#111111" stroke-width="1.5"></path></svg>
          <svg width="30" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '80%' }}><path d="M23.7497 15.8334L22.578 15.6387C22.5497 15.8088 22.5588 15.983 22.6047 16.1492C22.6506 16.3155 22.7321 16.4697 22.8436 16.6013C22.9551 16.7328 23.0939 16.8385 23.2504 16.911C23.4068 16.9834 23.5772 17.021 23.7497 17.0209L23.7497 15.8334ZM6.33301 15.8334L6.33301 14.6459C6.01806 14.6459 5.71602 14.771 5.49332 14.9937C5.27062 15.2164 5.14551 15.5185 5.14551 15.8334L6.33301 15.8334ZM9.49967 32.8542L27.4863 32.8542L27.4863 30.4792L9.49967 30.4792L9.49967 32.8542ZM29.3863 14.6459L23.7497 14.6459L23.7497 17.0209L29.3863 17.0209L29.3863 14.6459ZM24.9213 16.0282L26.1975 8.37275L23.8542 7.98166L22.578 15.6387L24.9213 16.0282ZM23.4647 5.14591L23.1258 5.14591L23.1258 7.52091L23.4631 7.52091L23.4647 5.14591ZM18.1843 7.79008L14.2022 13.764L16.1782 15.0813L20.1603 9.10742L18.1843 7.79008ZM12.5555 14.6459L6.33301 14.6459L6.33301 17.0209L12.5555 17.0209L12.5555 14.6459ZM5.14551 15.8334L5.14551 28.5001L7.52051 28.5001L7.52051 15.8334L5.14551 15.8334ZM31.7566 29.3551L33.6566 19.8551L31.3291 19.388L29.4291 28.888L31.7566 29.3551ZM14.2022 13.764C14.0215 14.0352 13.7767 14.256 13.4894 14.4099C13.2022 14.5637 12.8814 14.6442 12.5555 14.6443L12.5555 17.0193C14.0122 17.0193 15.3707 16.2926 16.1782 15.0813L14.2022 13.764ZM26.1975 8.37275C26.2637 7.9758 26.2427 7.5676 26.1359 7.1796C26.029 6.7916 25.839 6.43154 25.5789 6.12444C25.3188 5.81733 24.9949 5.57057 24.6298 5.40132C24.2647 5.23206 23.8671 5.14595 23.4647 5.14591L23.4647 7.51933C23.5221 7.51947 23.5787 7.53209 23.6308 7.55631C23.6828 7.58054 23.7289 7.61579 23.766 7.65962C23.803 7.70345 23.8301 7.75481 23.8453 7.81015C23.8606 7.86548 23.8636 7.92505 23.8542 7.98166L26.1975 8.37275ZM29.3863 17.0193C29.6792 17.0193 29.9684 17.0842 30.2331 17.2094C30.4978 17.3347 30.7314 17.5171 30.9171 17.7435C31.1028 17.9699 31.2359 18.2347 31.3069 18.5188C31.3779 18.8029 31.3849 19.0993 31.3275 19.3864L33.6566 19.8535C33.7829 19.2218 33.7674 18.5683 33.6113 17.9433C33.4551 17.3183 33.1623 16.7357 32.7538 16.2376C32.3453 15.7395 31.8314 15.3382 31.2491 15.0626C30.6667 14.7871 30.0305 14.6443 29.3863 14.6443L29.3863 17.0193ZM27.4863 32.8542C28.4929 32.8544 29.4684 32.5043 30.2469 31.8664C31.0255 31.2284 31.5589 30.342 31.7566 29.3551L29.4291 28.888C29.3397 29.3373 29.0971 29.7401 28.7428 30.0306C28.3886 30.3211 27.9445 30.4796 27.4863 30.4792L27.4863 32.8542ZM23.1258 5.14591C22.1484 5.14598 21.1861 5.38578 20.3243 5.84704C19.4626 6.30831 18.728 6.97519 18.1858 7.7885L20.1603 9.10583C20.4857 8.61762 20.9267 8.21736 21.444 7.94059C21.9614 7.66382 22.5391 7.5207 23.1258 7.52091L23.1258 5.14591ZM9.49967 30.4792C8.40717 30.4792 7.52051 29.5926 7.52051 28.5001L5.14551 28.5001C5.14551 29.6549 5.60425 30.7624 6.42081 31.5789C7.23738 32.3955 8.34488 32.8542 9.49967 32.8542L9.49967 30.4792Z" fill="#111111"></path><path d="M12.666 15.8334L12.666 31.6667" stroke="#111111" stroke-width="1.5"></path></svg>
        </div> */}
         <div className='d-flex gap-1 chatAnswerLike'>
      <ThumbUpIcon  className='chatAnswerLikeIcon'
        id='like'
        onClick={likeIconClickHandle}
        style={{ color: likeColor }}/>
      <ThumbDownAltIcon className='chatAnswerLikeIcon'
        id='dislike'
        onClick={dislikeIconClickHandle}
        style={{ color: dislikeColor }}/>
         </div>
        <span className='timeview text-muted ps-3'>{new Date(prop.answer.time_stamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className=' ps-2 text-muted'>{prop?.answer?.time_taken?`${prop?.answer?.time_taken?.toFixed(3)} sec`:''}</span>
      </div>
      {/* table view/clipboard icon if there is either table or chart to show  */}
      {prop.answer.model_output_type != '' || prop.answer.graph_type != '' ?
        <i class="bi bi-clipboard2-data" onClick={showChartAndTableViewHandle}></i> : null
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
      {prop.answer.suggestive.length != 0 ?

        <div className='suggestivesCnt justify-content-between px-3 mt-3 rounded py-3'>
          <div> <i class="bi bi-lightbulb sugesttxt"></i><span className='text-muted px-3 sugesttryaskTxt'>Try Asking</span>
          </div>
          <div >{
            prop.answer.suggestive?.map((val) => (
              <p className='suggestion p-1 px-3' onClick={(e) => { prop.setValues({ ...prop.fieldvalues, question: e.target.innerText }) }}>{val}</p>
            ))
          }</div>
        </div>
        :
        null
      }

    </div>
  )
}

export default ChatAnswerCrad
