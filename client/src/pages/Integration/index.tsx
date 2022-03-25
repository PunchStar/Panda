import React, { useState } from "react"
import styled from "styled-components"
import { useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import { Config } from 'src/config/aws';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import * as actions from '../../actions';

export default function Integration() {
  const { integrationType, partnerId, interviewId } = useParams();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  let naviage = useNavigate();
  const [user, setUser]= useState(uuidv4());
  const [integrationFlag, setIntegrationFlag] = useState(false);
  const [integrationLink, setIntegrationLink] = useState('');
  const [integrationUserName, setIntegrationUserName] = useState('');
  const [integrationUserEmail, setIntegrationUserEmail] = useState('');
  actions.xmit_event('popup-generated', partnerId?.toUpperCase(), user, interviewId, user).then(res => {
    let {data} = res;
    console.log('result-event-xmit',data)
  })
  .catch(() => {
  });
  actions.log_event('inegration', '', '2', partnerId?.toUpperCase(), interviewId, user).then(res => {
    let {data} = res;
    console.log('result-event-log',data)
  })
  .catch(() => {
  });
  getIntegration(integrationType, partnerId,interviewId);
  function getIntegration (integrationType:any, partner:any, interview:any){
    axios.defaults.baseURL = Config.api_url;
    axios.post("/integration/get", {
      partner:partnerId,
      interview:interviewId,
      integrationType:integrationType,
      user
    }, { params: {
      name: query.get('name') || "",
      email: query.get('email') || ""
    } })
    .then(res => {
      let {data} = res;
      if(!data.integration)
        naviage('/input-selector/'+ data.partner + '/' + data.interview + '/' + data.user);
      else {
        setIntegrationFlag(true);
        setIntegrationLink(data.integration_link);
        if (partnerId === "DATASAUR") {
          setIntegrationUserName(data.datasaur_data.name);
          setIntegrationUserEmail(data.datasaur_data.email);
        }
        setUser(data.user);
        window.addEventListener('message', function(e) {
          // message that was passed from iframe page
          let e_data = e.data;
          if (e_data.event_id === "smpldv_message") {
              let event_url = btoa(e_data.data.host_event_uri);
              let event_uuid = btoa(e_data.data.event_uuid);
              let invitee_uuid = btoa(e_data.data.invitee_uuid);
              naviage("/input-selector/"+data.partner+"/"+data.interview+"/"+data.user+"/"+event_url+"/"+event_uuid+"/"+invitee_uuid);
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
      {integrationFlag && partnerId === "ABRR1" && <iframe src={integrationLink + "?microinterviewlink=" + user} title="Perspective Panda - Scheduling"></iframe>}
      {integrationFlag && partnerId === "DATASAUR" && <iframe src={integrationLink + "?microinterviewlink=" + user + "&name=" + integrationUserName + "&email=" + integrationUserEmail} title="Perspective Panda - Scheduling"></iframe>}
    </IntegrationWrapper>
  )
}
const IntegrationWrapper = styled.div`
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
