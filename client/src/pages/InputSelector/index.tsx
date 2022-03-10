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
import { useParams } from "react-router-dom";
import { Config } from 'src/config/aws';
import * as actions from '../../actions';
import axios from 'axios';

export default function InputSelector() {
  const { status, startRecording, stopRecording } = useReactMediaRecorder({video: false, askPermissionOnMount:false});
  let naviage = useNavigate();
  const [closeFlag, setCloseFlag] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isTextActive, setIsTextActive] = useState(false);
  const [micFlag, setMicFlag] = useState(true);
  const [userId, setUserID] = useState('')
 const [urlArr, setUrlArr] = useState([]);
  const [step,setStep] = useState(0);
  const { partnerId, interviewId } = useParams();
  const interviewArr =  Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0]['interviews'];
  const CObj = Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0];
  const [arrCount,setArrCount] = useState(0);
  const onCloseClick = () => {
    setStep(2);
    if(CObj['x_button'] == '1')
      setCloseFlag(false);
    else
      setCloseFlag(true);
  }
  const onClick = () => {
    log_event('input-selector', '', '2', partnerId?.toUpperCase(), interviewId, userId)
     if(!isActive){
      startRecording();
      // stopRecording();
    } 
      else
        stopRecording();
      setIsActive(!isActive);
    }
  const onTextClick = () => {
    log_event('input-selector', '', '3', partnerId?.toUpperCase(), interviewId, userId)
    setIsTextActive(!isTextActive);
    setStep(1);
  }
  const xmit_event = (event_name:any, partner:any, user:any, interview:any) => {
    axios.defaults.baseURL = Config.api_url;
    axios.post("/event", {
        e: event_name,
        p: partner,
        u: user,
        i: interview,
        q: '',
        c: ''
      })
      .then(res => {
        let {data} = res;
        console.log('result-event-xmit',data)
      })
      .catch(() => {
      });

}

const log_event = (event_name:any, question_number:any, code:any, partner:any, interview:any, user:any) => {
  axios.defaults.baseURL = Config.api_url;
  axios.post("/event", {
      e: event_name,
      p: partner,
      u: user,
      i: interview,
      q: question_number,
      c: code
    })
    .then(res => {
      let {data} = res;
      console.log('result-event-log',data)
    })
    .catch(() => {
    });
}
  useEffect(() => {
    if(status === 'recording'){
      // naviage('/input-selector/answer-audio');
      setStep(1);
    }
  },[status]);
  
  return (
    <InputSelectorWrapper step={step}>
      {step === 0 ? <>
      <CloseImg onClick={onCloseClick} src={closeImg}/>
      <PandaImg src={panda}/>
      <HowTalk>How should we talk?</HowTalk>
      <SpeakButton onClick={onClick}>
          <MicrophoneImg src={micFlag ? microphone : microphoneDisable}/>
      </SpeakButton>
      <SpeakText>Press to speak</SpeakText>
      <WriteButton onClick={onTextClick}>
        <PencilPaperImg src={pencilpaper} />
      </WriteButton>
      <WriteText>Press to write</WriteText>
      <PoweredBy>
      *All feedback is recorded.<br/>
      Powered by PerceptivePanda for {partnerId?.toUpperCase()}
      </PoweredBy></>: step === 1 ?
      isTextActive?
      <AnswerText onNextClick={(step,value,arrCount,urlArr) => {
        setStep(step);
        setArrCount(arrCount);
        setUserID(value);
        setUrlArr(urlArr);
      }}onLogClick={(flag, questionNumber)=>{
        if(flag == 0)
          log_event('answer-audio', questionNumber, '2', partnerId, interviewId, userId);      
        else
          log_event('answer-audio', questionNumber, '3', partnerId, interviewId, userId);      
      }} onClosesClick={(flag)=>{
        setStep(2);
        setCloseFlag(flag);
      }}
      />:
       <AnswerAudio onNextClick={(step,value,arrCount,urlArr) => {
        setStep(step);
        setArrCount(arrCount);
        setUrlArr(urlArr);
        setUserID(value);
      }} onLogClick={(flag, questionNumber)=>{
        if(flag == 0)
          log_event('answer-audio', questionNumber, '2', partnerId, interviewId, userId);      
        else
          log_event('answer-audio', questionNumber, '3', partnerId, interviewId, userId);      
      }} onClosesClick={(flag)=>{
        setStep(2);
        setCloseFlag(flag);
      }}/>: step === 2 ?
      <Thankyou partner={partnerId as any} onNextClick={(step) => {
        setStep(step);
        log_event('thank-you', 3 , '0', partnerId, interviewId, userId);    
      }} closeFlag={closeFlag as boolean}/>: <AudioResult  userId={userId} text={isTextActive} count={arrCount} url={urlArr}/>
      }
    </InputSelectorWrapper>
  )
}
const InputSelectorWrapper = styled.div<{step:number}>`
    position: absolute;
    width: 400px;
    height: 450px;
    padding: 0;
    top: 50%;
    left: 50%;
    margin: -225px 0 0 -200px;
    ${(props) => props.step !== 0 && `background-color: #e6eefd;`}   
    opacity: 1.0;
    border-radius: 10px;
    box-shadow: 0 0 12.5px -1px rgba(0, 0, 0, 0.1);   
    ${(props) => props.step === 0 && `background-color:#fff;`}   
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
