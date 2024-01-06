import { dbService, authService} from '../../fbase';
import React, { useEffect,useCallback, useState } from 'react';
import { getFirestore, addDoc, collection, query, updateDoc, where, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';

import { Link , useNavigate } from 'react-router-dom';
import './Cart.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import List from '../Account/List';
import '../../Sign/UserAddress.css';
import Modal from "../../AboutAddress/Modal";
import DaumPostcode from "react-daum-postcode";

// 배송지 정보 입력 페이지
const PaymentCheck = () => {
    const [PayOrder, setPayOrder] = useState(false);
    const user = authService.currentUser;
    const [paymentCheckList, setPaymentCheckList] = useState([]);
    const [PayOrders, setPayOrders] = useState([]);
    const [Tog1, setTog1] = useState(false);
    const [Tog2, setTog2] = useState(false);
    const [totalPrice, setTotalPrice] = useState([]);
    const toggleEditing = () => setTog1((prev) => !prev);
    const toggleEditing2 = () => setTog2((prev) =>!prev);
    const [order, setOrder] = useState([]);
    const [BeforeuserAddress, setBeforeUserAddress] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [ChangeInfo, setChangeInfo] = useState([]);
    const [PaymentCheck, setPaymentCheck] = useState([]);
    const [paymentChecks, setPaymentChecks] = useState([]);
    const navigate = useNavigate();
    const handlePayment = async () => {
        try {
          console.log(PaymentCheck);
          const orderListArray = PaymentCheck.map((payment) => ({
            ProductID: payment.ProductID,
            UserID: user.uid,
            ProductImg: payment.ProductImg,
            ProductName: payment.ProductName,
            ProductPrice: payment.ProductPrice,
            countNumber: payment.countNumber,
            Address: BeforeuserAddress[0].address,
            PostCode: BeforeuserAddress[0].number,
            UserName: userInfo[0].name,
            UserTel: userInfo[0].number,
            CreateTime: Date.now()
          }));
          console.log(orderListArray);
          for (const orderList of orderListArray) {
            const docRef = await addDoc(collection(dbService, "Order"), orderList);
            console.log("Document written with ID: ", docRef.id);
          }
          const orderSnapshot = await getDocs(
            query(collection(dbService, "Order"), where("UserID", "==", user.uid))
          );
          const orderArray = orderSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setOrder(orderArray);
          setPaymentCheckList([]); 
          const paymentCheckQuery = query(
            collection(dbService, "PaymentCheck"),
            where("userId", "==", user.uid)
          );
          const paymentCheckSnapshot = await getDocs(paymentCheckQuery);
          
          if (!paymentCheckSnapshot.empty) {
            paymentCheckSnapshot.docs.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
          }
            console.log(paymentCheckQuery);
            console.log("Done");
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      };
      

     useEffect(() => {
            const Address = query( 
            collection(dbService, 'userAddress'),
            where('createrId', '==', user.uid)
            ); // 기존 배송지 정보

            const Infomation = query(
                collection(dbService, 'userInfomation'),
                where('createrId', '==', user.uid)
            ); // 기존 유저 정보
            
            const q = query(collection(dbService, "PaymentCheck"), where('userId', '==', user.uid));
            onSnapshot(q, (snapshot) => {
                const userArray = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id, 
                }));
            setPaymentCheck(userArray);
            });

            const q2 = query(collection(dbService, "CHomeTotalPrice"), where('userId', '==', user.uid));
            onSnapshot(q2, (snapshot) => {
                const userArray = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id, 
                }));
                setTotalPrice(userArray);
            });

            const unsubscribe1 = onSnapshot(Address, (snapshot) => {
            const userArray = snapshot.docs.map((doc)=>({
                ...doc.data(), 
                id: doc.id,}));
                setBeforeUserAddress(userArray);
                console.log(userArray);
            }); // 기본 배송지 정보

            const unsubscribe2 = onSnapshot(Infomation, (snapshot) => {
                const userInfoArray = snapshot.docs.map((doc)=>({
                    ...doc.data(), 
                    id: doc.id,}));
                    setUserInfo(userInfoArray);
                });  // 기본 유저 정보    
    },[user]);

    return (
        <>
        <h1> 결제할 상품 </h1>
                {PaymentCheck && (
                    <> 
                        {PaymentCheck.map((p) => (
                            <div key={p.id}>
                                <div> 상품 : {p.ProductName}</div>
                                <div> 가격 : {p.ProductPrice} </div>
                                <div> 수량 : {p.countNumber}</div>
                                <div> 이미지: <img src={p.ProductImg}/> </div>
                            </div>
                        ))}
                    </>
                )}
                <h2> 총 결제 금액 </h2>
                {totalPrice && totalPrice.length > 0? (
                    <div> {totalPrice[0].totalPrice}</div>):(<div> 일시적인 오류가 발생했습니다. 다시 결제를 진행해주세요. </div> )}

                <h1> 기존에 저장된 배송자 정보</h1>
                {userInfo && userInfo.length > 0 ? (
                    <div>{userInfo[0].name}
                    <br/>
                    {userInfo[0].number}
                    </div>
                    ) : (
                    <div>No user information available</div>
                    )}
                    <h4> 기존 저장된 주소 </h4>
                    {BeforeuserAddress && (
                        <>
                            {BeforeuserAddress.map((address) => (
                                <div key={address.id}>
                                    <p> 우편 번호: {address.number} </p>
                                    <p> 주소: {address.address} </p>
                                </div>
                            ))}
                        </> )}
                <Link to="/MyPage/Cart/Delivery/*"> <button> 배송지 정보 변경하기 </button></Link>
         <br/>
           <Link to="/MyPage/Cart/PurchaseDone"> <button onClick={handlePayment}> 결제 하기 </button></Link>
      </>
  );
}

export default PaymentCheck;