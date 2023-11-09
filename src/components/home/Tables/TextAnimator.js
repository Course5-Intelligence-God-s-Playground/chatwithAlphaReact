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
          setIsAnswerFinished(false);
          setDisplayedText(content.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(streamingInterval);
          setIsAnswerFinished(true);
        }
      }, 4); // Adjust the typing speed here (e.g., 15ms per character)
    };
    return (
        <div>
           <span dangerouslySetInnerHTML={{ __html: displayedText }}></span>
        </div>
      //streaming is currently disabled , to enable streaming replace dynamiceText with displayText
      );  
}
export default TextAnimator


        {/* <ReactSanitizerParser>{displayedText }</ReactSanitizerParser> */}