import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService, dbService, storageService } from '../fbase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import './community.css';

const Edit = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState({
    Class: '',
    PostImgs: [],
    PostText: '',
    PostTitle: '',
    Writer: '',
    commentid: [],
    createrId: '',
    like: 0,
    scrap: 0,
    time: 0,
  });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDocRef = doc(dbService, 'posts', postId);
        const postDocSnapshot = await getDoc(postDocRef);

        if (postDocSnapshot.exists()) {
          const postData = postDocSnapshot.data();
          setPost({ ...postData });
          setImages(postData.PostImgs);
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

      // Upload new images
      const uploadImagePromises = newImages.map(async (image) => {
        const imageRef = ref(storageService, `postImages/${post.createrId}/${image.name}`);
        await uploadBytes(imageRef, image);
        return getDownloadURL(imageRef);
      });

      const newImageUrls = await Promise.all(uploadImagePromises);

      // Update post data
      await updateDoc(postDocRef, {
        PostText: post.PostText,
        PostTitle: post.PostTitle,
        PostImgs: [...images, ...newImageUrls],
        // Add other updated post properties
      });

      // Delete images marked for deletion
      const deleteImagePromises = deletedImages.map(async (imageUrl) => {
        const imageRef = ref(storageService, imageUrl);
        await deleteObject(imageRef);
      });

      await Promise.all(deleteImagePromises);

      alert('게시글이 수정되었습니다!');
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setNewImages(selectedImages);
  };

  const handleDeleteImage = (imageUrl) => {
    setImages((prevImages) => prevImages.filter((img) => img !== imageUrl));
    setDeletedImages((prevDeletedImages) => [...prevDeletedImages, imageUrl]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
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
        {/* Other input fields */}
        <br />
        {images.map((imageUrl, index) => (
          <div key={index}>
            <img src={imageUrl} alt={`postimg-${index}`} />
            <button type="button" onClick={() => handleDeleteImage(imageUrl)}>
              Delete Image
            </button>
          </div>
        ))}
        <br />
        <label>
          Add Images:
          <input type="file" accept="image/*" onChange={handleImageChange} multiple />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Edit;
