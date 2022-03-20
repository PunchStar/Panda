import React, { useState } from "react"
import styled from "styled-components"
import pandaListeningImg from 'src/assets/images/Panda-Listening Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import SpeechBubbleCenter from 'src/assets/images/speech-bubble-center.svg'
import bubbleDarkImg from 'src/assets/images/thanks-dark/bubble@3x.png';
import pandaDarkImg from 'src/assets/images/thanks-dark/panda@3x.png';
interface ThankyouProps {
  partner: any;
  closeFlag: boolean;
  onNextClick: (step:number) => void;
  thank_you_text: string;
  partner_name: string;
}
export default function Thankyou(props: ThankyouProps) {
  const {onNextClick, partner, closeFlag, thank_you_text, partner_name} = props;
  const [darkFlag, setDarkFlag] = useState(partner?.toUpperCase() === 'DATASAUR' ? true : false);
  // const [customsupport, setCusstomSupport] = useState(true);
  return (
    <>
      {darkFlag?
      <DarkBubbleImg src={bubbleDarkImg} />:
      <SpeechBubbleImg src={SpeechBubbleCenter} />
      }
      {darkFlag?
        <Message darkFlag={darkFlag}>Thanks! You should now have received an appointment confirmation email.</Message> :
        <Message > {thank_you_text} </Message> 
            }
      {/* } */}
      {darkFlag?
      <PandaTalkDarkImg src={pandaDarkImg}/>:
      <PandaTalkImg src={pandaListeningImg} />}
      {/* {!closeFlag && <Button onClick={()=>{onNextClick(3);}}>See Result</Button>} */}
      <PoweredBy>
        Powered by PerceptivePanda {partner_name != `` ? `for ` : ``} {partner_name}
      </PoweredBy>
    </>
  )
}
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
const DarkBubbleImg = styled.img`
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
const PandaTalkDarkImg = styled.img`
  position: absolute;
  left: 75px;
  top: 122px;
  width: auto;
  height: 281px;
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
const Message = styled.div<{darkFlag?:boolean}>`
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
  ${(props) => props.darkFlag && `
    color:white!important;
    left: 76.5px;
    top: 48px;
    width: 247px;
    height: 67px;
    padding: 13px 10px;
    background-image: linear-gradient(106deg, rgba(49,49,49,0.84), #111 53%, #000 77%);
  `}   

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
