import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../fbase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Posts = ({ category, setCategory }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts based on the selected category
    
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(dbService, 'posts');
        let categoryQuery = postsCollection;

        if (category) {
          categoryQuery = query(postsCollection, where('Class', '==', category));
        }

        const postsSnapshot = await getDocs(categoryQuery);
        const allPosts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/community/${category}/${post.id}`}>
              <h3>{post.PostTitle}</h3>
            </Link>
            <p> 시간 : {new Date(post.time).toLocaleString()}</p>
            <p> 글쓴이 : {post.Writer}</p>
            <p> 좋아요 : {post.like}</p>
            <p> 댓글 : {post.commentid.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
