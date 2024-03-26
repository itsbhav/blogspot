import React, { memo } from "react";

const PostAuthor = ({ imageUrl, displayname,verified }) => {
  return (
    <main className="author-main">
      <p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${displayname}`}
            className="hero-image-author"
          />
        )}
      </p>
      <p className="author-p nowrap">{displayname }{ verified && <img src="/verified.png" alt="✔" width="20px"/>}</p>
    </main>
  );
};

export default memo(PostAuthor);
