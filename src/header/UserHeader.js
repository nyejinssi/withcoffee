import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import logo from './HeaderLogo.png';
import SearchIcon from './검색.png';
import users from './users.png';
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
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchInput.trim() !== '') {
      try {
        // Assuming you have a collection named 'searchKeywords' in Firestore
        await addDoc(collection(dbService, 'searchKeywords'), {
          keyword: searchInput,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error saving search keyword to Firebase:', error);
      }
    }
    // Navigate to search page
    navigate(`/shop/Search/${searchInput}`);

    // Save the search keyword to Firebase
    

    // Clear the search input
    setSearchInput('');
  };

  const handleMouseEnter = () => { setDropdownVisible(true); };
  const handleMouseLeave = () => { setDropdownVisible(false); };
  const closeDropdown = () => { setDropdownVisible(false); };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '10%', padding: '0 20px', backgroundColor: 'black' }}>
    <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minWidth: '10%' }}>
      {/* Logo */}
      <Link to="/" style={{ width: '10%', minWidth: '25%' }}>
        <img src={logo} alt="로고" style={{ width: '100%', height: '100%', maxWidth: '80%' }} />
      </Link>
      {/* Move the search bar container here */}
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', height: '100%', marginLeft: '20px', border: 'None', boxShadow: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', border: 'None', boxShadow: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <input
              type="text"
              placeholder={searchInput ? "검색어를 입력해주세요!" : "검색"}
              style={{
                padding: '10px',
                marginRight: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                height: '100%',
                width: '300px',
                minWidth:'100px',
                maxWidth:'300px'
              }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setSearchInput('')}
              onBlur={() => {
                if (!searchInput) {
                  setSearchInput('');
                }
              }}
            />
            <button type="submit" style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', padding: '0', cursor: 'pointer', height: '100%', margin: '0' }}>
              <img src={SearchIcon} alt="검색" style={{ width: '25px', height: '33px', margin: '0' }} />
            </button>
          </div>
        </div>
      </form>
    </div>

        <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
        <Link to="/shop/Beans" style={{ textDecoration: 'none', color: 'white', marginRight: '20px' }}>쇼핑</Link>
        <div style={{ cursor: 'pointer', textDecoration: 'none', color: 'white', fontWeight: 'bold', marginRight: '20px' }}>
          <Link to="/community" style={{ textDecoration: 'none', color: 'white' }}>커뮤니티</Link>
        </div>
      </div>
        {/* My Page Dropdown */}
        <div className="header" style={{ display: 'flex', position: 'relative' }}>
  <div
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <img src={users} alt="마이페이지" style={{ width: '20%', height: '20%', cursor: 'pointer' }} />
    {dropdownVisible && (
      <div
        ref={dropdownRef}
        style={{
          position: 'absolute',
          top: 'calc(100% + 10px)', // Adjust the distance as needed
          right: '0',
          backgroundColor: '#fff',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #ddd',
          borderRadius: '4px',
          zIndex: '100',
          minWidth: '100px',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li><Link to="/mypage" style={{ color: '#333', padding: '12px 16px', display: 'block', textDecoration: 'none'}}>내가 쓴 글</Link></li>
          <li><Link to="/mypage/MyComment" style={{ color: '#333', padding: '12px 16px', display: 'block', textDecoration: 'none'}}>댓글단 글</Link></li>
          <li><Link to="/mypage/SavedPost" style={{ color: '#333', padding: '12px 16px', display: 'block', textDecoration: 'none' }}>저장한 글</Link></li>
          <li><Link to="/mypage/UpdateInfo" style={{ color: '#333', padding: '12px 16px', display: 'block', textDecoration: 'none' }}>내 정보 수정</Link></li>
          <li><Link to="/mypage/MyReview" style={{ color: '#333', padding: '12px 16px', display: 'block', textDecoration: 'none' }}>내가 쓴 리뷰</Link></li>
          <li><Link to="/mypage/LikedProduct" style={{ color: '#333', padding: '12px 16px', display: 'block', textDecoration: 'none' }}>관심상품</Link></li>
          <li><Link to="/auth/logout" style={{ color: 'red', padding: '12px 16px', display: 'block', textDecoration: 'none' }}>로그아웃</Link></li>
        </ul>
      </div>
    )}
  </div>
</div>

    </div>
  );
}