import React from "react";
import AuthDetails from "../components/AuthDetails";
import "./profile.css";
import { Link, useLocation } from "react-router-dom";
import Contacts from "./Contacts";
import { useState } from "react";
import Articles from "./Articles";

function Profile() {
  const [showContacts, setShowContacts] = useState(false);
  const location = useLocation();
  const { userData } = location.state;
  let userNameUser = userData.username;
  return (
    <>
      <header className="profile-header">
        <h1 className="app-title">Blog.it</h1>

        <div className="header-user-features-profile">
          <Link to="/blog-it-app/main" className="main-page-link">
            Main Page
          </Link>
          <AuthDetails />
        </div>
      </header>
      <main className="profile-main">
        <div className="left-profile-section">
          <h1 className="profile-username">{userNameUser}</h1>
          <div className="profile-buttons">
            <button onClick={() => setShowContacts(true)}>Personal Info</button>
            <button onClick={() => setShowContacts(false)}>Articles</button>
          </div>
          <div className="profile-changable-content">
            {showContacts ? <Contacts user={userData} /> : ""}
            <div className="articles-container">
              {showContacts ? "" : <Articles user={userData} />}
            </div>
          </div>
        </div>
        <div className="right-profile-section">
          <img
            className="profile-img"
            alt="imge of the user"
            src={userData.profileImage}
          ></img>

          <h2 className="profile-img">{userNameUser}</h2>
         {userData.bio ? <p>{userData.bio}</p> : <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Donec vel mauris quam. Nulla dapibus, velit vel facilisis hendrerit, elit massa condimentum elit, sed malesuada lectus nisi ut neque. Phasellus a orci nec justo laoreet ultricies. Nulla ac sem et orci fringilla tincidunt.

Sed sit amet urna at arcu dictum volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec laoreet neque sit amet tellus faucibus, et mollis lacus cursus. Etiam feugiat sem at venenatis elementum. Aliquam erat volutpat. Nulla eget orci sed purus egestas volutpat non a enim. Ut et nibh vel ligula ullamcorper placerat. Donec at tristique nisi, et consectetur nisi.

Mauris in bibendum turpis. Integer consectetur nunc sed quam placerat, non elementum eros facilisis. Aenean ut elit vel odio placerat elementum non non lacus. Donec ultricies ligula et massa hendrerit, sed aliquet turpis volutpat. Sed lacinia feugiat sem in efficitur. Praesent efficitur erat et diam pretium, at condimentum ligula interdum. Fusce dapibus ligula non libero gravida, et dictum
</p> }
        </div>
      </main>
    </>
  );
}
export default Profile;
