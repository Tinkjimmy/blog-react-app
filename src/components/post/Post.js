import React from "react";
import "./post.css";
import { Link } from "react-router-dom";
//need to ad a delete button
function Post(props) {
  const abstract = props.text ? props.text.substring(0, 100) : "";


  
  return (
    <div className="post-section">
     <div>
      {props.img ? <img className="post-image" src={props.img} alt="ime related to" /> : ""}</div>
      <h3 className="post-title">{props.title}</h3>
      <div className="user-info">
        <img
        className="profile-picture-post"
          src={props.userImg}
          alt="the profile picure of the author of the article"
        ></img>
        <p className="post-author">{props.author}</p>
      </div>
      <p className="post-text"> {abstract}...   <Link className="Article-link" to="/article">Read more</Link></p>
      

      <div className="bottom-div">
        <p className="post-date">{props.time}</p>
        {props.author === props.idName ? (
          <button
            className="post-btn "
            onClick={() => props.handleDelete(props.id)}
          >
            Delete
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Post;
