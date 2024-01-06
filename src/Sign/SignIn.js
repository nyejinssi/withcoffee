import React, { useState } from 'react';
import { authService } from '../fbase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import UserInfo from './UserInfo';
import './Auth.css';
import logo from './logo_2.jpg';
import GoogleLogin from './btn_google_signin_light_normal_web.png';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true); 
    const [error, setError] = useState(""); 
    const [errorMessage, setErrorMessage] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [word, setWord] = useState("");
    const [User, setUser] = useState(null);

    const data = useState("");
    const onSubmit = (event) => {
        event.preventDefault();        
        try{    
                data = signInWithEmailAndPassword(authService, email, password).then(() => {
                    navigate('/Main');
                    console.log(data); })
                } catch(error){
                    setErrorMsg(error.message);
                    setErrorMessage("이메일 또는 비밀번호가 잘못되었습니다.");
                }
        };

    const onSocialClick = async (event) => {
        const { target: {name},} = event;
        let provider;
        if (name === "google"){ provider = new GoogleAuthProvider(); }
        const data = await signInWithPopup(authService, provider);
        console.log("구글 계정으로 로그인 성공");
        navigate('/Main');
    };

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){ 
            setEmail(value);
        } else if(name === "password"){
                setPassword(value);
    }};       

        return (
                <>
                <div className='table-container'>
                    <table>              
                            <tr>
                                <td className='logoWrap'> <img src={logo} className="logo_img" alt="logo" /> </td>
                                <td className="LoginTitle"> Cafe인 </td>
                            </tr>
                    </table>
                </div>
                <div className='LoginConts'>
                    <form onSubmit={onSubmit}>
                        <input name="email" type="text" className='LoginEmail' placeholder="Email" required value={email} onChange={onChange} />
                        <input name="password"  className='LoginPassword' type="password" placeholder="Password" required value={password} onChange={onChange} />
                        <input type="submit" className = 'AuthSubmit' value="로그인" />
                    </form>
                    {errorMessage && <p className="error-message"> 아이디 혹은 비밀번호가 잘못되었습니다.<br/> 확인후 다시 입력해주세요. </p>}
                        <img className='G-SingIn' src={GoogleLogin} onClick={onSocialClick} name="google" alt="구글로 로그인" />
                </div>
            </>
             );
        }

export default SignIn; 
