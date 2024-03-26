import React, { memo } from "react";
import { Link } from "react-router-dom";
import {
  useFriendReqMutation,
  useAcceptReqMutation,
  useGetUsersByIdQuery,
} from "../features/users/usersSlice";
import useAuth from "../hooks/useAuth";
const UserExcerpt = ({ user }) => {
  
  const [handleFriendReq, { isError: reqIsError, error: reqError }] =
    useFriendReqMutation();

  const [handleAcceptReq, { isError: acceptIserror, error: acceptError }] =
    useAcceptReqMutation();

  const { id } = useAuth();

  const { currentUser } = useGetUsersByIdQuery("usersList", {
    selectFromResult: ({ data }) => ({
      currentUser: data?.entities[id],
    }),
  });
    
    const handleFriendReqClick = async() => {
        await handleFriendReq(user._id)
    }
    const handleAcceptReqClick = async (call) => {
        const data = {
            id: user._id,
            accept:call
        }
        await handleAcceptReq(data);
    }

  let friendButton = null;
  let acceptButton = null;
  let rejectButton = null;
  if (id && currentUser) {
    if (
      currentUser.requested.filter(
        (u) => u._id.toString() === user._id.toString()
      ).length
    ) {
      friendButton = (
        <button
          type="button"
          title="UnRequest"
          className="reactionButton user-button"
          onClick={() => handleFriendReqClick()}
        >
          UnRequest
        </button>
      );
    } else if (
      currentUser.friendList.filter(
        (u) => u._id.toString() === user._id.toString()
      ).length
    ) {
      friendButton = (
        <button
          type="button"
          title="UnFriend"
          className="reactionButton user-button"
          onClick={() => handleFriendReqClick()}
        >
          UnFriend
        </button>
      );
    } else if (
      currentUser.accept.filter((u) => u._id.toString() === user._id.toString())
        .length
    ) {
      acceptButton = (
        <button
          type="button"
          title="Accept Request"
          className="reactionButton user-button"
          onClick={() => handleAcceptReqClick(true)}
        >
          Accept
        </button>
      );
      rejectButton = (
        <button
          type="button"
          title="Reject Request"
          className="reactionButton user-button"
          onClick={() => handleAcceptReqClick(false)}
        >
          Reject
        </button>
      );
    } else if(currentUser.id!==user._id){
      friendButton = (
        <button
          type="button"
          title="Request"
          className="reactionButton user-button"
          onClick={() => handleFriendReqClick()}
        >
          Request
        </button>
      );
    }
  }

  return (
      <main
      className="user-excerpt-main"
    >
      <Link to={ `/users/${user._id}`}> <img
        src={user.imageUrl}
        alt={user.displayname}
        className="user-excerpt-image user-excerpt-div"
      /></Link>
      <div className="marginlr user-excerpt-div">{user.displayname }{ user?.verified && <img src="/verified.png" alt="✔" width="20px"/>}</div>
      <div className="marginlr user-excerpt-div">{user.username}</div>
      <div
       className="user-excerpt-div"
      >
        {friendButton}
        {acceptButton}
        {rejectButton}
        {reqIsError && <p className="errmsg">{ reqError?.data?.message}</p>}
        {acceptIserror && <p className="errmsg">{ acceptError?.data?.message}</p>}
      </div>
    </main>
  );
};

export default memo(UserExcerpt);
