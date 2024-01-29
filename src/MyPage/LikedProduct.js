import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './MyPage.css';

const LikedProduct = ()  => {
    const user = authService.currentUser;
    const [likedProducts, setLikedProducts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedProducts = async () => {
          try {
            const likedProductsQuery = query(
              collection(dbService, 'Liked'),
              where('likedBy', 'array-contains', user.uid)
            );
    
            const querySnapshot = await getDocs(likedProductsQuery);
    
            const likedProductsData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
    
            setLikedProducts(likedProductsData);
          } catch (error) {
            console.error('Error fetching liked products:', error);
          }
        };
    
        fetchLikedProducts();
      }, [user.uid]);
    
      const handleNavigateToReviewWrite = (productId) => {
        navigate(`/Review/Write/${productId}`);
      };
    

    const getTypeString = (type) => { //타입
        switch (type) {
          case 0:
            return '로스팅 홀빈';
          case 1:
            return '분쇄';
          case 2:
            return '생두';
          default:
            return type;
        }
      };

    return (
      <div className="home-container">
      <nav className="home-nav">
        <ul>
        <li className={location.pathname === '/mypage' ? 'active' : ''}><Link to="/mypage">내가 쓴 글</Link></li>
          <li className={location.pathname === '/mypage/MyComment' ? 'active' : ''}><Link to="/mypage/MyComment">댓글단 글</Link></li>
          <li className={location.pathname === '/mypage/SavedPost' ? 'active' : ''}><Link to="/mypage/SavedPost">저장한 글</Link></li>
          <li className={location.pathname === '/mypage/UpdateInfo' ? 'active' : ''}><Link to="/mypage/UpdateInfo">내 정보 수정</Link></li>
          <li className={location.pathname === '/mypage/MyReview' ? 'active' : ''}><Link to="/mypage/MyReview">내가 쓴 리뷰</Link></li>
          <li className={location.pathname === '/mypage/LikedProduct' ? 'active' : ''}><Link to="/mypage/LikedProduct">관심상품</Link></li>
        </ul>
      </nav>

          <div className='liked-container'>
            <ul className="liked-list">
            {likedProducts.map((product) => (
            <li key={product.id} className="liked-list-item">
                <Link to={`/shop/Detail/${product.id}`}>
                <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px' }}/>
                <h3>{product.name}</h3>
                </Link>
                <p className='posts-metadata'>브랜드 : {product.brand} | 타입 : {getTypeString(product.type)} | 가격 : {product.price}</p>
            </li>
            ))}
        </ul>
          </div>
          </div>
    )

}

export default LikedProduct;