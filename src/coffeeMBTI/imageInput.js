import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from 'firebase/firestore';

const ImageInput = () => {
    const [imageName, setImageName] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const handleImageNameChange = (e) => {
        setImageName(e.target.value);
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleImageUpload = async () => {
        if (imageName && imageFile) {
            // 이미지 파일을 Firestore Storage에 업로드
            const storageRef = ref(storageService, `images/${imageName}`);
            await uploadBytes(storageRef, imageFile);

            // 업로드된 이미지의 다운로드 URL을 가져오기
            const imageUrl = await getDownloadURL(storageRef);

            // Firestore의 questionImg 컬렉션에 데이터 추가
            await addDoc(collection(dbService, "questionImg"), {
                name: imageName,
                imageUrl: imageUrl,
            });

            // 이미지 업로드 후 필요한 작업 수행 (예: 페이지 리디렉션)
            console.log("이미지 업로드 완료!");
        } else {
            console.log("이미지 이름과 파일을 모두 입력하세요.");
        }
    };

    return (
        <div>
            <label>
                이미지 이름:
                <input type="text" value={imageName} onChange={handleImageNameChange} />
            </label>
            <br />
            <label>
                이미지 파일 선택:
                <input type="file" onChange={handleImageFileChange} />
            </label>
            <br />
            <button onClick={handleImageUpload}>이미지 업로드</button>
        </div>
    );
};

export default ImageInput;
