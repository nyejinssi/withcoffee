import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { dbService, authService } from '../../fbase';
import { Link } from 'react-router-dom';
import './Review.css';
import Col from 'react-bootstrap/Col';

const Review = () => {
  const user = authService.currentUser;
  const [confirmedProducts, setConfirmedProducts] = useState([]);

  //WReview에서 정보 가져오기
  useEffect(() => {
    const fetchConfirmedProducts = async () => {
      try {
        const wReviewCollectionRef = collection(dbService, 'WReview');
        const querySnapshot = await getDocs(wReviewCollectionRef);
        const confirmedProducts = [];
        querySnapshot.forEach((doc) => {
          const { ProductID, ProductImg, ProductName, userId } = doc.data();
          if (userId === user.uid) {
            confirmedProducts.push({
              ProductID,
              ProductImg,
              ProductName,
            });
          }
        });
        setConfirmedProducts(confirmedProducts);
      } catch (error) {
        console.error('Error retrieving confirmed products:', error);
      }
    };
  
    fetchConfirmedProducts();
  }, [user.uid]);
  
    return (
        <>
        <Col lg="3" md="3" sm="1" xs="1">
            <div className="myCafeIn">
              
                  <Link to="/Home/*">My CafeIn</Link>
                    <ul className="list-group list-group-flush" style={{ listStyle: "none", display:"flex" }}>
                        <li>
                        <Link to="/MyPage/Cart/CHome/*">장바구니</Link>
                        </li>
                        <hr/>
                        <li>
                        <Link to="/MyPage/Like/LHome/*"> 찜한 상품</Link>
                        </li>
                        <hr />
                        <li>
                        <Link to="/MyPage/Shop/ShopList/*">주문목록</Link>
                        </li>
                        <hr />
                        <li>
                        <Link to="/MyPage/Review/Review/*">리뷰관리</Link>
                        </li>
                        <li>
                        <Link to="/MyPage/Review/Review/*" style={{color:'#8D5124', fontWeight:550}}>작성 가능한 리뷰</Link>
                        </li>
                        <li>
                        <Link to="/Mypage/Review/RList/*" style={{ color: "#6F6F6F" }}>내가 작성한 리뷰 </Link></li>
                        <hr/>
                        <li>
                          <Link to="/MyPage/Account/Home/*">계정 관리</Link>
                          </li>
                    </ul>
                </div>
                </Col> 
        
                <div className="myPageLike2">
        <h2 style={{ marginTop: "5%", marginBottom: "1%", marginLeft: "1%" }}>
            리뷰관리
          </h2>

          <ul style={{ listStyle: "none", marginTop:"2%" }}>
            <li>
              <h3
                style={{
                  fontWeight: 600,
                  textDecoration: "none",
                  position: "relative",
                  float:"left",
                  right:"3%"
                }}
              >
                작성 가능한 리뷰
              </h3>
            </li>
            <li>
              <h3>
               <Link to="/MyPage/Review/RList/*"
                  style={{
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "#6F6F6F",
           
                    position: "relative",
                    left:"6%"
                  }}
                >
                  내가 작성한 리뷰
                </Link>
              </h3>
            </li>
          </ul>
          <hr/>
     
          <form>
            {confirmedProducts.map((product) => (
              <div className="myPageReviewContents" id="myPageReviewedContents1" key={product.ProductID}>
                <img src={product.ProductImg} className="ReviewimgConts" alt={product.ProductName} />
                <p id="idConts">{product.ProductName}</p>
                <Link to="/Mypage/Review/Write/*">
                  <button className="writeReview"> 리뷰쓰기 </button>
                </Link>
              </div>
            ))}
          </form>
          </div>
        </>
    );
};

export default Review;