import React, { useState, useEffect } from "react"
import Login from "src/components/Login/Login";
import useToken from "src/useToken";
import styled from "styled-components"
export default function Interview() {
    const { token, setToken} = useToken();
    if(!token ){
        return <Login setToken = {setToken} />
    }
    return(
        <div>
            UserLayout
        </div>

    )
}
