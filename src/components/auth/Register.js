import React, { useState, useRef } from "react";
import { auth, db,storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { uploadBytes,getDownloadURL, ref } from "firebase/storage";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [lastname, setLastName] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState("");
  
  const navigate = useNavigate();
const fileInputRef =useRef(null)




  async function signUp(e) {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;


      let imageUrl = "";

    if (profilePic) {
      try {
        const storageRef = ref(storage, `images/${profilePic.name}`);
        const snapshot = await uploadBytes(storageRef, profilePic);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading image: ", error);
        return;
      }
    }

      // Add user information to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: name,
        lastname: lastname,
        email: email,
        username: username,
        dob: dob,
        createdAt: new Date(),
        posts: [],
        profilepic: "",
        newsletter: newsletter,
        profilepic: imageUrl,
        bio: bio,
      });

      navigate("/main");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }

  return (
    <div className="register-body">
      <header className="registration-header">
        <h1 className="registration-home-link"><Link className="registration-app-name" to="/blog-react-app">
          Blog.it
        </Link></h1>

        <h2 className="registration-title">Sign Up</h2>
        <Link className="registration-link-home" to="/blog-react-app">
          Home
        </Link>
      </header>

      <form
        className="registrationForm"
        id="registrationForm"
        onSubmit={signUp}
      >
        <label className="registration-label" htmlFor="name">
          Name
        </label>
        <input
          className="registration-input"
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="registration-label" htmlFor="lastname">
          Last Name
        </label>
        <input
          className="registration-input"
          type="text"
          id="lastname"
          name="lastname"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label className="registration-label" htmlFor="username">
          Username
        </label>
        <input
          className="registration-input"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="registration-label" htmlFor="dob">
          Date of Birth
        </label>
        <input
          className="registration-input"
          type="date"
          id="dob"
          name="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />

        <label className="registration-label" htmlFor="email">
          Email
        </label>
        <input
          className="registration-input"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="registration-label" htmlFor="password">
          Password
        </label>
        <input
          className="registration-input"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="registration-label" htmlFor="profilePic">
          Profile Picture
        </label>
        <input
          className="registration-input-file"
          type="file"
          id="profilePic"
          name="profilePic"
         
          ref={fileInputRef}
          onChange={(e) => {
            setProfilePic(e.target.files[0]);
          }}
        />
        



        <label className="registration-label" htmlFor="bio">
          Bio
        </label>
        <textarea
          className="registration-input"
          id="bio"
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <div></div>
        <div className="submit-div">
          <div className="newsletter-div">
            <input
              className="registration-input"
              type="checkbox"
              id="newsletter"
              name="newsletter"
              value={newsletter}
              onClick={(e) => {
                setNewsletter(!newsletter);
              }}
             
            />
            <label className="registration-label" htmlFor="passwonewsletterrd">
              Sign up to our newsletter
            </label>
          </div>
          <button className="signup-btn" type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default Register;

