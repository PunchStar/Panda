import React from "react"
import styled from "styled-components"
// import ReactAudioPlayer from 'react-audio-player';
interface AudioResultProps {
  userId: string;
}
export default function AudioResult(props: AudioResultProps) {
  const {userId} = props;
  return (
    <AudioResultWrapper>
      <p>User - {userId}</p>
      <div>
        <span>Question {1}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + userId + '__1.ogg'} target="_blank">Download</a>
      </div>
      <div>
        <span>Question {2}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + userId + '__2.ogg'} target="_blank">Download</a>
      </div>
      <div>
        <span>Question {3}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + userId + '__3.ogg'} target="_blank">Download</a>
      </div>
      <div>
        <span>Question {4}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + userId + '__4.ogg'} target="_blank">Download</a>
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