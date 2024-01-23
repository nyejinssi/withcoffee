import React, { useState } from 'react';
import { authService, dbService } from '../fbase';
import { getFirestore, doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const UserInfo = () => {
    const navigate = useNavigate();
    const user = authService.currentUser;
    const createrId = user.uid;
    const [nickname, setNickname] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, SetPhoneNumber] = useState("");
    
    const onChange = (event) => {
      const { target: { name, value } } = event;
      let modifiedValue;
    
      if (name === "nickname") {
        setNickname(value);
      } else if (name === "phoneNumber") {
        modifiedValue = value.replace(/\D/g, '');
        SetPhoneNumber(modifiedValue);
      } else if (name === "name") {
        setName(value);
      }
    };
    

    const handleSubmit = async (event) => {
      event.preventDefault();
      const user = authService.currentUser;
      const uid = user.uid;
      
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
            phoneNumber: phoneNumber,
            name: name
          });
    
          console.log('User information updated successfully');
          navigate('/Auth/SignUpDone');
        }
      });
    };

  return (
    <div style={{ alignItems: 'center', height: '80vh', textAlign:'center'}}>
      <p style={{ fontSize: '1.5em',fontWeight: 'bold'}}>사용자 정보 입력</p>
        <p> 해당 정보를 입력하지 않을 경우, <br/> 커뮤니티, 쇼핑 등의 활동에 제약이 있을 수 있습니다. </p>
      <form style={{textAlign:'center', maxWidth: '20%', width: '100%', alignItems: 'center'}}>        
        <label style={{textAlign:'left'}}>
        닉네임 <input type="text" name="nickname" placeholder='ex. 커피윗유' required style={{width:'100%'}} onChange={onChange} />
        </label>
        <br />
        <label style={{textAlign:'left'}}> 전화번호
          <input type="text" name="phoneNumber" placeholder='01011111111' required style={{width:'100%'}} onChange={onChange} />
        </label>
        <br />
        <label style={{textAlign:'left'}}> 이름
          <input type="text" name="name" placeholder='홍길동' required style={{width:'100%'}} onChange={onChange} />
        </label>
        <br />
        <button type="submit" onClick={handleSubmit} style={{ backgroundColor:'black', color:'white', border:'gray'}}>회원가입하기</button>
      </form>
    </div>
      );
        }    

export default UserInfo; 
