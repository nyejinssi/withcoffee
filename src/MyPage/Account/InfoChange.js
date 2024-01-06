import { dbService, authService } from '../../fbase';
import React, { useEffect, useState } from 'react';
import { getFirestore, where, doc, updateDoc, getDocs, collection, query, onSnapshot, snapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import './ChangeAccount.css';

const InfoChange = () => {
    const user = authService.currentUser;
    const [NewUsername, setNewUsername] = useState("");
    const [NewUserphonenumber, setNewUserPhonenumber] = useState("");
    const [userInfo, setUserInfo] = useState([]);
    const [editing, setEditing] = useState(false);

    const navigate = useNavigate();  

    useEffect(() => {
        const q = query(
            collection(dbService, 'userInfomation'),
            where('creatorId', '==', user.uid)
        );

        onSnapshot(q, (snapshot) => {
            const userInfoArray = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setUserInfo(userInfoArray);
        }); 
        console.log(userInfo);
    }, [user.uid]); 

    const onChange = (event) => {
        const { target: { name, value } } = event; 
        if (name === "usersname") {
            setNewUsername(value); 
        } else if (name === "usersphonenumber") {
            setNewUserPhonenumber(value);
        }
    };

    const onSubmit = async (event) => {
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
                number: NewUserphonenumber,
                updateDocTime: serverTimestamp(),
            });
        });

        setNewUsername("");
        setNewUserPhonenumber("");
        setEditing(false); // editing 상태 업데이트
        console.log(userInfo);
    };


    return (
        <div>
            <form onSubmit={onSubmit} > 
                <input style={{marginLeft:'6%'}}
                    value={NewUsername}
                    name="usersname"
                    type="name"
                    placeholder="카페인"
                    maxLength={15}
                    onChange={onChange}
                    required
                    className="inputPassword"
                /> <br/>
                <input style={{marginLeft:'6%'}}
                    value={NewUserphonenumber}
                    name="usersphonenumber"
                    type="tel"
                    placeholder="01012345678"
                    maxLength={11}
                    onChange={onChange}
                    required
                    className="inputPassword"
                /> <br/>
                <div style={{marginLeft:"70%"}}>
                <input type="submit" className="InfoChangeButton" value=" 다음 " style={{left:"55%"}} required />
                <Link to="../../Main"><button className="InfoChangeButton" >취소</button></Link>
                </div>
    </form></div>
    );      
};

export default InfoChange;