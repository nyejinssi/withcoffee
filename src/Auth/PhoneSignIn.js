import React, { useState } from 'react';
import { authService, dbService } from '../fbase';
import { getAuth,RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import {getFirestore, addDoc, getDocs, collection, query, where, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import logo from '../header/HeaderLogo.png';


const PhoneSignIn = () => {
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
          const querySnapshot = getDocs(query(collection(dbService, 'User'), where('id', '==', phoneNumber)));
          const userExists = querySnapshot.size > 0;
          if (!userExists) {
            // If the user doesn't exist, add to Firestore
            addDoc(collection(dbService, 'User'), {
              createrId: user.uid,
              id: phoneNumber,
              createdAt: serverTimestamp()
              // Add other fields as needed
            });
          }
          // Navigate to the appropriate location based on user existence
          navigate(userExists ? '/' : '/Auth/Info');
        })
        .catch((error) => {
          console.error("Phone number sign-in verification failed:", error);
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

export default PhoneSignIn; 