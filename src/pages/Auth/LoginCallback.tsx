import { getCookie, setCookie } from '../../Utility/Cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const LoginCallback = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const navigate = useNavigate();

    axios.get(process.env.REACT_APP_BASE_URL+`/login/oauth2/code/naver?code=${code}&state=${state}`
        ,{
            withCredentials: true
        })
    .then(response => {
        console.log(document.cookie);
        console.log(getCookie('Authorization'));
        console.log(code);
        console.log(state);
        let refresh = response.data.refresh;
        setCookie('refresh', refresh);
        navigate('/'); 
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // useEffect(() => {
    //     if (location.pathname === '/test') {

    //     }
    // }, [location, navigate]);

    return <div>로그인 중...</div>;
};

export default LoginCallback;