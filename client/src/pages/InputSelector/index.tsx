import React, { useState, useEffect  } from "react";
import styled from "styled-components"
import { useNavigate } from 'react-router-dom';
import {useReactMediaRecorder} from "react-media-recorder";
import panda from 'src/assets/images/panda@3x.png';
import microphone from 'src/assets/images/microphone.svg';
import microphoneDisable from 'src/assets/images/microphone-disabled.svg';
import micDarkSpeak from 'src/assets/images/input-dark/icon-2@3x.png';
import micDarkWrite from 'src/assets/images/input-dark/icon-1@3x.png';
import pencilpaper from 'src/assets/images/pencil-paper.svg'
import closeImg from 'src/assets/images/x.svg'
import closeDarkImg from 'src/assets/images/input-dark/rectangle-x@3x.png'
import bitmapImg from 'src/assets/images/input-dark/bitmap@3x.png'
import AnswerAudio from "../AnswerAudio";
import AudioResult from "../AudioResult";
import Thankyou from "../Thankyou";
import AnswerText from "../AnswerText";
import { useParams } from "react-router-dom";
import { Config } from 'src/config/aws';
import * as actions from '../../actions';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';

export default function InputSelector() {
  const { status, error, startRecording, stopRecording } = useReactMediaRecorder({video: false, askPermissionOnMount:false});
  let naviage = useNavigate();
  const [closeFlag, setCloseFlag] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isTextActive, setIsTextActive] = useState(false);
  const [micFlag, setMicFlag] = useState(true);
  const [urlArr, setUrlArr] = useState([]);
  const [step,setStep] = useState(0);
  const { partnerId, interviewId, user } = useParams();
  const [userId, setUserID] = useState(user == undefined ? uuidv4() : user);
  const interviewArr =  Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0]['interviews'];
  const thank_you_text = interviewArr.filter(item => item.name === interviewId)[0].thank_you_text || "Thank you for sharing your insights!";
  const CObj = Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0];
  const partner_name = CObj.partner_name;
  const [arrCount,setArrCount] = useState(0);
  const [darkFlag, setDarkFlag] = useState(partnerId?.toUpperCase() === 'DATASAUR' ? true : false);
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
      console.log('===start_record=====')
      // stopRecording();
    } 
    else {
        stopRecording();
        console.log('===stop_record=====')      
    }
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
    console.log('>>>><<<<>>>><<')
    console.log("status'",status)
    console.log('>>>><<<<>>>><<')
  },[status]);
  useEffect(() => {
    if( error === 'permission_denied' || error === "no_specified_media_found" )
      setMicFlag(false);
    else
      setMicFlag(true);
  }, [error]);
  useEffect(() => {
    if(step == 2){
      stopRecording();
      console.log('===stopRecording====')
      // navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
      //     console.log('stream',stream)
      //     var track = stream.getTracks()[0];
      //     track.stop();
      // }).catch(function(err){
      //   console.log('media error', err)
      // })
    }
  },[step]);
  return (
    <InputSelectorWrapper step={step} partner={partnerId} darkFlag={darkFlag}>
      {step === 0 ? <>
      <CloseImg onClick={onCloseClick} src={darkFlag?closeDarkImg:closeImg} darkFlag={darkFlag}/>
      { darkFlag?
        <>
          <BitmapImg src={bitmapImg}/>
          <DarkInputSelectorText>{"To help us prepare for your appointment, please mention which business needs you're hoping we can address."}</DarkInputSelectorText>
        </>
      :CObj.input_selector_type != "b" ?
      <PandaImg src={panda}/> : <InputSelectorText>{CObj.input_selector_text}</InputSelectorText>
      }
      <HowTalk darkFlag={darkFlag}>How should we talk?</HowTalk>
      <SpeakButton onClick={onClick} micFlag={micFlag} darkFlag={darkFlag}>
          {darkFlag ?
          <DarkSpeakImg src={micDarkSpeak}/>
          :<MicrophoneImg src={micFlag ? microphone : microphoneDisable}/>}
      </SpeakButton>
      <SpeakText micFlag={micFlag} darkFlag={darkFlag}>Press to speak</SpeakText>
      <WriteButton darkFlag={darkFlag} onClick={onTextClick}>
        {!darkFlag ?<PencilPaperImg src={pencilpaper} />:
        <PencilDarkImg src={micDarkWrite}/>}
      </WriteButton>
      <WriteText darkFlag={darkFlag}><div>Press to write</div></WriteText>
      {!micFlag &&
        <PermissionDeniedText>
            Your browser or OS isn't Microphone enabled.<br/> Please click "Press to write" instead.
        </PermissionDeniedText>
      }
      <PoweredBy>
        *All feedback is recorded.<br/>
        Powered by PerceptivePanda {partner_name != `` ? `for ` : ``} {partner_name}
      </PoweredBy></>: step === 1 ?
      isTextActive?
      <AnswerText userId={userId} darkFlag={darkFlag} onNextClick={(step,value,arrCount) => {
        setStep(step);
        setArrCount(arrCount);
        setUserID(value);
        // setUrlArr(urlArr);
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
       <AnswerAudio userId={userId} darkFlag={darkFlag} onNextClick={(step,value,arrCount) => {
        setStep(step);
        setArrCount(arrCount);
        // setUrlArr(urlArr);
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
      }} closeFlag={closeFlag as boolean} thank_you_text={thank_you_text} partner_name={partner_name} />:
      //  <AudioResult  userId={userId} text={isTextActive} count={arrCount} url={urlArr}/>
      <></>
      }
    </InputSelectorWrapper>
  )
}
const InputSelectorWrapper = styled.div<{step:number, partner: any, darkFlag:boolean}>`
    position: absolute;
    width: 400px;
    height: 460px;
    padding: 0;
    top: 49%;
    left: 50%;
    margin: -225px 0 0 -200px;
    ${(props) => props.step !== 0 && `background-color: #e6eefd;`}   
    opacity: 1.0;
    border-radius: 10px;
    box-shadow: 0 0 12.5px -1px rgba(0, 0, 0, 0.1);   
    ${(props) => props.step === 0 && `background-color:#fff;`}   
    ${(props) => props.darkFlag && `background-color:black!important;`}   
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
        transform: scale(1.5);
        // transform: ${({ partner, step }) => partner === 'ABRR1' && step === 2  ? 'scale(1.2)' : 'scale(1.7)'};
    }
`
const PandaImg = styled.img`
  position: absolute;
  width: 143px;
  height: 143px;
  top: 50px;
  left: 125px;
`
const BitmapImg = styled.img`
  position: absolute;
  width: 83px;
  height: 83px;
  top: 50px;
  left: 151px;
`
const CloseImg = styled.img<{darkFlag:boolean}>`
  position: absolute;
  width: 25px;
  height: 25px;
  top: 10px;
  right: 5px;
  opacity: 0.5;
  cursor: pointer;
  ${(props) => props.darkFlag  && `
    width:10px;
    height:10px;
    right:10px;

  `}   

`
const InputSelectorText = styled.div`
  position: absolute;
  top: 70px !important;
  left: 110px !important;
  width: 180px;
  height: auto;
  font-family: 'Muli', sans-serif;
  font-weight: 900;
  text-align: center;
`
const DarkInputSelectorText = styled.div`
  position: absolute;
  top: 136px !important;
  left: 84px !important;
  width: 236px;
  height: auto;
  font-family: Soleil;
  font-weight: bold;
  line-height:1.33;
  text-align: center;
  color:white!important;
`
const HowTalk = styled.div<{darkFlag:boolean}>`
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
  ${(props) => props.darkFlag  && `
    color:rgba(255,255,255,0.5);
    font-family:Barlow;
    font-weight:normal;
    font-stretch:normal;
    letter-spacing: 0.57px;
    height:11px;
    top: 260px;
    font-size:12px;
  `}   

`
const SpeakButton = styled.div<{micFlag:boolean,darkFlag:boolean}>`
  position: absolute;
  top: 275px;
  left: 100px;
  height: 75px;
  width: 75px;
  border: solid 2px #4d9ff5;
  border-radius: 50%;
  ${(props) => !props.micFlag  && `border-color: lightgray;`}   
  display: inline-block;
  cursor: pointer; 
  ${(props) => props.darkFlag && `
  border:0px; `}
`
const WriteButton = styled.div<{darkFlag:boolean}>`
  position: absolute;
  top: 275px;
  left: 225px;
  height: 75px;
  width: 75px;
  border: solid 2px #4d9ff5;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer; 
  ${(props) => props.darkFlag && `
  border:0px; `}
`
const MicrophoneImg = styled.img`
  position: absolute;
  left: 24px;
  top: 17px;
`
const DarkSpeakImg = styled.img`
  position: absolute;
  left: 10px;
  top: 16px;
  width: 59px;
`
const SpeakText = styled.span<{micFlag:boolean, darkFlag:boolean}>`
  position: absolute;
  top: 355px;
  left: 83px;
  width: 110px;
  ${(props) => !props.micFlag  && `color: lightgray!important;`}     
  ${(props) => props.darkFlag  &&`
    color:white!important;
      padding-top:6px;
      text-transform: uppercase;
      font-size:10px!important;
  height: 26px;
    &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50px;
    padding: 1px;
    background: linear-gradient(105deg, #0ec88f 7%, #0064ff 51%,#934dfc 93%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
            `}
`
const WriteText = styled.span<{darkFlag:boolean}>`
  position: absolute;
  top: 355px;
  left: 210px;
  width: 110px;  
  ${(props) => props.darkFlag  &&`
    color:white!important;
    div{
      padding-top:6px;
      text-transform: uppercase;
      font-size:10px;
    }  
  height: 26px;
    &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50px;
    padding: 1px;
    background: linear-gradient(105deg, #0ec88f 7%, #0064ff 51%,#934dfc 93%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
            `}
`
const PencilPaperImg = styled.img`
  position: absolute;
  left: 20px;
  top: 16px;
`
const PencilDarkImg = styled.img`
  position: absolute;
  left: 17px;
  top: 18px;
  width: 59px;
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
const PermissionDeniedText = styled.span`
    position: absolute;
    height: 15px;
    width: 400px;
    bottom: 66px;
    left: 0px;
    font-size: 10px!important;
    font-weight: normal!important;
    font-stretch: normal!important;
    font-style: normal!important;
    line-height: normal!important;
    letter-spacing: -0.18px;
    text-align: center;
    color: red!important;
`
