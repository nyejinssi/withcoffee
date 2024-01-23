import React, { useState, useEffect } from 'react';
import { authService, dbService, storageService } from '../fbase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
  addDoc,
  setDoc,
  getDocs,
  doc,
  collection,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject, // Import deleteObject from storage
} from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const WritePost = () => {
  const [category, setCategory] = useState('freedom');
  const [title, setTitle] = useState('');
  const [mainText, setMainText] = useState('');
  const [images, setImages] = useState([]);
  const [writerNickname, setWriterNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const user = authService.currentUser;
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    const storageRef = ref(storageService, `postImages/${user.uid}/${file.name}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleDeleteImage = async (index, imageName) => {
    try {
      // Delete the image from storage
      const imageRef = ref(storageService, `postImages/${user.uid}/${imageName}`);
      await deleteObject(imageRef);

      // Remove the image from the images state
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        return updatedImages;
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  useEffect(() => {
    // Fetch user data from dbService based on uid
    const fetchUserData = async () => {
      if (user) {
        try {
          // Create a query to get the user document with the matching createrId
          const userQuery = query(collection(dbService, 'User'), where('createrId', '==', user.uid));
          // Execute the query and get the documents
          const querySnapshot = await getDocs(userQuery);

          // Check if there is at least one document matching the query
          if (!querySnapshot.empty) {
            // Get the first document from the query result
            const userDoc = querySnapshot.docs[0];

            // Access the 'nickname' field from the document data
            const nickname = userDoc.data().nickname;

            // Set the nickname in the state
            setWriterNickname(nickname);
          } else {
            console.error('User document not found for createrId:', user.uid);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length < 10 || mainText.length < 10) {
      alert('제목이나 내용이 너무 짧습니다 :(');
      return;
    }
    setLoading(true);

    // Get the current user
    const uid = user.uid;
    const postId = uuidv4(); // Generate a unique ID for the post

    const imageUrls = await Promise.all(images.map((image) => handleFileUpload(image)));

    // Create a new post document with the explicitly set document ID
    const postRef = doc(dbService, 'posts', postId);

    await setDoc(postRef, {
      Class: category,
      createrId: uid,
      Writer: writerNickname,
      PostTitle: title,
      PostText: mainText,
      PostImgs: imageUrls, // Store multiple image URLs in an array
      like: 0,
      scrap: 0,
      time: Date.now(),
      commentid: [], // Initialize with an empty array
    });

    console.log('Post created successfully with ID: ', postId);

    // Reset form fields after submission
    setCategory('');
    setTitle('');
    setMainText('');
    setImages([]);
    setLoading(false);

    // Redirect or perform any other action after successful submission
    navigate('/community/'); // Adjust the path as needed
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  };

  return (
    <div style={{ textAlign: 'center' }}>
    <form onSubmit={handleSubmit} style={{ margin: '0 auto', textAlign:'center' }}>
        <label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="freedom">자유</option>
            <option value="coffeeBean">원두</option>
            <option value="tools">도구</option>
            <option value="startup">창업</option>
            <option value="promotion">홍보</option>
          </select>
        </label>
        <br />
        <label>
          <input type="text" value={title} placeholder={'제목을 입력하세요'} onChange={(e) => setTitle(e.target.value)} style={{ width: '750px', height: '30px' }}/>
        </label>
        <br />
        <label>
        <textarea value={mainText} placeholder={'내용을 입력하세요'} onChange={(e) => setMainText(e.target.value)} style={{ width: '750px', height: '150px' }} />
        </label>
        <br />
        <label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        </label>
        <br />
        {images.map((image, index) => (
          <div key={index}>
            <img src={URL.createObjectURL(image)} alt={`image-${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
            <button type="button" onClick={() => handleDeleteImage(index, image.name)} style={{ backgroundColor:'#ffffff', border: '#ffffff', textAlign:'center'}}>
              ❌
            </button>
          </div>
        ))}
        <br />
        <button type="submit" disabled={loading} style={{backgroundColor:'#000000', border: '#000000'}}>
          {loading ? 'Submitting...' : '글쓰기'}
        </button>
      </form>
    </div>
  );
};

export default WritePost;
