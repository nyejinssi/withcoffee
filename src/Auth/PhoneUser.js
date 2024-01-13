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
      let phoneNumber = event.target.elements.phoneNumber.value;
    
      // Remove non-numeric characters from the phone number
      phoneNumber = phoneNumber.replace(/\D/g, '');
    
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
            // Add other fields as needed
          });
    
          console.log('정보 입력 완료!');
          navigate('Auth/SignUpDone');
        }
      });
    };

      return (
        <div>
          <form onSubmit={handleSubmit}>
            <label> 닉네임
              <input type="text" name="nickname" placeholder='닉네임' required />
            </label>
            <br />
            <label> 이름
              <input type="text" name="name" placeholder='이름' required />
            </label>
            <br />
            <label> 이메일
              <input type="text" name="email" placeholder='email' required />
            </label>
            <br />
            <button type="submit">저장</button>
          </form>
        </div>
      );
        }    

export default UserInfo; 

