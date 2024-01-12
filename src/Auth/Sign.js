import React, { useState } from 'react';
import { authService, dbService } from '../fbase';
import { getAuth, GoogleAuthProvider, signInWithPopup , createUserWithEmailAndPassword} from "firebase/auth";
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
            navigate('/Auth/UserInfo');
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
            navigate('./UserInfo');
          } catch (error) {
            console.error('Error signing in with social provider:', error);
          }
        };
  
    const toggleAccount = () => setNewAccount((prev) => !prev);

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
                <form onSubmit={onSubmit} className="container">
                  <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                    className="authInput"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                    className="authInput"
                  />
                  <input
                    type="submit"
                    value={newAccount ? "Create Account" : "Log In"}
                    className="authInput authSubmit"
                  />
                  {error && <span className="authError">{error}</span>}
                </form>
                <span onClick={toggleAccount} className="authSwitch">
                  {newAccount ? "Sign In" : "Create Account"}
                </span>
                </div>
                <div>
                        <img className='G-SingIn' src={GoogleLogin} onClick={onSocialClick} name="google" alt="구글로 로그인" />

                </div>
            </>
             );
        }    

export default Sign; 