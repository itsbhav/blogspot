import React from "react";
import { memo } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useGetRandomQuery } from "../features/posts/postsSlice";
import PostPagePublic from "./PostPagePublic";
import PulseLoader from "react-spinners/PulseLoader";
import Footer from "./Footer";
import useAuth from "../hooks/useAuth";
const Public = () => {
  const { username } = useAuth();
  const location = useLocation();

  const {
    data: posts,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useGetRandomQuery("postsList");
  let contentMain = null;

  if (isLoading) contentMain = <PulseLoader color={"#191971a6"} />;

  if (isError) {
    contentMain = (
      <p className="errmsg transparent_back">
        Error Fetching {` ${error?.data?.message || ""}`}
      </p>
    );
  }
  if (isSuccess) {
    const { ids } = posts;
    contentMain = ids.map((id) => <PostPagePublic key={id} postId={id} />);
  }
  let content = !username?.length? (
    <>
      <main className="post-public">{contentMain}</main>
      <Footer />
    </>
  ) : (
    <Navigate to="/dash" state={{ from: location }} replace />
  );
  return content;
};

export default memo(Public);
