import React, { useState, useEffect } from "react"
import styled from "styled-components"
import pandaTalkingImg from 'src/assets/images/Panda-Talking Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import SpeechBubbleCenter from 'src/assets/images/speech-bubble-center.svg'
import { useNavigate,useLocation } from 'react-router-dom';


export default function Thankyou() {
  const [customsupport, setCusstomSupport] = useState(true);
  let naviage = useNavigate();
  let { state }=useLocation();
  return (
    <ThankWrapper>
      <CloseImg src={closeImg}/>
      <SpeechBubbleImg src={SpeechBubbleCenter}/>
      {customsupport ? <Message customsupport={customsupport}>
        Got it!<br/>
        We'll share your feedback with customer support and they'll be in touch.
      </Message> : <Message > Thank you for sharing your insights! </Message> }
      <PandaTalkImg src={pandaTalkingImg} />
      <Button onClick={()=>{naviage('/audio-result',{ state: state })}}>See Result</Button>
      <PoweredBy>
        Powered by PerceptivePanda for {"Datasaur.ai"}
      </PoweredBy>
    </ThankWrapper>
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
  color: #fff;
  user-select: none;
  left: 46px;
  bottom: 102px;
  width: 140px;
  text-decoration: none;
  font-size: 13px;
  line-height: 20px;
`
const ThankWrapper = styled.div`
  position: absolute;
  width: 400px;
  height: 450px;
  padding: 0;
  top: 50%;
  left: 50%;
  margin: -225px 0 0 -200px;
  background-color: #e6eefd;
  opacity: 1.0;
  border-radius: 10px;
  box-shadow: 0 0 12.5px -1px rgba(0, 0, 0, 0.1);    
  @media(min-width: 1000px){
    transform: scale(1.7);
  }
`
const SpeechBubbleImg = styled.img`
  position: absolute;
  left: 40px;
  top: -10px;
  width: 300px;
  height: 187px;
  margin: 4px 10px 81px 2.5px;
  padding: 26.5px 7.5px 38px;
  object-fit: contain;
  border: 0;
`
const PandaTalkImg = styled.img`
  position: absolute;
  left: 220px;
  top: 180px;
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
const Message = styled.div<{customsupport?:boolean}>`
  position: absolute;
  overflow: hidden;
  font-family: 'Muli', sans-serif;
  font-size: 18px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  left: 76px;
  top: 80px;
  width: 250px;
  height: 65px;
  line-height: 1.15;
  text-align: center;
  color: #000;
  ${(props) => props.customsupport && `    top: 33px;
  height: 100px;`}   
`
const PoweredBy = styled.span`
  position: absolute;
  height: 15px;
  width: 400px;
  top: 445px;
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