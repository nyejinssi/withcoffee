import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const PostDetail = () => {
  const { category, postId } = useParams();
  const [post, setPost] = useState({
    scraps: [],
    commentid: [],
  });
  const [userLiked, setUserLiked] = useState(false);
  const [userScrapped, setUserScrapped] = useState(false);
  const user = authService.currentUser;
  const createrId = user?.uid; // Add a conditional check

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDocRef = doc(dbService, 'posts', postId);
        const postDocSnapshot = await getDoc(postDocRef);
  
        if (postDocSnapshot.exists()) {
          const postData = postDocSnapshot.data();
          console.log('Post Data:', postData); // Add this line to check the structure
  
          setPost({ id: postDocSnapshot.id, ...postData });
  
          // Check if the current user has liked the post
          setUserLiked(postData.likes?.includes(createrId));
  
          // Check if the current user has scrapped the post
          setUserScrapped(postData.scraps?.includes(createrId));
        } else {
          console.error('Post not found with ID:', postId);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
  
    fetchPost();
  }, [postId, createrId]);
  

  const handleLikeClick = async () => {
    try {
      if (!userLiked) {
        const postDocRef = doc(dbService, 'posts', postId);
        await updateDoc(postDocRef, {
          like: post.like + 1,
          likes: arrayUnion(createrId),
        });

        setPost((prevPost) => ({
          ...prevPost,
          like: prevPost.like + 1,
          likes: prevPost.likes ? [...prevPost.likes, createrId] : [createrId],
        }));
        setUserLiked(true);
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const handleScrapClick = async () => {
    try {
      if (!userScrapped) {
        const postDocRef = doc(dbService, 'posts', postId);
        await updateDoc(postDocRef, {
          scrap: post.scrap + 1,
          scraps: arrayUnion(createrId),
        });

        setPost((prevPost) => ({
          ...prevPost,
          scrap: prevPost.scrap + 1,
          scraps: prevPost.scraps ? [...prevPost.scraps, createrId] : [createrId],
        }));
        setUserScrapped(true);
      }
    } catch (error) {
      console.error('Error updating scrap count:', error);
    }
  };

  return (
    <div>
      {post ? (
        <div>
          <h2>{post.PostTitle}</h2>
          <p> 시간 : {new Date(post.time).toLocaleString()}</p>
          <p> 작성자 : {post.Writer}</p>
          <p> {post.PostText}</p>
          <img src={post.PostImg} alt="postimg"/> 
          <button onClick={handleLikeClick}> 좋아요 </button>
          <p> {post.like}</p>
          <button onClick={handleScrapClick}> 저장 </button>
          <p> {post.scrap}</p>
          <p> Comment: {post.commentid ? post.commentid.length : 0}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetail;
