import React from "react"
import styled from "styled-components"
import pandaListeningImgConsider from 'src/assets/images/Panda-Listening Pose-Turtleneck-v4.png'
import pandaListeningImgFoqal from 'src/assets/images/Panda-Listening Pose-Foqal-v2.png'
import pandaListeningImg from 'src/assets/images/Panda-Listening Pose 1-v12.png'
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
  const { partner, thank_you_text, partner_name} = props;
  const darkFlag = partner?.toUpperCase() === 'DATASAUR' ? true : false;

  return (
    <>
      {darkFlag?
      <DarkBubbleImg src={bubbleDarkImg} />:
      <SpeechBubbleImg src={SpeechBubbleCenter} />
      }
      {darkFlag?
        <Message darkFlag={darkFlag}><span>Thanks! You should now have received an appointment confirmation email.</span></Message> :
        <Message > {thank_you_text} </Message> 
      }
      {darkFlag?
      <PandaTalkDarkImg src={pandaDarkImg}/>:
      <PandaTalkImg src={partner?.toUpperCase() === 'ABRR1'?pandaListeningImgConsider:partner?.toUpperCase() === 'FOQAL'?pandaListeningImgFoqal:pandaListeningImg}/>}
      <PoweredBy>
        Powered by PerceptivePanda {partner_name !== `` ? `for ` : ``} {partner_name}
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
  top: 0px;
  height: 180px;
  margin: 4px 10px 81px 10px;
  object-fit: contain;
  border: 0;
  left: 7px;
  top: 0px;
  margin: 4px 10px 81px 10px;
  padding: 14.5px 7.5px 38px;
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
    span {
      background:none;
      color:white!important;
      position: absolute;
      width:90%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    position:relative;
    background-image: linear-gradient(106deg, rgba(49,49,49,0.84), #111 53%, #000 77%);
    left: 36.5px;
    top: 28px;
    width: 320px;
    height: 91px;
    padding: 13px 10px;
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
