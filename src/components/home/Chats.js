import React, { useEffect } from 'react'
import './Chats.scss'
import ChatAnswerCrad from './ChatAnswerCrad'
import { useRecoilValue } from 'recoil'
import { loginMailId } from '../utilites/loginRecoil'

function Chats(prop) {

    const getloginMailIdValue = useRecoilValue(loginMailId)
    
    useEffect(()=>{
        let userName ;
        switch (getloginMailIdValue) {
            case 'poca@course5i.com':
                userName='George'
                break;
            case 'raiyer@microsoft.com':
                userName='Ram Iyer'
                break;
            case 'patrickkerin@microsoft.com':
                userName='Patrick'
                break;
            default:
                break;
        }
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
                general_question: true

            }
            ,{
                chat_text: `<b>You have Selected: </b>${prop.fieldvalues.scoring_type==='Customer Journey POCA scoring (Discover, Learn, Buy & Engage)'?'Customer Journey POCA scoring system (Discover, Learn, Buy & Engage)':'Standard POCA scoring system (Marketing, Omnichannel, Ecommerce & Subscription)'}`,
                chat_type: "msg",
                time_stamp: currentDate,
                new: true,
                suggestive: '',
                model_output: '',
                model_output_type: '',
                graph_data: '',
                graph_type: '',
                id: errorIdval+1,
                scoretype: prop.fieldvalues.scoring_type,
                general_question: true

            }
        ]

        prop.setqaChats([...array,...prop.qaChats]);
        }
       
    },[prop.qaChats])

    return (
        <div className='chatsContainer px-5 pt-1'>
          
            {   prop?.qaChats?.length==0?
               
            <>
            <div className='chatAnswerBotCnt d-flex justify-content-end'><div className='chatAnswer px-3 py-2  align-items-center mt-5'><b >You have Selected: </b>{prop.fieldvalues.scoring_type}</div></div>
            </>
                :

                prop.qaChats.map((item)=>(
                    <div className='chatSection d-flex flex-column gap-5 pb-5'>
                       {item.chat_type=='Question'? <div>
                       <div className='chatQuestion rounded px-2 d-flex align-items-center'>{item.chat_text}</div>
                       <span className='timeview text-muted'>{ new Date(item.time_stamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'})}</span>
                       </div>:
                    <div className='chatAnswerHold' id={item.id}>
                        {
                            <ChatAnswerCrad answer={item} new={item.new} setValues={prop.setValues} fieldvalues={prop.fieldvalues}/>
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
