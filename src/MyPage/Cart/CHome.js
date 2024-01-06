import { dbService, authService } from '../../fbase';
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDocs, addDoc,deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Checkbox } from '@progress/kendo-react-inputs';
import { useNavigate } from 'react-router-dom';
// 장바구니
const CHome = () => {
  const [userCart, setUserCart] = useState([]);
  const [userPrice, setUserPrice] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [productPay, setProductPay] = useState([]);
  const user = authService.currentUser;
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevItems) => ({
      ...prevItems,
      [name]: checked,
    }));
  };
  
  const handleDelete = (productId) => {
    try {
      // Firestore에서 해당 상품 삭제
      deleteDoc(doc(dbService, 'Cart', productId));
  
      // userCart 상태 업데이트
      setUserCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  
      console.log("상품이 삭제되었습니다.");
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
    }
  };

  const handleOrder = () => {
    const selectedItems = userCart.filter((item) => checkedItems[item.id]);
    let totalPrice = 0;
    for (let i = 0; i < selectedItems.length; i++) {
      const productCount = selectedItems[i].countNumber;
      const productPrice = selectedItems[i].ProductPrice;
      const pr = productPrice * productCount;
      totalPrice += pr;
    }
    setUserPrice(totalPrice);
   
  };

  const DataInput = (e) => {
    e.preventDefault();
  
    const selectedItems = userCart.filter((item) => checkedItems[item.id]);
  
    try {
      selectedItems.forEach(async (item) => {
        const { ProductID, ProductName, ProductPrice, countNumber, ProductImg } = item;
  
        await addDoc(collection(dbService, "PaymentCheck"), {
          userId: user.uid,
          ProductID,
          ProductName,
          ProductPrice,
          countNumber,
          ProductImg,
        });
      });
  
      setCheckedItems({}); // Reset the checked items
      console.log("PaymentCheck documents added successfully");
    } catch (error) {
      console.error("Error adding documents to PaymentCheck: ", error);
    }
    navigate('/MyPage/Cart/PaymentCheck');
  };

  useEffect(() => {
    const q = query(collection(dbService, 'Cart'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserCart(userArray);
    });
    handleOrder();
    return unsubscribe;
  }, [user, userCart, checkedItems]);

  return (
  <>
 <Col lg="3" md="3" sm="1" xs="1">
            <div className="myCafeIn">
                  <Link to="/Home/*">My CafeIn</Link>
                    <ul className="list-group list-group-flush" style={{ listStyle: "none" }}>
                        <li>
                        <Link to="/MyPage/Cart/CHome/*" style={{color:'#8D5124', fontWeight:550}} >장바구니</Link>
                        </li>
                        <hr/>
                        <li>
                        <Link to="/MyPage/Like/LHome/*"> 찜한 상품</Link>
                        </li>
                        <hr />
                        <li>
                        <Link to="/MyPage/Shop/ShopList/*" >주문목록</Link>
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

        <div className="myPageCart">
          <h2 style={{ marginTop: "5%", marginBottom: "1%", marginLeft: "1%" }}>
            장바구니
          </h2>
          <hr />
          <ul className="cartHeader">
        <li>
        </li>
          <li style={{ flex: "2" }}>원두 정보</li>
          <li style={{ flex: "1" }}>수량</li>
          <li style={{ flex: "2" }}>상품 금액</li>
          <li style={{ flex: "1" }}>삭제</li>
          </ul>
          <hr />


    {userCart.map((userCartItem) => (
 <ul className="cartList">

      <div key={userCartItem.id} cart={userCartItem}>
      <li style={{ margin: 0, paddingLeft: 0 }}>
        <input
          type="checkbox"
          name={userCartItem.id}
          checked={!!checkedItems[userCartItem.id] || false}
          onChange={handleCheckboxChange}
          value={userCartItem.id}
        />
        <img src={userCartItem.ProductImg} className="CartimgConts" />
        </li></div>
        <br />
        <li>
        <p id="idConts">{userCartItem.ProductName} <br /></p></li>
        <li><input type="number" className="quantityConts" min={0} defaultValue={userCartItem.countNumber}/></li>
        <li className="amountConts" >
        {userCartItem.ProductPrice} <br /></li>
        <button name="delete" className="allDelete" onClick={() => handleDelete(userCartItem.id)}> 삭제 </button>
        </ul>
      
    ))}
</div>

<table className="cartCalc">
          <tbody>
            <tr>
            <td style={{ borderRight: "none", fontWeight:"600"}}>최종 결제 금액</td></tr>
            <tr>
            <td>(Cafe인은 전 상품 배송비 무료)</td>
            </tr>
            <tr>
            <td style={{fontWeight:"600", color:"#0071E3" }}>{userPrice}</td>
            </tr>
  </tbody>
  </table>
    <Link to="/Mypage/Cart/PaymentCheck">
    <button type="button" className="btn btn-primary btn-lg" id="getOrder" onClick={DataInput}>
      주문하기
    </button></Link>
  </>
);
}

export default CHome;