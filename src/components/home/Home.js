import React, { useEffect,useRef,useState } from "react";
import { Link } from "react-router-dom";

import linkImg from "../../assets/images/linkedin_icon.svg";
import gitImg from "../../assets/images/github__icon.svg";
import "./home.css";
import Login from "../auth/Login";
function Home() {
  const [showLogin, SetShowLogin] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => {
    SetShowLogin(!showLogin);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      SetShowLogin(false);
    }
  };

  useEffect(() => {
    if (showLogin) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogin]);

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="title">Blog.it</h1>
        <div className="div-log">
          <button className="login-btn" onClick={toggleModal}>
            Login
          </button>
          <Link className="link register" to="/register">
            Get Started
          </Link>
        </div>
      </header>
      <body className="home-body">
      <div className="add-band">
        <p className="add-band-text">Discover new perspectives and share your story on Blog.it - Where every voice finds a place.</p>
        
</div>
      <main className="home-main-container"
      >
        <div className="image-container"></div>
        <div className="text-container">
          <h1 className="overlay-text">Tell Your Story To The World!</h1>
          <Link className="overlay-text2" to="/register">
            Get Started
          </Link>
        </div>

        {showLogin && (
          <div className="modal">
            <div className="modal-content" ref={modalRef}>
              <Login className="login-component" />
            </div>
          </div>
        )}
      </main>
      <footer>
        <p id="footer-text">
          For this and other projects check out my links
        </p>
        <div classname="social-media">
          <a
            href="https://www.linkedin.com/in/giacomoducawd"
            className="footer-img"
          >
            <img src={linkImg} alt="LinkedIn" />
          </a>
          <a href="https://github.com/Tinkjimmy" className="footer-img">
            <img src={gitImg} alt="Github" />
          </a>
        </div>
      </footer>
      </body>
    </div>
    
  );
}

export default Home;
