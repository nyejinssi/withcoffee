import React, { useState, useEffect } from 'react';
import { authService, dbService } from '../fbase';
import { Link } from 'react-router-dom';
import { doc,  getDoc, getDocs,  updateDoc,  arrayUnion,  collection,  addDoc,
    query,  orderBy,  onSnapshot, where, deleteDoc} from 'firebase/firestore';

const UpdateInfo = () => {
  const user = authService.currentUser;
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user data from dbService based on uid
    const fetchUserData = async () => {
      if (user) {
        try {
          // Create a query to get the user document with the matching createrId
          const userQuery = query(collection(dbService,'User'), where('createrId', '==', user.uid));
          const userDoc = await getDocs(userQuery);

          // Check if the user document exists
          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            // Set initial values for name, nickname, and phoneNumber
            setName(userData.name || '');
            setNickname(userData.nickname || '');
            setPhoneNumber(userData.phoneNumber || '');
          } else {
            console.error('User document not found for createrId:', user.uid);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Fetch the user document first
      const userQuery = query(collection(dbService, 'User'), where('createrId', '==', user.uid));
      const userDocSnapshot = await getDocs(userQuery);
  
      if (!userDocSnapshot.empty) {
        const userDocRef = doc(dbService, 'User', userDocSnapshot.docs[0].id);
  
        // Update the user document with the new information
        await updateDoc(userDocRef, {
          name,
          nickname,
          phoneNumber,
        });
  
        console.log('User information updated successfully.');
      } else {
        console.error('User document not found for createrId:', user.uid);
      }
    } catch (error) {
      console.error('Error updating user information:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/mypage">내가 쓴 글</Link></li>
          <li><Link to="/mypage/MyComment">댓글단 글</Link></li>
          <li><Link to="/mypage/SavedPost">저장한 글</Link></li>
          <li><Link to="/mypage/UpdateInfo">내 정보 수정</Link></li>
        </ul>
      </nav>
      <form onSubmit={handleSubmit}>
        <label>
          이름:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="당신의 이름을 입력해주세요!" />
        </label>
        <br />
        <label>
          닉네임:
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="당신의 닉네임을 입력해주세요!" />
        </label>
        <br />
        <label>
          전화번호:
          <input type="String" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="당신의 전화번호를 입력해주세요!" />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : '수정'}
        </button>
      </form>
    </div>
  );
};

export default UpdateInfo;