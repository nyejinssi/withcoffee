import React, { useState , useEffect } from 'react';
import { authService, dbService, storageService} from '../fbase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, setDoc, getDocs, doc, collection, query, onSnapshot, orderBy, serverTimestamp , where} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const WritePost = () => {
  const [category, setCategory] = useState('freedom');
  const [title, setTitle] = useState('');
  const [mainText, setMainText] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [writerNickname, setWriterNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const user = authService.currentUser;
  const navigate = useNavigate();
  

  const handleFileUpload = async () => {
    if (mainImage) {
      const storageRef = ref(storageService, `postImages/${user.uid}/${mainImage.name}`);
      await uploadBytes(storageRef, mainImage);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
    return null;
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
            console.error("User document not found for createrId:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
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
  
    const postImgURL = await handleFileUpload();
    // Create a new post document with the explicitly set document ID
    const postRef = doc(dbService, 'posts', postId);
  
    await setDoc(postRef, {
      Class: category,
      createrId: uid,
      Writer: writerNickname,
      PostTitle: title,
      PostText: mainText,
      PostImg: postImgURL,
      like: 0,
      scrap: 0,
      time: serverTimestamp(),
      commentid: [], // Initialize with an empty array
    });
  
    console.log('Post created successfully with ID: ', postId);
  
    // Reset form fields after submission
    setCategory('');
    setTitle('');
    setMainText('');
    setMainImage(null);
  
    // Redirect or perform any other action after successful submission
    navigate('/'); // Adjust the path as needed
    setLoading(false);
  };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
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
            <input type="text" value={title} placeholder={"제목을 입력하세요"} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <br />
          <label>
            <textarea value={mainText} placeholder={'내용을 입력하세요'} onChange={(e) => setMainText(e.target.value)} />
          </label>
          <br />
          <label>
            <input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files[0])} />
          </label>
          <br />
          <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        </form>
      </div>
    );
  };

export default WritePost;

