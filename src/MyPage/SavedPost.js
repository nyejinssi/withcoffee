// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation  } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import Post from '../community/Post';
import { collection, query, where, getDocs } from 'firebase/firestore';

const SavedPost = () => {
  const location = useLocation();
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
    <div className="home-container">
      <nav className="home-nav">
        <ul>
        <li className={location.pathname === '/mypage' ? 'active' : ''}><Link to="/mypage">내가 쓴 글</Link></li>
          <li className={location.pathname === '/mypage/MyComment' ? 'active' : ''}><Link to="/mypage/MyComment">댓글단 글</Link></li>
          <li className={location.pathname === '/mypage/SavedPost' ? 'active' : ''}><Link to="/mypage/SavedPost">저장한 글</Link></li>
          <li className={location.pathname === '/mypage/UpdateInfo' ? 'active' : ''}><Link to="/mypage/UpdateInfo">내 정보 수정</Link></li>
          <li className={location.pathname === '/mypage/MyReview' ? 'active' : ''}><Link to="/mypage/MyReview">내가 쓴 리뷰</Link></li>
          <li className={location.pathname === '/mypage/LikedProduct' ? 'active' : ''}><Link to="/mypage/LikedProduct">관심상품</Link></li>

        </ul>
      </nav>

      <div className="posts-container">
      <ul className="posts-list" >
        {mySavedPosts.map((post) => (
          <li key={post.id} className="posts-list-item">
            <Link to={`/community/${post.Class}/${post.id}`}>{post.PostTitle}</Link>
            <p className="posts-metadata">❤️ {post.like} | 💬 {post.commentid ? post.commentid.length : 0}</p>
          </li>
        ))}
        </ul>
        </div>
      </div>
  );
};

export default SavedPost;
