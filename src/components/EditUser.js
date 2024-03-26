import { useState, useEffect } from "react";
import {
  useUpdateUserMutation,
  useGetUsersByIdQuery,
  useDeleteUserMutation,
} from "../features/users/usersSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import imageConverter from "../utility/imageConverter";
import { memo } from "react";
import useTitle from "../hooks/useTitle";
const EditUser = () => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  const [
    deleteUser,
    { isError: isDelError, error: delError, isSuccess: isDelSuccess },
  ] = useDeleteUserMutation();
  const navigate = useNavigate();

  const { id } = useAuth();
  useTitle(`EditUser`)
  const { user } = useGetUsersByIdQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  const [username, setUsername] = useState(user?.username || "");
  const [displayname, setDisplayname] = useState(user?.displayname || "");
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState(user?.about || "");
const [err, setErr] = useState("");
  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setDisplayname("");
      setImageUrl("");
      setPassword("");
      setAbout("");
      navigate("/");
    }
  }, [isSuccess,navigate]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setDisplayname(user.displayname);
      setImageUrl(user.imageUrl);
      setPassword("");
      setAbout(user.about);
    }
  }, [user]);

  if (!id) return <p className="errmsg">Unauthorized</p>;
  if (!user) {
    return <PulseLoader color="#000" />;
  }

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onDisplaynameChanged = (e) => setDisplayname(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onAboutChanged = (e) => setAbout(e.target.value);

  const canSave = [username, displayname].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    if (canSave) {
      let changePass = false;
      if (password?.length) {
        changePass=window.confirm("Do you really want to change your password?")
      }
      await updateUser({
        username,
        displayname,
        password:(changePass)?password:"",
        about,
        imageUrl,
      });
    }
  };

  const onDeleteUserClicked = async () => {
    if (id) {
      if (
        window.confirm("You will Lose Your Account and Data, are you sure?")
      ) {
        await deleteUser();
      }
      if (isDelSuccess || !isDelError) navigate("/");
    }
  };
  const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
  const errContent = (error?.data?.message || delError?.data?.message) ?? "";
  const handleFile = async (e) => {
   
    try {
      setErr("")
      if (e.target.files[0].size > 1024*1024) {
         throw new Error("Maximum 1MB size is permissible for upload")
      }
      const x = await imageConverter(e.target.files[0])
      setImageUrl(x);
    } catch (err) {
      setErr(err)
    }
  }
  const content = (
    <>
      <p className={errClass}>Error {errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label
          className="marginlr"
          htmlFor="hero"
        >
          <img src={imageUrl} alt="My Hero" className="hero-image"/>
        </label>
         {err && <p className="errmsg">{err}</p>}
            <input
              className="offscreen"
              id="hero"
              name="public"
              type="file"
          title="Select Image if any"
          accept=".jpeg,.png,.jpg"
            onChange={(e)=>handleFile(e)}
          />

        <label className="form__label" htmlFor="username">
          Username:
        </label>
        <input
          className={`form__input`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="displayname">
          Displayname:
        </label>
        <input
          className={`form__input`}
          id="displayname"
          name="displayname"
          type="text"
          autoComplete="off"
          value={displayname}
          onChange={onDisplaynameChanged}
        />
        <label className="form__label" htmlFor="pwd">
          Password:
        </label>
        <input
          className={`form__input`}
          id="pwd"
          name="password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={onPasswordChanged}
        />
        <label className="form__label" htmlFor="about">
          About:
        </label>
        <textarea
          className={`form__input`}
          id="about"
          name="about"
          value={about}
          onChange={onAboutChanged}
        />
        <div className="form__title-row">
          <div className="form__action-buttons">
            <button
              className="reactionButton"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="reactionButton"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};
export default memo(EditUser);
