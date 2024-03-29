import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MBTIbackground from './coffeembti.png';
import { authService, dbService } from '../fbase';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';

const Main = () => {
  const [popularKeywords, setPopularKeywords] = useState([]);
  const [testData, setTestData] = useState(null);

  const [bestBeans, setBestBeans] = useState([]);
  const [bestTools, setBestTools] = useState([]);

  const [bestItems, setBestItems] = useState([]);

  useEffect(() => {    
    const fetchPopularKeywords = async () => {
      const searchKeywordsRef = collection(dbService, 'searchKeywords');
      const q = query(
        searchKeywordsRef,
        orderBy('count', 'desc'),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const keywords = querySnapshot.docs.map((doc, index) => `${index + 1}. ${doc.data().keyword}`);
      setPopularKeywords(keywords);
    };

    fetchPopularKeywords();
    const fetchData = async () => {
      try {
          const response = await fetch('../MBTI/data.json');  // 파일 경로에 따라 수정
          const data = await response.json();
          setTestData(data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  const fetchBestItems = async () => {
    const beansRef = collection(dbService, 'Beans');
    const toolsRef = collection(dbService, 'Tools');

    const beansQuery = query(
      beansRef,
      orderBy('purchaseCnt', 'desc'),
      limit(2)
    );

    const toolsQuery = query(
      toolsRef,
      orderBy('purchaseCnt', 'desc'),
      limit(2)
    );

    const beansSnapshot = await getDocs(beansQuery);
    const beans = beansSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setBestBeans(beans);

    const toolsSnapshot = await getDocs(toolsQuery);
    const tools = toolsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setBestTools(tools);

    const bestItems = [...beans, ...tools];
    setBestItems(bestItems);
  };


  fetchData();
  fetchBestItems();
  }, []); 

  
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
          <Link to="/MBTI/MBTIMain" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#ffffff', color: '#000000', padding: '10px 20px', border: 'none' }}>커피 MBTI</button>
          </Link>
        </div>
      </div>
      <div style={{  marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{textAlign: 'center'}}>실시간 인기 검색어</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {popularKeywords.map((keyword) => (
            <li key={keyword} style={{ fontSize: '1.2rem', margin: '8px 0', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: keyword }} />
          ))}
        </ul>
      </div>
          
      <div>
        <h2 style={{textAlign: 'center'}}>쇼핑 Best</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {bestItems.map(item => (
            <div key={item.id}>
              <Link to={`/shop/Detail/${item.id}`}>
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', marginBottom: '50px' }} />
              </Link>
              {/* <div style={{ textAlign: 'center' }}>{item.name}</div> */}
            </div>
          ))}
        </div>
      </div>
    </>
    
  );
};

export default Main;
