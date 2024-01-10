import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const Home = () => {
  const user = authService.currentUser;
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const postsQuery = query(
          collection(dbService, 'posts'),
          where('createrId', '==', user.uid),
          orderBy('time', 'desc')
        );

        const querySnapshot = await getDocs(postsQuery);

        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMyPosts(postsData);
      } catch (error) {
        console.error('Error fetching my posts:', error);
      }
    };

    fetchMyPosts();
  }, [user.uid]);

  return (
    <div>
      <h2>마이페이지</h2>

      <nav>
        <ul>
          <li><Link to="/mypage">내가 쓴 글</Link></li>
          <li><Link to="/mypage/MyComment">댓글단 글</Link></li>
          <li><Link to="/mypage/SavedPost">저장한 글</Link></li>
        </ul>
      </nav>

      <div>
        <h3>내가 쓴 글</h3>
        <ul>
          {myPosts.map((post) => (
            <li key={post.id}>
              <Link to={`/community/${post.Class}/${post.id}`}>{post.PostTitle}</Link>
              <p>좋아요 수: {post.like}</p>
              <p>댓글 수: {post.commentid ? post.commentid.length : 0}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
