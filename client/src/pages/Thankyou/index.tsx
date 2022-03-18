import React, { useState } from "react"
import styled from "styled-components"
import pandaTalkingImg from 'src/assets/images/Panda-Talking Pose 1-v12.png'
import pandaListeningImg from 'src/assets/images/Panda-Listening Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import SpeechBubbleCenter from 'src/assets/images/speech-bubble-center.svg'

interface ThankyouProps {
  partner: any;
  closeFlag: boolean;
  onNextClick: (step:number) => void;
  thank_you_text: string;
  partner_name: string;
}
export default function Thankyou(props: ThankyouProps) {
  const {onNextClick, partner, closeFlag, thank_you_text, partner_name} = props;
  // const [customsupport, setCusstomSupport] = useState(true);
  return (
    <>
      <SpeechBubbleImg src={SpeechBubbleCenter}/>
      {/* {customsupport ? <Message customsupport={customsupport}>
        Got it!<br/>
        We'll share your feedback with customer support and they'll be in touch.
      </Message> :  */}
      {/* <Message > Thank you for sharing your insights! </Message>  */}
      <Message > {thank_you_text} </Message> 
      {/* } */}
      <PandaTalkImg src={pandaListeningImg} />
      {/* {!closeFlag && <Button onClick={()=>{onNextClick(3);}}>See Result</Button>} */}
      <PoweredBy>
        Powered by PerceptivePanda {partner_name != `` ? `for ` : ``} {partner_name}
      </PoweredBy>
    </>
  )
}
const Button = styled.span`
  position: absolute;
  padding: 5px 0 5px 0;
  margin: 0 0 0 0;
  border-radius: 20px;
  background-color: #4d9ff5;
  cursor: pointer;
  text-align: center;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);    
  font-family: 'Muli', sans-serif;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.06px;
  text-align: center;
  color: #fff!important;
  user-select: none;
  left: 46px;
  bottom: 102px;
  width: 140px;
  text-decoration: none;
  font-size: 13px;
  line-height: 20px;
`
const SpeechBubbleImg = styled.img`
  position: absolute;
  left: 50px;
  top: 0px;
  width: 280px;
  height: 180px;
  margin: 4px 10px 81px 10px;
  padding: 26.5px 7.5px 38px;
  object-fit: contain;
  border: 0;
`
const PandaTalkImg = styled.img`
  position: absolute;
  left: 116px;
  top: 174px;
  width: auto;
  height: 224px;
`
const CloseImg = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  top: 10px;
  right: 5px;
  opacity: 0.5;
  cursor: pointer;
`
const Message = styled.div`
  position: absolute;
  overflow: hidden;
  font-family: 'Muli', sans-serif;
  font-size: 12px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  left: 65.5px;
  top: 50px;
  width: 270px;
  height: 80px;
  line-height: 1.15;
  text-align: center;
  color: #000;
  white-space: pre-wrap;
`
const PoweredBy = styled.span`
  position: absolute;
  height: 15px;
  width: 400px;
  top: 425px;
  left: 0px;
  font-size: 10px!important;
  font-weight: normal!important;
  font-stretch: normal!important;
  font-style: normal!important;
  line-height: normal!important;
  letter-spacing: -0.18px;
  text-align: center;
  color: #999!important;
`
