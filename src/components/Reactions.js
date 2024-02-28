import React, { useState,memo } from "react";
import { useHandleReactionsMutation } from "../features/posts/postsSlice";

const reactionEmoji = {
  thumbsUp: "👍🏻",
  clap: "👏🏻",
  heart: "❤️",
};

const Reactions = ({ post }) => {
  
  const [rname, setRname] = useState("");
  const [handleReaction, { isError}] = useHandleReactionsMutation();
  const addReactions = async (id, name) => {
    setRname(name);
    await handleReaction({ id, reactionName: name });
  };
  const errClass = isError ? "errmsg" : "offscreen";
  const content = Object.entries(reactionEmoji).map(([name, emoji]) => (
    <button
      key={name}
      type="button"
      title={name}
      className="reactionButton"
      onClick={() => addReactions(post.id, name)}
    >
      {!isError && emoji}
      {isError && rname !== name && emoji}
      <p className={errClass}>{rname === name && "🚫"}</p>
      {post?.reactions && post.reactions[name]}
    </button>
  ));
  return content;
};

export default memo(Reactions);
