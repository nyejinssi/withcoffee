import React, { useEffect, useState } from 'react';
import { dbService, authService} from '../fbase';
import { doc, getDoc, getDocs, query, where, collection, setDoc} from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import shop from './shop.css';

const Detail = () => {
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [reviews, setReviews] = useState([]);
   const [isLiked, setIsLiked] = useState(false);

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
    const checkLikedStatus = async () => {
      // Check if the current user has liked the product
      const likedDoc = doc(dbService, 'Liked', productId);
      const likedDocSnapshot = await getDoc(likedDoc);
      setIsLiked(likedDocSnapshot.exists());
    };

    checkLikedStatus();
  }, [productId]);

  const handleLike = async () => {
    const user = authService.currentUser;

    if (user) {
      const likedDocRef = doc(dbService, 'Liked', productId);

      if (!isLiked) {
        // Like the product
        await setDoc(likedDocRef, {
          productId,
          likedBy: [user.uid],
          // Add additional product information here
          name: selectedProduct.name,
          image: selectedProduct.image,
          type: selectedProduct.type,
          brand: selectedProduct.brand,
          rate: selectedProduct.rate,
          price: selectedProduct.price
        });
      } else {
        // Unlike the product
        const likedDocSnapshot = await getDoc(likedDocRef);
        const likedBy = likedDocSnapshot.data()?.likedBy || [];
        const updatedLikedBy = likedBy.filter((userId) => userId !== user.uid);
        await setDoc(likedDocRef, { likedBy: updatedLikedBy }, { merge: true });
      }

      // Update the liked state
      setIsLiked(!isLiked);
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
    <div id='detail-container'>
      <h2>{selectedProduct.name}</h2>
      <p>카테고리: {getTypeString(selectedProduct.type)} | 브랜드: {selectedProduct.brand} | 인터넷 평점: {selectedProduct.rate}</p>
      {selectedProduct.image && <img src={selectedProduct.image} alt="Product"/>}

      <div id="button-container">
        <button>
              <a
                href={selectedProduct.lowest_link ? selectedProduct.lowest_link : selectedProduct.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'black', textDecoration:'none' }}
                >
                <span>🧺 구매하러 가기</span>
              </a>
            </button>
            <button onClick={() => handleWriteReview(selectedProduct.id)}>
              🖋️ 리뷰쓰기
            </button>
            <button onClick={handleLike}>
              {isLiked ? '💔 좋아요 해제' : '❤️ 좋아요'}
            </button>
          </div>

          <div className='detail-review'>
          <h3>WithCoffee 사용자들의 리뷰 목록</h3>
            {reviews.map((review) => (
              <div key={review.id} >
                {/* <p>작성자: {review.creatorNickname}</p> 작성자 출력이 안 돼 ㅜㅜ */}
                <p>{review.text}</p>
                <div className='detail-rating'>{[0, 1, 2, 3, 4].map((index) => (
              <FaStar
                key={index}
                size="15"
                color={index < review.userrate ? 'gold' : 'lightGray'}
              ></FaStar>
            ))}</div>
                <div className="detail-image-container">
                  {review.reviewimage && <img src={review.reviewimage} alt="Review" className="detail-image" />}
                </div>
                </div>
            ))}
          </div>
          </div>
        );
      };

export default Detail;
