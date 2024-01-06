import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
            <p>Like: {post.like}</p>
            <p>Comment: {post.commentid.length}</p>
            <p>Time: {post.time.toDate().toLocaleString()}</p>
            <p>Writer: {post.Writer}</p>
          </li>
        ))}
      </ul>

      {/* Add a link to show all posts */}
      {category && (
        <Link to="/community" onClick={() => setCategory('')}>
          Show All Posts
        </Link>
      )}
    </div>
  );
};

export default Posts;