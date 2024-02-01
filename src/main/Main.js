import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MBTIbackground from './coffeembti.png';
import { authService, dbService } from '../fbase';
import {
  addDoc,
  setDoc,
  getDocs,
  doc,
  collection,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  where,
} from 'firebase/firestore';
const Main = () => {
  const [popularKeywords, setPopularKeywords] = useState([]);

  useEffect(() => {
    const searchKeywordsRef = collection(dbService, 'searchKeywords');
    const q = query(searchKeywordsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const keywords = snapshot.docs.map((doc) => doc.data().keyword);
      setPopularKeywords(keywords.slice(0, 5)); // 최근 5개만 가져오기
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시에 구독 해제
  }, []);  // 최초 한 번만 실행

  return (
    <>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <br /><br /><br/><br />
        <img src={MBTIbackground} alt="Example" style={{ maxWidth: '100%', height: 'auto' }} />
        <div
          id="mbti_box"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Link to="/MBTI/MBTItest" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#ffffff', color: '#000000', padding: '10px 20px', border: 'none' }}>
              커피 MBTI
            </button>
          </Link>
        </div>
      </div>
      <div>
        <h2>실시간 인기 검색어</h2>
        <ul>
          {popularKeywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
    </>
    
  );
};

export default Main;
