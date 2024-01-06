import { dbService, authService } from '../../fbase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import List from './List';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const MyAd = () => {
  const [userAddress, setUserAddress] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const user = authService.currentUser;

  useEffect(() => {
    const q = query(
      collection(dbService, 'userAddress'),
      where('createrId', '==', user.uid)
    );

    onSnapshot(q, (snapshot) => {
      const userArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      if (userArray.length > 0) {
        setUserAddress(userArray[0]);
      }
    });
      const q2 = query(
        collection(dbService, 'userInfomation'),
        where('createrId', '==', user.uid)
        );

        onSnapshot(q2, (snapsshot) => {
            const userArrays = snapsshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setUserInfo(userArrays);
            });
        },[user]);    

  return (
    <><div>
        {userInfo && userInfo.length > 0 ? (
                    <div>{userInfo[0].name}
                    <br/>
                    {userInfo[0].number}
                    </div>
                    ) : (
                    <div>No user information available</div>
                    )}
          <Link to="/MyPage/Account/InfoChange/*"><button>  변경하기 </button></Link>
      <div>
    </div>
      
      <h4> 기존 저장된 주소 </h4>
      {userAddress && (
        <>
          <p> 우편 번호 : {userAddress.number} </p>
          <p> {userAddress.address} </p>
        </>
      )}
      <Link to="/MyPage/Account/Address/*"><button> 변경하러 가기 </button></Link>
    </div>
    </>

  );
};

export default MyAd;