import React, { useState } from "react"
import styled from "styled-components"
import pandaTalkingImg from 'src/assets/images/Panda-Talking Pose 1-v12.png'
import closeImg from 'src/assets/images/x.svg'
import SpeechBubbleCenter from 'src/assets/images/speech-bubble-center.svg'
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Config } from 'src/config/aws';
import { useNavigate } from 'react-router-dom';

export default function Integration() {
  const { integrationType, partnerId, interviewId } = useParams();
  let naviage = useNavigate();
  const [user, setUser]= useState('');
  const [integrationFlag,setIntegrationFlag] = useState(false);
  getIntegration(integrationType, partnerId,interviewId);
  function getIntegration (integrationType:any, partner:any, interview:any){
    axios.defaults.baseURL = Config.api_url;
    axios.post("/integration/get", {
      partner:partnerId,
      interview:interviewId,
      integrationType:integrationType
    })
    .then(res => {
      let {data} = res;
      if(!data.integration)
        naviage('/input-selector/'+ data.partner + '/' + data.interview );
      else{
        setIntegrationFlag(true);
        setUser(data.user);
        window.addEventListener('message', function(e) {
          // message that was passed from iframe page
          let data = e.data;
          if (data.event_id == "smpldv_message") {
              let event_url = btoa(data.data.host_event_uri);
              let event_uuid = btoa(data.data.event_uuid);
              let invitee_uuid = btoa(data.data.invitee_uuid);
              naviage("/input-selector/"+partner+"/"+data.interview+"/"+data.user+"/" + event_url + "/" + event_uuid + "/" + invitee_uuid);
                  axios.post("/input-selector/event", {
                    partner:data.partner,
                    interview:data.interview,
                    user:data.user,
                    event_link:event_url,
                    event_uuid,
                    invitee_uuid,
                  })
                  .then(res => {
                    console.log(res)
                  })
                  .catch(() => {
                  });
              }
      } , false);
      }
    })
    .catch(() => {
    });
}
  return (
    <IntegrationWrapper>
         {integrationFlag && <iframe src={"https://panda-demo-f236d.web.app/?microinterviewlink=" + user} title="Perspective Panda - Scheduling"></iframe>}
    </IntegrationWrapper>
 
  )
}
const IntegrationWrapper = styled.div`   
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
    overflow: hidden;
    background-color: white;
    min-width: 320px;
    width: 100%;
    height: 100%;
    top: 30px;
    left: 0;
    margin: 0;
    box-shadow: none;
    transform: scale(1) !important;
    @media(max-width: 1000px){
      height: 100%;
      top: 50px;
    }
    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
`
