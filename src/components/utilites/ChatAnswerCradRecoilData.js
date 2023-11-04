import { atom } from "recoil";

export const ChatAnswerComponentData = atom({  
    key: 'ChatAnswerComponentData',
    default: {
        scrollType:0,//stores user current scroll position in chatbot page so to retun to same spot after user returns from expanded table view
        ShowAnimation:true, //chatbot answer text animation state, animation will appear only once and not after user enters from expanded table view page
        closeBtnClick:false //when user clicks close expanded table view button 
    }
});