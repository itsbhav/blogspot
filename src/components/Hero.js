import React from "react";
import { memo } from "react";
import { Link } from "react-router-dom";

const Hero = ({ user, showVerify }) => {
  if (showVerify) {
    if (user.verified) showVerify = false;
  }

  const handleFriend = () => {
    const x = document.getElementById("friendList");
    if (x.style.display === "flex") x.style.display = "none";
    else x.style.display = "flex";
  };
  return (
    <main className="hero-main basic-protect">
      <div className="hero-main-div">
        <img src={user.imageUrl} alt="User" className="hero-image" />
        <h2 className="hero-clamp">{user.username}</h2>
      </div>
      <div className="hero-main-about">
        <h1 className="hero-clamp">
          {user.displayname}
          {user?.verified && <img src="/verified.png" alt="✔" width="20px" />}
        </h1>
        <h3 className="hero-clamp">{user.about}</h3>
        <div role="button" onClick={handleFriend}>
          {user.friendList.length} Friends
        </div>
        {showVerify && (
          <button
            className="reactionButton-loaded changehue"
            style={{ display: "inline-block" }}
            type="button"
          >
            <Link to={"/verificationPage"} style={{ color: "black" }}>
              Get Verified
            </Link>
          </button>
        )}
      </div>
    </main>
  );
};

export default memo(Hero);
