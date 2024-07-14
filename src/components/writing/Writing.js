import React, { useState, useRef } from "react";
import { db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";

import "./writing.css";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthDetails from "../AuthDetails";

function Writing() {
  const [currentPost, setCurrentPost] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state;
  const userNameAuthor = userData.username;
  const userIdentity = userData.id;

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
      author: userNameAuthor,
    };

    try {
      // Reference to the user's document in the database
      const userDocRef = doc(db, "users", userIdentity);

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
      navigate("/main");
    } catch (error) {
      console.error("Error updating post: ", error);
    }
  };

  function toProfile() {
    navigate("/profile", { state: { userData } });
  }
  function toHome(){
    navigate("/")
  }
  
  return (
    <main className="write-main">
      <header className="writing-header">
        <h1 className="app-title" onClick={toHome}>Blog.it</h1>

        
        <div className="header-user-features-write">
          
          <Link className="registration-link-home" to="/main">
          Home
        </Link>
          <AuthDetails />
          
          {userData ? (
            <img
              className="profile-img"
              alt="mage"
              src={userData.profileImage}
              onClick={toProfile}
            ></img>
          ) : (
            <img className="profile-img" alt="proile ige"></img>
          )}
        </div>
      </header>
      <form className="write-form" onSubmit={handlePostSubmit}>
        <input
          className="main-page-input title-input"
          type="text"
          name="title"
          value={currentTitle}
          placeholder="Title"
          onChange={(e) => {
            setCurrentTitle(e.target.value);
          }}
          required
        ></input>
        <textarea
          placeholder="Let's write something.."
          className="main-page-input  text-body"
          name="post"
          id="post"
          value={currentPost}
          onChange={(e) => {
            setCurrentPost(e.target.value);
          }}
          required
        />
<label for="image" class="drop-container" id="dropcontainer">
        <input
          className="custom-file-upload"
          type="file"
          name="image"
          id="images"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => {
            setCurrentImage(e.target.files[0]);
          }}
          required
        ></input>
        </label>

        <button className="post-button" type="submit">
          Post
        </button>
      </form>
    </main>
  );
}

export default Writing;
