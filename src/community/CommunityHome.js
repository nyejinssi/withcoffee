import React, { useState, useEffect } from 'react';
import WritePost from './WritePost';
import PopularPosts from './PopularPosts';
import Post from './Post'; // Import the Posts component
import { useNavigate, Link , useLocation } from 'react-router-dom';
import './community.css';

const CommunityHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState('popular');

  useEffect(() => {
    // Extract category from the current URL
    const categoryFromURL = location.pathname.split('/').pop();
    setCategory(categoryFromURL || 'popular'); // Default to 'popular' if not present
  }, [location.pathname]);

  const handleCategoryClick = (clickedCategory) => {
    setCategory(clickedCategory);
    navigate(`/community/${clickedCategory}`);
  };

  const handleWritePostClick = () => {
    // Navigate to the WritePost page
    navigate('/community/write');
  };

  return (
    <div className="community-container">
      <nav className="community-nav">
        <ul>
          <li><Link to="/community/popular">인기</Link></li>
          <li><Link to="/community/freedom" onClick={() => handleCategoryClick('freedom')}>자유</Link></li>
          <li><Link to="/community/coffeeBean" onClick={() => handleCategoryClick('coffeeBean')}>원두</Link></li>
          <li><Link to="/community/tools" onClick={() => handleCategoryClick('tools')}>도구</Link></li>
          <li><Link to="/community/startup" onClick={() => handleCategoryClick('startup')}>창업</Link></li>
          <li><Link to="/community/promotion" onClick={() => handleCategoryClick('promotion')}>홍보</Link></li>
        </ul>
      </nav>

      {category === 'popular' ? (
        <PopularPosts />
      ) : (
        <Post category={category} />
      )}
      <button className="community-button" onClick={handleWritePostClick}>글쓰기</button>
    </div>
  );
};

export default CommunityHome;

