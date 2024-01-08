import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dbService, storageService } from '../fbase';
import { addDoc, collection, doc, serverTimestamp, getDoc,onSnapshot ,updateDoc, increment  } from 'firebase/firestore';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(dbService, 'posts', postId);
        const unsubscribe = onSnapshot(postRef, (doc) => {
          if (doc.exists()) {
            const postData = doc.data();
            setPost(postData);
          } else {
            console.log('No such document!');
          }
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe from snapshot listener
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLikeClick = () => {
    // Implement like functionality here
    console.log('Like button clicked');
    setPost((prevPost) => ({
      ...prevPost,
      like: prevPost.like + 1,
    }));
  };

  const handleScrapClick = async () => {
    try {
      const postRef = doc(dbService, 'posts', postId);
      await updateDoc(postRef, { scrap: increment(1) });

      // Update the local state to trigger a re-render
      setPost((prevPost) => ({
        ...prevPost,
        scrap: prevPost.scrap + 1,
      }));
    } catch (error) {
      console.error('Error updating scrap count:', error);
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Implement comment submission functionality here
    console.log('Comment submitted:', newComment);

    // Add the new comment to the state for immediate display
    const commentToAdd = {
      id: Date.now().toString(), // You should use a more reliable way to generate IDs
      text: newComment,
      timestamp: serverTimestamp(),
    };
    setComments((prevComments) => [...prevComments, commentToAdd]);

    // Clear the input field
    setNewComment('');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }
  return (
    <div>
      <h1>{post.PostTitle}</h1>
      <p>Like: {post.like}</p>
      <p>Comment: {comments.length}</p>
      <p>Time: {post.time.toDate().toLocaleString()}</p>
      <p>Writer: {post.Writer}</p>
      <p>Post Text: {post.PostText}</p>

      <button onClick={handleLikeClick}>Like</button>
      <button onClick={handleScrapClick}>Scrap</button>

      {/* Display comments */}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.text}</p>
            <p>Time: {comment.timestamp.toDate().toLocaleString()}</p>
            {/* Add any other comment-related info you want to display */}
          </li>
        ))}
      </ul>

      {/* Comment form */}
      <form onSubmit={handleCommentSubmit}>
        <label>
          Comment:
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        </label>
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default PostDetails;