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
        const phoneNumber = event.target.elements.phoneNumber.value;
      
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

            console.log('User information updated successfully');
            }
        });
        };

      return (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Nickname:
              <input type="text" name="nickname" required />
            </label>
            <br />
            <label>
              Phone Number:
              <input type="text" name="phoneNumber" required />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
        }    

export default UserInfo; 

