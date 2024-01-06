import React, { useEffect, useState } from 'react';
import { Link } from'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import ReviewEdit from './Edit';
import { authService, dbService } from '../../fbase';
import Edit from './Edit';
import Col from 'react-bootstrap/Col';

const RList = () => {
    const [userReviews, setUserReviews] = useState([]);
    const user = authService.currentUser;

    useEffect(() => {
        const q = query(
        collection(dbService, 'userReviews'),
        where('creatorId', '==', user.uid)
        );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userReviewArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, }));
      setUserReviews(userReviewArray);
    }); }, [user]);

    return (
              <>
        <Col lg="3" md="3" sm="1" xs="1">
            <div className="myCafeIn">
              
                  <Link to="/Home/*">My CafeIn</Link>
                    <ul className="list-group list-group-flush" style={{ listStyle: "none" }}>
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
                        <Link to="/MyPage/Review/Review/*" style={{ color: "#6F6F6F" }}>작성 가능한 리뷰</Link>
                        </li>
                        <li>
                        <Link to="/Mypage/Review/RList/*" style={{color:'#8D5124', fontWeight:550}}>내가 작성한 리뷰 </Link></li>
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
            <Link to="/MyPage/Review/Review/*">
              <h3
                style={{
                  fontWeight: 600,
                  textDecoration: "none",
                  position: "relative",
                  float:"left",
                  right:"3%",
                  color: "#6F6F6F"
                }}
              >
                작성 가능한 리뷰
              </h3>
              </Link>
            </li>
            <li>
              <h3 
                  style={{
                    fontWeight: 600,
                    textDecoration: "none",
                    float:"left",
                    position: "relative",
                    left:"6%",
                    color:"black"
                  }}
                >
                  내가 작성한 리뷰
                
              </h3>
            </li>
          </ul>
          <hr/>

        {userReviews.map((userReview) => (
            <Edit
            key={userReview.id}
            reviewObj={userReview}
            isOwner={true} 
            />
        ))}
        </div>
        </>
    );
};

export default RList;