import React, { useState, useEffect } from "react"
import Login from "src/components/Login/Login";
import useToken from "src/useToken";
import styled from "styled-components"

export default function Admin() {
    const { token, setToken} = useToken();
    if(!token ){
        return <Login setToken = {setToken} />
    }
    return(
        <div>
            <h1>Perceptive Panda Admin</h1>
            <ul>
                <li><a href="/admin/interviews">Interviews</a></li>
                <li><a href="/admin/user-inputs">User Inputs</a></li>
            </ul>
        </div>
    )
}