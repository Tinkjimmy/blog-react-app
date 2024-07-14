import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./authdetails.css"
function AuthDetails() {
  const [authUser, setAuthUser] = useState(null);
  const navigate =useNavigate();

  //this useEffect checks for changes in the user state
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  //function to sign out
  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        navigate('/')
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      {authUser ? (
        <>
          
          <button  className="signout-btn" onClick={userSignOut}>Sign out</button>
        </>
      ) : (
        <p>Signed out</p>
      )}{" "}
    </div>
  );
}

export default AuthDetails;
