import { Link } from 'react-router-dom';
import logo from './HeaderLogo.png';
import { React, useState } from 'react';

export default function Header() {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 로직 추가
    console.log('검색어:', searchInput);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 150px' }}>
      <Link to="/">
        <img src={logo} alt="로고" style={{ width: '200px', height: '120px' }} />
      </Link>
      <form style={{ marginLeft: '10px', flexGrow: 1, display: 'flex' }} onSubmit={handleSearch}>
        <input type="text" placeholder="검색" style={{ width: '80%', marginRight: '10px' }} value={searchInput} 
        onChange={(e) => setSearchInput(e.target.value)} />
        <button type="submit" style={{ width: '20%' }}>검색</button>
      </form>
      <div style={{ marginLeft: '10px' }}>
        <div>
          <Link to="/Auth" style={{ fontSize: "0.5vw", fontWeight: "bold", marginRight: '10px' }}>
            로그인 | 회원가입</Link>
        </div>
        <div style={{ display: 'flex' }}>
          <Link to="/Shop/Shop" style={{ fontSize: "0.5vw", fontWeight: "bold", marginRight: '10px' }}>쇼핑</Link>
          <Link to="/Community" style={{ fontSize: "0.5vw", fontWeight: "bold" }}>커뮤니티</Link>
        </div>
      </div>
    </div>
  );
}
