import React, { useEffect, useState } from 'react';
import Post from '../components/post/Post';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function Articles(props) {
  const [userData, setUserData] = useState([props.user]);
  const [postElements, setPostElements] = useState([]);

  useEffect(() => {
    // Check if userData state is not null
    if (userData) {
      let reverseArray = [...userData[0].posts].reverse();

      // Format posts and set post elements
      const elements = reverseArray.map((post) => {
        let timestamp = post.timestamp;

        // Log the original timestamp
        

        // Convert Firestore Timestamp to Date object
        if (timestamp && timestamp.seconds) {
          timestamp = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        } else if (timestamp.toDate) {
          timestamp = timestamp.toDate();
        }

        // Convert timestamp to Date object if it's not already
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', timestamp);
          return null; // Skip this post if the date is invalid
        }

        const formattedTime = date.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          day: "2-digit",
          month: "short",
        });

        return (
          <Post
            key={post.id}
            title={post.title}
            text={post.text}
            time={formattedTime}
            img={post.image}
            id={post.id}
            handleDelete={handleDeletePost}
          />
        );
      }).filter(element => element !== null); // Filter out invalid posts

      // Update postElements state with the formatted post elements
      setPostElements(elements);
    }
  }, [userData]);


  ///delete posts
  const handleDeletePost = async (postId) => {
    try {
      const updatedPosts = userData[0].posts.filter((post) => post.id !== postId);
      
      const userDocRef = doc(db, "users", userData[0].id);
      await updateDoc(userDocRef, {
        posts: updatedPosts,
      });
      console.log("Post deleted successfully");
      setUserData((prevUserData) => {
        const updatedUserData = { ...prevUserData[0], posts: updatedPosts };
        return [updatedUserData];
      });
 
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  return (
    <div>
      {postElements}
    </div>
  );
}

export default Articles;
