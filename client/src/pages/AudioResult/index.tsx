import React from "react"
import { useLocation } from 'react-router-dom';
import styled from "styled-components"
// import ReactAudioPlayer from 'react-audio-player';
export default function AudioResult() {
  let { state } = useLocation();
  return (
    <AudioResultWrapper>
      <p>User - {state}</p>
      <div>
        <span>Question {1}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + state + '__1.ogg'} target="_blank">Download</a>
      </div>
      <div>
        <span>Question {2}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + state + '__2.ogg'} target="_blank">Download</a>
      </div>
      <div>
        <span>Question {3}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + state + '__3.ogg'} target="_blank">Download</a>
      </div>
      <div>
        <span>Question {4}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + state + '__4.ogg'} target="_blank">Download</a>
      </div>
    </AudioResultWrapper>
  )
}
const AudioResultWrapper = styled.div`
  padding:20px;
  div {
    padding: 20px;
  }
`