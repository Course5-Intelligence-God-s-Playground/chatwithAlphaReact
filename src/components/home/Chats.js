import React from 'react'
import './Chats.scss'
import ChatAnswerCrad from './ChatAnswerCrad'

function Chats(prop) {
   
    return (
        <div className='chatsContainer px-5 pt-1'>
          
            {   prop.qaChats.length==0?
            <div className='chatAnswerBotCnt d-flex justify-content-end'><div className='chatAnswer px-3 py-2  align-items-center'>Hello <b>Patrick !</b><br/> I am Course5 Discovery, How can I assist you?</div></div>
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
