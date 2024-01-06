import React, { useState } from 'react';
import WritePost from './WritePost';
import Post from './Post'; // Import the Posts component
import { useNavigate, Link } from 'react-router-dom';

const CommunityHome = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');

  const handleCategoryClick = (clickedCategory) => {
    setCategory(clickedCategory);
  };

  const handleWritePostClick = () => {
    // Navigate to the WritePost page
    navigate('/community/write');
  };

  return (
    <div>
      <nav>
        <ul>
        <li><Link to="/community" >전체</Link></li>
          <li><Link to="/community/popular" >인기</Link></li>
          <li><Link to="/community/freedom" onClick={() => handleCategoryClick('freedom')} >자유</Link></li>
          <li><Link to="/community/coffeeBean" onClick={() => handleCategoryClick('coffeBean')}>원두</Link></li>
          <li><Link to="/community/tools" onClick={() => handleCategoryClick('tools')} >도구</Link></li>
          <li><Link to="/community/startup" onClick={() => handleCategoryClick('startup')} >창업</Link></li>
          <li><Link to="/community/promotion" onClick={() => handleCategoryClick('promotion')} >홍보</Link></li>
        </ul>
      </nav>

      {/* Use the Posts component with the selected category */}
      <Post category={category} />
      <button onClick={handleWritePostClick}>글쓰기</button>
    </div>
  );
};

export default CommunityHome;
