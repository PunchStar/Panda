import React from "react"
import Login from "src/components/Login/Login";
import useToken from "src/useToken";
import styled from "styled-components"
import brandLogoImg from 'src/assets/images/panda@3x.png'

export default function Admin() {
    const { token, setToken} = useToken();
    if(!token ){
        return <Login setToken = {setToken} partnerId = {''} />
    }

    return(
        <AdminWrapper>
            <LogoImg src={brandLogoImg}/>
            <h1>PerceptivePanda Admin</h1>
            <ul>
                <li><a href="/admin/interviews">Interviews</a></li>
                <li><a href="/admin/user-inputs">User Inputs</a></li>
            </ul>
        </AdminWrapper>
    )
}
const AdminWrapper = styled.div`
`
const LogoImg =  styled.img`
    width: 143px;
    height: 143px;
`
