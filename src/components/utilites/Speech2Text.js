import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = (prop) => {
  const {
    transcript,
    listening,
  } = useSpeechRecognition();

 
  function speechHandler(e){
    let speechType = e.target.id
    if(speechType == 'stopSpeech'){
 
        SpeechRecognition.stopListening()
        
    }
    else {
       
        SpeechRecognition.startListening()
    }
}

useEffect(()=>{
    
    prop.setValues({...prop.fieldvalues,question:transcript})
},[transcript])

useEffect(()=>{

        prop.setSpeechEnabled(listening)
   
},[listening])
  return (
    <div>
    
   
      {listening?
                                      
                                      <i class="bi bi-mic-mute-fill text-danger"id='stopSpeech' onClick={speechHandler} ></i>
                                      :<i class="bi bi-mic" id='startSpeech' onClick={speechHandler} ></i>
                                      }
      
    </div>
  );
};
export default Dictaphone;