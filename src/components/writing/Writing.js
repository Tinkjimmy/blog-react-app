import React, { useState, useRef, useEffect } from "react";
import { db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";

import "./writing.css";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";

import AuthDetails from "../AuthDetails";

function Writing() {
  const [currentPost, setCurrentPost] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [allFilled, setAllFilled] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state;
  let userNameAuthor = userData.username;
  let userIdentity = userData.id;
  let userProfileImage = userData.profileImage;

  const hamMenuRef = useRef(null);
  const offScreenMenuRef = useRef(null);

  useEffect(() => {
    if (currentTitle && currentPost && currentImage) {
      setAllFilled(true);
    } else {
      setAllFilled(false);
    }
  }, [currentTitle, currentPost, currentImage]);

  useEffect(() => {
    const handleClick = () => {
      if (hamMenuRef.current && offScreenMenuRef.current) {
        hamMenuRef.current.classList.toggle("active");
        offScreenMenuRef.current.classList.toggle("active");
      }
    };

    const hamMenuElement = hamMenuRef.current;
    hamMenuElement.addEventListener("click", handleClick);

    return () => {
      hamMenuElement.removeEventListener("click", handleClick);
    };
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
      author: userNameAuthor,
      userphoto: userProfileImage,
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
      setImagePreview(null);
      setAllFilled(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      navigate("/main");
    } catch (error) {
      console.error("Error updating post: ", error);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCurrentImage(file);
    setImagePreview(URL.createObjectURL(file)); // Set image preview
  };

  function toProfile() {
    navigate("/profile", { state: { userData } });
  }
  function toHome() {
    navigate("/main");
  }

  return (
    <main className="write-main">
      <header className="writing-header">
        <h1 className="app-title" onClick={toHome}>
          Blog.it
        </h1>

        <div className="header-user-features-write" ref={hamMenuRef}>
          {userData ? (
            <img
              className="profile-img profile-img-nav"
              alt="mage"
              src={userData.profileImage}
            ></img>
          ) : (
            <img className="profile-img" alt="proile ige"></img>
          )}

          <div className="off-screen-menu" ref={offScreenMenuRef}>
            <ul>
              <li onClick={toProfile}>Profile</li>
              <li>
                <AuthDetails />
              </li>
            </ul>
          </div>
        </div>
      </header>
      <form className="write-form" onSubmit={handlePostSubmit}>
        <input
          className="write-page-input title-input"
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
          className="write-page-input  text-body"
          name="post"
          id="post"
          value={currentPost}
          onChange={(e) => {
            setCurrentPost(e.target.value);
          }}
          required
        />

        <label htmlFor="image" className="drop-container" id="dropcontainer">
          <input
            className="custom-file-upload"
            type="file"
            name="image"
            id="images"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            required
          ></input>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
        </label>

        <button
          className={`post-button ${allFilled ? "active" : ""}`}
          type="submit"
        >
          Post
        </button>
      </form>
    </main>
  );
}

export default Writing;
