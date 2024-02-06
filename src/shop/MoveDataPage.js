import React, { useEffect } from 'react';
import { dbService, realtimeDB } from '../fbase';
import { ref, set } from "firebase/database";
import { collection, getDocs } from 'firebase/firestore';

const moveFirestoreDataToRealtimeDB = async () => {
  try {
    // Firestore 컬렉션의 데이터 읽기
    const beansCollection = collection(dbService, 'Beans');
    const beansSnapshot = await getDocs(beansCollection);
    const beansData = {};

    beansSnapshot.forEach((doc) => {
      // Firestore 문서 ID를 Key로 사용하여 데이터 저장
      beansData[doc.id] = doc.data();
    });

    // Realtime Database의 'Beans' 경로에 Beans 데이터 저장
    const dbRealtime = realtimeDB; // realtimeDB 객체 가져오기
    set(ref(dbRealtime, 'Beans'), beansData);

    // Tools 컬렉션의 데이터 읽기
    const toolsCollection = collection(dbService, 'Tools');
    const toolsSnapshot = await getDocs(toolsCollection);
    const toolsData = {};

    toolsSnapshot.forEach((doc) => {
      // Firestore 문서 ID를 Key로 사용하여 데이터 저장
      toolsData[doc.id] = doc.data();
    });

    // Realtime Database의 'Tools' 경로에 Tools 데이터 저장
    set(ref(dbRealtime, 'Tools'), toolsData);

    console.log('Data moved successfully to Realtime Database!');
  } catch (error) {
    console.error('Error moving data:', error);
  }
};

const MoveDataPage = () => {
  useEffect(() => {
    // 컴포넌트가 마운트될 때 데이터 이동 함수 호출
    moveFirestoreDataToRealtimeDB();
  }, []);

  return (
    <div>
      <h1>Data Move Page</h1>
      {/* 이 페이지에서는 실제로 렌더링하는 부분이 필요 없으므로 비워두었습니다. */}
    </div>
  );
};

export default MoveDataPage;
