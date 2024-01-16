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

    // Inside the onClickHandle2 function
  const onClickHandle2 = async () => {
    try {
      const code = getCodeFromUserInput();

      if (window.confirmationResult) {
        const result = await window.confirmationResult.confirm(code);

        // Check if user is signed in
        if (authService.currentUser) {
          const user = authService.currentUser;

          // User signed in successfully.
          const querySnapshot = await getDocs(query(collection(dbService, 'User'), where('phoneNumber', '==', phoneNumber)));
          const userExists = querySnapshot.size > 0;

          if (!userExists) {
            // If the user doesn't exist, add to Firestore
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
          console.error("User is not signed in.");
        }
      } else {
        console.error("Confirmation result is null.");
      }
    } catch (error) {
      console.error("Phone number sign-in verification failed:", error.message);
    }
  };

    

    return (
      <>
        <div style={{ textAlign: 'center', alignItems: 'center' }}>
          <img src={logo} className="logo_img" alt="logo" style={{width: '10%'}} />
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}> 전화번호로 로그인 | 회원가입</p>
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div id="sign-in-button"></div>
          <input onChange={(e) => Setvalue(e.target.value)} type="text" placeholder='전화번호 ex. 01011111111' style={{ width: '10%' }}/>
          <button onClick={onClickHandle} style={{ backgroundColor:'black', color:'white', border:'gray'}} >문자보내기</button>
          <br /><br />
          <input onChange={(e) => setVerificationCode(e.target.value)} type="text" value={verificationCode} placeholder='인증번호 ex. 010101' style={{ width: '10%' }}/>
          <button onClick={onClickHandle2} style={{ backgroundColor:'black', color:'white', border:'gray'}}>인증번호 확인하기</button>
        </div>
  </>
   );
}    

export default PhoneSignIn; 