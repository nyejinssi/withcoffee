import React, { useState } from 'react';
import { authService } from '../fbase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import GoogleLogin from './btn_google_signin_light_normal_web.png';

const Auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true); 
    const [error, setError] = useState(""); 
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [word, setWord] = useState("");
    const [User, setUser] = useState(null);
    const data = useState("");
    const onSubmit = (event) => {
        event.preventDefault();
        if (errorMsg !== "") {            
            return;
        }
        try {
            setErrorMsg("");
            data = createUserWithEmailAndPassword(authService, email, password).then(() => {
                sendEmailVerification(authService, email);
                setEmail("");
                setPassword("");
                console.log("계정 생성 완료");
                navigate("/Sign/UserInfo");
            // auth객체의 currentUser.emailVerified 값이 true인 경우에만 로그인되도록 코드 짜기
            });
          } catch (error) {
            switch (error.code) {
              case 'auth/weak-password':
                setErrorMsg("비밀번호는 8자 이상 16자 이하입니다.");
                break;
              case 'auth/invalid-email':
                setErrorMsg("잘못된 이메일 주소입니다.");
                break;
              case 'auth/email-already-in-use':
                setErrorMsg("이미 존재하는 이메일입니다.");
                break;
              default:
                setErrorMsg("회원가입에 실패했습니다. 잘못 입력된 것이 없는지 다시 한 번 확인부탁드립니다.");
                break;
            }
          }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onSocialClick = async (event) => {
        const { target: {name},} = event;
        let provider;
        if (name === "google"){ 
            provider = new GoogleAuthProvider(); 
        }
        const data = await signInWithPopup(authService, provider).then(() => {
            console.log("구글로 회원가입 하기를 선택하셨습니다.");
            navigate('../Sign/UserInfo');
        });
    };

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){ 
            setEmail(value);
        } else if(name === "password"){
                setPassword(value);
                if (value.length < 8 || value.length > 16){
                    setErrorMsg("비밀번호는 8자 이상 16자 이하입니다.");
                } else if ((value.length >= 8) || (value.length <= 16)) {
                    setErrorMsg("");
            }
    }};       

        return (
            <>
                <div className='LoginConts'>
                    <form onSubmit={onSubmit}>
                        <input name="email" type="text" className='LoginEmail' placeholder="Email" required value={email} onChange={onChange} />
                        <input name="password"  className='LoginPassword' type="password" placeholder="Password" required value={password} onChange={onChange} />
                        {errorMsg && <p className="error">{errorMsg}</p>}
                        <input type="submit" className = 'AuthSubmit' value="회원 가입 하기" />
                    </form>
                        <Link to="/Sign/UserInfo"><img className='G-SingIn' src={GoogleLogin} onClick={onSocialClick} name="google" alt="구글로 로그인" /> </Link>
                </div>
            </>
             );
        }    

export default Auth;