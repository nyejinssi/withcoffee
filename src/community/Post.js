import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../fbase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './community.css';

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
  
        // Sort posts by the 'time' property in descending order
        const sortedPosts = allPosts.sort((a, b) => b.time - a.time);
  
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <div className="posts-container">
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.id} className="posts-list-item">
            <Link to={`/community/${category}/${post.id}`}>
              <h3>{post.PostTitle}</h3>
            </Link>
            <p className="posts-metadata"> 👨‍💻 {post.Writer} | ❤️{post.like} | 💬{post.commentid.length}</p>
            <p className="posts-metadata"> {new Date(post.time).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
