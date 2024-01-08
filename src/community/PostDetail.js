import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dbService } from '../fbase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const PostDetail = () => {
  const { category, postId } = useParams();
  const [post, setPost] = useState(null);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDocRef = doc(dbService, 'posts', postId);
        const postDocSnapshot = await getDoc(postDocRef);

        if (postDocSnapshot.exists()) {
          setPost({ id: postDocSnapshot.id, ...postDocSnapshot.data() });
        } else {
          console.error('Post not found with ID:', postId);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);
  return (
    <div>
      {post ? (
        <div>
          <h2>{post.PostTitle}</h2>
          <p> Time: {post.time.toDate().toLocaleString()}</p>
          <p> Writer: {post.Writer}</p>
          <p> Post Text: {post.PostText}</p>
          <p> Like: {post.like}</p>
          <p> Scrap: {post.scrap}</p> {/* Add this line */}
          <p> Comment: {post.commentid.length}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetail;