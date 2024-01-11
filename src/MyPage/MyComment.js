import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { collection, query, where, getDocs, orderBy, getDoc, doc } from 'firebase/firestore';

const MyComment = () => {
  const user = authService.currentUser;
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
    <div>
      <nav>
        <ul>
          <li><Link to="/mypage">내가 쓴 글</Link></li>
          <li><Link to="/mypage/MyComment">댓글단 글</Link></li>
          <li><Link to="/mypage/SavedPost">저장한 글</Link></li>
          <li><Link to="/mypage/UpdateInfo">내 정보 수정</Link></li>
        </ul>
      </nav>
      <div>
        <ul>
          {myComments.map((comment) => (
            <li key={comment.id}>
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