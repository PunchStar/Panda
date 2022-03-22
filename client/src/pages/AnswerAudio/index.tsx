import React, { useState, useEffect } from "react"
import styled from "styled-components"
import {useReactMediaRecorder} from "react-media-recorder";
import { v4 as uuidv4 } from 'uuid';
import microphone from 'src/assets/images/microphone-white.svg';
import microphoneInit from 'src/assets/images/microphone-initial.svg';
import micrphoneDark from 'src/assets/images/audio-states/icon-9@3x.png';
import micrphoneCircleDark from 'src/assets/images/audio-states/inner-circle-9@3x.png';
import microphoneActive from 'src/assets/images/microphone-active.svg';
import pandaListeningImgConsider from 'src/assets/images/Panda-Listening Pose-Turtleneck-v4.png'
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
import darkMicVolumeImg1 from 'src/assets/images/audio-states/volume-2@3x.png'
import darkMicVolumeImg2 from 'src/assets/images/audio-states/volume-3@3x.png'
import darkMicVolumeImg3 from 'src/assets/images/audio-states/volume-4@3x.png'
import darkMicVolumeImg4 from 'src/assets/images/audio-states/volume-5@3x.png'
import darkMicVolumeImg5 from 'src/assets/images/audio-states/volume-6@3x.png'
import darkMicVolumeImg6 from 'src/assets/images/audio-states/volume-7@3x.png'
import darkMicVolumeImg7 from 'src/assets/images/audio-states/volume-8@3x.png'
import darkMicVolumeImg8 from 'src/assets/images/audio-states/volume-9@3x.png'
import darkMicVolumeImg  from 'src/assets/images/audio-states/volume@3x.png'
import { useParams }  from "react-router-dom";
import closeDarkImg from 'src/assets/images/input-dark/rectangle-x@3x.png'
import pandaDarkTalkImg from 'src/assets/images/audio-dark/panda-gradient@3x.png'
import bubbleDarkImg from 'src/assets/images/audio-dark/bubble-full@3x.png';

// declare var MediaRecorder: any;
import { Config } from 'src/config/aws';
  import axios from 'axios';

  interface AnswerAudioProps {
  userId: string,
  darkFlag: boolean,
  onNextClick: (step:number,userId:string, arrCount:number) => void;
  onLogClick: (flag:number,questionNumber:number) => void;
  onClosesClick: (flag:boolean) => void;
}
export default function AnswerAudio(props:AnswerAudioProps) {
  const {userId, onNextClick, onLogClick, onClosesClick, darkFlag} = props;
  // const [url, setUrl] = useState([]);
  const {
    status, startRecording, stopRecording, mediaBlobUrl, previewAudioStream,
  } = useReactMediaRecorder({video: false, askPermissionOnMount:false});
  const { partnerId, interviewId } = useParams();
  const [circleWidth, setCircleWidth] =useState(33);
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
  const [micVolume, setMicVolume] = useState(darkFlag?darkMicVolumeImg:micVolumeImg);
  const [redCircle, setRedCircle] = useState(false);
  const interviewArr =  Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0]['interviews'];
  const questionArrObj = interviewArr.filter(item => item.name === interviewId)[0]['questions'];
  const CObj = Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0];
  const partner_name = CObj.partner_name;
  let average_volume = 0;
  var volume_timer:any = null;
  const [volumeTimer, setVolumeTimer] = useState();
  // const [media_recorder, setMediaRecorder] = useState<MediaRecorder>();

  function get_volume_meter(stream:any) {
    console.log('---average_volume----')
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
            get_volume_meter(previewAudioStream);

            volume_timer = setInterval(function() {
                let corrected_vol = average_volume * 2;
                if (corrected_vol >= 100) {
                    corrected_vol = 99;
                }
                const num = Math.floor(9 * corrected_vol / 100);
                switch(num){
                  case 1:
                    setMicVolume(darkFlag?darkMicVolumeImg1:micVolumeImg1);
                    break;
                  case 2:
                    setMicVolume(darkFlag?darkMicVolumeImg2:micVolumeImg2);
                    break;
                  case 3:
                    setMicVolume(darkFlag?darkMicVolumeImg3:micVolumeImg3);
                    break;
                  case 4:
                    setMicVolume(darkFlag?darkMicVolumeImg4:micVolumeImg4);
                    break;
                  case 5:
                    setMicVolume(darkFlag?darkMicVolumeImg5:micVolumeImg5);
                    break;
                  case 6:
                    setMicVolume(darkFlag?darkMicVolumeImg6:micVolumeImg6);
                    break;
                  case 7:
                    setMicVolume(darkFlag?darkMicVolumeImg7:micVolumeImg7);
                    break; 
                  case 8:
                    setMicVolume(darkFlag?darkMicVolumeImg8:micVolumeImg8);
                    break;
                  default:
                    setMicVolume(darkFlag?darkMicVolumeImg:micVolumeImg);
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
            setVolumeTimer(volume_timer);
            return true;
      //     } 
      //     else {
      //         return false;
      //     }
      // } catch (e) {
      //         console.error('Unrecognized error getting device', e);
      //     return false;
      // }
  // } else {
  //     // getUserMedia NOT supported. Yikes.
  //     console.log('getUserMedia NOT supported');
  //     return false;
  // }
  }
  const onCloseClick = () => {
    if(CObj['x_button'] == '1')
      onClosesClick(false);
    else
      onClosesClick(true);
  }
  const uploadFile = async() => {
    if(!mediaBlobUrl) return;
    let blob = await fetch(mediaBlobUrl as any).then(r=>r.blob());
    // const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
    const file = new File([blob], 'audio.ogg', { type: 'audio/ogg; codecs=opus' });
    axios.defaults.baseURL = Config.api_url;
    axios.post("/input-selector/answer-audio", {
      partner:partnerId?.toUpperCase(),
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
        axios.defaults.baseURL = '';
        axios.put(data.url, file).then(res =>{
          console.log('3333333')
          console.log(res);
          console.log('3333333')
        })
        setQuestionCount(questionCount + 1);
        if(questionCount  < questionArrObj.length) {
          startRecording();
          console.log('--startrecord---')
        }
        if( questionCount  >= questionArrObj.length){
          clearInterval(volumeTimer);
          // if (volume_timer) {
          //   clearInterval(volume_timer);
          //   volume_timer = null;
          // }
          console.log('status', status)
          onNextClick(2, userId, questionArrObj.length);
        }
      }
    })
    .catch(() => {
    });
    
  }
  const nextQuestionFunc = async(flag:number) => {
    onLogClick(flag,questionCount);
    if(flag == 1){
    axios.defaults.baseURL = Config.api_url;
    axios.post("/send-audio-generated-email", {
        partner:partnerId?.toUpperCase(),
        interview:interviewId,
        user:userId 
      })
      .then(res => {
        let {data} = res;
        console.log('result-sendemail',data)
      })
      .catch(() => {
      });
    }
    await stopRecording();
  }
  useEffect(() => {
    console.log('444',status)
    if(status == 'idle') {
      // request_recording();
      startRecording()
     }
     if(status == 'recording' && previewAudioStream){
      if(volumeTimer)
        clearInterval(volumeTimer);
      request_recording()
        // previewAudioStream.onaddtrack = (event) => {
        //   console.log('onaddtracn')
        //   console.log(event )
        // }
      console.log('track');
     }
  },[status])
  useEffect(()=>{
    console.log('circlewidth', circleWidth)
    let totalWidth = 200 - questionArrObj.length * 20;
    totalWidth /= questionArrObj.length-1;
    setCircleWidth(totalWidth);
  },[questionArrObj])
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
      <CloseImg onClick={onCloseClick} src={darkFlag?closeDarkImg:closeImg} darkFlag={darkFlag}/>
      <PandaTalkImg src={partnerId?.toUpperCase()== 'ABRR1' ?pandaListeningImgConsider:darkFlag?pandaDarkTalkImg:pandaListeningImg}/>
      {hidden && <PandaListenImg src={pandaListeningImg}/>}
      {darkFlag && <DarkBubbleImg src={bubbleDarkImg} />}
      <Message darkFlag={darkFlag}> 
        {darkFlag ?<MessageDark>{questionArrObj[questionCount>questionArrObj.length?questionArrObj.length - 1:questionCount- 1]['text']}</MessageDark>:questionArrObj[questionCount>questionArrObj.length?questionArrObj.length - 1:questionCount- 1]['text']}
      </Message>
      {!darkFlag&&<ArrowImg/>}
      
      {hidden && <BlueCircle hidden>
         <img src={microphone} />
      </BlueCircle>}
      <Circle redCircle>
      {!darkFlag ? <img src={microphoneInit} /> : 
        <DarkMicrophone>
          <DarkMicrophoneCircle src={micrphoneCircleDark}/>
          <DarkMicrophoneMain src={micrphoneDark}/>
        </DarkMicrophone>
       }
        {hidden && !darkFlag &&<img src={microphoneActive} />}
      </Circle>
      <MicVolume src={micVolume} darkFlag={darkFlag}/>
      <Bottom darkFlag={darkFlag}>
        {!darkFlag &&<LabelProgress>Progress</LabelProgress>}
        <ProgressBar>
            <StepCircle active={1 <= questionCount} darkFlag={darkFlag}>1</StepCircle>
            <StepBar  active={2 <= questionCount}  circleWidth={circleWidth} darkFlag={darkFlag}/>
            <StepCircle active={2 <= questionCount} darkFlag={darkFlag}>2</StepCircle>
            {questionArrObj.length > 2 && <StepBar  active={3 <= questionCount} circleWidth={circleWidth} darkFlag={darkFlag}/> }
            {questionArrObj.length > 2 && <StepCircle active={3 <= questionCount} darkFlag={darkFlag}>3</StepCircle> }
            {questionArrObj.length > 3 && <StepBar  active={4 <= questionCount} circleWidth={circleWidth} darkFlag={darkFlag}/> }
            {questionArrObj.length > 3 && <StepCircle active={4 <= questionCount} darkFlag={darkFlag}>4</StepCircle> }
            {questionArrObj.length > 4 && <StepBar  active={5 <= questionCount} circleWidth={circleWidth} darkFlag={darkFlag}/> }
            {questionArrObj.length > 4 && <StepCircle active={5 <= questionCount} darkFlag={darkFlag}>5</StepCircle> }
        </ProgressBar>
        {questionCount !== questionArrObj.length ?<Button onClick={()=>nextQuestionFunc(0)} darkFlag={darkFlag}>Next Question →</Button> :
          <Button onClick={()=>nextQuestionFunc(1)} darkFlag={darkFlag}>Finish</Button>
        }
      </Bottom>
      <PoweredBy>
        Powered by PerceptivePanda {partner_name != `` ? `for ` : ``} {partner_name}
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
const DarkBubbleImg = styled.img`
  position: absolute;
  margin: 4px 10px 81px 10px;
  left: 25px;
  top: 20px;
  width: 343px;
  height: 183px;
  object-fit: contain;
  border: 0;
`
const PandaListenImg = styled.img`
  position: absolute;
  left: 220px;
  top: 180px;
  height: 208px;
  z-index: 1;
  display: none;
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
const Message = styled.div<{darkFlag?:boolean}>`
  position: relative;
  left: 35px;
  top: 55px;
  width: 330px;
  text-align: left;
  height: auto;
  line-height: 1.2;
  text-align: left;
  font-size: 12px;
  font-weight: 900;
  background-color: #ffffff;
  border-radius: 15px;
  border: 1px solid #c4c4c4;
  padding: 15px 10px 30px 15px;
  ${(props) => props.darkFlag && `
    color: transparent;
    background-image: linear-gradient(106deg, rgba(49,49,49,0.84), #111 53%, #000 77%);
    top: 52px;
    border:0px solid;
    left:46px;
    border-radius:0px;
    width: 320px;
    padding:0px;
    height: 108px;
  `} 
`
const MessageDark = styled.span`
  background:none;
  color:white!important;
  position: absolute;
  font-size:17px!important;
  width:80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
const MicVolume = styled.img<{darkFlag:boolean}>`
  position: absolute;
  left: 61px;
  top: 203px;
  ${(props) => props.darkFlag && `width:124px;`}   

`
const Bottom = styled.div<{darkFlag:boolean}>`
  position: absolute;
  top: 380px;
  left: 0px;
  width: 100%;
  height: 81px;
  background-color: white;
  border-radius: 0 0 10px 10px;
  opacity: 1.0;
  border-top: solid 1px #ccc;
  ${(props) => props.darkFlag && `background-color: #0f1523;color: #fff;border-top:0px solid!important;`}   
`
const LabelProgress = styled.span`
  position: absolute;
  left: 35px!important;
  top: 5px!important;
  width: 90px!important;
  font-family: 'Muli', sans-serif!important;
  font-size: 8px!important;
  font-weight: bold!important;
  font-stretch: normal!important;
  font-style: normal!important;
  line-height: 1.29!important;
  letter-spacing: 0.31px!important;
  text-align: left!important;
  color: #a5a5a5!important;
  text-transform: uppercase!important;
`
const ProgressBar = styled.div`
  display: flex;
  margin-left: 35px;
  margin-top: 25px;

`
const StepCircle = styled.div<{active?:boolean, darkFlag?:boolean}>`
  background-color: #b1bdd4;
  height: 20px;
  width: 20px;
  line-height: 20px;
  border-radius: 50%;
  font-size: 10px;
  color: #929292;
  text-align: center;
  ${(props) => props.active && `background-color: #399aff;color: #fff;`}   
  ${(props) => props.darkFlag && `background-color: #0f1523; color:#fff;border:1px solid #2a64ff;line-height:17px;`}  
  ${(props) => props.darkFlag && props.active &&
  `      box-shadow: 0 0 4px 0 #934dfc;
  border: solid 0.5px #2a64ff;
  background-color: #04153e;`}
`
const StepBar = styled.div<{active?:boolean, circleWidth?:number, darkFlag?:boolean}>`
  background-color: #b1bdd4;
  height: 3px;
  // width: 33.333333333333336px;
  margin-top: auto;
  margin-bottom: auto;
  ${(props) => props.active && `background-color: #399aff;color: #fff;`}   
  ${(props) => props.circleWidth && `width: ${props.circleWidth}px;`}   
  ${(props) => props.darkFlag && `height:1px; background-color:#2a64ff;`}   
`
const Button = styled.span<{darkFlag:boolean}>`
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
  left: 247px;
  top: 33px;
  width: 140px;
  text-decoration: none;
  font-size: 13px;
  line-height: 20px;
  ${(props) => props.darkFlag  &&`
    color:white!important;
      padding-top:6px;
      text-transform: uppercase;
      font-size:10px!important;
  height: 26px;
  background:transparent;
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
const PoweredBy = styled.span`
  position: absolute;
  height: 15px;
  width: 400px;
  top: 440px;
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
const DarkMicrophone = styled.div`
    &:before {
    content: "";
    position: absolute;
    width: 101px;
    height: 101px;
    left: -10px!important;
    top: -8px!important;
    inset: 0;
    border-radius: 50px;
    padding: 1px;
    background: linear-gradient(105deg, #0ec88f 7%, #0064ff 51%,#934dfc 93%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    }
`
const DarkMicrophoneMain = styled.img`
    position: absolute;
    left: 23px!important;
    top: 14px!important;
    width: 35px!important;
`
const DarkMicrophoneCircle = styled.img`
    position:absolute;
    width: 90px!important;
    height: 90px!important;
    left: -5px!important;
    top: -3px!important;
`