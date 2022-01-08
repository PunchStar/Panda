import React, { useState, useEffect } from "react"
import styled from "styled-components"
import {useReactMediaRecorder} from "react-media-recorder";
import { useNavigate } from 'react-router-dom';
import microphone from 'src/assets/images/microphone-white.svg';
import microphoneInit from 'src/assets/images/microphone-initial.svg';
import microphoneActive from 'src/assets/images/microphone-active.svg';
import pandaListeningImg from 'src/assets/images/Panda-Listening Pose 1-v12.png'
import pandaTalkingImg from 'src/assets/images/Panda-Talking Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import arrowImg from 'src/assets/images/arrow.svg'
import micVolumeImg from 'src/assets/images/bar-0-8.svg'
import { Config } from 'src/config/aws';
import { RadarController } from "chart.js";
import axios from 'axios';
const configFormData = {     
  headers: { 'content-type': 'multipart/form-data' }
}
axios.defaults.baseURL = Config.api_url;
export default function AnswerAudio() {
  const {
    status, startRecording, stopRecording, mediaBlobUrl 
  } = useReactMediaRecorder({video: false, askPermissionOnMount:false});
  const [question, setQuestion] = useState("Please tell me what brought you to Datasaur?");
  const [hidden, setHidden] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  let naviage = useNavigate();
  const uploadFile = () => {
    axios.post("/upload/fileUpload", mediaBlobUrl, configFormData)
      .then(res => {
        let {data} = res;
        console.log('result',data)
        if(!data.success) {
          let message = `While uploading files, unknown errors was occured!`
          console.log('dd', message)
          return;
        }
      })
      .catch(() => {
      });
    setQuestionCount(questionCount + 1);
    startRecording();
  }
  const nextQuestionFunc = async() => {
    console.log('status', status);
    await stopRecording();
    console.log('status11', status);
    if( questionCount >= 4){
      console.log('333')
      naviage('/thank-you')
    }

  }
  useEffect(()=>{
    if(status == 'idle'){
      startRecording();
      console.log('33')
    }
  },[])
  useEffect(()=>{
    if(mediaBlobUrl && status == 'stopped'){
      console.log("444", questionCount,mediaBlobUrl )
      uploadFile();
    }
  },[mediaBlobUrl])
  return (
    <AnswerAudioWrapper>
      {/* <video src={mediaBlobUrl || ''} controls loop/> */}
      <CloseImg src={closeImg}/>
      <PandaTalkImg src={pandaTalkingImg}/>
      {hidden && <PandaListenImg src={pandaListeningImg}/>}
      <Message> 
        {question}
      </Message>
      <ArrowImg/>
      {hidden && <BlueCircle hidden>
         <img src={microphone} />
      </BlueCircle>}
      <Circle>
        <img src={microphoneInit} />
        {hidden && <img src={microphoneActive} />}
      </Circle>
      <MicVolume src={micVolumeImg}/>
      <Bottom>
        <LabelProgress>Progress</LabelProgress>
        <ProgressBar>
            <StepCircle active={1 <= questionCount}>1</StepCircle>
            <StepBar  active={2 <= questionCount}/>
            <StepCircle active={2 <= questionCount}>2</StepCircle>
            <StepBar  active={3 <= questionCount}/>
            <StepCircle active={3 <= questionCount}>3</StepCircle>
            <StepBar  active={4 <= questionCount}/>
            <StepCircle active={4 <= questionCount}>4</StepCircle>
        </ProgressBar>
        {questionCount !== 4 ?<Button onClick={nextQuestionFunc}>Next Question →</Button> :
          <Button onClick={nextQuestionFunc}>Finish</Button>
        }
      </Bottom>
      <PoweredBy>
        Powered by PerceptivePanda for {"Datasaur.ai"}
      </PoweredBy>
    </AnswerAudioWrapper>
  )
}
const AnswerAudioWrapper = styled.div`
    position: absolute;
    width: 400px;
    height: 450px;
    padding: 0;
    top: 50%;
    left: 50%;
    margin: -225px 0 0 -200px;
    opacity: 1.0;
    border-radius: 10px;
    box-shadow: 0 0 12.5px -1px rgb(0 0 0 / 10%);       
    background-color: #e6eefd;
    @media(min-width: 1000px){
        transform: scale(1.7);
    }
`
const PandaTalkImg = styled.img`
  position: absolute;
  left: 220px;
  top: 180px;
  height: 208px; z-index: 1;
`
const PandaListenImg = styled.img`
  position: absolute;
  left: 220px;
  top: 180px;
  height: 208px;
  z-index: 1;
  display: none;
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
  position: relative;
  left: 35px;
  top: 55px;
  width: 330px;
  text-align: left;
  height: auto;
  line-height: 1.2;
  text-align: left;
  font-size: 12px;
  background-color: #ffffff;
  border-radius: 15px;
  border: 1px solid #c4c4c4;
  padding: 15px 10px 30px 15px;
`
const ArrowImg = styled.div`
    position: relative;
    background-image: url("${arrowImg}");
    width: 30px;
    height: 28px;
    top: 52px;
    left: 330px;
`
const BlueCircle = styled.div`
  position: absolute;
  left: 89px;
  top: 230px;
  height: 65px;
  width: 65px;
  background-color: #399aff;
  border-radius: 50%;
  cursor: pointer; 
  img {
    position: absolute;
    left: 21px;
    top: 15px;
  }
`
const Circle = styled.div`
  position: absolute;
  left: 83px;
  top: 223px;
  height: 76px;
  width: 76px;
  border-radius: 50%;
  cursor: pointer;
  img {
    position: absolute;
    left: 6px;
    top: 6px;
  }
`
const MicVolume = styled.img`
  position: absolute;
  left: 61px;
  top: 203px;
`
const Bottom = styled.div`
  position: absolute;
  top: 380px;
  left: 0px;
  width: 100%;
  height: 81px;
  background-color: white;
  border-radius: 0 0 10px 10px;
  opacity: 1.0;
  border-top: solid 1px #ccc;
`
const LabelProgress = styled.span`
  position: absolute;
  left: 35px;
  top: 5px;
  width: 90px;
  font-family: 'Muli', sans-serif;
  font-size: 8px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: 0.31px;
  text-align: left;
  color: #a5a5a5;
  text-transform: uppercase;
`
const ProgressBar = styled.div`
  display: flex;
  margin-left: 35px;
  margin-top: 18px;
`
const StepCircle = styled.div<{active?:boolean}>`
  background-color: #b1bdd4;
  height: 20px;
  width: 20px;
  line-height: 20px;
  border-radius: 50%;
  font-size: 10px;
  color: #929292;
  text-align: center;
  ${(props) => props.active && `background-color: #399aff;color: #fff;`}   
`
const StepBar = styled.div<{active?:boolean}>`
  background-color: #b1bdd4;
  height: 3px;
  width: 33.333333333333336px;
  margin-top: auto;
  margin-bottom: auto;
  ${(props) => props.active && `background-color: #399aff;color: #fff;`}   
`
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
  left: 230px;
  top: 25px;
  width: 140px;
  text-decoration: none;
  font-size: 13px;
  line-height: 20px;
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