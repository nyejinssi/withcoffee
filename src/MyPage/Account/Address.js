import React, { useCallback, useState, useEffect } from "react";
import Modal from "../../AboutAddress/Modal";
import DaumPostcode from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import { dbService, authService } from "../../fbase";
import { collection, addDoc, query, getDocs, where, onSnapshot, updateDoc } from "firebase/firestore";
import './Address.css';

function Address() {
  const user = authService.currentUser;
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpenSecondPopup, setIsOpenSecondPopup] = useState(false);
  const [newaddress, setNewAddress] = useState(null);
  const [newpostCodes, setNewPostCodes] = useState(null);
  const [newdetailAddress, setNewDetailAddress] = useState("");
  const [newAddressData, setNewAddressData] = useState(null);

  const navigate = useNavigate();
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
    <>
      <div className="address_p">
<form onSubmit={onSubmit}>
  <button onClick={openModal}>주소 조회</button>
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
          <button type="submit" onClick={onClick}>저장</button> </div>)}
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
  <button required>저장하기</button>
</form>
    </div>
    </>
  );
}

export default Address;