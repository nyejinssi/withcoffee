import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { dbService, authService } from '../../fbase';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Pic from '../../profile.png';
import './ShopList.css';

const ShopList = () => {
  const user = authService.currentUser;
  const [productData, setProductData] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [confirmedProducts, setConfirmedProducts] = useState([]);

  useEffect(() => {
    const getOrderData = async () => {
      try {
        const orderCollectionRef = collection(dbService, 'Order');
        const querySnapshot = await getDocs(orderCollectionRef);

        const orderData = [];
        querySnapshot.forEach((doc) => {
          const { ProductID, ProductImg, ProductName, UserID } = doc.data();
          if (UserID === user.uid) {
            orderData.push({
              ProductID,
              ProductImg,
              ProductName,
              confirmed: false // 구매 확정 상태 추가
            });
          }
        });
        setProductData(orderData);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    getOrderData();
  }, [user.uid]); // user.uid를 의존성 배열에 추가

  useEffect(() => {
    const fetchConfirmedProducts = async () => {
      try {
        const wReviewCollectionRef = collection(dbService, 'WReview');
        const querySnapshot = await getDocs(wReviewCollectionRef);
        const confirmedProductIds = [];
        querySnapshot.forEach((doc) => {
          const { ProductID, userId } = doc.data();
          if (userId === user.uid) {
            confirmedProductIds.push(ProductID);
          }
        });
        setConfirmedProducts(confirmedProductIds);
      } catch (error) {
        console.error('Error retrieving confirmed products:', error);
      }
    };

    fetchConfirmedProducts();
  }, [user.uid]);

  const saveDataToWReview = async (reviewData) => {
    try {
      const wReviewCollectionRef = collection(dbService, 'WReview');
      await addDoc(wReviewCollectionRef, reviewData);
      console.log('Data saved to WReview collection successfully!');
    } catch (error) {
      console.error('Error saving data to WReview collection:', error);
    }
  };

  const ConfirmationComplete = async (product) => {
    try {
      const shouldSave = window.confirm('구매확정 하시겠습니까?');
      if (shouldSave) {
        if (confirmedProducts.includes(product.ProductID)) {
          console.log('이미 구매 확정된 상품입니다.');
          return;
        }
  
        const reviewData = {
          ProductID: product.ProductID,
          ProductImg: product.ProductImg,
          ProductName: product.ProductName,
          ReviewWrite: false,
          DeliveryDone: true,
          userId: user.uid,
        };
  
        saveDataToWReview(reviewData);
        setConfirmedProducts((prevProducts) => [...prevProducts, product.ProductID]);
      } else {
        console.log('Save to WReview cancelled by user.');
      }
    } catch (error) {
      console.error('Error saving data to WReview collection:', error);
    }
  };
  

  // 나머지 코드 생략


  {/*운송장 제작*/}

  const generateRandomNumericString = (length) => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleSubmit = async (event, product) => {
    event.preventDefault();

    const newTrackingNumber = generateRandomNumericString(12);
    setTrackingNumber(newTrackingNumber);

    const trackingData = {
      TrackingNumber: newTrackingNumber,
      createdAt: Date.now(),
      creatorId: user.uid,
      ProductID: product.ProductID
    };

    try {
      const docRef = await addDoc(collection(dbService, "DeliveryTracking"), trackingData);
      console.log("운송장 번호가 성공적으로 저장되었습니다. 문서 ID:", docRef.id);
    } catch (error) {
      console.error("운송장 번호 저장 중 오류가 발생했습니다.", error);
    }

    // 배송조회 버튼을 클릭하면 Tracker로 이동하도록 설정
    window.open(
      `http://info.sweettracker.co.kr/tracking/5?t_key=AvyWMRazruOJcBTdlYl1Hw&t_code=04&t_invoice=${newTrackingNumber}`,
      '_blank'
    );
  };

  return (
    <>

<Col lg="3" md="3" sm="1" xs="1">
            <div className="myCafeIn">
                  <Link to="/Home/*">My CafeIn</Link>
                    <ul className="list-group list-group  -flush" style={{ listStyle: "none" }}>
                        <li>
                        <Link to="/MyPage/Cart/CHome/*" >장바구니</Link>
                        </li>
                        <hr/>
                        <li>
                        <Link to="/MyPage/Like/LHome/*"> 찜한 상품</Link>
                        </li>
                        <hr />
                        <li>
                        <Link to="/MyPage/Shop/ShopList/*" style={{color:'#8D5124', fontWeight:550}}>주문목록</Link>
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
                
    <div className="ShopList" >
      <div className="myPageOrdered">
        <h2>주문목록</h2>
      </div>
      <hr/>

      {productData.map((product) => (
        <Col key={product.ProductID} className="mb-4">
          <div className="OrderList">
            <img src={product.ProductImg || Pic} className="card-img-top" id="imgConts" alt={product.ProductName} />
              <p>{product.ProductName}</p>
              {!confirmedProducts.includes(product.ProductID) && (
                <button
                  className="orderButtons"
                  onClick={() => ConfirmationComplete(product)}
                  disabled={confirmedProducts.includes(product.ProductID)}
                >
                  구매 확정
                </button>
              )}
              
              <Link to={`/product/${product.ProductID}`}>
                <button className="orderButtons">
                교환/환불 문의
                </button>
              </Link>

              <form
                  action="http://info.sweettracker.co.kr/tracking/5"
                  method="post" >
                  <input
                    type="hidden"
                    name="t_key"
                    defaultValue="AvyWMRazruOJcBTdlYl1Hw" />
                  <input
                    type="hidden"
                    name="t_code"
                    defaultValue={'04'} />
                  <input
                    type="hidden"
                    name="t_invoice"
                    defaultValue={product.TrackingNumber} />
                  <input
                    type="submit"
                    className="orderButtons"
                    value={"배송조회"}
                    id="submitBtn"
                    />
                </form>
          </div>
        </Col>
      ))}
    </div>
    </>
  );
};

export default ShopList;