import React from "react";
import "./article.css";
import { Link, useLocation,useNavigate } from "react-router-dom";
import AuthDetails from "../AuthDetails";

const Article = () => {
  const location = useLocation();
  const { img, title, userImg, author, text, time, currentUserImg } = location.state;
  const navigate= useNavigate()
  function toHome(){
    navigate("/main")
  }
  // console.log({currentUserImg})
  return (
    <div className="article-page">
      <header className="header-mainpage">
        <h1 className="app-title " onClick={toHome}>Blog.it</h1>
        <div className="header-user-features">
        {/* //it doesn't show beacusae useradata doesn't apss */}
          
            <Link to="/write" className="write-link" >
              Write
            </Link>
          
          <AuthDetails />
          {currentUserImg ? (
            <img
              className="profile-img profile-img-nav"
              alt="profile image"
              src={{currentUserImg}}
            />
          ) : (
            <img className="profile-img" alt="profile image" />
          )}
        </div>
      </header>
      <main className="article-content">
        
          <div className="article-info">
                  <div className="article-body">
                        {img && (
                          <img className="article-img" src={img} alt="Article related" />
                        )}
                        <h2 className="article-title">{title}</h2>
                        <p className="article-text">{text}</p>
                  </div>
                  <div className="Article-other-info">
                        <img
                          className="article-author-img"
                          src={userImg}
                          alt={`Profile pictue f ${author}`}
                        />
                        <p className="article-author">{author}</p>
                        <p className="article-date">{time}</p>
                  </div>
          </div>
       
      </main>
    </div>
  );
};

export default Article;
