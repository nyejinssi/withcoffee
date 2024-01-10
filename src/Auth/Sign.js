import React, { useState } from 'react';
import { authService, dbService } from '../fbase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, addDoc, getDocs, collection, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import logo from '../header/HeaderLogo.png';
import GoogleLogin from './btn_google_signin_light_normal_web.png';

const Sign = () => {
    const navigate = useNavigate();
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
            navigate('./UserInfo');
          } catch (error) {
            console.error('Error signing in with social provider:', error);
          }
        };

        return (
                <>
                <div>
                    <table>              
                            <tr>
                                <td ><img src={logo} className="logo_img" alt="logo" /> </td>
                                <td> 로그인 | 회원가입 </td>
                            </tr>
                    </table>
                </div>
                <div>
                        <img className='G-SingIn' src={GoogleLogin} onClick={onSocialClick} name="google" alt="구글로 로그인" />

                </div>
            </>
             );
        }    

export default Sign; 