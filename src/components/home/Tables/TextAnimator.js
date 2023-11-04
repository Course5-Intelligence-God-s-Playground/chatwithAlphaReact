import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { ChatAnswerComponentData } from '../../utilites/ChatAnswerCradRecoilData';

function TextAnimator({dynamicText}) {
    const [displayedText, setDisplayedText] = useState('');
    const [isAnswerFinished, setIsAnswerFinished] = useState(false);
    const getChatAnswerComponentData = useRecoilValue(ChatAnswerComponentData)

    useEffect(() => {
      if (dynamicText) {
        if (getChatAnswerComponentData.ShowAnimation) {
            streamText(dynamicText);

        }
        else setDisplayedText(dynamicText)
      }
    }, [dynamicText]);
  
    const streamText = (content) => {
      let currentIndex = 0;
  
      const streamingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedText(content.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(streamingInterval);
          setIsAnswerFinished(true);
        }
      }, 15); // Adjust the typing speed here (e.g., 15ms per character)
    };
    return (
        <div dangerouslySetInnerHTML={{ __html: displayedText }}></div>
 
      );
          
   
             

    
}

export default TextAnimator
