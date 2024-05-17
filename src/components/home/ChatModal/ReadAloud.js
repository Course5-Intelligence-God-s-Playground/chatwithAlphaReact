import React from 'react'

import muteIcon from '../../assets/chatpage/volume-mute.png'
import unmuteIcon from '../../assets/chatpage/volume.png'
export const ReadAloud = (prop) => {
    
    function readLoudHandler(e) {
        let targetId = e.target?.parentElement?.id
        let allMuteElements = document.getElementsByClassName('mute')
        let allUnMuteElements = document.getElementsByClassName('unmute')

        for (let I = 0; I < allMuteElements?.length; I++) {

            if (!allMuteElements[I]?.classList?.contains(`${targetId}mute`)) {
                allMuteElements[I]?.classList?.add('d-none')

            }

        }
        for (let j = 0; j < allUnMuteElements?.length; j++) {
            allUnMuteElements[j]?.classList?.remove('d-none')



        }
        const speechSynthesis = window.speechSynthesis;
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel(); // Stop existing speech
        }
        let userClickedElement = document.getElementsByClassName(`${targetId}mute`)[0]
        let userClickedunmuteElement = document.getElementsByClassName(`${targetId}unmute`)[0]
        if (userClickedElement?.classList?.contains('d-none')) {
            userClickedElement?.classList?.remove('d-none')
            userClickedunmuteElement?.classList?.add('d-none')
            let strippedText = prop?.answer?.chat_text.replace(/<[^>]*>/g, '');
            const utterance = new SpeechSynthesisUtterance(strippedText);
            utterance.rate = 1.75; // Increase the rate to 1.5 for faster speech
            speechSynthesis.speak(utterance);
            utterance.onend = () => {
                userClickedElement?.classList?.add('d-none')
                userClickedunmuteElement?.classList?.remove('d-none')

            }
        }
        else {
            userClickedElement?.classList?.add('d-none')
            userClickedunmuteElement?.classList?.remove('d-none')

            speechSynthesis.cancel();
        }
        //last response is read using browser default text to speech service
    }
    return (
        <div className='d-flex pe-3 align-items-center relative' id={prop?.answer?.id}>

            <img src={muteIcon} id='unmute' onClick={readLoudHandler} className={`answerIcons unmute voiceIcon ${prop?.answer?.id}unmute`}></img>
            <img src={unmuteIcon} id='mute' onClick={readLoudHandler} className={`answerIcons voiceIcon mute ${prop?.answer?.id}mute d-none`}></img>

        </div>
    )
}
