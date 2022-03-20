import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { v4 as uuidv4 } from 'uuid';
import pandaListeningImg from 'src/assets/images/Panda-Listening Pose 1-v12.png'
import pandaListeningImgDark from 'src/assets/images/text-dark/panda-gradient@3x.png'
import pandaListeningImgConsider from 'src/assets/images/Panda-Listening Pose-Turtleneck-v4.png'
import pandaTalkingImg from 'src/assets/images/Panda-Talking Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import arrowImg from 'src/assets/images/arrow.svg'
import bubbleImg from 'src/assets/images/text-dark/bubble@3x.png'
import { Config } from 'src/config/aws';
import { useParams } from "react-router-dom";
import closeDarkImg from 'src/assets/images/input-dark/rectangle-x@3x.png'

import axios from 'axios';

interface AnswerTextProps {
  userId: string,
  darkFlag: boolean,
  onNextClick: (step:number,userId:string, arrCount:number, urlArr:never[]) => void;
  onClosesClick: (flag:boolean) => void;
  onLogClick: (flag:number,questionNumber:number) => void;
}
export default function AnswerText(props:AnswerTextProps) {
  const {userId, onNextClick, onLogClick,onClosesClick, darkFlag} = props;
  const [commetText, setCommentText] = useState('');
  // const [question, setQuestion] = useState("");
  const { partnerId, interviewId } = useParams();
  const interviewArr =  Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0]['interviews'];
  const questionArrObj = interviewArr.filter(item => item.name === interviewId)[0]['questions'];
  const CObj = Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0];
  const partner_name = CObj.partner_name;
  const [circleWidth, setCircleWidth] =useState(33);
  
  // const questionArr = [ 
  //   "",
  //   "If you were giving Jobox a report card, what would score most highly?",
  //   "Where is Jobox falling short on understanding your needs?",
  //   "Is Jobox the primary way you manage all your jobs? If not, what could Jobox do to become your primary way?",
  // ];
  const [hidden, setHidden] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [url, setUrl] = useState([]);
  const createSigned = async() =>{
    axios.defaults.baseURL = Config.api_url;
    axios.post("/input-selector/answer-text", {
      partner:partnerId?.toUpperCase(),
      interview:interviewId,
      user:userId,
      question_number:questionCount
    })
    .then(res => {
      let {data} = res;
      console.log('result111',data)
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
  useEffect(()=>{
    console.log('circlewidth', circleWidth)
    let totalWidth = 200 - questionArrObj.length * 20;
    totalWidth /= questionArrObj.length-1;
    setCircleWidth(totalWidth);
  },[questionArrObj])
  useEffect(()=>{
    console.log('333')
    createSigned();
  },[questionCount]);
  const onCloseClick = () => {
    if(CObj['x_button'] == '1')
      onClosesClick(false);
    else
      onClosesClick(true);
  }
  const uploadFile = async() => {
    console.log("upload", url);
    axios.defaults.baseURL = '';
    axios.put(url[questionCount - 1], commetText).then(res =>{
      console.log('3333333')
      console.log(res);
      console.log('3333333')
    })
    setCommentText('');
    setQuestionCount(questionCount + 1);
    if( questionCount >= questionArrObj.length){
      onNextClick(2,userId, questionArrObj.length, url);
    }
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
    uploadFile();
    // await stopRecording();
  }
  return (
    <>
      {/* <video src={mediaBlobUrl || ''} controls loop/> */}
      <CloseImg onClick={onCloseClick} src={darkFlag?closeDarkImg:closeImg} darkFlag={darkFlag}/>
      <PandaTalkImg src={partnerId?.toUpperCase()== 'ABRR1' ?pandaListeningImgConsider:darkFlag?pandaListeningImgDark:pandaListeningImg}/>
      {hidden && <PandaListenImg src={pandaListeningImg}/>}
      {darkFlag?
      <AnswerBubbleDark>
        <DarkBubbleImg src={bubbleImg} />
        <Message darkFlag={darkFlag}>{questionArrObj[questionCount>questionArrObj.length ? questionArrObj.length - 1 : questionCount - 1]['text']}</Message>
      </AnswerBubbleDark>:
      <AnswerBubble>
        <Message> 
          {questionArrObj[questionCount>questionArrObj.length ? questionArrObj.length - 1 : questionCount - 1]['text']}
        </Message>
        <ArrowImg/>
      </AnswerBubble>
      }
      <ResponseAnswer darkFlag={darkFlag}>
        <textarea value={commetText} onChange={e=> setCommentText(e.target.value)} placeholder={'Type your answer here'}/>
      </ResponseAnswer>
      <Bottom darkFlag={darkFlag}>
        {!darkFlag &&<LabelProgress>Progress</LabelProgress>}
        <ProgressBar>
            <StepCircle darkFlag={darkFlag}active={1 <= questionCount}>1</StepCircle>
            <StepBar darkFlag={darkFlag} active={2 <= questionCount}  circleWidth={circleWidth}/>
            <StepCircle darkFlag={darkFlag}active={2 <= questionCount}>2</StepCircle>
            {questionArrObj.length > 2 && <StepBar  active={3 <= questionCount} circleWidth={circleWidth}darkFlag={darkFlag}/> }
            {questionArrObj.length > 2 && <StepCircle active={3 <= questionCount}darkFlag={darkFlag}>3</StepCircle> }
            {questionArrObj.length > 3 && <StepBar  active={4 <= questionCount} circleWidth={circleWidth}darkFlag={darkFlag}/> }
            {questionArrObj.length > 3 && <StepCircle active={4 <= questionCount}darkFlag={darkFlag}>4</StepCircle> }
            {questionArrObj.length > 4 && <StepBar  active={5 <= questionCount} circleWidth={circleWidth}darkFlag={darkFlag}/> }
            {questionArrObj.length > 4 && <StepCircle active={5 <= questionCount}darkFlag={darkFlag}>5</StepCircle> }
        </ProgressBar>
        {questionCount !== questionArrObj.length ?<Button darkFlag={darkFlag}onClick={()=>nextQuestionFunc(0)}>Next Question {darkFlag?'':'→'}</Button> :
          <Button darkFlag={darkFlag} onClick={()=>nextQuestionFunc(1)}>Finish</Button>
        }
      </Bottom>
      <PoweredBy>
        Powered by PerceptivePanda {partner_name != `` ? `for ` : ``} {partner_name}
      </PoweredBy>
    </>
  )
}
const AnswerBubble = styled.div`
  position: absolute;
  top: 50px;
  background-color: transparent;
  left: 205px;
`
const AnswerBubbleDark = styled.div`
  position: absolute;
  top: 34px;
  background-color: transparent;
  left: 205px;
`
const DarkBubbleImg = styled.img`
    position: absolute;
    left: 13px;
    top: 0px;
    width: 170px;
    height: 154px;
    border: 0;
`
const ResponseAnswer = styled.div<{darkFlag:boolean}>`
  position: absolute;
  left: 35px;
  top: 35px;
  width: 170px;
  height: 300px;
  textarea {
    width: 100%;
    height: 100%;
    ${(props) => props.darkFlag && `
    background-color: #0f1523;
    border: solid 0.5px #2a64ff;
    border-radius: 1px;
    color:white;
    padding: 10px 8px!important;
    font-size:12px !important;
    &:placeholder{
      color:#6f737b!important;
    }
    `}
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
  left: 17px;
  top: 3px;
  width: 163px;
  height: 102px;
  line-height: 1.2;
  text-align: left;
  font-size: 12px;
  font-weight: 900;
  background-color: #ffffff;
  border-radius: 15px;
  border: 1px solid #c4c4c4;
  padding: 10px 10px 15px 15px;
  ${(props) => props.darkFlag && `
    color:white!important;
    background-image: linear-gradient(106deg, rgba(49,49,49,0.84), #111 53%, #000 77%);
    text-align:center;
    border:0px;
    padding: 10px 10px 15px 15px;
    color: white!important;
    left: 24.5px;
    top: 8px;
    border-radius: 0px;
    width: 144px;
    height: 118px;
  `}  
`
const ArrowImg = styled.div`
    position: relative;
  background-image: url("${arrowImg}");
    width: 30px;
    height: 28px;
    top: 0px;
    left: 79px;
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
  position: absolute!important;
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
  ${(props) => props.darkFlag && `background-color: #0f1523; color:#fff;border:1px solid #2a64ff;line-height:18px`}  
  ${(props) => props.darkFlag && props.active &&
  `       box-shadow: 0px 0px 12.5px 7px rgb(0 0 0 / 81%);
    background-color: #05010d;`}
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
