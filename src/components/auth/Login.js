import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function signIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/main"); //navigate to the user's main page
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div className="login-container">
        <form className="loginForm" id="loginForm" onSubmit={signIn}>
          <label className="login-label" htmlFor="email">
            Email
          </label>
          <input
            className="login-input"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            className="login-input"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-btn-modal" type="submit">
            Log in
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
