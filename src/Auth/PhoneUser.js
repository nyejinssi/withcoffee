import React, { useState } from 'react';
import { authService, dbService } from '../fbase';
import { getFirestore, doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const UserInfo = () => {
    const navigate = useNavigate();
    const user = authService.currentUser;
    const createrId = user.uid;

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      const user = authService.currentUser;
      const uid = user.uid;
    
      const nickname = event.target.elements.nickname.value;
      let name = event.target.elements.name.value;
    
      // Get a reference to the user document based on the condition
      const usersCollection = collection(dbService, 'User');
    
      // Get all documents in the collection
      const querySnapshot = await getDocs(usersCollection);
    
      querySnapshot.forEach((userDoc) => {
        const data = userDoc.data();
        if (data.createrId === uid) {
          // If the condition is met, update the document
          const userDocRef = doc(usersCollection, userDoc.id);
          updateDoc(userDocRef, {
            nickname: nickname,
            name: name,
            // Add other fields as needed
          });
    
          console.log('정보 입력 완료!');
          navigate('Auth/SignUpDone');
        }
      });
    };
    const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh', // 화면의 높이에 맞게 조절할 수 있습니다.
    };
  
    const formStyle = {
      textAlign: 'center',
      maxWidth: '20%', // 폼의 최대 너비 설정
      width: '100%',
    };

      return (
        <div style={containerStyle}>
      <form style={formStyle}>
        <p style={{ fontSize: '1.5em',fontWeight: 'bold'}}>사용자 정보 입력</p>
        <p> 해당 정보를 입력하지 않을 경우, <br/> 커뮤니티, 쇼핑 등의 활동에 제약이 있을 수 있습니다. </p>
        <label style={{textAlign:'left'}}> 닉네임
          <input type="text" name="nickname" placeholder='ex. 커피윗유' required style={{width:'100%'}}/>
        </label>
        <br />
        <label style={{textAlign:'left'}}> 이름
          <input type="text" name="name" placeholder='홍길동' required style={{width:'100%'}}/>
        </label>
        <br />
        <button type="submit">회원가입하기</button>
      </form>
    </div>
      );
        }    

export default UserInfo; 

