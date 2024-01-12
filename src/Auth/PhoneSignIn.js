import React, { useState } from 'react';
import { authService, dbService } from '../fbase';
import { getAuth, GoogleAuthProvider, signInWithPopup , createUserWithEmailAndPassword, 
  RecaptchaVerifier, signInWithPhoneNumber
} from "firebase/auth";

import { getFirestore, addDoc, getDocs, collection, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import logo from '../header/HeaderLogo.png';
import GoogleLogin from './btn_google_signin_light_normal_web.png';

const PhoneSign = () => {
  const user = authService.currentUser;
  const navigate = useNavigate();
  const [value, Setvalue] = useState("");
  const appVerifier = window.recaptchaVerifier; 
  const [phoneNumber, SetPhoneNumber] = useState("");

    const getPhoneNumberFromUserInput = () => {
      const phoneNumber = "+82" + value.substring(1);
      console.log(phoneNumber);
      return phoneNumber;
    };
    const onClickHandle = () => {
      window.recaptchaVerifier = new RecaptchaVerifier(authService, "sign-in-button", {
        size: "invisible",
        callback: (response) => {
          console.log('reCAPTCHA solved:', response);
        },
      });
      authService.languageCode = "ko";		// 한국어로 해줍시다
      const phoneNumber = getPhoneNumberFromUserInput(); // 위에서 받아온 번호
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authService, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;	// window
        })
        .catch((error) => {
          console.log("SMS FAILED");
        });
    };

    const getCodeFromUserInput = () => {
      return value;
    };

    const onClickHandle2 = () => {
      const code = getCodeFromUserInput();
      window.confirmationResult
        .confirm(code)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          console.log("hey YOU ARE IN SUCCESS");
          addDoc(collection(dbService, 'User'), {
            createrId: user.uid,
            id: phoneNumber
          // Add other fields as needed
          });

          navigate('/Auth/Info');
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
        });
    };

        return (
                <>
                <div>
                  <div id="sign-in-button"></div>
                  <input onChange={(e) => Setvalue(e.target.value)} type="text" />
                  <button onClick={onClickHandle}>문자보내기</button>
                  <input onChange={(e) => Setvalue(e.target.value)} type="text" value={phoneNumber}/>
                  <button onClick={onClickHandle2}>인증번호 확인하기</button>
                </div>
            </>
             );
        }    

export default PhoneSign; 