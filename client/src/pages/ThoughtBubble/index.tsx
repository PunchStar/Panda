import React, { useState, useEffect  } from "react";
import styled from "styled-components"
import panda from 'src/assets/images/panda@3x.png';
import thought from 'src/assets/images/thought-bubble-gray.svg';
import closeImg from 'src/assets/images/x.svg'
import Thankyou from "../Thankyou";
import { useParams } from "react-router-dom";
import { Config } from 'src/config/aws';
import * as actions from '../../actions';
import {v4 as uuidv4} from 'uuid';

export default function ThoughtBubble() {
  const [closeFlag, setCloseFlag] = useState(false);
  const { partnerId, interviewId, user } = useParams();
  const interviewArr =  Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0]['interviews'];
  const CObj = Config.partner.filter(item => item.partner === partnerId?.toUpperCase())[0];
  const thank_you_text = interviewArr.filter(item => item.name === interviewId)[0].thank_you_text || "Thank you for sharing your insights!";
  const partner_name = CObj.partner_name;
  const darkFlag = partnerId?.toUpperCase() === 'DATASAUR' ? true : false;
  const userId = generateUSER(user);

  window.setTimeout(() => {
    actions.log_event('thought-bubble', '', '0', partnerId?.toUpperCase(), interviewId, userId).then(res => {
      let {data} = res;
      actions.debug_console('result-event-log',data)

    })
    .catch(() => {
    });      
  }, 60000);
  function generateUSER(id : any) {
    id = id || "";
    let flag = 0;
    const parts = id.split('-');
    if (parts.length === 5 && 
      parts[0].length === 8 && 
      parts[1].length === 4 && 
      parts[2].length === 4 && 
      parts[3].length === 4 && 
      parts[4].length === 12)
      flag = 1;
    if(flag === 1) return id;
    return uuidv4();
  }
  const onCloseClick = () => {
    // if(CObj['x_button'] == '1')
      setCloseFlag(!closeFlag);
    // else
    //   setCloseFlag(true);
    
  }
  const onStartClick = () => {
    actions.log_event('thought-bubble', '', '0', partnerId?.toUpperCase(), interviewId, userId).then(res => {
      let {data} = res;
      actions.debug_console('result-event-log',data)
    })
    .catch(() => {
    });
  }
  useEffect(() => {
    actions.xmit_event('popup-generated', partnerId?.toUpperCase(), userId, interviewId,user?user:'').then(res => {
      let {data} = res;
      actions.debug_console('result-event-xmit',data)
    })
    .catch(() => {
    });
  }, [userId]);
  useEffect(() => {
    if(closeFlag){
      actions.log_event('thought-bubble', '', '1', partnerId?.toUpperCase(), interviewId, userId).then(res => {
        let {data} = res;
        actions.debug_console('result-event-log',data)
      })
      .catch(() => {
      });
  }
  }, [closeFlag]); 
  return (!closeFlag?
    <ThoughtBubbleWrapper>
      <CloseImg onClick={onCloseClick} src={closeImg}/>
      <ThoughBubbleImg src={thought}/>
      <Message>
        {interviewArr.filter(item => item.name === interviewId)[0].initial_question}
      </Message>
      <PandaImg src={panda}/>
      <InitialCTA>
        <a href={`/input-selector/${partnerId}/${interviewId}/${userId}`} onClick={onStartClick}>
            Yes. Let's go!
        </a>
      </InitialCTA>
      <PoweredBy>
        Powered by PerceptivePanda {partner_name !== `` ? `for ` : ``} {partner_name}
      </PoweredBy>
      </ThoughtBubbleWrapper>
      : 
    <InputSelectorWrapper partner={partnerId} darkFlag={darkFlag}>
      
      <Thankyou partner={partnerId as any} onNextClick={(step) => {
        actions.log_event('thank-you', 3 , '0', partnerId, interviewId, userId).then(res => {
          let {data} = res;
        })
        .catch(() => {
        });    
      }} closeFlag={closeFlag as boolean} thank_you_text={thank_you_text} partner_name={partner_name} />
      </InputSelectorWrapper>
  )
}
const ThoughtBubbleWrapper = styled.div`
    position: absolute;
    width: 400px;
    height: 460px;
    padding: 0;
    top: 49%;
    left: 50%;
    margin: -225px 0 0 -200px;
    opacity: 1.0;
    border-radius: 10px;
    box-shadow: 0 0 12.5px -1px rgba(0, 0, 0, 0.1);   
    background-color:#fff;  
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
const Message = styled.span`
    position: absolute;
    overflow: hidden;
    font-family: 'Muli', sans-serif!important;
    font-size: 18px!important;
    font-weight: 900!important;
    font-stretch: normal!important;
    font-style: normal!important;
    line-height: 1.2!important;
    letter-spacing: normal!important;
    text-align: center!important;
    color: #000!important;
    left: 85px;
    top: 65px;
    width: 250px;
    height: 121px;
`
const ThoughBubbleImg = styled.img`
  position: absolute;
  left: 45px;
  top: -10px;
  width: 320px;
  height: 249px;
  margin: 4px 10px 81px 2.5px;
  padding: 26.5px 7.5px 38px;
  object-fit: contain;
  border: 0;
`
const PandaImg = styled.img`
  position: absolute;
  width: 143px;
  height: 143px;
  top: 190px;
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
  padding-top:12px;
`
const InitialCTA = styled.div`
  width: 100%;
  height: 30px;
  top: 380px;
  position: absolute;
  display: -webkit-flex;
  a {
    display: block;
    top: 50%;
    font-size: 16px;
    line-height: 30px;
    min-width: 150px;
    height: 38px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 4px;
    margin-left: auto;
    margin-right: auto;
    position: initial;
    text-decoration: none;
    transform: translateY(-50%);
    font-family: 'Muli', sans-serif;
    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: 0.06px;
    text-align: center;
    color: #fff;
    user-select: none;
    border-radius: 20px;
    background-color: #4d9ff5;
    cursor: pointer;

  }
`
const InputSelectorWrapper = styled.div<{ partner: any, darkFlag:boolean}>`
    position: absolute;
    width: 400px;
    height: 460px;
    padding: 0;
    top: 49%;
    left: 50%;
    margin: -225px 0 0 -200px;
    background-color: #e6eefd;  
    opacity: 1.0;
    border-radius: 10px;
    box-shadow: 0 0 12.5px -1px rgba(0, 0, 0, 0.1);   
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
    }
`
