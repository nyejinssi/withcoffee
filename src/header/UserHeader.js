import { Link, useNavigate  } from 'react-router-dom';
import logo from './HeaderLogo.png';
import { React, useState} from 'react';
import './header.css'; // Import the CSS file
import SearchIcon from './검색.png';

export default function Header() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop/Search/${searchInput}`);
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
          <Link to="/mypage" className="user-link">
            마이페이지
          </Link>
          <Link to="/Auth/logout" className="user-link">
            로그아웃
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/shop/Beans" className="nav-link">
            쇼핑
          </Link>
          <Link to="/Community" className="nav-link">
            커뮤니티
          </Link>
        </div>
      </div>
    </div>
  );
}
