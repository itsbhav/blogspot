import React,{memo,useEffect} from "react";
import { Link } from "react-router-dom";
import usePersist from "../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useRefreshMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const Footer = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const [refresh, { isLoading, isSuccess, isError}] =
    useRefreshMutation();

  useEffect(() => {
    const refreshSend = async () => {
      await refresh();
    }
    if (persist&&!token) {
       refreshSend();
    }
  }, [persist, refresh, token])
  const { username } = useAuth()
  if (isLoading) return <></>;
  if(isError) return (
    <div className="footer">
      <div className="footer-div">
        Join The Blogging Community <Link to="/login">Login</Link>
      </div>
    </div>
  );
  if (isSuccess) return (
    <div className="footer">
      <div className="footer-div">
        Hey {username}, welcome again! Go to <Link to="/dash">DashBoard</Link>
      </div>
    </div>
  );
  return (
    <div className="footer">
      <div className="footer-div">
        Join The Blogging Community <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default memo(Footer);
