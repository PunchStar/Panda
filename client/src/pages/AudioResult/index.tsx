import { render } from "@testing-library/react";
import React, { useState } from "react"
import axios from 'axios';

import styled from "styled-components"
import { Config } from "src/config/aws";
// import ReactAudioPlayer from 'react-audio-player';
interface AudioResultProps {
  userId: string;
  text?:boolean;
  count:number;
  url:string[];
}
export default function AudioResult(props: AudioResultProps) {
  const {userId,text, count, url} = props;
  const [result, setResult] = useState(false);
  const [resultVal, setResultVal] = useState('')
  console.log(url)
  console.log()
  const createSigned = async(qCount:number,url:string) =>{
    axios.defaults.baseURL=Config.api_url;
    axios.post("/input-selector/getobject", {
      filename: url.slice(url.indexOf('dev') + 4,url.indexOf('?')),
      text:text
    })
    .then(res => {
      let {data} = res;
      console.log('result555',data)
      setResultVal(data.data);
      if(!text){  // this code right?
//this is mine . as u can see, this is react part.
// know it. wanted to confirm this block is showing ogg file?
// just a moment. i'll show one thing

        const blob = new Blob([data.data], {type:'audio/ogg'});
        setResultVal(URL.createObjectURL(blob));
      }
      setResult(true);
      if(!data.success) {
        let message = `While uploading files, unknown errors was occured!`
        return;
      }
    
    })
    .catch(() => {
    });
  } 
  return (
    <AudioResultWrapper>
        <>
          <p>User - {userId}</p>
          {url.map((element, index)=><div key={index}>
    <span>Question {index + 1}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href={'http://localhost:5115/admin/media-download' + element.slice(element.indexOf('dev') + 3,element.indexOf('?'))} target="_blank">Download</a>
  </div>)}
        </>
        {/* // :
        // <>
        //   <p>Result</p>
        //   {text&&<h1>{resultVal}</h1>}
        //   {!text && <audio controls><source src={resultVal} type="audio/ogg"/></audio>}
        //   <br/>
        //   <a onClick={()=>{setResult(false); setResultVal('');}}>Back</a>
        // </>
        } */}
      
      {/*<div>
        <span>Question {1}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {!text?
        <a href={'/recording/' + userId +'__1.ogg'}  target="_blank">Download</a>
        :<a href={'/text/' + userId + '__1.txt'} download>Download</a>
        }
        
      </div>
      <div>
        <span>Question {2}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {!text?
        <a href={'/recording/' + userId +'__2.ogg'}  target="_blank">Download</a>
        :<a href={'/text/' + userId + '__2.txt'} download>Download</a>
        }
      </div>
      {count > 2 && <div>
        <span>Question {3}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {!text?
        <a href={'/recording/' + userId +'__3.ogg'}  target="_blank">Download</a>
        :<a href={'/text/' + userId + '__3.txt'} download>Download</a>
        }
      </div> }
      {count > 3 && <div>
        <span>Question {4}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {!text?
        <a href={'/recording/' + userId +'__4.ogg'}  target="_blank">Download</a>
        :<a href={'/text/' + userId + '__4.txt'} download>Download</a>
        }
      </div>} */}
    </AudioResultWrapper>
  )
}
const AudioResultWrapper = styled.div`
  padding:20px;
  div {
    padding: 20px;
   
  }
  a {
    cursor: pointer!important;
    text-decoration: underline!important;
  }
`
