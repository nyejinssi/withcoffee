import React, { useState } from 'react';
import { authService, dbService } from '../fbase';
import { getAuth, GoogleAuthProvider, signInWithPopup , createUserWithEmailAndPassword, 
  RecaptchaVerifier, signInWithPhoneNumber
} from "firebase/auth";

import { getFirestore, addDoc, getDocs, collection, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import logo from '../header/HeaderLogo.png';
import GoogleLogin from './btn_google_signin_light_normal_web.png';

const Sign = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { target: { name, value }, } = event;
    if (name === "email") { setEmail(value);
    } else if (name === "password") { setPassword(value);}};
  
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) { // 계정 생성
        data = await createUserWithEmailAndPassword(authService, email, password)
        .then((userCredential) => {
          console.log("회원가입 성공");
          const user = userCredential.user;
          addDoc(collection(dbService, 'SignUp'), {
            createdAt: serverTimestamp(), // Timestamp of the sign-up
            email: email,
            pw: password});
          addDoc(collection(dbService, 'User'), {
            createdAt: serverTimestamp(),
            createrId: user.uid
          });  
          navigate('/Auth/Info/Email');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
      } else {
        // log in
        data = await authService.signInWithEmailAndPassword(email, password);
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const onSocialClick = async (event) => {
      const { target: {name},} = event;
      let provider;
      if (name === "google"){ 
          provider = new GoogleAuthProvider(); 
      } 
      try {
          const { user } = await signInWithPopup(authService, provider);
          console.log("구글로 회원가입 하기를 선택하셨습니다.");
          await addDoc(collection(dbService, 'User'), {
              createdAt: serverTimestamp(), // Timestamp of the sign-up
              createrId: user.uid,
              name: user.displayName,
              email: user.email          
            // Add other fields as needed
          });
          navigate('/Auth/Info/Email');
        } catch (error) {
          console.error('Error signing in with social provider:', error);
        }
      };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  const PhoneClick = () => {
    navigate('/Auth/PhoneSignIn');
  };
  

  return (
    <>
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
          <img src={logo} className="logo_img" alt="logo" style={{width: '10%'}} />
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>로그인 | 회원가입</p>
        </div>
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
      <br /> <br/>
        <button onClick={toggleAccount} className="authSwitch" style={{ textAlign: 'center', alignItems: 'center', backgroundColor:'white', color:'black', border:'gray' }}>
          {newAccount ? "로그인 하러가기" : "계정생성 하러가기"}</button>
        {/* Center-align the form by adding a wrapper div */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form onSubmit={onSubmit} style={{ textAlign: 'center', alignItems: 'center' }}>
            <input name="email" type="text" placeholder="이메일" required value={email} onChange={onChange} style={{ width: '250px' }} />
            <input name="password" type="password" placeholder="비밀번호" required value={password} onChange={onChange} style={{ width: '250px' }} />
            <input type="submit" value={newAccount ? "회원가입" : "로그인"} style={{ backgroundColor:'black', color:'white', border:'gray'}}/>
            {error && <span className="authError">{error}</span>}
            <br/>
          </form>
        </div>
      </div>
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
        <button onClick={PhoneClick} alt='전화번호로 로그인' style={{ backgroundColor:'black', color:'white', border:'gray'}}>전화번호로 회원가입 | 로그인 </button>
        <br /> <br/>
      </div>
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
        <img className='G-SingIn' src={GoogleLogin} onClick={onSocialClick} name="google" alt="구글로 로그인"  style={{width : '10%'}}/>
      </div>
    </>
  );
}    

export default Sign; 