import React, { useState, useEffect } from "react"
import Login from "src/components/Login/Login";
import useToken from "src/useToken";
import styled from "styled-components"
import { Config } from 'src/config/aws';
import axios from 'axios';
import brandLogoImg from 'src/assets/images/panda@3x.png'
import { useParams } from "react-router-dom";

export default function UserLayout() {
    const { token, setToken} = useToken();
    const partners = Config.partner;
    const { partnerId, interviewId, user } = useParams();
    const [sepcPartner, setSepcPartner] = useState('');
    const [pubName, setPubName] = useState('');
    const [interviewActive, setInterviewActive] = useState(false)
    const [sepcInterview, setSpecInterview] = useState('');
    const [specUser, setSpecUser] = useState('');
    const [users,setUsers]= useState<any[]>([]);
    const [answer,setAnswer] = useState<any[]>(['']);
    const onClickInterview = (partner:any, interview:any) => {
        setInterviewActive(true);
        setSepcPartner(partner);
        setPubName(Config.partner.filter(item => item.partner === partner?.toUpperCase())[0].public_name || "");
        setSpecInterview(interview);
        axios.defaults.baseURL = Config.api_url;
        axios.post("/admin/user-input/get-media", {
          partner:partner,
          interview:interview,
          user:user||""
        })
        .then(res => {
          let {data} = res;
          console.log('result114441', data)
          setUsers(data.users);
          if(!data.success) {
            let message = `While uploading files, unknown errors was occured!`
            return;
          }
        })
        .catch(() => {
        });
    }
    useEffect(()=>{
        if(partnerId || interviewId)
            onClickInterview(partnerId?.toUpperCase(), interviewId)
        if(user){
            onClickInterview(partnerId?.toUpperCase(), interviewId)
            setInterviewActive(true);
            setSpecUser(user);    

        }
    },[ partnerId, interviewId, user]) 
    if(!token ){
        return <Login setToken = {setToken} />
    }
    return(
        <UserLayoutWrapper>
            <LogoImg src={brandLogoImg}/> <h1>PerceptivePanda Admin</h1>
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
                <h4>Partner: {pubName}</h4>
                <h4>Interview: {sepcInterview}</h4>
            <ul>
                {users.map((uElement, index)=> (specUser=='' || specUser == uElement['user']) &&<div>
                    <p>User: {uElement['user']}</p>
                    <div>&nbsp;&nbsp;&nbsp;{uElement.files.map((subelement1 : any) => 
                    {   
                        // var tempDate = new Date(subelement1.datetime);
                        return(<li key={subelement1.url}>{subelement1.datetime} (PST) - {subelement1.type} - Question {subelement1.question} - {subelement1.questionContent}  - &nbsp;
                         {/* {subelement1.type=="Text" && <RemovedSpan>{subelement1.questionContentRe}</RemovedSpan>} */}
                         <a href={Config.api_url + subelement1.url} target="_blank">Download</a>
                         {subelement1.type == "Text" && <span><br/><br/>Response: {subelement1.textResult}</span>}
                         <br/><br/></li>)})}
                    </div>
                </div>)}
            </ul></div>
            }
        </UserLayoutWrapper>

    )
}
const RemovedSpan = styled.span`
    color:red;
`
const UserLayoutWrapper = styled.div`
    padding:20px;
    li {
        color:blue!important:
        text-decoration: underline!important;
        cursor:pointer!important;
        margin-left: 40px;
        padding-top:5px;
        padding-bottom:5px;
    }
    ul {
        p {
             padding-top: 20px;
         margin-bottom: 0px;
     }
    }
`
const LogoImg =  styled.img`
width: 86px;
height: 86px;
`
