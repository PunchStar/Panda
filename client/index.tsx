import React, { useState, useEffect , useRef,  ChangeEvent,  SyntheticEvent } from "react"
import styled from "styled-components"
import pandaListeningImg from 'src/assets/images/Panda-Listening Pose 1-v12.png'
import pandaListeningImgDark from 'src/assets/images/text-dark/panda-gradient@3x.png'
import pandaListeningImgConsider from 'src/assets/images/Panda-Listening Pose-Turtleneck-v4.png'
import pandaListeningImgFoqal from 'src/assets/images/Panda-Listening Pose-Foqal-v2.png'
// import pandaTalkingImg from 'src/assets/images/Panda-Talking Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import arrowImg from 'src/assets/images/arrow.svg'
import bubbleImg from 'src/assets/images/text-dark/bubble@3x.png'
import quoteImg from 'src/assets/images/quote.png'
import { Config } from 'src/config/aws';
import { useParams } from "react-router-dom";
import closeDarkImg from 'src/assets/images/input-dark/rectangle-x@3x.png'
import * as actions from '../../actions';
import $ from "jquery"
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
  UseRiveParameters,
  RiveState,
  StateMachineInput,
} from 'rive-react';
// import pandaLiv from './panda_teddy_12.riv';
import axios from 'axios';

const STATE_MACHINE_NAME = 'Login Machine';
const LOGIN_PASSWORD = 'teddy';
const LOGIN_TEXT = 'Login';
var wrapCounter = 1;
var wrapOffset = 0;
var lengthCheck;
var lengthOfTextBox = 1;

interface AnswerTextProps {
  userId: string,
  darkFlag: boolean,
  onNextClick: (step:number,userId:string, arrCount:number, urlArr:never[]) => void;
  onClosesClick: (flag:boolean, questionNumber:number ) => void;
  onLogClick: (flag:number,questionNumber:number) => void;
}
export default function AnswerText(props:AnswerTextProps) {
  const { rive, RiveComponent }: RiveState = useRive({
    src: "panda_teddy_12.riv",
    // stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    // layout: new Layout({
    //   fit: Fit.Cover,
    //   alignment: Alignment.Center,
    // }),
  });
  const {userId, onNextClick, onLogClick,onClosesClick, darkFlag} = props;
  const [commetText, setCommentText] = useState('');
  // const [question, setQuestion] = useState("");
  const { partnerId, interviewId } = useParams();
  const interviewArr =  Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0]['interviews'];
  const questionArrObj = interviewArr.filter(item => item.name === interviewId)[0]['questions'];
  const CObj = Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0];
  const partner_name = CObj.partner_name;
  const [circleWidth, setCircleWidth] =useState(33);
  const inputRef = useRef(null);
  const isCheckingInput: StateMachineInput | null = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    'isChecking'
  );
  const numLookInput: StateMachineInput | null = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    'numLook'
  );
  const trigSuccessInput: StateMachineInput | null = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    'trigSuccess'
  );
  const trigFailInput: StateMachineInput | null = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    'trigFail'
  );
  const isHandsUpInput: StateMachineInput | null = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    'trigFail'
  );
  // const questionArr = [ 
  //   "",
  //   "If you were giving Jobox a report card, what would score most highly?",
  //   "Where is Jobox falling short on understanding your needs?",
  //   "Is Jobox the primary way you manage all your jobs? If not, what could Jobox do to become your primary way?",
  // ];
  const hidden = false;
  const [inputLookMultiplier, setInputLookMultiplier] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const[lineCount, setLineCount] = useState(0);
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
      if(!data.success) {
        let message = `While uploading files, unknown errors was occured!`
        actions.debug_console('uploading',message)
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
    let totalWidth = 200 - questionArrObj.length * 20;
    totalWidth /= questionArrObj.length-1;
    setCircleWidth(totalWidth);
    countLines();
  },[questionArrObj, circleWidth])
  useEffect(()=>{
    createSigned();
  },[questionCount]);
  const onCloseClick = () => {
    if(CObj['x_button'] === '1')
      onClosesClick(false, questionCount);
    else
      onClosesClick(true, questionCount);
  }
  const uploadFile = async() => {
    axios.defaults.baseURL = '';
    axios.put(url[questionCount - 1], commetText).then(res =>{
       actions.debug_console('uploadFile',res)
    })
    setCommentText('');
    setQuestionCount(questionCount + 1);
    if( questionCount >= questionArrObj.length){
      onNextClick(2,userId, questionArrObj.length, url);
    }
  }
  const nextQuestionFunc = async(flag:number,disabled:boolean) => {
    if(disabled) {
      return;
    }
    onLogClick(flag,questionCount);
    if(flag === 1){
      axios.defaults.baseURL = Config.api_url;
      axios.post("/send-audio-generated-email", {
          partner:partnerId?.toUpperCase(),
          interview:interviewId,
          user:userId 
        })
        .then(res => {
          let {data} = res;
          actions.debug_console('result-sendemail',data)
        })
        .catch(() => {
        });
      }
    uploadFile();
    // await stopRecording();
  }
  function textWidth(txt:any, font:any,padding:any) {
    var $span = $('<span></span>');
    $span.css({
      font:font,
      position:'absolute',
      top: -1000,
      left:-1000,
      padding:padding
    }).text(txt);
    $span.appendTo('body');
    return $span.width();
  }
  const onUsernameFocus = () => {
    console.log("dddfocus'", rive)
    isCheckingInput!.value = true;

    if (numLookInput!.value !== commetText.length * inputLookMultiplier) {
      numLookInput!.value = commetText.length * inputLookMultiplier;
    }
  };
  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {

    const newVal = e.target.value;
    setCommentText(newVal);
    if (!isCheckingInput!.value) {
      isCheckingInput!.value = true;
    }
    var numChars = newVal.length - ((wrapCounter-1)*lengthOfTextBox);
    var $txt:any=$('#textbox'),i = 1;
    var font = $txt.css('font');
    
    var padding = $txt.css('padding');
    // var realTxtWidth = wrapCounter * $txt.width();
    var txtwidth = (wrapCounter * $txt.width() || 0) - wrapOffset;
    var txt = $txt.val().split('\n');
    $(txt).each(function(){
      var w = textWidth(this,font,padding);
      if(w?w:0>txtwidth){
        if(wrapCounter === 1) {
          lengthCheck = e.target.value;

          lengthOfTextBox = lengthCheck.length; //actual length of box is closer to 30 than 32
        }
        wrapCounter++;
        // if (typeof(lengthofTextBox) !== 'undefined' && lengthofTextBox != null) {
        //   wrapOffset = wrapOffset + Math.round(lengthofTextBox * .75);
        // }
      }
      i++;
    });


    numLookInput!.value = numChars * inputLookMultiplier;
  };
  useEffect(() => {
    if (inputRef?.current && !inputLookMultiplier) {
      setInputLookMultiplier(
        (inputRef.current as HTMLInputElement).offsetWidth / 100
      );
    }
  }, [inputRef]);
  function countLines(){
    var el = document.getElementById('pandaQuestion')
    var divHeight = el?.offsetHeight || 0;
    var lines = divHeight  / 15;
    console.log('lines', lines);
    setLineCount(lines);
  }
  // return <RiveComponent/>
  return (
    <>
      {/* <video src={mediaBlobUrl || ''} controls loop/> */}
      <CloseImg onClick={onCloseClick} src={darkFlag?closeDarkImg:closeImg} darkFlag={darkFlag}/>
      {/* {darkFlag && <PandaTalkImg src={partnerId?.toUpperCase() === 'ABRR1'?pandaListeningImgConsider:partnerId?.toUpperCase() === "FOQAL"?pandaListeningImgFoqal:darkFlag?pandaListeningImgDark:pandaListeningImg} partnerId={partnerId?.toUpperCase()}/>} */}
      <PandaTalkImgMain src={partnerId?.toUpperCase() === 'ABRR1'?pandaListeningImgConsider:partnerId?.toUpperCase() === "FOQAL"?pandaListeningImgFoqal:darkFlag?pandaListeningImgDark:pandaListeningImg} />
      {/* <RiveComponent className="rive-container" /> */}
      {hidden && <PandaListenImg alt="" src={pandaListeningImg}/>}
      {/* {darkFlag?
      <AnswerBubbleDark>
        <DarkBubbleImg src={bubbleImg} />
        <Message darkFlag={darkFlag} partnerId={partnerId?.toUpperCase()}>
        {darkFlag ?<MessageDark>{questionArrObj[questionCount>questionArrObj.length?questionArrObj.length - 1:questionCount- 1]['text']}</MessageDark>:
          questionArrObj[questionCount>questionArrObj.length ? questionArrObj.length - 1 : questionCount - 1]['text']}
        </Message>
      </AnswerBubbleDark>: */}
      <AnswerBubble>
        {darkFlag && <DarkRectangle/>}

        <MessageMain darkFlag={darkFlag} partnerId={partnerId?.toUpperCase()} >
          <PandaQuote alt="" src={quoteImg} />
          <PandaQuestion darkFlag={darkFlag}  count={lineCount} id="pandaQuestion">
            {questionArrObj[questionCount>questionArrObj.length ? questionArrObj.length - 1 : questionCount - 1]['text']}
          </PandaQuestion>
        </MessageMain>
      </AnswerBubble>
      {/* } */}
      {/* {darkFlag ?<ResponseAnswer>
        <textarea value={commetText} autoFocus onChange={e=> setCommentText(e.target.value)} placeholder={'Type your answer here'}/>
      </ResponseAnswer>: */}
      <ResponseAnswerMain darkFlag={darkFlag}>
        <textarea  id="textbox" value={commetText}  onChange={e=> setCommentText(e.target.value)} placeholder={'Type your answer here'}
                />
                {/* <textarea  id="textbox" value={commetText}  onChange={e=>{onUsernameChange(e)}} placeholder={'Type your answer here'}
                onFocus={onUsernameFocus}
                onBlur={() => (isCheckingInput!.value = false)}
                ref={inputRef}
                /> */}
      </ResponseAnswerMain>
      {/* } */}
      <Bottom darkFlag={darkFlag}>
        {!darkFlag &&<LabelProgress>Progress</LabelProgress>}
        <ProgressBar>
            <StepCircle darkFlag={darkFlag} active={1 === questionCount} passed={0 < questionCount}>1</StepCircle>
            <StepBar darkFlag={darkFlag} active={2 <= questionCount}  circleWidth={circleWidth}/>
            <StepCircle darkFlag={darkFlag} active={2 === questionCount} passed={1 < questionCount}>2</StepCircle>
            {questionArrObj.length > 2 && <StepBar active={3 <= questionCount} circleWidth={circleWidth} darkFlag={darkFlag}/> }
            {questionArrObj.length > 2 && <StepCircle active={3 === questionCount} darkFlag={darkFlag} passed={2 < questionCount}>3</StepCircle> }
            {questionArrObj.length > 3 && <StepBar active={4 <= questionCount} circleWidth={circleWidth} darkFlag={darkFlag}/> }
            {questionArrObj.length > 3 && <StepCircle active={4 === questionCount}darkFlag={darkFlag} passed={3 < questionCount}>4</StepCircle> }
            {questionArrObj.length > 4 && <StepBar active={5 <= questionCount} circleWidth={circleWidth} darkFlag={darkFlag}/> }
            {questionArrObj.length > 4 && <StepCircle active={5 === questionCount}darkFlag={darkFlag} passed={4 < questionCount}>5</StepCircle> }
        </ProgressBar>
        {questionCount !== questionArrObj.length ?<Button darkFlag={darkFlag} onClick={()=>nextQuestionFunc(0, commetText === ''?true:false)} disabled={commetText === ''?true:false}>Next Question {darkFlag?'':'→'}</Button> :
          <Button darkFlag={darkFlag} onClick={()=>nextQuestionFunc(1, commetText === ''?true:false)} greenColor disabled={commetText === ''?true:false}>Finish</Button>
        }
      </Bottom>
      <PoweredBy>
        Powered by PerceptivePanda {partner_name !== `` ? `for ` : ``} {partner_name}
      </PoweredBy>
    </>
  )
}
const AnswerBubble = styled.div`
  position: absolute;
  top: 146px;
  background-color: transparent;
  left: 15px;
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
const ResponseAnswer = styled.div`
  position: absolute;
  left: 35px;
  top: 35px;
  width: 170px;
  height: 300px;
  textarea {
    width: 100%;
    height: 100%;
    background-color: #0f1523;
    border: solid 0.5px #2a64ff;
    border-radius: 1px;
    color:white;
    padding: 10px 8px!important;
    font-size:12px !important;
    &:placeholder{
      color:#6f737b!important;
    }
  }
  ::-webkit-resizer{
    border:2px solid yellow;
  }
`
const ResponseAnswerMain = styled.div<{darkFlag?:boolean}>`
  position: absolute;
  left: 32px;
  top: 195px;
  width: 330px;
  height: 166px;
  textarea {
    width: 100%;
    border:0px;
    height: 100%;
    border: 1px solid #c4c4c4;
    border-radius: 6px;
    padding: 10px 10px 15px 15px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    caret-color:#399aff;
    font-size:13px;
    ${(props) => props.darkFlag && `
        background-color: #0f1523;
        border: solid 0.5px #2a64ff;
        border-radius: 1px;
        color:white;
        padding: 10px 8px!important;
        font-size:12px !important;
        border-top:0px;
        &:placeholder{
          color:#6f737b!important;
        }
    `}
  }
  &:focus-visible{
    outline:0px!important
  }
  textarea:focus-visible{
    outline:0px!important
  }
`
const PandaTalkImg = styled.img<{partnerId:any}>`
  position: absolute;
  left: 220px;
  top: 180px;
  height: 208px;
  z-index: 1;
  ${(props) => props.partnerId === "FOQAL" && `
    top: 230px;
    height: 156px;
  `}
`
const PandaTalkImgMain = styled.img`
  position: absolute;
  left: 119px;
  top: 8px;
  height: 201px;
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
  width: 28px;
  height: 16px;
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
const Message = styled.div<{darkFlag?:boolean, partnerId:any}>`
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
  padding: 10px 10px 10px 10px;
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
  ${(props) => props.partnerId === "FOQAL" && `
    height: 155px;
  `}
`
const MessageMain = styled.div<{darkFlag?:boolean,partnerId:any}>`
  position: relative;
  left: 17px;
  top: 3px;
  width: 330px;
  height: 47px;
  line-height: 1.2;
  text-align: left;
  font-size: 12px;
  font-weight: 900;
  background-color: #f6f9fe;
  border-radius: 6px;
  border: 1px solid #c4c4c4;
  padding: 10px 10px 15px 15px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  ${(props) => props.darkFlag && `
    color:white!important;
    background-image: linear-gradient(106deg, rgba(49,49,49,0.84), #111 53%, #000 77%);
    border:0px;
    color: white!important;
    border-radius: 0px;
    left: 24px;
    top: 6px;
    width: 309px;
    height: 36px;
    padding: 8px 8px 11px 7px;
  `}
${(props) => props.partnerId === "FOQAL" && `
  height: 155px;
`}
`
const PandaQuote = styled.img`
  width: 16px;
  margin-top: -5px;
`;
const PandaQuestion = styled.span<{darkFlag?:boolean,count:number}>`
  color: #000 !important;
  text-align: left !important;
  clear: both;
  display: -webkit-box;
  padding-left: 24px;
  line-height:15px!important;
  margin-top: -17px;
  font-size:12.5px!important;
  ${(props) => props.count > 2 && `font-size:10px!important`}   
  ${(props) => props.darkFlag && `color: #FFF!important;padding-left: 20px;`}   
`;
const MessageDark = styled.span`
  background:none;
  color:white!important;
  position: absolute;
  width:90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`
const ArrowImg = styled.div`
  position: relative;
  background-image: url("${arrowImg}");
  width: 30px;
  height: 28px;
  top: 0px;
  left: 79px;
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
  font-family: 'Soleil', sans-serif!important;
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
const StepCircle = styled.div<{active?:boolean, darkFlag?:boolean, passed?:boolean}>`
  background-color: transparent;
  border:1px solid #b1bdd4;
  height: 20px;
  width: 20px;
  line-height: 19px;
  border-radius: 50%;
  font-size: 10px;
  color: #929292;
  text-align: center;
  ${(props) => props.passed && `border-color:#399aff;background-color: #399aff;color: #fff;`}
  ${(props) => props.darkFlag && `border-color:#0f1523;background-color: #0f1523; color:#fff;border:1px solid #2a64ff;line-height:17px;`}
  ${(props) => props.darkFlag && !props.active && props.passed && `border-color:#0f1523;background-color: #0f1523; color:#fff;border:1px solid #0ec88f;line-height:17px;`}  
  ${(props) => props.darkFlag && props.active &&
  `box-shadow: 0 0 4px 0 #934dfc;
  border: solid 0.5px #0ec88f;
  background-color: #04153e;border-color:#04153e;`}
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
const Button = styled.span<{darkFlag:boolean, greenColor?:boolean, disabled?:boolean}>`
  position: absolute;
  padding: 5px 0 5px 0;
  margin: 0 0 0 0;
  border-radius: 10px;
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
    ${(props)=> props.greenColor && ' background-color: #4bc33d!important;'}
    ${(props)=> props.disabled && ` opacity: 0.2;
    cursor: default;
    pointer-events: none;`}
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
const DarkRectangle = styled.div`
  position: absolute;
  width: 330px;
  height: 49px;
  left: 17px;
  border-style: solid;
  border-width: 0.5px;
  border-image-source:linear-gradient(106deg, #934dfc 14%, #0064ff 42%, #0ec88f 72%);
  border-image-slice:1;
  background-color: #05010d;  
`