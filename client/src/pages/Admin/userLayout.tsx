import React, { useState, useEffect } from "react"
import Login from "src/components/Login/Login";
import useToken from "src/useToken";
import styled from "styled-components"
export default function UserLayout() {
    const { token, setToken} = useToken();
    if(!token ){
        return <Login setToken = {setToken} />
    }
    return(
        <div>
            <h1>Perceptive Panda Admin</h1>
            <h2>User Inputs</h2>
            <h3>Partners and Interviews</h3>
            <ul>
            {/* {{#each config}}
                {{> admin/partner-user-inputs}}
            {{/each}} */}
            </ul>
        </div>

    )
}