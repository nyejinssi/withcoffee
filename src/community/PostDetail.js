import React, { useState, useEffect,useRef } from 'react';
import { useParams } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { doc,  getDoc, getDocs,  updateDoc,  arrayUnion,  collection,  addDoc,
  query,  orderBy,  onSnapshot, where} from 'firebase/firestore';

const PostDetail = () => {
  const { category, postId } = useParams();
  const [post, setPost] = useState({
    scraps: [],
    commentid: [],
  });
  const [userLiked, setUserLiked] = useState(false);
  const [userScrapped, setUserScrapped] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [writerNickname, setWriterNickname] = useState('');
  const user = authService.currentUser;
  const createrId = user?.uid; // Add a conditional check
  const commentInputRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDocRef = doc(dbService, 'posts', postId);
        const postDocSnapshot = await getDoc(postDocRef);
    
        if (postDocSnapshot.exists()) {
          const postData = postDocSnapshot.data();  
          setPost({ id: postDocSnapshot.id, ...postData });
          setUserLiked(postData.likes?.includes(createrId));
          setUserScrapped(postData.scraps?.includes(createrId));
        } else {
          console.error('Post not found with ID:', postId);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };    

    const fetchComments = async () => {
      try {
        const commentsCollection = collection(dbService, 'comments');
        const postCommentsQuery = query(
          commentsCollection,
          where('postid', '==', postId),
          orderBy('time')
        );
    
        const querySnapshot = await getDocs(postCommentsQuery);
    
        const fetchedComments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchUserData = async () => {
      if (user) {
        try {
          const userQuery = query(collection(dbService, 'User'), where('createrId', '==', user.uid));
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const nickname = userDoc.data().nickname;
            setWriterNickname(nickname);
          } else {
            console.error("User document not found for createrId:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchPost();
    fetchComments();
    fetchUserData();
  }, [postId, createrId, user]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (newComment.trim() === '') {
      return;
    }
  
    try {
      const commentData = {
        postid: postId,
        postClass: post.Class,
        createrId: createrId,
        text: newComment,
        time: Date.now(),
        Writer: writerNickname,
      };
  
      const commentDocRef = await addDoc(collection(dbService, 'comments'), commentData);
  
      // Update the posts collection's commentid array
      const postDocRef = doc(dbService, 'posts', postId);
      await updateDoc(postDocRef, {
        commentid: arrayUnion(commentDocRef.id),
      });
  
      setComments((prevComments) => [
        ...prevComments,
        { id: commentDocRef.id, ...commentData },
      ]);
  
      // Increment the comment count in the UI
      setPost((prevPost) => ({
        ...prevPost,
        commentid: [...prevPost.commentid, commentDocRef.id],
      }));
  
      setNewComment('');
      commentInputRef.current.value = ''; // Clear the input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  

  const handleLikeClick = async () => {
    try {
      if (!userLiked) {
        const postDocRef = doc(dbService, 'posts', postId);
        await updateDoc(postDocRef, {
          like: post.like + 1,
          likes: arrayUnion(createrId),
        });

        setPost((prevPost) => ({
          ...prevPost,
          like: prevPost.like + 1,
          likes: prevPost.likes ? [...prevPost.likes, createrId] : [createrId],
        }));
        setUserLiked(true);
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const handleScrapClick = async () => {
    try {
      if (!userScrapped) {
        const postDocRef = doc(dbService, 'posts', postId);
        await updateDoc(postDocRef, {
          scrap: post.scrap + 1,
          scraps: arrayUnion(createrId),
        });

        setPost((prevPost) => ({
          ...prevPost,
          scrap: prevPost.scrap + 1,
          scraps: prevPost.scraps ? [...prevPost.scraps, createrId] : [createrId],
        }));
        setUserScrapped(true);
      }
    } catch (error) {
      console.error('Error updating scrap count:', error);
    }
  };


  return (
    <div>
      {post ? (
        <div>
          <h2>{post.PostTitle}</h2>
          <p> 시간 : {new Date(post.time).toLocaleString()}</p>
          <p> 작성자 : {post.Writer}</p>
          <p> {post.PostText}</p>
          {post.PostImg && <img src={post.PostImg} alt="postimg" />}
          <p> {post.like}</p>
          <button onClick={handleLikeClick}> 좋아요 </button>
          <p> {post.scrap}</p>
          <button onClick={handleScrapClick}> 저장 </button>
          <p> 댓글 수: {post.commentid ? post.commentid.length : 0}</p>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.text}</p>
                <p>Time: {new Date(comment.time).toLocaleString()}</p>
                <p>{comment.Writer} </p>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              ref={commentInputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 적어주세요!"
            />
            <button type="submit">저장</button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetail;