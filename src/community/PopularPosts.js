import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../fbase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const postsCollection = collection(dbService, 'posts');
        const popularPostsQuery = query(postsCollection, where('like', '>=', 10));
        const popularPostsSnapshot = await getDocs(popularPostsQuery);
        const popularPostsData = popularPostsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPopularPosts(popularPostsData);
      } catch (error) {
        console.error('Error fetching popular posts:', error);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <div>
      <ul>
        {popularPosts.map((post) => (
          <li key={post.id}>
            <Link to={`/community/popular/${post.id}`}>
              <h3>{post.PostTitle}</h3>
            </Link>
            <p> 좋아요 : {post.like}</p>
            <p> 댓글 수: {post.commentid.length}</p>
            <p> 시간 : {new Date(post.time).toLocaleString()}</p>
            <p> 작가: {post.Writer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularPosts;