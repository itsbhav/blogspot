import React from "react";
import { useGetAllPostsQuery } from "../features/posts/postsSlice";
import { useGetUsersByIdQuery } from "../features/users/usersSlice";
import { useFriendReqMutation } from "../features/users/usersSlice";
import PostPagePrivate from "./PostPagePrivate";
import { useState } from "react";
import { memo } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../hooks/useAuth";
import PostAuthor from "./PostAuthor";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Hero from "./Hero";
import useTitle from "../hooks/useTitle";
const DashBoard = () => {
  const {
    data: posts,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useGetAllPostsQuery("postsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { id } = useAuth();
  useTitle(`Dashboard: blogSpot`)
  const { user } = useGetUsersByIdQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  const [handleReq, { isError: isFrError, error: Frerror }] =
    useFriendReqMutation();

  const { pathname } = useLocation();

  const [search, setSearch] = useState("");

  if (!id) return <p className="errmsg transparent_back">Unauthorized</p>;

  const handleFriendReq = async (friendId) => {
    await handleReq(friendId);
  };
  
  let content = null;
  if (!user) return <PulseLoader color={"#000"} />;
  let friendListContent = null;

  if (isError) {
    content = (
      <p className="errmsg transparent_back">
        Error Fetching Posts {error?.data?.message}
      </p>
    );
  }

  if (isLoading) {
    content = <PulseLoader color="#000" />;
  }

  
  friendListContent = user.friendList.map((friend) => (
    <div key={friend.username} className="friend-excerpt">
      <Link to={`/users/${friend._id}`}>
        <PostAuthor
          imageUrl={friend.imageUrl}
          displayname={friend.displayname || friend.username}
        />
      </Link>
      <button
        type="button"
        title="Unfriend"
        className="reactionButton reactionButton-loaded"
        onClick={() => handleFriendReq(friend._id)}
      >
        Unfriend
      </button>
    </div>
  ));

  if (isFrError) {
    friendListContent = (
      <p className="errmsg transparent_back">Error {Frerror?.data?.message}</p>
    );
  }

  if (isSuccess) {
    const { ids } = posts;
    content = ids.map((id) => <PostPagePrivate key={id} postId={id} search={search} />);
  }

 
  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  return (
    <>
      {/* <DashHeader /> */}
      {!pathname.includes("posts") && <Hero user={user} />}
      <input id="search"type="text" role="searchbox" placeholder="Search Posts..." value={search} onChange={handleSearch} className="searchbox"/>
      <article className="dash-container">
        <article className="dash-container-content">
          {content}
        </article>
        {!pathname.includes("posts") && (
          <article className="friendList" id="friendList">
            {user.friendList.length > 0 && (
              <h3 className="marginlr">Friend List</h3>
            )}
            {friendListContent}
          </article>
        )}
      </article>
    </>
  );
};

export default memo(DashBoard);
