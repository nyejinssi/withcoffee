import { dbService, authService } from '../fbase';
import React, { useEffect, useState } from 'react';
import { getFirestore, addDoc, getDocs, collection, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import '../Sign/UserInfo.css';
import { useNavigate } from 'react-router-dom';
import ModalPage from './UserAddress';
import Main from '../Main';
import UserAddress from './UserAddress';

const UserInfo = () => {
    const user = authService.currentUser;
    const [username, setUsername] = useState("");
    const [userphonenumber, setUserPhonenumber] = useState("");
    const [userInfomation, setUserInfo] = useState([]);
    const navigate = useNavigate();   

    useEffect(() => {
            const q = query(collection(dbService, "userInfomation"));
            onSnapshot(q, (snapshot) => {
                const UserInfoArray = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id, 
                }));
            setUserInfo(UserInfoArray);
            });
        }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const UserInfomation ={
                name: username,
                number: userphonenumber,
                createrId : user.uid,
                createdAt: Date.now()
            }
            const docRef = await addDoc(collection(dbService, "userInfomation"), UserInfomation);
            setUsername("");
            setUserPhonenumber("");
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        navigate('../Sign/UserAddress');
    };

    const onChange = (event) => {
        const { target: {name, value} } = event; 
        if (name === "usersname"){
            setUsername(value); 
        } else if (name === "usersphonenumber"){
            setUserPhonenumber(value);
        }
    };

    return(
        <div className="UserInfo-box">
            <h2>회원가입을 위해 이름과 전화번호를 입력해주세요.</h2>
            <form onSubmit={onSubmit}>
                <div className="user-box">
                    <label style={{display:"inline",marginRight:"10%"}}>이름</label>
                    <input className="InputUserName" value = {username} name= "usersname" type = "name" placeholder="홍길동" maxLength = {15} onChange = {onChange} required/>
                </div>
                <div className="user-box">
                    <label>전화번호</label>
                    <input className="InputUserPhone" value = {userphonenumber} name="usersphonenumber" placeholder="010-1111-1111" type = "tel" maxLength = {11} onChange = {onChange} required />
                </div>
                <input className="UserInfoNext" type = "submit" value = " 다음 " required/><br/>
            </form>
        </div>
    );      
};

export default UserInfo;