import React, { useState, useEffect } from 'react';
import { Link , useLocation, useNavigate} from 'react-router-dom';
import { authService, dbService } from '../fbase';
import logo from './HeaderLogo.png';
import './header.css'; // Import the CSS file
import SearchIcon from './검색.png';

export default function Header() {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop/Search/${searchInput}`);
    setSearchInput('');
  };

  return (
    <div className="header-container">
      <Link to="/" className="logo-link">
        <img src={logo} alt="로고" className="logo-img" />
      </Link>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="검색"
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="search-button">
          <img src={SearchIcon} alt="검색" className="search-icon" />
        </button>
      </form>
      <div className="user-links">
        <div>
          <Link to="/Auth" className="user-link">
            로그인 | 회원가입
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/shop/Beans" className="nav-link">
            쇼핑
          </Link>
          <div className='nav-link'>
            커뮤니티
          </div>
        </div>
      </div>
    </div>
  );
}
