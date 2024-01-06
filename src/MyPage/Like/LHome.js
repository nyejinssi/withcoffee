import { dbService, authService } from '../../fbase';
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Like.css';
import Col from 'react-bootstrap/Col';

// 찜한 상품 ( Like.js )
const LHome = () => {
  const [userLike, setUserLike] = useState([]);
  const user = authService.currentUser;

  useEffect(() => {
    const q = query(
      collection(dbService, 'Like'),
      where('userId', '==', user.uid)
    );
        
    onSnapshot(q, (snapshot) => {
      const userArray = snapshot.docs.map((doc)=>({
        ...doc.data(), 
        id: doc.id,}));
      setUserLike(userArray);
    },[user]);
  });

  
    const onDeleteClick = async (like, isOwner) => {
            await deleteDoc(doc(dbService, `Like/${like.id}`));
            if(like.ProductImg !== "") {
                await deleteDoc(doc(dbService, like.ProductImg));
            }
    };

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
                        <Link to="/MyPage/Like/LHome/*" style={{color:'#8D5124', fontWeight:550}}> 찜한 상품</Link>
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
                        <Link to="/Mypage/Review/RList/*" style={{ color: "#6F6F6F" }}>내가 작성한 리뷰 </Link></li>
                        <hr/>
                        <li>
                          <Link to="/MyPage/Account/Home/*">계정 관리</Link>
                          </li>
                    </ul>
                </div>
                </Col> 

    <div>
        <div className="myPageLike2">
        <h2 style={{ marginTop: "5%", marginBottom: "1%", marginLeft: "1%" }}>
            찜한 상품
          </h2>
          <hr/>
        {userLike.map((L) => (
          <div key={L.id} L={L} style={{display:'grid', gridTemplateColumns:'2fr 3fr 1fr 1fr', alignItems:'center'}} >
            <a href={`/Shop/ProductDetail/${L.id}`}/>
              <img src={L.ProductImg} className="LikeimgConts"/>
              <div className="LikeidConts">{L.ProductName}</div>
              <div className="LikePriceConts">{L.ProductPrice}</div>
              <button onClick={onDeleteClick} className={`${"cancleConts"} ${"btn-close"}`}></button>
          </div>  ))}
    </div>
    </div>
    </>
  );
};

export default LHome;