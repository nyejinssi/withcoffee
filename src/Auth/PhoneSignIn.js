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
  const [message, setMessage] = useState("");

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
      authService.languageCode = "ko";		
      const phoneNumber = getPhoneNumberFromUserInput(); 
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authService, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;	// window
          setMessage("문자가 성공적으로 전송되었습니다.");
        })
        .catch((error) => {
          console.log("SMS FAILED");
          setMessage("문자 전송에 실패했습니다. 다시 시도해주세요.");
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
            navigate('/Auth/Info/Phone/');
          }
        } else {
          console.error("User is not signed in.");
            navigate('/');
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
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}> 전화번호로 <br/>로그인 | 회원가입</p>
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div id="sign-in-button"></div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
          <input onChange={(e) => Setvalue(e.target.value)} type="text" placeholder='전화번호' style={{ width: '75%' }} />
          <button onClick={onClickHandle} style={{ backgroundColor: 'black', color: 'white', border: 'gray', marginLeft: '10px', padding: '8px', marginTop: '5px', marginBottom: '5px', width: '25%' }}> 전송 </button>
        </div>
        <p style={{ color: message.includes("성공") ? "green" : "red" }}>{message}</p>
        <p style={{ fontSize: '80%', color: 'red' }}> '-'없이 입력해주세요! ex. 01012345678 </p>
        <br/>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
          <input onChange={(e) => setVerificationCode(e.target.value)} type="text" value={verificationCode} placeholder='인증번호' style={{ width: '75%' }} />
          <button onClick={onClickHandle2} style={{ backgroundColor: 'black', color: 'white', border: 'gray', marginLeft: '10px', padding: '8px', marginTop: '5px', marginBottom: '5px', width: '25%' }}> 확인 </button>
        </div>
        <p style={{ fontSize: '80%', color: 'red' }}>문자로 전송된 6자리의 인증번호를 입력해주세요!</p>
      </div>
      </>
   );
}    

export default PhoneSignIn; 