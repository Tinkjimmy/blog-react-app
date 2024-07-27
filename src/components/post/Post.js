import React from "react";
import "./post.css";
import { useNavigate } from "react-router-dom";

function Post({ img, title, userImg, author, text, time, id, handleDelete, idName,currentUserImg }) {
  const navigate = useNavigate();

  function toArticle() {
    navigate("/article", { state: { img, title, userImg, author, text, time, id,currentUserImg } });
  }
console.log({currentUserImg})
  return (
    <div className="post-section" onClick={toArticle}>
      <div className="post-image-div">
        {img && <img className="post-image" src={img} alt="Image related to the post" />}
      </div>
      <h3 className="post-title">{title}</h3>
      <div className="user-info">
        <img
          className="profile-picture-post"
          src={userImg}
          alt="The profile picture of the author of the article"
        />
        <p className="post-author">{author}</p>
      </div>
      <div className="post-text-div">
        <p className="post-text">{text}</p>
      </div>
      <div className="bottom-div">
        <p className="post-date">{time}</p>
        {author === idName && (
          <button
            className="post-btn"
            onClick={(event) => {
              event.stopPropagation();
              handleDelete(event, id);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Post;
