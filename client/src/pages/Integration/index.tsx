import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Config } from "src/config/aws";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Calendly from "./Calendly";

export default function Integration() {
  const { integrationType, partnerId, interviewId } = useParams();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  let naviage = useNavigate();
  const [user, setUser] = useState(uuidv4());
  const [integrationUserName, setIntegrationUserName] = useState("");
  const [integrationUserEmail, setIntegrationUserEmail] = useState("");
  const [calendlyAuth, setCalendlyAuth] = React.useState("");
  const [calendlyHostLink, setCalendlyHostLink] = React.useState("");
  const [additionalCalendlyParams, setAdditionalCalendlyParams] = React.useState("");
  const [calendlyFound, setCalendlyFound] = React.useState(false);
  const [interviewLink, setInterviewLink] = React.useState("");
  
  /* ABANDON ENDPOINT */
  const abandonTrackerEndpoint = "https://hooks.zapier.com/hooks/catch/11643492/b8krckt/";

  /* PAIRED EVENT ENDPOINT */
  const pairedEventEndpoint = "https://hooks.zapier.com/hooks/catch/11643492/b8krv0b/silentsss/";

  const [showing, setShowing] = React.useState(true);
  const [host, setHost] = React.useState("");

  getIntegration(integrationType, partnerId,interviewId);
  function getIntegration(integrationType: any, partner: any, interview: any) {
    axios.defaults.baseURL = Config.api_url;
    axios
      .post(
        "/integration/get",
        {
          partner: partnerId?.toUpperCase(),
          interview: interviewId,
          integrationType: integrationType,
          user,
        },
        {
          params: {
            name: query.get("name") || "",
            email: query.get("email") || "",
          },
        }
      )
      .then((res) => {
        let { data } = res;
        if (!data.integration)
          naviage(
            "/input-selector/"+
              data.partner +
              "/"+
              data.interview +
              "/"+
              data.user
          );
        else {
          setInterviewLink("/input-selector/"+ data.partner +"/"+ data.interview + "/"+ data.user)

          if (partnerId === "DATASAUR") {
            setIntegrationUserName(data.datasaur_data.name);
            setIntegrationUserEmail(data.datasaur_data.email);
          }
          setUser(data.user);

          if (data.calendlyAuth) { 
            setCalendlyFound(true);
            setCalendlyAuth(data.calendlyAuth);
            setCalendlyHostLink(data.calendlyHostLink);
            setAdditionalCalendlyParams(data.additionalCalendlyParams);
          }
        }
        
      })
      .catch(() => {});
  }

  function finishSchedule() {
    naviage(interviewLink);
  }

  return (
    <IntegrationWrapper>
      {calendlyFound && <Calendly
        calendlyAuth={calendlyAuth}
        abandonTrackerEndpoint={abandonTrackerEndpoint}
        additionalCalendlyParams={additionalCalendlyParams}
        pairedEventEndpoint={pairedEventEndpoint}
        calendlyHostLink={calendlyHostLink}
        name={integrationUserName}
        email={integrationUserEmail}
        microinterviewlink={user}
        showing={showing}
        setShowing={setShowing}
        host={host}
        setHost={setHost}
        interviewLink={interviewLink}
        finishSchedule={finishSchedule}
      /> }
    </IntegrationWrapper>
  );
}
const IntegrationWrapper = styled.div`
  position: absolute;
  padding: 0;
  top: 49%;
  left: 50%;
  margin: -225px 0 0 -200px;
  background-color: #e6eefd;
  opacity: 1;
  border-radius: 10px;
  box-shadow: 0 0 12.5px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: white;
  min-width: 320px;
  width: 100%;
  height: 90%;
  top: 30px;
  left: 0;
  margin: 0;
  box-shadow: none;
  transform: scale(1) !important;
  @media (max-width: 1000px) {
    height: 100%;
    top: 50px;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`
