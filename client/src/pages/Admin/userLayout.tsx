import React, { useState, useEffect } from "react"
import Login from "src/components/Login/Login";
import useToken from "src/useToken";
import styled from "styled-components"
import { Config } from 'src/config/aws';
import axios from 'axios';

export default function UserLayout() {
    const { token, setToken} = useToken();
    const partners = Config.partner;
    const [sepcPartner, setSepcPartner] = useState('');
    const [interviewActive, setInterviewActive] = useState(false)
    if(!token ){
        return <Login setToken = {setToken} />
    }
    const onClickInterview = (partner:any, interview:any) => {
        setInterviewActive(true);
        axios.defaults.baseURL = Config.api_url;
        axios.post("/admin/user-input/get-media", {
          partner:partner,
          interview:interview,
        })
        .then(res => {
          let {data} = res;
          console.log('result114441',data)
          if(!data.success) {
            let message = `While uploading files, unknown errors was occured!`
            return;
          }
        })
        .catch(() => {
        });
    }
    return(
        <UserLayoutWrapper>
            <h1>Perceptive Panda Admin</h1>
            <h3>User Inputs</h3>
            <h5>Partners and Interviews</h5>
            {partners.map((element, index)=> (sepcPartner=='' || sepcPartner == element.partner) &&<li key={index}>
                Partner: <a onClick={()=>setSepcPartner(element.partner)}>{element.partner}</a>
                <ol>&nbsp;&nbsp;&nbsp;{element.interviews.map(subelement => <li onClick={()=>onClickInterview(element.partner, subelement.name)}>Interview: {subelement.name}</li>)}
                </ol>
            </li>)}
        </UserLayoutWrapper>

    )
}
const UserLayoutWrapper = styled.div`
    padding:20px;
    li {
        color:blue!important:
        text-decoration: underline!important;
        cursor:pointer!important;
    }
`