import { useState } from 'react';

export default function useToken(){
    const getToken = () =>{
        // localStorage.clear();
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token
        // return tokenString
    };
    const [token, setToken] = useState(getToken());

    const saveToken = userToken =>{
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
        // setToken(userToken)
    };

    return {
        setToken: saveToken,
        token
    }
}
