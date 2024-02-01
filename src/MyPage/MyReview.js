import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import './MyPage.css';
import { FaStar } from 'react-icons/fa';

const MyReview = () => {
  const location = useLocation();
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const reviewsQuery = query(
          collection(dbService, 'Reviews'),
          where('creatorId', '==', authService.currentUser.uid), // Assuming you have a field 'userId' in your Reviews collection
          // orderBy('timestamp', 'desc') // You can order by a timestamp or any other field
        );

        const querySnapshot = await getDocs(reviewsQuery);

        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMyReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching my reviews:', error);
      }
    };

    fetchMyReviews();
  }, []);

  return (
    <div className="home-container">
      <nav className="home-nav" style={{ backgroundColor: 'black' }}>
        <ul>
        <li className={location.pathname === '/mypage' ? 'active' : ''}><Link to="/mypage">내가 쓴 글</Link></li>
          <li className={location.pathname === '/mypage/MyComment' ? 'active' : ''}><Link to="/mypage/MyComment">댓글단 글</Link></li>
          <li className={location.pathname === '/mypage/SavedPost' ? 'active' : ''}><Link to="/mypage/SavedPost">저장한 글</Link></li>
          <li className={location.pathname === '/mypage/UpdateInfo' ? 'active' : ''}><Link to="/mypage/UpdateInfo">내 정보 수정</Link></li>
          <li className={location.pathname === '/mypage/MyReview' ? 'active' : ''}><Link to="/mypage/MyReview">내가 쓴 리뷰</Link></li>
          <li className={location.pathname === '/mypage/LikedProduct' ? 'active' : ''}><Link to="/mypage/LikedProduct">관심상품</Link></li>
        </ul>
      </nav>

      <div className="review-container">
        <ul className="review-list">
          {myReviews.map((review) => (
            <li key={review.id} className="review-list-item">
              <Link to={`/shop/Detail/${review.ProductID}`}>
              <img src={review.image} alt={review.name} style={{ width: '150px', height: '150px' }}/>
              <h3>{review.name}</h3></Link>
              <div></div>
              <img src={review.reviewimage} alt={review.name} style={{ width: '100px', height: '100px' }}/>
              <p className='review-text'>{review.text}</p>
              <div className='detail-rating'>{[0, 1, 2, 3, 4].map((index) => (
              <FaStar
                key={index}
                size="15"
                color={index < review.userrate ? 'gold' : 'lightGray'}
              ></FaStar>
            ))}</div>
            </li>
          ))}
        </ul>
      </div>
</div>
  );
};

export default MyReview;
