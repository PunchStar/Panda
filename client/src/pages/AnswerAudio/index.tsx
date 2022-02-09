import React, { useState, useEffect } from "react"
import styled from "styled-components"
import {useReactMediaRecorder} from "react-media-recorder";
import { v4 as uuidv4 } from 'uuid';
import microphone from 'src/assets/images/microphone-white.svg';
import microphoneInit from 'src/assets/images/microphone-initial.svg';
import microphoneActive from 'src/assets/images/microphone-active.svg';
import pandaListeningImg from 'src/assets/images/Panda-Listening Pose 1-v12.png'
import pandaTalkingImg from 'src/assets/images/Panda-Talking Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import arrowImg from 'src/assets/images/arrow.svg'
import micVolumeImg1 from 'src/assets/images/bar-1-8.svg'
import micVolumeImg2 from 'src/assets/images/bar-2-8.svg'
import micVolumeImg3 from 'src/assets/images/bar-3-8.svg'
import micVolumeImg4 from 'src/assets/images/bar-4-8.svg'
import micVolumeImg5 from 'src/assets/images/bar-5-8.svg'
import micVolumeImg6 from 'src/assets/images/bar-6-8.svg'
import micVolumeImg7 from 'src/assets/images/bar-7-8.svg'
import micVolumeImg8 from 'src/assets/images/bar-8-8.svg'
import micVolumeImg from 'src/assets/images/bar-0-8.svg'
import { useParams } from "react-router-dom";

// declare var MediaRecorder: any;
import { Config } from 'src/config/aws';
import axios from 'axios';
const configFormData = {     
  headers: { 'content-type': 'multipart/form-data' }
}


interface AnswerAudioProps {
  onNextClick: (step:number,userId:string, arrCount:number, urlArr:never[]) => void;
}
export default function AnswerAudio(props:AnswerAudioProps) {
  const {onNextClick} = props;
  const [url, setUrl] = useState([]);
  const {
    status, startRecording, stopRecording, mediaBlobUrl ,
    previewAudioStream
  } = useReactMediaRecorder({video: false, askPermissionOnMount:false});
  const { partnerId, interviewId } = useParams();
  
  // const [question, setQuestion] = useState("Please tell me what brought you to Datasaur?");
  // const questionArr = [ 
  //   "",
  //   "Please tell me what brought you to Datasaur?",
  //   "What type of project are you working on here?",
  //   "What seems challenging about using Datasaur?",
  //   "What features here are the most useful to you?"
  // ];
  const [hidden, setHidden] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [userId, setUserId] = useState(uuidv4());
  const [micVolume, setMicVolume] = useState(micVolumeImg);
  const [redCircle, setRedCircle] = useState(false);
  const interviewArr =  Config.partner.filter(item => item.partner === partnerId)[0]['interviews'];
  const questionArrObj = interviewArr.filter(item => item.name === interviewId)[0]['questions'];
  let average_volume = 0;
  var volume_timer:any = null;
  let media_recorder:any = null;
  function get_volume_meter(stream:any) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;
    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = function() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;
  
        var length = array.length;
        for (var i = 0; i < length; i++) {
          values += (array[i]);
        }
        average_volume = values / length;
      }
  }
  async function request_recording() {
    if (navigator.mediaDevices.getUserMedia) {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

          if (stream) {
              if (media_recorder == null) {
                  media_recorder = new MediaRecorder(stream);
              }
              get_volume_meter(stream);

              volume_timer = setInterval(function() {
                  let corrected_vol = average_volume * 2;
                  if (corrected_vol >= 100) {
                      corrected_vol = 99;
                  }
                  const num = Math.floor(9 * corrected_vol / 100);
                  // console.log(num);
                  switch(num){
                    case 1:
                      setMicVolume(micVolumeImg1);
                      break;
                    case 2:
                      setMicVolume(micVolumeImg2);
                      break;
                    case 3:
                      setMicVolume(micVolumeImg3);
                      break;
                    case 4:
                      setMicVolume(micVolumeImg4);
                      break;
                    case 5:
                      setMicVolume(micVolumeImg5);
                      break;
                    case 6:
                      setMicVolume(micVolumeImg6);
                      break;
                    case 7:
                      setMicVolume(micVolumeImg7);
                      break; 
                    case 8:
                      setMicVolume(micVolumeImg8);
                      break;
                    default:
                      setMicVolume(micVolumeImg);
                      break;
                  }
                  if (num == 0) {
                    setRedCircle(true);
                    setHidden(false);
                } else {
                  setRedCircle(false);
                  setHidden(true);
                }
              }, 100);

              return true;
          } else {
              return false;
          }
      } catch (e) {
              console.error('Unrecognized error getting device', e);
          return false;
      }
  } else {
      // getUserMedia NOT supported. Yikes.
      console.log('getUserMedia NOT supported');
      return false;
  }
  }
  const createSigned = async() =>{
    axios.defaults.baseURL = Config.api_url;
    axios.post("/input-selector/answer-audio", {
      partner:partnerId,
      interview:interviewId,
      user:userId,
      question_number:questionCount
    })
    .then(res => {
      let {data} = res;
      console.log('result114441',data)
      if(!data.success) {
        let message = `While uploading files, unknown errors was occured!`
        return;
      }
      if(data.url){
        let tempUrl : any= url;
        tempUrl.push(data.url);
        setUrl(tempUrl);
        
      }
    })
    .catch(() => {
    });
  }
  const uploadFile = async() => {
    if(!mediaBlobUrl) return;
    let blob = await fetch(mediaBlobUrl as any).then(r=>r.blob());
    // let formData = new FormData();
    // formData.append(userId +'__' +questionCount, blob);
    // axios.post("/upload/fileUpload", formData, configFormData)
    //   .then(res => {
    //     let {data} = res;
    //     console.log('result',data)
    //     if(!data.success) {
    //       let message = `While uploading files, unknown errors was occured!`
    //       return;
    //     }
    //   })
    //   .catch(() => {
    //   });
    axios.defaults.baseURL = Config.api_url;
    axios.post("/input-selector/answer-audio", {
      partner:partnerId,
      interview:interviewId,
      user:userId,
      question_number:questionCount
    })
    .then(res => {
      let {data} = res;
      console.log('result114441',data)
      if(!data.success) {
        let message = `While uploading files, unknown errors was occured!`
        return;
      }
      if(data.url){
        let tempUrl : any= url;
        tempUrl.push(data.url);
        setUrl(tempUrl);
        axios.defaults.baseURL = '';
        axios.put(data.url, blob).then(res =>{
          console.log('3333333')
          console.log(res);
          console.log('3333333')
        })
        setQuestionCount(questionCount + 1);
        startRecording();
        if( questionCount  >= questionArrObj.length){
          // clearInterval(volume_timer as  any)
          if (volume_timer) {
            clearInterval(volume_timer);
            volume_timer = null;
          }
          onNextClick(2,userId, questionArrObj.length, url);
        }
      }
    })
    .catch(() => {
    });
    
  }
  const nextQuestionFunc = async() => {
    await stopRecording();
  }
  useEffect(()=>{
    console.log('444')
    if(status == 'idle'){
      request_recording();
      startRecording();
     }
  },[])
  // useEffect(()=>{
  //   console.log('333')
  //   if( questionCount  < questionArrObj.length)
  //     createSigned();
  // },[questionCount]);
  useEffect(()=>{
    if(mediaBlobUrl && status == 'stopped'){
      console.log("555", questionCount,mediaBlobUrl )
      uploadFile();
    }
  },[mediaBlobUrl])
  return (
    <>
      {/* <video src={mediaBlobUrl || ''} controls loop/> */}
      <CloseImg src={closeImg}/>
      <PandaTalkImg src={pandaTalkingImg}/>
      {hidden && <PandaListenImg src={pandaListeningImg}/>}
      <Message> 
        {questionArrObj[questionCount>questionArrObj.length?questionArrObj.length - 1:questionCount- 1]['text']}
      </Message>
      <ArrowImg/>
      {hidden && <BlueCircle hidden>
         <img src={microphone} />
      </BlueCircle>}
      <Circle redCircle>
        <img src={microphoneInit} />
        {hidden && <img src={microphoneActive} />}
      </Circle>
      <MicVolume src={micVolume}/>
      <Bottom>
        <LabelProgress>Progress</LabelProgress>
        <ProgressBar>
            <StepCircle active={1 <= questionCount}>1</StepCircle>
            <StepBar  active={2 <= questionCount}/>
            <StepCircle active={2 <= questionCount}>2</StepCircle>
            {questionArrObj.length > 2 && <StepBar  active={3 <= questionCount}/> }
            {questionArrObj.length > 2 && <StepCircle active={3 <= questionCount}>3</StepCircle> }
            {questionArrObj.length > 3 && <StepBar  active={4 <= questionCount}/> }
            {questionArrObj.length > 3 && <StepCircle active={4 <= questionCount}>4</StepCircle> }
            {questionArrObj.length > 4 && <StepBar  active={5 <= questionCount}/> }
            {questionArrObj.length > 4 && <StepCircle active={5 <= questionCount}>5</StepCircle> }
        </ProgressBar>
        {questionCount !== questionArrObj.length ?<Button onClick={nextQuestionFunc}>Next Question →</Button> :
          <Button onClick={nextQuestionFunc}>Finish</Button>
        }
      </Bottom>
      <PoweredBy>
        Powered by PerceptivePanda for {"Datasaur.ai"}
      </PoweredBy>
    </>
  )
}
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
const Circle = styled.div<{redCircle:boolean}>`
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
  ${(props) => props.redCircle && `border: 0px solid #f56f4d;`}   
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
  margin-top: 25px;
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
  color: #fff!important;
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