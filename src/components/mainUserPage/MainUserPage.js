import React, { useState, useEffect } from "react";
import { db } from "../../firebase";

import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import AuthDetails from "../AuthDetails";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Post from "../post/Post";
import "./main.css";

import { Link, useNavigate } from "react-router-dom";

function MainUserPage() {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserdata] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  const [postElements, setPostElements] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Callback function to be executed when authentication state changes
    const listen = onAuthStateChanged(auth, (user) => {
      // Update authUser state based on the user object
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    // Cleanup function to unsubscribe from the listener when component unmounts
    return () => {
      listen();
    };
  }, [authUser]);

  // useEffect hook to fetch user data and listen for changes in user's document
  useEffect(() => {
    if (authUser) {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", authUser.uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];

          const data = doc.data();
          // Construct userInfo object with necessary user data
          const userInfo = {
            id: doc.id,
            dob: data.dob,
            email: data.email,
            username: data.username,
            name: data.name,
            lastname: data.lastname,
            posts: data.posts || [],
            profileImage: data.profilepic,
            // Set posts array, defaulting to empty array if not available
          };

          // Update userData state with userInfo
          setUserdata(userInfo);
        } else {
          console.log("User document not found.");
        }
      });














      // Cleanup function to unsubscribe from the snapshot listener when component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [authUser]);

  //fetch all users's posts
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (collection) => {
        let aggregatedPosts = [];
        collection.forEach((doc) => {
          const data = doc.data();
          if (data.posts && Array.isArray(data.posts)) {
            aggregatedPosts = aggregatedPosts.concat(data.posts);
          }
        });

        const aggrPosts = aggregatedPosts.map((post) => {
          const timestamp = post.timestamp.toDate
            ? post.timestamp.toDate()
            : new Date(post.timestamp);

          return {
            ...post,
            timestamp: timestamp,
          };
        });
        aggrPosts.sort((a, b) => a.timestamp - b.timestamp);
        setAllPosts(aggrPosts);
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to handle post deletion
  const handleDeletePost = async (event, postId) => {
    event.stopPropagation(); // Ensure the navigation event is not triggered
    try {
      const updatedPosts = userData.posts.filter((post) => post.id !== postId);
      const userDocRef = doc(db, "users", userData.id);
      await updateDoc(userDocRef, { posts: updatedPosts });
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };
  // useEffect hook create the components and format and sort user's posts
  useEffect(() => {
    if (allPosts) {
      const reversePosts = allPosts.reverse();
      const elements = reversePosts.map((post) => {
        const timestamp = post.timestamp.toDate
          ? post.timestamp.toDate()
          : post.timestamp;
        const formattedTime = new Date(timestamp).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          day: "2-digit",
          month: "short",
        });

        return (
          <>
            <Post
              key={post.id}
              title={post.title}
              text={post.text}
              time={formattedTime}
              img={post.image}
              id={post.id}
              handleDelete={handleDeletePost}
              author={post.author}
              idName={userData.username}
              userImg={post.userphoto}
              // dubbio
             
            />
          </>
        );
      });
      setPostElements(elements);
    }
  }, [userData]);

  function toProfile() {
    navigate("/profile", { state: { userData } });
  }

  return (
    <div className="main-user-page">
      <header className="header-mainpage">
        <h1 className="app-title app-title-main">Blog.it</h1>
        {/* eventually an image with the name and logo */}
        <div className="header-user-features">
          {userData && (
            <Link to="/write" className="write-link" state={{ userData }}>
              Write
            </Link>
          )}
          <AuthDetails />

          {userData ? (
            <img
              className="profile-img profile-img-nav"
              alt="profil iage"
              src={userData.profileImage}
              onClick={toProfile}
            ></img>
          ) : (
            <img className="profile-img" alt="profle iage"></img>
          )}
        </div>
      </header>
      <main className="main-content">
        <section className="posts-section">
          {userData ? (
            <>
              {allPosts === null || allPosts.length === 0 ? "" : postElements}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default MainUserPage;
