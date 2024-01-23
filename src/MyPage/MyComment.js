import React, { useState, useEffect } from 'react';
import { Link , useLocation} from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { collection, query, where, getDocs, orderBy, getDoc, doc } from 'firebase/firestore';

const MyComment = () => {
  const user = authService.currentUser;
  const location = useLocation();
  const [myComments, setMyComments] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchMyComments = async () => {
      try {
        const commentsQuery = query(
          collection(dbService, 'comments'),
          where('createrId', '==', user.uid),
          orderBy('time', 'desc')
        );

        const querySnapshot = await getDocs(commentsQuery);

        const commentsData = await Promise.all(
          querySnapshot.docs.map(async (commentDoc) => {
            const commentData = {
              id: commentDoc.id,
              ...commentDoc.data(),
            };

            // Fetch the post corresponding to the comment
            const postDoc = await getDoc(doc(dbService, 'posts', commentData.postid));
            const postData = postDoc.data();
            commentData.postTitle = postData?.PostTitle || 'No Title';

            return commentData;
          })
        );

        setMyComments(commentsData);
      } catch (error) {
        console.error('Error fetching my comments:', error);
      }
    };

    fetchMyComments();
  }, [user.uid]);

  return (
    <div className="home-container">
    <nav className="home-nav">
      <ul>
      <li className={location.pathname === '/mypage' ? 'active' : ''}><Link to="/mypage">내가 쓴 글</Link></li>
        <li className={location.pathname === '/mypage/MyComment' ? 'active' : ''}><Link to="/mypage/MyComment">댓글단 글</Link></li>
        <li className={location.pathname === '/mypage/SavedPost' ? 'active' : ''}><Link to="/mypage/SavedPost">저장한 글</Link></li>
        <li className={location.pathname === '/mypage/UpdateInfo' ? 'active' : ''}><Link to="/mypage/UpdateInfo">내 정보 수정</Link></li>
        <li>내가 쓴 리뷰</li>
        <li>관심상품</li>
      </ul>
    </nav>

    <div className="posts-container">
        <ul className="posts-list" >
          {myComments.map((comment) => (
            <li key={comment.id} className="posts-list-item">
              <Link to={`/community/${comment.postClass}/${comment.postid}`}>
              <p>{comment.postTitle}</p>
              <p>{comment.text.substring(0, 50)}...</p>
              </Link>
              
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyComment;