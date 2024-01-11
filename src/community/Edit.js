import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService, dbService, storageService } from '../fbase'; // Import storageService
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';

const Edit = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState({
    PostTitle: '',
    PostText: '',
    // Add other post properties
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDocRef = doc(dbService, 'posts', postId);
        const postDocSnapshot = await getDoc(postDocRef);

        if (postDocSnapshot.exists()) {
          const postData = postDocSnapshot.data();
          setPost({ ...postData });
          setImageUrl(postData.PostImg); // Assuming the image URL is stored in PostImg
        } else {
          console.error('Post not found with ID:', postId);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const postDocRef = doc(dbService, 'posts', postId);

      if (image) {
        // If a new image is selected, upload it to storage
        const imageRef = ref(storageService, `images/${postId}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);

        await updateDoc(postDocRef, {
          PostTitle: post.PostTitle,
          PostText: post.PostText,
          PostImg: imageUrl,
          // Add other updated post properties
        });
      } else {
        // If no new image is selected, update other post properties
        await updateDoc(postDocRef, {
          PostTitle: post.PostTitle,
          PostText: post.PostText,
          // Add other updated post properties
        });
      }

      alert('게시글이 수정되었습니다!');
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setImageUrl(URL.createObjectURL(selectedImage));
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleEditSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="PostTitle"
            value={post.PostTitle}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Text:
          <textarea
            name="PostText"
            value={post.PostText}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {imageUrl && <img src={imageUrl} alt="postimg" />}
        <br />
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {/* Add other input fields for additional post properties */}
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Edit;