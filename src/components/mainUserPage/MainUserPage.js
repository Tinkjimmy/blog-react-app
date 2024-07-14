import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  doc,
  arrayUnion,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import AuthDetails from "../AuthDetails";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Post from "../post/Post";
import "./main.css";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";

function MainUserPage() {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserdata] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState("");
  const [postElements, setPostElements] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentImage, setCurrentImage] = useState(null);

  const fileInputRef = useRef(null); // Reference for the file input
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

      // Listener for snapshot changes in the query result
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // Check if query result is not empty
        if (!querySnapshot.empty) {
          // Get the first document in the query result
          const doc = querySnapshot.docs[0];
          // Extract data from the document
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

  // Function to handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (currentPost.trim() === "") {
      console.log("Post content is empty");
      return; // It immediately exits the function using the return statement, preventing the rest of the code inside the function (handlePostSubmit) from executing.
    }
    let imageUrl = "";

    if (currentImage) {
      try {
        const storageRef = ref(storage, `images/${currentImage.name}`);
        const snapshot = await uploadBytes(storageRef, currentImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading image: ", error);
        return;
      }
    }

    // Create new post object with text and timestamp
    const newPost = {
      id: uuidv4(),
      title: currentTitle,
      text: currentPost,
      timestamp: new Date(),
      image: imageUrl,
      author: userData.username,
      userphoto: userData.profileImage,
    };

    try {
      // Reference to the user's document in the database
      const userDocRef = doc(db, "users", userData.id);

      // Update the user's document by adding the new post to the posts array
      await updateDoc(userDocRef, {
        posts: arrayUnion(newPost),
      });

      console.log("Post updated successfully");
      setCurrentPost("");
      setCurrentTitle("");
      setCurrentImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error updating post: ", error);
    }
  };

  // Function to handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      const updatedPosts = userData.posts.filter((post) => post.id !== postId);

      const userDocRef = doc(db, "users", userData.id);
      await updateDoc(userDocRef, {
        posts: updatedPosts,
      });
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
        <h1 className="app-title">Blog.it</h1>
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
              className="profile-img"
              alt="profile image"
              src={userData.profileImage}
              onClick={toProfile}
            ></img>
          ) : (
            <img className="profile-img" alt="profile image"></img>
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
