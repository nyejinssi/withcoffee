import { getFirestore, addDoc, doc, updateDoc, deleteDoc, getDocs, collection, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { dbService, authService  } from "../../fbase";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
//기존 주소 보는 부분
// prev : LookAddress 
// MyAddress와 함께 사용

const List = ({Address}) => {
    const user = authService.currentUser;
    const navigate = useNavigate();
    const onClick = () => async () => {
        const ok = window.confirm("기존 주소 정보를 삭제하시겠습니까?");
        if (ok) {
            await deleteDoc(doc(dbService, `Address/${Address.id}`));
            console.log("삭제 완료");
            navigate("./AccountChange/Address");
        }
    };

    return (
        <div> 
                <p> 우편 번호 : {Address.PostCodes} </p>
                <p> {Address.Address} {Address.DetailAddress} </p>
                <button onClick = {onClick}> 변경하러 가기 </button>
        </div>
    ); 
};

export default List;
