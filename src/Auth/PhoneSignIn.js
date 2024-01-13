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
  const navigate = useNavigate();
  const [value, Setvalue] = useState("");
  const appVerifier = window.recaptchaVerifier; 
  const [phoneNumber, SetPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

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
      return verificationCode;
    };

    const onClickHandle2 = async () => {
      try {
        const code = getCodeFromUserInput();
    
        if (window.confirmationResult) {
          const result = await window.confirmationResult.confirm(code);
    
          // User signed in successfully.
          const querySnapshot = await getDocs(query(collection(dbService, 'User'), where('id', '==', phoneNumber)));
          const userExists = querySnapshot.size > 0;
    
          if (!userExists) {
            // If the user doesn't exist, add to Firestore
            const user = authService.user;
            await addDoc(collection(dbService, 'User'), {
              createrId: user.uid,
              id: phoneNumber,
              createdAt: serverTimestamp(),
              // Add other fields as needed
            });
            navigate('Auth/Info/Phone');
          }
          navigate('/');
        } else {
          console.error("Confirmation result is null.");
        }
      } catch (error) {
        console.error("Phone number sign-in verification failed:", error.message);
      }
    };
    

    return (
      <>
      <div>
        <div id="sign-in-button"></div>전화번호 <input onChange={(e) => Setvalue(e.target.value)} type="text" placeholder='01011111111'/>
        <button onClick={onClickHandle}>문자보내기</button><br/>
        인증번호 <input onChange={(e) => setVerificationCode(e.target.value)} type="text" value={verificationCode} placeholder='010101'/>
        <button onClick={onClickHandle2}>인증번호 확인하기</button>
      </div>
  </>
   );
}    

export default PhoneSignIn; 