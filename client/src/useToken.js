import { useState } from 'react';

export default function useToken(){
    const getToken = () =>{
        const tokenString = localStorage.getItem('token');
        // console.log('ddd')
        // console.log(tokenString)
        const userToken = JSON.parse(tokenString);
        return userToken?.token
        return tokenString
    };
    const [token, setToken] = useState(getToken());

    const saveToken = userToken =>{
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
        setToken(userToken)
    };

    return {
        setToken: saveToken,
        token
    }
}