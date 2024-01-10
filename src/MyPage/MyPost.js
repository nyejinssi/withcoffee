import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dbService } from '../fbase';
import Post from '../community/Post';
import { collection, query, where, getDocs } from "firebase/firestore";

const MyPost = ({ user, category}) => {
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        console.log(category);
        // Fetch posts where the creatorId is equal to the current user's UID
        const postsCollection = collection(dbService, 'posts');
        const myPostsQuery  = query(postsCollection, where('createrId', '==', user.uid));
        const querySnapshot =await getDocs(myPostsQuery);

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyPosts(fetchedPosts);
        console.log(myPosts[0].Class)
      } catch (error) {
        console.error('Error fetching my posts:', error);
      }
    };

    if (user) {
      fetchMyPosts();
    }
  }, [user, category]);

  return (
    <div>
      <ul>
        {myPosts.map((post) => (
          <li key={post.id}>
            <Link to={`/community/${post.Class}/${post.id}`}>
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

export default MyPost;
