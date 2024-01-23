import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import { doc, getDoc, getDocs, query, where, collection} from 'firebase/firestore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { authService } from '../fbase';

const Detail = () => {
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [reviews, setReviews] = useState([]);
   const user = authService.currentUser;

  const location = useLocation();
  const productId = location.pathname.split('/').pop();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const beansProductDoc = doc(dbService, 'Beans', productId);
        const beansProductSnapshot = await getDoc(beansProductDoc);
  
        if (beansProductSnapshot.exists()) {
          setSelectedProduct({ id: beansProductSnapshot.id, ...beansProductSnapshot.data() });
        } else {
          const toolsProductDoc = doc(dbService, 'Tools', productId);
          const toolsProductSnapshot = await getDoc(toolsProductDoc);
  
          if (toolsProductSnapshot.exists()) {
            setSelectedProduct({ id: toolsProductSnapshot.id, ...toolsProductSnapshot.data() });
          } else {
            console.error('Product not found');
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
  
    fetchProduct();
  }, [productId]);

  const handleWriteReview = (productId) => {
    const user = authService.currentUser;

    if (user) {
      // User is logged in
      navigate(`/Review/Write/${productId}`);
    } else {
      // User is not logged in
      navigate('/Auth');
    }
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsQuery = query(collection(dbService, 'Reviews'), where('ProductID', '==', productId));
        const reviewsSnapshot = await getDocs(reviewsQuery);
  
        const reviewsData = reviewsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    fetchReviews();
  }, [productId]);
  
        
  if (!selectedProduct) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h2>{selectedProduct.name}</h2>
      {selectedProduct.image && <img src={selectedProduct.image} alt="Product" style={{ width: '100px', height: '100px' }} />}
      <p>카테고리: {getTypeString(selectedProduct.type)}</p>
      <p>브랜드: {selectedProduct.brand}</p>
      <p>평점: {selectedProduct.rate}</p>
      <button>
            <a
              href={selectedProduct.lowest_link ? selectedProduct.lowest_link : selectedProduct.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'black' }}
              >
              <span>구매하러 가기</span>
            </a>
          </button>
          <button onClick={() => handleWriteReview(selectedProduct.id)}>
            리뷰쓰기
          </button>

          <h3>리뷰</h3>
      {reviews.map((review) => (
        <div key={review.id}>
          {/* <p>작성자: {review.creatorNickname}</p> 작성자 출력이 안 돼 ㅜㅜ */}
          <p>리뷰 내용: {review.text}</p>
          <p>평점:{[0, 1, 2, 3, 4].map((index) => (
        <FaStar
          key={index}
          size="15"
          color={index < review.userrate ? 'gold' : 'lightGray'}
        ></FaStar>
      ))}</p>
          {review.reviewimage && <img src={review.reviewimage} alt="Review" style={{ width: '100px', height: '100px' }} />}
        </div>
      ))}
    </div>
  );
};

export default Detail;
