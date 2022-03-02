import React, { useState, useEffect } from "react"
import Login from "src/components/Login/Login";
import useToken from "src/useToken";
import styled from "styled-components"
import { Config } from 'src/config/aws';
import axios from 'axios';
import brandLogoImg from 'src/assets/images/panda@3x.png'

export default function UserLayout() {
    const { token, setToken} = useToken();
    const partners = Config.partner;
    const [sepcPartner, setSepcPartner] = useState('');
    const [interviewActive, setInterviewActive] = useState(false)
    const [sepcInterview, setSpecInterview] = useState('');
    const [users,setUsers]= useState<any[]>([]);
    const [answer,setAnswer] = useState<any[]>(['']);
    if(!token ){
        return <Login setToken = {setToken} />
    }
    const onClickInterview = (partner:any, interview:any) => {
        setInterviewActive(true);
        setSepcPartner(partner);
        setSpecInterview(interview);
        axios.defaults.baseURL = Config.api_url;
        axios.post("/admin/user-input/get-media", {
          partner:partner,
          interview:interview,
        })
        .then(res => {
          let {data} = res;
          console.log('result114441',data)
            setUsers(data.users);
          if(!data.success) {
            let message = `While uploading files, unknown errors was occured!`
            return;
          }
        })
        .catch(() => {
        });
    }
    const  checkData= (url:string)=>{
        axios.defaults.baseURL = Config.api_url;
        axios.get(url)
        .then(res => {
            let {data} = res;
            // let tempObj:any = answer;
            // tempObj[url] = 'Answer: ' + data;
            // setAnswer(tempObj);
            let tempArr:string[] = answer;
            tempArr.push(url);
            tempArr.push('Answer: ' + data);
            setAnswer(tempArr);
            console.log('answer',answer);
        })
        .catch(() => {
        });
        
    }
    // const showAnswer = (url:string)=>{
    //     let tempObj:any= answer
    //     Object.keys(tempObj).forEach((key)=>{
    //         if(key == url)
    //             return tempObj[key];
    //     })
    //     return '';
    // }
    return(
        <UserLayoutWrapper>
            <LogoImg src={brandLogoImg}/> <h1>Perceptive Panda Admin</h1>
            {!interviewActive ? <>
            <h3>User Inputs</h3>
            <h5>Partners and Interviews</h5>
            {partners.map((element, index)=> (sepcPartner=='' || sepcPartner == element.partner) &&<li key={index}>
                Partner: <a onClick={()=>setSepcPartner(element.partner)}>{element.partner}</a>
                <ol>&nbsp;&nbsp;&nbsp;{element.interviews.map(subelement => <li onClick={()=>onClickInterview(element.partner, subelement.name)}>Interview: {subelement.name}</li>)}
                </ol>
            </li>)}
            </>:<div>
                <h2>User Interviews</h2>    
                <h4>Partner:{sepcPartner}</h4>
                <h4>Interview:{sepcInterview}</h4>
            <ul>
                {users.map((uElement, index)=><div>
                    <p>Users: {uElement['user']}</p>
                    <div>&nbsp;&nbsp;&nbsp;{uElement.files.map((subelement1 : any) => 
                    {   
                        var tempDate = new Date(subelement1.datetime);
                        return(<li key={subelement1.url}>Question: {subelement1.question} - {subelement1.type} - {tempDate.toLocaleDateString()} (GMT{tempDate.getTimezoneOffset()< 0?'+':'-'} {Math.abs(tempDate.getTimezoneOffset())/60}) -
                         {/* <a href={'http://localhost:5005' +subelement1.url}>Download</a> */}
                         <a onClick={()=>checkData( subelement1.url)}>Download</a>
                         {/* {Object.keys(answer as any).forEach((key1)=>{
                            let tempObj : any = answer;
                            if(key1 == subelement1.url)
                                return (<span>{tempObj.key1}</span>)
                        })} as*/}
                        {/* {Object.entries(answer).map(([key, value1])=>{
                            if(key == subelement1.url)
                                return(<span>{value1 as string}</span>);
                        })} */}
                        {answer.map((subanswer, answerIndex) =>{
                            if(subanswer == subelement1.url){
                                console.log("dddd")
                                return(<span>{answer[answerIndex+1]}</span>)
                            }
                        })}
                         </li>)})}
                </div>
                </div>)}
            </ul></div>
            }
        </UserLayoutWrapper>

    )
}
const UserLayoutWrapper = styled.div`
    padding:20px;
    li {
        color:blue!important:
        text-decoration: underline!important;
        cursor:pointer!important;
        margin-left: 40px;
    }
    ul {
        p {
             padding-top: 20px;
         margin-bottom: 0px;
     }
    }
`
const LogoImg =  styled.img`
width: 143px;
height: 143px;
`