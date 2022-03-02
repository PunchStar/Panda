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
        // <div className="modal">
        //     <div className="modal-content">
        //         <div className="modal-header">
        //             <h4 className="modal-title">Sign In</h4>
        //         </div>
        //         <div className="modal-body">
        //             <div className="login-wrapper">
        //             <form onSubmit={handleSubmit}>
        //                 <label>
        //                     <p>UserName</p>
        //                     <input type="text" onChange={e => setUserName(e.target.value)} />
        //                 </label>
        //                 <label>
        //                     <p>Password</p>
        //                     <input type="password" onChange={e => setPassword(e.target.value)} />
        //                 </label>
        //                 <div>
        //                     <button type="submit">Submit</button>
        //                 </div>
        //             </form>
        //         </div>
        //         </div>
        //         <div className="modal-footer">
        //             <button className="button">
        //                 Close
        //             </button>
        //         </div>
        //     </div>
        // </div>
        <div className="modal">
                <div className="modal-dialog">
                    <div className="loginmodal-container">
                        <h1>Sign In</h1><br/>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Username" onChange={e => setUserName(e.target.value)} />
                            <input type="password" placeholder="Password"  onChange={e => setPassword(e.target.value)} />
                            <input type="submit" name="login" className="login loginmodal-submit" value="Login"/>
                        </form>
                    </div>
                </div>
        </div>
    )
}