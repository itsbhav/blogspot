import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetUsersByIdQuery } from "../features/users/usersSlice";
import { useGetPostsQuery } from "../features/posts/postsSlice";
import PulseLoader from "react-spinners/PulseLoader";
import PostPageUser from "./PostPageUser";
import PostAuthor from "./PostAuthor";
import { memo } from "react";
import Hero from "./Hero";
import useTitle from "../hooks/useTitle";
const UserPage = () => {
  const { id } = useParams();
  useTitle("User Page");
  const { user, isErrU, errU } = useGetUsersByIdQuery(id || "usersList", {
    selectFromResult: ({ data, isError, error }) => ({
      errU: error,
      isErrU: isError,
      user: data?.entities[id],
    }),
  });
  const {
    data: posts,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetPostsQuery(id || "postsList", {});

  let content = null;

  if (isErrU) {
    return (
      <p className="errmsg transparent_back">
        Error Getting User {errU?.data?.message}
      </p>
    );
  }

  if (isError) {
    content = (
      <p className="errmsg transparent_back">
        Error Getting Posts {error?.data?.message}
      </p>
    );
  }
  if (!user) return <PulseLoader color="#000" />;

  if (isLoading) content = <PulseLoader color="#000" />;

  let friendListContent = null;

  friendListContent = user.friendList.map((friend) => (
    <Link to={`/users/${friend._id}`} key={friend.username}>
      <PostAuthor
        imageUrl={friend.imageUrl}
        displayname={friend.displayname || friend.username}
        verified={ friend?.verified}
      />
    </Link>
  ));

  if (isSuccess) {
    const { ids } = posts;
    content = ids.map((id) => <PostPageUser key={id} postId={id} />);
  }

  return (
    <>
      <Hero user={user} />
      <article className="dash-container">
        <article className="dash-container-content">{content}</article>
        <article className="friendList" id="friendList">
          {user.friendList.length > 0 && (
            <h3 className="marginlr">Friend List</h3>
          )}
          {friendListContent}
        </article>
      </article>
    </>
  );
};

export default memo(UserPage);
