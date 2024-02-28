import React,{memo} from "react";
import RTimeAgo from "./TimeAgo";
import Reactions from "./Reactions";
import { useGetRandomQuery } from "../features/posts/postsSlice";
const PostPagePublic = ({ postId }) => {
  const { post} = useGetRandomQuery('postsList', {
      selectFromResult: ({ data }) => ({
        post: data?.entities[postId]
      })
    })
  
  return (
    <article className="post_article" style={{display:"flex",flexFlow:"column nowrap",marginBottom:"4rem"}}>
      <h2>{post?.title}</h2>
      <p className="excerpt" style={{flexGrow:"1"}}>{post?.content.slice(0,200)}...</p>
       <p className="postCredit">
      {post?.imageUrl && <img src={post?.imageUrl} alt="Post" className="public-width" />}
      </p>
      <p className="postCredit">
        <RTimeAgo timestamp={Date.parse(post?.updatedAt)} />
      </p>
      <div>
        <Reactions post={post} />
      </div>
    </article>
  );
};

export default memo(PostPagePublic);
