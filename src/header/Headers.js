import React, { useState, useEffect } from 'react';
import { Link , useLocation, useNavigate} from 'react-router-dom';
import { authService, dbService } from '../fbase';
import logo from './HeaderLogo.png';
import SearchIcon from './검색.png';
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
export default function Header() {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    // Navigate to search page
    navigate(`/shop/Search/${searchInput}`);

    // Save the search keyword to Firebase
    if (searchInput.trim() !== '') {
      try {
        // Assuming you have a collection named 'searchKeywords' in Firestore
        await addDoc(collection(doc(dbService, 'searchKeywords')),{
          keyword: searchInput,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error saving search keyword to Firebase:', error);
      }
    }

    // Clear the search input
    setSearchInput('');
  };
  
  const AlertCom =(e)=>{
    e.preventDefault();
    alert("로그인후, 이용하실 수 있습니다")
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '10%', padding: '0 20px',backgroundColor:'black' }}>
  <div style={{ flex: '1', display: 'flex', alignItems: 'center', height: '70%', maxWidth:"70%" }}>
    <Link to="/" style={{ width: '50%' }}>
      <img src={logo} alt="로고" style={{ width: '50%', height: '50%', maxwidth:'80%', minWidth:'20%' }} />
    </Link>
  </div>
  <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', height: '100%', marginRight: '100px', border: 'None', boxShadow: 'none' }}>
  <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
    <input
      type="text"
      placeholder="검색"
      style={{ flex: '1', padding: '5px', marginRight: '5px', border: '1px solid #ccc', borderRadius: '5px', height: '100%', margin: '0' }}
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
    <button type="submit" style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', padding: '0', cursor: 'pointer', height: '100%', margin: '0' }}>
      <img src={SearchIcon} alt="검색" style={{ width: '20px', height: '23px', margin: '0' }} />
    </button>
  </div>
</form>
  <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
    <Link to="/shop/Beans" style={{ flex: '1', textDecoration: 'none', color: 'white' }}>쇼핑</Link>
    <div onClick={AlertCom} style={{ flex: '1', cursor: 'pointer', textDecoration: 'none', color: 'white',fontWeight: 'bold' }}>커뮤니티</div>
    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Link to="/Auth" style={{ textDecoration: 'none', color: 'black', fontSize: '80%', textAlign: 'center', color:'white' }}>로그인 <br />회원가입</Link>
    </div>
  </div>
  </div>  
  );
}
