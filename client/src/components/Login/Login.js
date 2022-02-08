import React, { useState } from 'react';
import './Login.css';

import { Config } from 'src/config/aws';

async function loginUser(credentials) {
    return fetch(`${Config.api_url}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}
export default function Login ({setToken}) {
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const handleSubmit = async e =>{
        e.preventDefault();
        const token = await loginUser({
            userName,
            password
        });
        if(token.success)
        setToken(token);
    }
    return (
        <div className="login-wrapper">
            <h1> Please Log In </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>UserName</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}