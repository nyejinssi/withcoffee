import { dbService, authService } from '../fbase';
import React, { useEffect, useState } from 'react';
import { getFirestore, addDoc, getDocs, collection, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation} from 'react-router-dom';
import Review from './Review.css';
import { FaStar } from 'react-icons/fa';

const Write = () => {
  const location = useLocation();
  const productId = location.pathname.split('/').pop();

  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const beansProductDoc = doc(dbService, 'Beans', productId);
        const beansProductSnapshot = await getDoc(beansProductDoc);

        if (beansProductSnapshot.exists()) {
          const data = beansProductSnapshot.data();
          setSelectedProduct({ id: beansProductSnapshot.id, brand: data?.brand || '', ...data });
        } else {
          const toolsProductDoc = doc(dbService, 'Tools', productId);
          const toolsProductSnapshot = await getDoc(toolsProductDoc);

          if (toolsProductSnapshot.exists()) {
            const data = toolsProductSnapshot.data();
            setSelectedProduct({ id: toolsProductSnapshot.id, brand: data?.brand || '', ...data });
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


  const [userreview, setUserreview] = useState("");
  const [userreviews, setUserreviews] = useState([]); 
  const [attachment, setAttachment] = useState("");
  const user = authService.currentUser;

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
          const docRef = await addDoc(collection(dbService, "Reviews"), {
            text: userreview,
            createdAt: Date.now(),
            creatorId: user.uid,
            reviewimage: attachment,
            ProductID: productId,
            name:selectedProduct.name,
            image:selectedProduct.image,
            userrate: selectedScore, 
          });
            setUserreview("");
            console.log("Document written with ID: ", docRef.id);
             navigate('/');
        } catch (error) {
            console.error("Error adding document: ", error);
          }
        };

    const onChange = (event) => {
        const { target: {value} } = event; 
        setUserreview(value); 
    };
    
    const onFileChange = (event) => {
        const { target: {files} } = event;
        const theFile = files[0];
        const reader = new FileReader();
        
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        };

        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment("");

    const ARRAY = [0, 1, 2, 3, 4];
    const [selectedScore, setSelectedScore] = useState(null);
    const [score, setScore] = useState([false, false, false, false, false]);

    const starScore = (index) => { //마우스에 따라 별점이 실시간으로 채워지는 action
      const newScore = index + 1; 
      setScore(new Array(5).fill(false).map((_, i) => i < newScore));
      setSelectedScore(newScore);
    };    

    const resetStars = () => { //클릭 시 별점 고정시킴.
      setScore(new Array(5).fill(false));
    };

    return (
      <div className="shop-review-container">
          <form onSubmit = {onSubmit} style={{ margin: '0 auto', textAlign:'center' }}>
          {selectedProduct && (  // selectedProduct이 존재하는 경우에만 렌더링
              <h2 className='productName'>{selectedProduct.name}</h2>
            )}
              <textarea
                  value = {userreview}  
                  placeholder = "내용을 입력하세요" 
                  maxLength = {120} 
                  onChange = {onChange} 
                  className='NewReviewArea'
              /> <br/>
              {ARRAY.map((el, index) => (
              <FaStar
                key={index}
                size="20"
                onMouseLeave={() => starScore(index)}
                onClick={resetStars}              
                color={index < selectedScore ? 'gold' : 'lightGray'}
              ></FaStar>
            ))}
              <input type = "file" accept = "image/*" onChange={onFileChange}/>
              <input className="review-save-button" type = "submit" value = "저장"/>
              {attachment && (
                  <div>
                      <img src = {attachment} width = "100px" height = "80px" />
                      <button className="PhotoDelete" id="deleteReview" onClick = {onClearAttachment}>X</button>
                  </div>
                  )}
          </form>
      </div>
    );
};

export default Write;