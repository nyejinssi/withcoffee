// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate, Link  } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import Post from '../community/Post';
import { collection, query, where, getDocs } from 'firebase/firestore';
const SavedPost = () => {
  const user = authService.currentUser;
  const [mySavedPosts, setMySavedPosts] = useState([]);

  useEffect(() => {
    const fetchMySavedPosts = async () => {
      try {
        // Fetch posts where the user's uid is in the scraps array
        const postsQuery = query(
          collection(dbService, 'posts'),
          where('scraps', 'array-contains', user.uid)
        );

        const querySnapshot = await getDocs(postsQuery);

        const savedPostsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMySavedPosts(savedPostsData);
      } catch (error) {
        console.error('Error fetching my saved posts:', error);
      }
    };

    fetchMySavedPosts();
  }, [user.uid]);

  return (
    <div>
        <h3>내가 저장한 글</h3>
        <ul>
          {mySavedPosts.map((post) => (
            <li key={post.id}>
              <p>{post.Class}</p>
              <Link to={`/community/${post.Class}/${post.id}`}>{post.PostTitle}</Link>
              <p>좋아요 수: {post.like}</p>
              <p>댓글 수: {post.commentid ? post.commentid.length : 0}</p>
            </li>
          ))}
        </ul>
      </div>
  );
};

export default SavedPost;
