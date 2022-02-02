import React from "react"
import styled from "styled-components"
// import ReactAudioPlayer from 'react-audio-player';
interface AudioResultProps {
  userId: string;
  text?:boolean;
}
export default function AudioResult(props: AudioResultProps) {
  const {userId,text} = props;
  return (
    <AudioResultWrapper>
      <p>User - {userId}</p>
      <div>
        <span>Question {1}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={text?'./text/':'./recording/' + userId + text?'__1.txt':'__1.ogg'} target="_blank">Download</a>
      </div>
      <div>
        <span>Question {2}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={text?'./text/':'./recording/' + userId + text?'__2.txt':'__2.ogg'} target="_blank">Download</a>
      </div>
      <div>
        <span>Question {3}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={text?'./text/':'./recording/' + userId + text?'__3.txt':'__3.ogg'} target="_blank">Download</a>
      </div>
      {!text && <div>
        <span>Question {4}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'./recording/' + userId + '__4.ogg'} target="_blank">Download</a>
      </div>}
    </AudioResultWrapper>
  )
}
const AudioResultWrapper = styled.div`
  padding:20px;
  div {
    padding: 20px;
  }
`