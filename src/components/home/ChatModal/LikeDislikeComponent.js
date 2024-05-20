import React, { useState } from 'react'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { Server } from '../../utilites/ServerUrl';
export const LikeDislikeComponent = (prop) => {
    const [likeColor, setLikeColor] = useState('rgb(215, 213, 213)'); // Initial color for like icon
    const [dislikeColor, setDislikeColor] = useState('rgb(215, 213, 213)'); // Initial color for dislike icon
   
    const likeIconClickHandle = () => {
        setLikeColor('green');
        setDislikeColor('rgb(215, 213, 213)');
        // Add any other logic you want to perform when like is clicked
        submitLikeDislike('like')
      };
    
      const dislikeIconClickHandle = () => {
        setLikeColor('rgb(215, 213, 213)');
        setDislikeColor('red');
        // Add any other logic you want to perform when dislike is clicked
        submitLikeDislike('dislike')
      };
    
     async function submitLikeDislike(state){
            try {
                const req = await fetch(Server.likeDislike,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "id":prop?.answerID,
                        "state":state
                        })
                })
               
                if(!req.ok){ //retry once if failed
                    submitLikeDislike(state)
                }
            } catch (error) {
                
            }
      }
    return (
        <div className='d-flex gap-1 chatAnswerLike ps-3'>
        <ThumbUpIcon className='chatAnswerLikeIcon'
          id='like'
          onClick={likeIconClickHandle}
          style={{ color: likeColor }} />
        <ThumbDownAltIcon className='chatAnswerLikeIcon'
          id='dislike'
          onClick={dislikeIconClickHandle}
          style={{ color: dislikeColor }} />
      </div>
    )
}
