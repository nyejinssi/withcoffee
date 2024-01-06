import { getFirestore, addDoc, doc, updateDoc, deleteDoc, getDocs, collection, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { dbService, authService, storageService } from "../../fbase";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { deleteObject, ref, uploadString, getDownloadURL } from "firebase/storage";
import Review from './Review';
import { v4 as uuidv4 } from 'uuid';
import './Review.css';

const Edit = ({reviewObj, isOwner}) => {
    const user = authService.currentUser;
    const [editing, setEditing] = useState(false);
    const [newReview, setNewReview] = useState(reviewObj.text);
    const [attachment, setAttachment] = useState("");

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if (ok) {
            await deleteDoc(doc(dbService, `userReviews/${reviewObj.id}`));
            if(reviewObj.attachmentURL !== "") {
                await deleteDoc(doc(dbService, reviewObj.attachmentURL));
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (event) => { 
        const { target: {value} } = event; 
        setNewReview(value); 
        console.log(setNewReview(value));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentURL = "";
        if (attachment !== ""){
            const attachmentRef = ref(storageService, `${user.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, 'data_url');
            attachmentURL = await getDownloadURL(response.ref);
        }

        const updateContent = {
            text: newReview,
            reviewimage: attachmentURL
        };

        await updateDoc(doc(dbService, `userReviews/${reviewObj.id}`), updateContent);
        setEditing(false); 
        setAttachment("");
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
        <div>
            {editing ? (
                <> 
                     <div className="myPageReviewBack" method="post">
                        <div style={{ marginLeft: "5%", marginTop: "2%" }}>
                            <span style={{ fontWeight: 700, fontSize: "1.5rem"}}>리뷰 수정하기</span>
                            <span style={{ fontWeight: 400, fontSize: "1.2rem" }}>&gt; 상품명</span>
                        </div>

                <form onSubmit={onSubmit} style={{display:"grid", marginTop:"5%", marginBottom:"3%"}}> 
                    <input className="WrittenReviewArea" onChange={onChange} value={newReview} required/> 
                    <input className='WrittenReviewPicture' type="file" accept="image/*" onChange={onFileChange} style={{marginTop:"3%"}}/>
                    <input className='WrittenReviewSubmit' type="submit" value="변경하기" style={{marginBottom:"2%"}}></input>
                    <button className='WrittenReviewCancle' onClick={toggleEditing}>취소</button>
                    {attachment && (
                        <div>
                            <img src={attachment} width="50px" height="40px" />
                            <button onClick={onClearAttachment}>X</button>
                        </div> 
                    )} 
                 </form>
                 </div>
                </>
            ) : (
                <> 
                
                    <span className="ReviewedList">
                        <h4>{reviewObj.text}</h4>
                        {reviewObj.reviewimage && (
                            <img src={reviewObj.reviewimage} width="200px" height="150px" /> )}
                            </span>
                        {isOwner && (
                            <> 
                            <div className="ReviewedListButtons">
                                <button className="btn btn-primary" id="modifyReview" onClick={onDeleteClick}>X</button>
                                <button className="btn btn-primary" id="deleteReview" onClick={toggleEditing}>수정</button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    ); 
};

export default Edit;