// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
const MyComment = () => {
  const user = authService.currentUser;
  const [myComments, setMyComments] = useState([]);

  useEffect(() => {
    const fetchMyComments = async () => {
      try {
        const commentsQuery = query(
          collection(dbService, 'comments'),
          where('createrId', '==', user.uid),
          orderBy('time', 'desc')
        );

        const querySnapshot = await getDocs(commentsQuery);

        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMyComments(commentsData);
      } catch (error) {
        console.error('Error fetching my comments:', error);
      }
    };

    fetchMyComments();
  }, [user.uid]);

  return (
    <div>
        <h3>내가 작성한 댓글</h3>
        <ul>
          {myComments.map((comment) => (
            <li key={comment.id}>
              <Link to={`/community/${comment.postClass}/${comment.postid}`}>
                {comment.PostTitle}
                {comment.text.substring(0, 50)}...
              </Link>
            </li>
          ))}
        </ul>
      </div>
  );
};

export default MyComment;
