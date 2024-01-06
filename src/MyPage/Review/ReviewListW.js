import { getFirestore, addDoc, doc, updateDoc, deleteDoc, getDocs, collection, where, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { dbService, authService, storageService } from "../../fbase";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { deleteObject, ref, uploadString, getDownloadURL } from "firebase/storage";
import Review from './Review';
import { v4 as uuidv4 } from 'uuid';
import './Review.css';

const ReviewListW = ({R, isOwner}) => {
    const user = authService.currentUser;
    const [writing, setWriting] = useState(false);
    const [userReview, setUserReview] = useState("");
    const [userReviews, setUserReviews] = useState([]);
    const [attachment, setAttachment] = useState("");
    const [editing, setEditing] = useState(false);
    const [userW, setUserW] = useState([]);
    const navigate = useNavigate();

    const ReviewDone =() =>{
        const q = query(collection(dbService, 'WReview'), where('userid', '==', user.uid), where('deliveryDone', '==', true), where('ReviewWrite', '==', false));
        onSnapshot(q, (snapshot) => {
            const userArray = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            }));
            setUserW(userArray);
        });
        deleteDoc(doc(dbService, 'WReview', R.id)); // 삭제 
        setUserW((prevUser) => prevUser.filter((item) => item.id!== R.id)); // 컬렉션에서 제외
    }

    const toWriting = () => setWriting((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = addDoc(collection(dbService, "userReviews"), {
                text: userReview,
                createdAt: Date.now(),
                creatorId: user.uid,
                ProductID: R.ProductID,
            });
            setUserReview("");
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        ReviewDone();
    };

    const onChange = (event) => {
        const { target: {value} } = event; 
        setUserReview(value); 
    };

    const onFileChange = (event) => {  // 사진 미리보기 만들기
        const { target: {files} } = event; 
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent)  => {
            const {
                currentTarget: {result}
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => { 
        setAttachment("");
    };

    return (
        <>
        <h2>작성가능한 리뷰</h2>
        {writing ? (
            <>
                <form onSubmit = {onSubmit}> 
                            <input 
                                value = {userReview} 
                                type = "text" 
                                placeholder = "당신의 솔직한 리뷰를 알려주세요 :)" 
                                maxLength = {120} 
                                onChange = {onChange} 
                                className='NewReviewArea'
                            /> <br/>
                            <input type = "file" accept = "image/*" onChange={onFileChange}/>
                            <input type = "submit" value = "저장"/>
                            {attachment && (
                                <div>
                                    <img src = {attachment} width = "100px" height = "80px" />
                                    <button  className="btn btn-primary" id="deleteReview" onClick = {onClearAttachment}>X</button>
                                </div>
                                )}
                </form>                
            </>
        ) : (
            <>
                <img src={R.ProductImg} />
                {R.ProductName}
                <button onClick={toWriting}>리뷰 작성하기</button>
            </>
        )}
          
                </>
    ); 
};

export default ReviewListW;