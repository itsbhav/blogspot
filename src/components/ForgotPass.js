import React from "react";
import { useState } from "react";
import { useRecoverAccMutation } from "../features/auth/authApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const ForgotPass = () => {
  const [username, setUsername] = useState("");
  const { pathname } = useLocation();
  const handleUname = (e) => setUsername(e.target.value);
  const [recover, { isError, isSuccess, isLoading, error }] =
    useRecoverAccMutation();
  const handleSecure = async (e) => {
    e.preventDefault();
    await recover({ username });
  };
  if (isLoading) return <PulseLoader color="black" />;
  if (isSuccess) {
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  }
  if (isError) {
    return (
      <div className="errmsg transparent_back">
        {error?.data?.message ||
          "Some Error Occured, Please check network connections and try again!"}
      </div>
    );
  }
  return (
    <>
      <h3 className="user-div">Steps to recover your password.</h3>
      <ol className="steps">
        <li>Type your username in the input bar</li>
        <li>Click recover my account button</li>
        <li>
          You will recieve a mail on your regisered mail id, if you have
          verified your mail earlier
        </li>
        <li>
          In case, your account is not mail verified, please write to us at{" "}
          <Link to={process.env.REACT_APP_OFFICIAL_MAIL} style={{ color: "black" }}>
            {process.env.REACT_APP_OFFICIAL_MAIL}
          </Link>
        </li>
        <li>
          Click on the link provided in the mail, and change your password from
          the window!
        </li>
      </ol>

      <form className="form" onSubmit={handleSecure}>
        <h3>Hello {username}, </h3>
        <label htmlFor="uname" className="offscreen">
          username:
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          id="uname"
          className="form__input"
          value={username}
          onChange={handleUname}
          required
        />
        <button type="submit" className="reactionButton-loaded changehue">
          Recover my Account
        </button>
      </form>
    </>
  );
};

export default ForgotPass;
