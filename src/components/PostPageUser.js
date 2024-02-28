import React from "react";
import RTimeAgo from "./TimeAgo";
import Reactions from "./Reactions";
import { useState,memo } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGetPostsQuery } from "../features/posts/postsSlice";
import useAuth from "../hooks/useAuth";
import EditPost from "./EditPost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen,faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDeletePostMutation } from "../features/posts/postsSlice";
import PulseLoader from "react-spinners/PulseLoader";
const PostPageUser = ({ postId }) => {
  
    const {id:x}=useParams()
  const [isEditing, setIsEditing] = useState(false);
  
  const {post} = useGetPostsQuery(x||'postsList', {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });
    
  const { id } = useAuth();
  const [deletePost, { isError:deleisError, error:delerror }] = useDeletePostMutation();
  let content = null;
  if(!post)return <PulseLoader color="#000"/>
  const errClass = (deleisError) ? "errmsg" : "offscreen";
  const errContent = (delerror)?.data?.message ?? "";
  const onEditPostClicked = () => {
    setIsEditing(true);
  };
  const onDeletePostClicked = async (postId) => {
    await deletePost({ id: postId });
  };
  const editButton = (
    <button
      title="Edit Post"
      className="reactionButton"
      type="button"
      onClick={onEditPostClicked}
    >
      <FontAwesomeIcon icon={faFilePen} />
    </button>
  );
  const deleteButton = (
    <button
      title="Delete Post"
      className="reactionButton"
      type="button"
      onClick={() => onDeletePostClicked(post.id)}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
  content = !isEditing ? (
    <article className="post_article minWidth" >
       <p className={errClass}>{errContent}</p>
        
      <h2><Link to={`/posts/${post?.id}`} style={{color:"black"}}>{post?.title}</Link></h2>
      <p className="excerpt">{post?.content}</p>
      <p className="postCredit">
      {post?.imageUrl && <img src={post?.imageUrl} alt="Post" className="maxWidth" />}
      </p>
      <p className="postCredit">
        <RTimeAgo timestamp={Date.parse(post?.updatedAt)} />
      </p>
      <Reactions post={post} />
      {id === post?.user && editButton}
      {id === post?.user && deleteButton}
    </article>
  ) : (
    <EditPost post={post} setIsEditing={setIsEditing} />
  );
  return content;
};

export default memo(PostPageUser);
