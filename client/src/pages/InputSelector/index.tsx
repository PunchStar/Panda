import React, { useState, useEffect  } from "react";
import styled from "styled-components"
import { useNavigate } from 'react-router-dom';
import {useReactMediaRecorder} from "react-media-recorder";
import panda from 'src/assets/images/panda@3x.png';
import microphone from 'src/assets/images/microphone.svg';
import microphoneDisable from 'src/assets/images/microphone-disabled.svg';
import pencilpaper from 'src/assets/images/pencil-paper.svg'
import closeImg from 'src/assets/images/x.svg'
import AnswerAudio from "../AnswerAudio";
import AudioResult from "../AudioResult";
import Thankyou from "../Thankyou";
import AnswerText from "../AnswerText";

export default function InputSelector() {
  const { status, startRecording, stopRecording } = useReactMediaRecorder({video: false, askPermissionOnMount:false});
  let naviage = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isTextActive, setIsTextActive] = useState(false);
  const [micFlag, setMicFlag] = useState(true);
  const [userId, setUserID] = useState('')
 const [urlArr, setUrlArr] = useState([]);
  const [step,setStep] = useState(0);
  const [arrCount,setArrCount] = useState(0);
  const onClick = () => {
     if(!isActive){
      startRecording();
      // stopRecording();
    } 
      else
        stopRecording();
      setIsActive(!isActive);
    }
  const onTextClick = () => {
      setIsTextActive(!isTextActive);
      setStep(1);
  }
  useEffect(() => {
    if(status === 'recording'){
      // naviage('/input-selector/answer-audio');
      setStep(1);
    }
  },[status]);
  
  return (
    <InputSelectorWrapper>
      {step === 0 ? <><CloseImg src={closeImg}/>
      <PandaImg src={panda}/>
      <HowTalk>How should we talk?</HowTalk>
      <SpeakButton onClick={onClick}>
          <MicrophoneImg src={micFlag ? microphone : microphoneDisable}/>
      </SpeakButton>
      <SpeakText>Press To Speak</SpeakText>
      <WriteButton onClick={onTextClick}>
        <PencilPaperImg src={pencilpaper} />
      </WriteButton>
      <WriteText>Press To Write</WriteText>
      <PoweredBy>
      *All feedback is recorded.<br/>
      Powered by PerceptivePanda for {"Datasaur.ai"}
      </PoweredBy></>: step === 1 ?
      isTextActive?
      <AnswerText onNextClick={(step,value,arrCount,urlArr) => {
        setStep(step);
        setArrCount(arrCount);
        setUserID(value);
        setUrlArr(urlArr);
      }}
      />:
       <AnswerAudio onNextClick={(step,value,arrCount,urlArr) => {
        setStep(step);
        setArrCount(arrCount);
        setUrlArr(urlArr);
        setUserID(value);
      }}/>: step === 2 ?
      <Thankyou onNextClick={(step) => {
        setStep(step);
      }}/>: <AudioResult  userId={userId} text={isTextActive} count={arrCount} url={urlArr}/>
      }
    </InputSelectorWrapper>
  )
}
const InputSelectorWrapper = styled.div`
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
    background-color: #fff;
    span {
      text-align: center;
      font-family: 'Muli', sans-serif;
      font-size: 14px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.21px;
      text-align: center;
      color: #399aff;
      cursor: pointer;
    }
    @media(min-width: 1000px){
        transform: scale(1.7);
    }
`
const PandaImg = styled.img`
  position: absolute;
  width: 143px;
  height: 143px;
  top: 50px;
  left: 125px;
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
const HowTalk = styled.div`
  position: absolute;
  top: 230px;
  width: 100%;
  font-family: 'Muli', sans-serif;
  font-size: 14px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.35px;
  text-align: center;
  color: #535353;
  text-transform: uppercase;    
`
const SpeakButton = styled.div`
  position: absolute;
  top: 275px;
  left: 100px;
  height: 75px;
  width: 75px;
  border: solid 2px #4d9ff5;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer; 
`
const WriteButton = styled.div`
  position: absolute;
  top: 275px;
  left: 225px;
  height: 75px;
  width: 75px;
  border: solid 2px #4d9ff5;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer; 
`
const MicrophoneImg = styled.img`
  position: absolute;
  left: 26px;
  top: 20px;
`
const SpeakText = styled.span`
  position: absolute;
  top: 355px;
  left: 83px;
  width: 110px;
`
const WriteText = styled.span`
  position: absolute;
  top: 355px;
  left: 210px;
  width: 110px;
`
const PencilPaperImg = styled.img`
  position: absolute;
  left: 20px;
  top: 16px;
`
const PoweredBy = styled.span`
  position: absolute;
  height: 15px;
  width: 400px;
  top: 410px;
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