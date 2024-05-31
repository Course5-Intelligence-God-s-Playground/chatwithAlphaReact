import React, { useEffect, useState } from 'react'
import './AnswerLoader.scss'
import spinnersImg from '../assets/spinner.gif'

function AnswerLoader(prop) {
    const [paraText, setParaText] = useState('')
    let standardPoca = [
        'AMAZON - US has the highest Ecommerce score of 85% in FY24.',
        ' AMAZON - AU in Australia has a high Ecommerce score of 87% in FY24.',
        'AMAZON - CA in Canada has a consistent Ecommerce score of 80% in FY23 and FY24.',
        ' AMAZON - MX in Mexico has improved its Ecommerce score from 78% in FY23 to 84% in FY24.',
        ' AMAZON - JP in Japan has the highest Ecommerce score of 89% in FY24 among all Asian countries.'
    ]
    let customerPoca = [
        ' DARTY - FR and FNAC - FR in France, both Market Makers, have the highest Discover scores of 99% and 98% respectively in FY23.',
        'ALZA - CZ in Czech Republic, a Strategic account, has a perfect Buy score of 100% in FY23.',
        ' JD.COM - CN in China, an Etailer, has consistent scores of 96% in Discover, Learn, and Engage categories in FY24.',
        ' BEST BUY - US in the US, a Market Maker, has high scores in Discover (96%), Buy (97%), and Engage (97%) categories in FY24.',
        ' COUPANG - KR in South Korea, an Etailer, has a high Discover score of 96% but a relatively low Engage score of 76% in FY24.',
    ]

    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 4);
        if (prop.value == 'Customer Journey POCA scoring (Discover, Learn, Buy & Engage)') {
            setParaText(customerPoca[randomNumber])
        }
        else {
            setParaText(standardPoca[randomNumber])
        }
    }, [])
    return (
        <div className='spinnerwhole  align-items-center justify-content-center d-flex'>
            <div className='ansLoaderCnt  d-flex align-items-center justify-content-center'>
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <img className='ansLoaderCntImg' src={spinnersImg} alt='Loading gif'></img>


                    <p className=' text-muted rounded bg-white'>Generating response to your question...</p>
                    <p className='ansLoaderCntTxt shine border rounded p-2 text-center'><span className='text-secondary'>DID YOU KNOW?</span><br /><br /><span className='paraMainText'>{paraText}</span></p>

                </div>
            </div>
        </div>
    )
}

export default AnswerLoader
