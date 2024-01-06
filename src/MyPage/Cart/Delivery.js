import { dbService, authService} from '../../fbase';
import React, { useEffect,useCallback, useState } from 'react';
import { getFirestore, addDoc, collection, query, updateDoc, where, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';

import { Link } from 'react-router-dom';
import './Cart.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import List from '../Account/List';
import '../../Sign/UserAddress.css';
import Modal from "../../AboutAddress/Modal";
import DaumPostcode from "react-daum-postcode";

// 결제 페이지
const Delivery = () => {
    const [PayOrder, setPayOrder] = useState(false);
    const user = authService.currentUser;
    
    const [Tog1, setTog1] = useState(false);
    const toggleEditing = () => setTog1((prev) => !prev);

    const [ChangeInfo, setChangeInfo] = useState([]);
    const [NewUsername, setNewUsername] = useState("");
    const [NewUserPhonenumber, setNewUserPhonenumber] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [isOpenSecondPopup, setIsOpenSecondPopup] = useState(false);
    const [newaddress, setNewAddress] = useState(null);
    const [newpostCodes, setNewPostCodes] = useState(null);
    const [newdetailAddress, setNewDetailAddress] = useState("");
    const [newAddressData, setNewAddressData] = useState(null);
    const openModal = useCallback(() => { setModalVisible(true); }, []);
    const closeModal = useCallback(() => { setModalVisible(false); }, []);
    const onChange = useCallback((e) => { setNewDetailAddress(e.target.value); }, []);
    const handleComplete = useCallback((data) => {
        let fullAddress = data.address;
        let extraAddress = "";
        let zoneCodes = data.zonecode;
        if (data.addressType === "R") {
        if (data.bname !== "") {extraAddress += data.bname; }
        if (data.buildingName !== "") {
            extraAddress +=
            extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setNewAddress(fullAddress);
        setNewPostCodes(zoneCodes);
        setIsOpenSecondPopup(true);
    }, []);


    const Order = () =>{ // 결제하기 누르면 생기는 정보
        const Orders = {
            UserId: user.id,
            ProductId: '',
            ProductName: "",
            Count: ""
        }
        updateDoc(collection(dbService, "userOrder"), Orders);
        setPayOrder("");
        console.log(Orders);
    }

    const UserInfoonChange = (event) => {
        const { target: { name, value } } = event; 
        if (name === "usersname") {
            setNewUsername(value); 
        } else if (name === "usersphonenumber") {
            setNewUserPhonenumber(value);
        }
    };

    const UserInfoonSubmit = async (event) => {
        event.preventDefault();
        const q = query(
            collection(dbService, 'userInfomation'),
            where('creatorId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            const docRef = doc(dbService, `userInfomation/${doc.id}`);
            updateDoc(docRef, {
                name: NewUsername,
                number: NewUserPhonenumber,
                updateDocTime: Date.now()
            });
        });
        setNewUsername("");
        setNewUserPhonenumber("");
        console.log(ChangeInfo);
    };

    // Address Change Notification
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
          const addressCollectionRef = collection(dbService, "Address");
          const q = query(addressCollectionRef, where("CreaterId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          let docRef;
          if (querySnapshot.empty) {
            // 주소 문서가 없는 경우 새로운 문서 추가
            const newDocRef = await addDoc(addressCollectionRef, {
              address: newaddress,
              postCodes: newpostCodes,
              detailAddress: newdetailAddress,
              CreaterId: user.uid,
              InputTime: Date.now(),
            });
            docRef = newDocRef;
          } else {
            // 주소 문서가 있는 경우 첫 번째 문서 참조 가져오기
            docRef = querySnapshot.docs[0].ref;
          }
      
          const newData = {
            address: newaddress,
            postCodes: newpostCodes,
            detailAddress: newdetailAddress,
            InputTime: Date.now(),
          };
      
          await updateDoc(docRef, newData);
          setNewAddress(newaddress + newdetailAddress);
          console.log("Data updated successfully!");
        } catch (error) {
          console.error("Error updating data:", error);
        }
      };
    
      const onClick = useCallback(
        (e) => {
          e.preventDefault();
          setIsOpenSecondPopup(false);
          closeModal(false);
        },
        [closeModal, newaddress, newdetailAddress]
      );
    
      const inputserver = (e) => {
        const { target: { name, value } } = e;
        if (name === "detail") {
          setNewDetailAddress(value);
        } else if (name === "postcode") {
          setNewPostCodes(value);
        }
      };

    return (
        Tog1 ? (
                <>
                        새 배송자 정보
                    이름 : {NewUsername}<br/>
                    전화번호 : {NewUserPhonenumber}<br/>
                    주소 : {newpostCodes}<br/>
                    <br/>{newaddress}<br/>
                    {newdetailAddress}<br/>
                    <Link to="/MyPage/Cart/PurchaseDone/*"><button> 결제 하기 </button></Link>
                </>
            ):(
            <> {/* 배송 정보 변경 */}
                <h2> 배송 정보 변경</h2>
                <form onSubmit={onSubmit}>
  이름
  <input
    value={NewUsername}
    name="usersname"
    type="name"
    placeholder="카페인"
    maxLength={15}
    onChange={UserInfoonChange}
    required
  /> <br/>
  전화번호
  <input
    value={NewUserPhonenumber}
    name="usersphonenumber"
    type="tel"
    placeholder="01012345678"
    maxLength={11}
    onChange={UserInfoonChange}
    required
  /> <br/>
  <button onClick={openModal}>주소 변경하기</button>
  {modalVisible && (
    <Modal visible={modalVisible} closable={true} maskClosable={true} onClose={closeModal}>
      <DaumPostcode name="postcode" onComplete={handleComplete} className="post-code" />
      {isOpenSecondPopup && (
        <div>
          <h3>상세 주소 입력</h3>
          <input
            name="detail"
            placeholder="상세 주소를 입력해 주세요"
            onChange={onChange}
            value={newdetailAddress}
          />
          <button type="submit" onClick={onClick}>저장</button>
        </div> )}
    </Modal>
  )}
  {newAddressData ? (
    <div>
      <div className="text">우편번호: {newpostCodes}</div>
      <div className="text">주소: {newaddress}</div>
    </div>
  ) : (
    <div className="text">
      <span className="emph"></span> <br />
    </div>
  )}
  <button type="submit" onClick={toggleEditing} required>배송지 변경 완료</button>
</form>
                </>
            )          
  ); };

export default Delivery;