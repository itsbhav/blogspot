import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useVerifyMutation } from "../features/auth/authApiSlice";

const VerifyMail = () => {
  const { id } = useAuth();
  const [mail, setMail] = useState("");
  const { pathname } = useLocation();
  const [verify, { isError, isSuccess, error }] = useVerifyMutation();
  const handleVerify = async (e) => {
    e.preventDefault();
    await verify({
      email: mail,
    });
  };
  const handleMail = (e) => setMail(e.target.value);
  if (!id) {
    return (
      <div className="errmsg transparent_back">
        Unauthorized, Please
        <span>
          <Link to={"/login"} style={{ color: "black" }}>
            Login
          </Link>
        </span>
        Again
      </div>
    );
  }
  if (isError) {
    return (
      <div className="transparent_back errmsg">
        {error?.data?.message ||
          "Some Error Occured, Please check network connections and try again!"}
      </div>
    );
  }
  if (isSuccess) {
    return <Navigate to="/" state={{ from: pathname }} replace/>
  }

  return (
    <>
      <h3 className="user-div">
        Steps to get a verified tick on your account.
      </h3>
      <ol className="steps">
        <li>Type your mail address in the input bar</li>
        <li>Click verify your mail button</li>
        <li>You will recieve a mail on the provided mail id, open the mail</li>
        <li>Click on the link provided in the mail, and relax!</li>
      </ol>
      <h4 className="user-div">
        Note: Verified tick does not give you any special access, but will help
        you if you forget your password or to communicate to us.{" "}
      </h4>

      <form className="form" onSubmit={handleVerify}>
        <h3>Hello { mail}, </h3>
        <label htmlFor="mail" className="offscreen">Mail:</label>
        <input
          type="email"
          placeholder="enter your mail id"
          id="mail"
          className="form__input"
          value={mail}
          onChange={handleMail}
          required
        />
        <button type="submit" className="reactionButton-loaded changehue">
          verify your mail
        </button>
      </form>
    </>
  );
};

export default VerifyMail;
