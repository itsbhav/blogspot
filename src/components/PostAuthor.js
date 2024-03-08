import React, { memo } from "react";

const PostAuthor = ({ imageUrl, displayname }) => {
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
      <p className="author-p">{displayname}</p>
    </main>
  );
};

export default memo(PostAuthor);
