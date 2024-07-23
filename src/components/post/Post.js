import React from "react";
import "./post.css";
import { Link } from "react-router-dom";
//need to ad a delete button
function Post(props) {
  

  
  return (
    <div className="post-section">
     <div className="post-image-div">
      {props.img ? <img className="post-image" src={props.img} alt="ime related to" /> : ""}
      </div>
      <h3 className="post-title">{props.title}</h3>
      <div className="user-info">
        <img
        className="profile-picture-post"
          src={props.userImg}
          alt="the profile picure of the author of the article"
        ></img>
        <p className="post-author">{props.author}</p>
      </div>
      <div className="post-text-div">
      <p className="post-text">  {props.text}  </p>
      </div>

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
