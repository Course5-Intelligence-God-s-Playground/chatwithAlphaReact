import React, { useEffect } from 'react'
import './Chats.scss'
import ChatAnswerCrad from './ChatAnswerCrad'

import userImage from '../assets/chatpage/userImage.png'
function Chats(prop) {

    
    useEffect(()=>{
     
        if(prop?.qaChats?.length<1){
            const currentDate = new Date()
        let errorIdval = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        let array = [
            {
                chat_text: `Hello!<br/>I am <b>Pi</b>, your Partner Intelligence chat assistant. How may I assist you?`,
                chat_type: "msg",
                time_stamp: currentDate,
                new: true,
                suggestive: '',
                model_output: '',
                model_output_type: '',
                graph_data: '',
                graph_type: '',
                id: errorIdval,
                scoretype: prop.fieldvalues.scoring_type,
                general_question: true,
                suggestive_completed:false,
                chart_completed:false,
                answer_closed:false,
                isSaved:false,
                chatCompleted:false

            }
           
        ]

        prop.setqaChats([...array,...prop.qaChats]);
        }
       
    },[prop.qaChats])

  
    return (
        <div className='chatsContainer pt-1'>
          
            {   prop?.qaChats?.length==0?
               
            <>
            <div className='chatAnswerBotCnt d-flex justify-content-end'><div className='chatAnswer px-3 py-2  align-items-center mt-5'><b >You have Selected: </b>{prop.fieldvalues.scoring_type}</div></div>
            </>
                :

                prop?.qaChats?.map((item)=>(
                    <div className='chatSection d-flex flex-column gap-5 pb-5'>
                       {item.chat_type=='Question'? 
                      <div className=' d-flex gap-2 chatQuestionSection'>
                        <img className='userBotChatImg' src={userImage}/>
                         <div>
                       <div className='chatQuestion rounded p-2 d-flex align-items-center'>{item.chat_text}</div>
                       <span className='timeview text-muted'>{ new Date(item.time_stamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'})}</span>
                      
                       </div>
                      </div>
                       :
                    <div className='chatAnswerHold' id={item.id}>
                     
                        {
                            <ChatAnswerCrad 
                            qaChats={prop?.qaChats}
                            setqaChats={prop?.setqaChats}
                            timeStore={prop?.timeStore}
                            sendQuestion={prop?.sendQuestion}
                            getfeedbackEmailContainerHandler={prop.getfeedbackEmailContainerHandler} answer={item} new={item.new} setValues={prop.setValues} fieldvalues={prop.fieldvalues}/>
                        }
                    </div>
                    }
                    </div>
                ))
            }
        </div>
    )
}

export default Chats
