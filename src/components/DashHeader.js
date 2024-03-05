import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import usePersist from "../hooks/usePersist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import {
  faFileCirclePlus,
  faUserGear,
  faUserEdit,
  faRightFromBracket,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
const DashHeader = () => {
  const [ persist,setPersist] = usePersist();
  const { username, id } = useAuth();
 
  const navigate = useNavigate();
  // const { pathname } = useLocation();

  const [sendLogout, { isSuccess, isError, error }] = useSendLogoutMutation();
  const onNewPostClicked = () => {
    navigate("/posts/new");
  };
  const onUserButtonClicked = () => {
    navigate(`/users/${id}`);
  };
  const handleLogout = async () => {
    await sendLogout();
  };
  const onEditUserButtonClicked = () => {
    navigate("/users/edit");
  };
  const onGrowNetwokButtonClicked = () => {
    navigate('/users')
  }
  useEffect(() => {
    if (isSuccess||isError) {
      setPersist(false);
      setTimeout(() => navigate("/"), 1000);
    }
  }, [isSuccess ,isError, setPersist, navigate]);
  let newPostButton = null;
  let logoutButton = null;
  let userButton = null;
  let editUser = null;

  let growNetwork = null;
  if (username.length) {
    newPostButton = (
      <button
        className="icon-button"
        title="New Post"
        onClick={onNewPostClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
    logoutButton = (
      <button className="icon-button" title="Logout" onClick={handleLogout}>
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
    );
    userButton = (
      <button
        className="icon-button"
        title="My Profile"
        onClick={onUserButtonClicked}
      >
        <FontAwesomeIcon icon={faUserGear} />
      </button>
    );
    editUser = (
      <button
        className="icon-button"
        title="Edit Profile"
        onClick={onEditUserButtonClicked}
      >
        <FontAwesomeIcon icon={faUserEdit} />
      </button>
    );
    growNetwork = (
      <button
        className="icon-button"
        title="Grow Your Network"
        onClick={onGrowNetwokButtonClicked}
      >
        <FontAwesomeIcon icon={faGlobe} />
      </button>
    );
  }
  const errClass = isError ? "errmsg" : "offscreen";

  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className="dash-header__container">
          <Link to="/">
            <h1 className="dash-header__title">blogSpot</h1>
          </Link>
          <nav className="dash-header__nav">
            <>
              {growNetwork}
              {newPostButton}
              {editUser}
              {userButton}
              {logoutButton}
            </>
          </nav>
        </div>
      </header>
    </>
  );
};

export default memo(DashHeader);
