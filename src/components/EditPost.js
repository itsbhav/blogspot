import { useState, useEffect } from "react";
import { useUpdatePostMutation } from "../features/posts/postsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBackspace } from "@fortawesome/free-solid-svg-icons";
import imageConverter from '../utility/imageConverter'
import { memo } from "react";

const EditPost = ({ post, setIsEditing }) => {
  const [updatePost, { isLoading, isSuccess, isError, error }] =
    useUpdatePostMutation();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [publicV, setPublicV] = useState(post.public);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setContent("");
      setImageUrl("");
      setPublicV(false);
      setIsEditing(false);
    }
  }, [isSuccess,setIsEditing]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onPublicVChanged = (e) => setPublicV((prev) => !prev);

  const canSave = [title, content].every(Boolean) && !isLoading;

  const onSavePostClicked = async (e) => {
    if (canSave) {
      await updatePost({
        id: post.id,
        title,
        content,
        public: publicV,
        imageUrl,
      });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !content ? "form__input--incomplete" : "";

  const errContent = error?.data?.message ?? "";


  const onImageUrlChanged = async(e) => {
    try {
      setErr("")
      if (e.target.files[0].size > 1024*1024) {
         throw new Error("Image Size Should be less than 1MB")
      }
      const x = await imageConverter(e.target.files[0])
   
      setImageUrl(x);
    } catch (err) {
      setErr(err)
    }
  }
  const Edcontent = (
    <>
      <p className={errClass}>Error {errContent}</p>
     
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="form__label" htmlFor="post-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="post-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="post-content">
          Content:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="post-content"
          name="content"
          value={content}
          onChange={onContentChanged}
        />
        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="post-public"
            >
              Mark as Public:
              <input
                className="form__checkbox"
                id="post-public"
                name="public"
                type="checkbox"
                title="Not Checked will be available to friends only"
                checked={publicV}
                onChange={onPublicVChanged}
              />
            </label>
            <label
              className="form__label form__checkbox-container"
              htmlFor="image"
            >
              Image URL:
              <img src={imageUrl} alt="post" className="image-edit" />
            </label>
             {err && <p className="errmsg">{err}</p>}
            <input
                className="offscreen"
                id="image"
                name="post-image"
                type="file"
                title="Select Image if any"
                accept=".jpeg,.jpg,.png"
                onChange={onImageUrlChanged}
              />
          </div>
        </div>
         <div className="form__title-row">
          <div className="form__action-buttons">
            <button
              className="reactionButton"
              title="Save"
              onClick={onSavePostClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon
                icon={faSave} />
            </button>
             <button
              type="button"
              title="Back"
              className="reactionButton"
              onClick={()=>setIsEditing(false)}
            >
              <FontAwesomeIcon
                icon={faBackspace} />
              </button>
          </div>
        </div>
      </form>
    </>
  );

  return Edcontent;
};
export default memo(EditPost);
