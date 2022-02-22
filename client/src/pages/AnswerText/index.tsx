import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { v4 as uuidv4 } from 'uuid';
import pandaListeningImg from 'src/assets/images/Panda-Listening Pose 1-v12.png'
import pandaTalkingImg from 'src/assets/images/Panda-Talking Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import arrowImg from 'src/assets/images/arrow.svg'
import { Config } from 'src/config/aws';
import { useParams } from "react-router-dom";

import axios from 'axios';
const configFormData = {     
  headers: { 'content-type': 'multipart/form-data' }
}


interface AnswerTextProps {
  onNextClick: (step:number,userId:string, arrCount:number, urlArr:never[]) => void;
  onClosesClick: (flag:boolean) => void;
  onLogClick: (flag:number,questionNumber:number) => void;
}
export default function AnswerText(props:AnswerTextProps) {
  const {onNextClick, onLogClick,onClosesClick} = props;
  const [commetText, setCommentText] = useState('');
  // const [question, setQuestion] = useState("");
  const { partnerId, interviewId } = useParams();
  const interviewArr =  Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0]['interviews'];
  const questionArrObj = interviewArr.filter(item => item.name === interviewId)[0]['questions'];
  const CObj = Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0];
  
  // const questionArr = [ 
  //   "",
  //   "If you were giving Jobox a report card, what would score most highly?",
  //   "Where is Jobox falling short on understanding your needs?",
  //   "Is Jobox the primary way you manage all your jobs? If not, what could Jobox do to become your primary way?",
  // ];
  const [hidden, setHidden] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [userId, setUserId] = useState(uuidv4());
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
    // const file = new Blob([commetText], {type:'text.plain'});
    // setCommentText('');
    // let formData = new FormData();
    // formData.append(userId +'__' +questionCount, file);
    // axios.post("/upload/fileTextUpload", formData, configFormData)
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
      <CloseImg onClick={onCloseClick}src={closeImg}/>
      <PandaTalkImg src={pandaTalkingImg}/>
      {hidden && <PandaListenImg src={pandaListeningImg}/>}
      <AnswerBubble>
        <Message> 
          {questionArrObj[questionCount>questionArrObj.length ? questionArrObj.length - 1 : questionCount - 1]['text']}
        </Message>
        <ArrowImg/>
      </AnswerBubble>
      <ResponseAnswer>
        <textarea value={commetText} onChange={e=> setCommentText(e.target.value)}/>
      </ResponseAnswer>
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
        {questionCount !== questionArrObj.length ?<Button onClick={()=>nextQuestionFunc(0)}>Next Question →</Button> :
          <Button onClick={()=>nextQuestionFunc(1)}>Finish</Button>
        }
      </Bottom>
      <PoweredBy>
        Powered by PerceptivePanda for {partnerId?.toUpperCase()}
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
const ResponseAnswer = styled.div`
  position: absolute;
  left: 35px;
  top: 35px;
  width: 170px;
  height: 300px;
  textarea {
    width: 100%;
    height: 100%;
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
  padding: 15px 10px 30px 15px;
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