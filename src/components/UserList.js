import React,{memo} from "react";
import useAuth from "../hooks/useAuth";
import {
  useGetRecommendationsQuery,
  useGetUsersBySearchQuery,
  useGetUsersByIdQuery,
} from "../features/users/usersSlice";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import UserExcerpt from './UserExcerpt.js'
import useTitle from "../hooks/useTitle.js";
const UserList = () => {
  useTitle("Grow Your Network")
  let content = null;
  const [selected, setSelected] = useState("recommendations")
  const [searchInput, setSearchInput] = useState("");
  const handleQuery = (e) => {
    setSelected(e.target.id);
  }
  const { id } = useAuth();
  const { user } = useGetUsersByIdQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });
  const {
    data: usersInSearch,
    isError: searchIsError,
    error: searchError,
    isSuccess:searchSuccess
  } = useGetUsersBySearchQuery(searchInput || "")
  
  const {
    data: usersInRecommendations,
    isError: recIsError,
    error: recError,
    isSuccess: recSuccess
  } = useGetRecommendationsQuery();

  const handleSearch = async(e) => {
    e.preventDefault();
    setSelected("search")
    setSearchInput(e.target.searchInput.value);
  }

  if (!user) return <PulseLoader color="#000" />;
  let acceptreq = null
  if (user) {
    acceptreq = user.accept.map(
      (requestedUser) => (
        <UserExcerpt key={requestedUser._id} user={requestedUser}/>
      )
    )
  }

  let requestedContent = null
  if (user) {
    requestedContent= user.requested.map(
      (requestedUser) => (
        <UserExcerpt key={requestedUser._id} user={requestedUser}/>
      )
    )
  }

  let recoContent = null
  if (recIsError) {
    recoContent= (<p className="errmsg transparent_back">{ recError.data.message}</p>)
  }
  if (recSuccess) {
    const { ids } = usersInRecommendations
    const {entities}=usersInRecommendations
    recoContent = ids.map((id) => (
      <UserExcerpt key={id} user={ entities[id]} />
    ))
  }
   
  let searchContent = null
  if (searchIsError) {
    searchContent=<p className="errmsg transparent_back"> Error Fetching Data { searchError.data.message}</p>
  }
  if (searchSuccess) {
    const { ids } = usersInSearch
    const {entities}=usersInSearch
    searchContent = ids.map((id) => (
      <UserExcerpt key={id} user={ entities[id]} />
    ))
  }
  
  const handleNav = () => {
    document.querySelector(".user-header").classList.toggle("display")
  }
  content = (
    <>
        <form className="user-form"
          onSubmit={handleSearch}
        >
        <input
          type="text"
          className="searchbox"
            id='searchInput'
            autoComplete="off"
          required={true}
          placeholder="Search Users...."
        />
      </form>
      {window.innerWidth<="600"&&<button type="button" className="papaya" onClick={handleNav}>Navbar</button>}
      <header
        className="user-header"
      >
        <div
          role="button"
          id="accept"
           className={
          (selected==="accept")?"user-header__selected user-div":"user-div"
        }
          onClick={handleQuery}
        >
          Requests To You
        </div>
        <div
          role="button"
          id="recommendations"
           className={
          (selected==="recommendations")?"user-header__selected user-div":"user-div"
        }
          onClick={handleQuery}
        >
          Recommendations
        </div>
        <div
          role="button"
          id="requests"
           className={
          (selected==="requests")?"user-header__selected user-div":"user-div"
        }
          onClick={handleQuery}
        >
          Your Pending Requests
        </div>
        <div
          role="button"
          id="search"
           className={
          (selected==="search")?"user-header__selected user-div":"user-div"
        }
        >
          Search Results
        </div>
      </header>
      <article
        className="user-article"
      >
        {selected === "recommendations" && recoContent}
        {selected === 'accept' && acceptreq}
        {selected === 'search' && searchContent}
        {selected==='requests'&& requestedContent}
      </article>
    </>
  );
  return content;
};

export default memo(UserList);
